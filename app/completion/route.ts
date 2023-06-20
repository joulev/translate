import { OpenAIStream, StreamingTextResponse } from "ai";
import { isWithinTokenLimit } from "gpt-tokenizer";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

import { withRouteValidation } from "~/lib/with-route-validation";

import { env } from "~/env.mjs";

export const runtime = "edge";

const apiConfig = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(apiConfig);
const schema = z.object({
  prompt: z.string(),
  to: z.string(),
  context: z.string(),
});

function buildPrompt(toLanguage: string, text: string, context: string) {
  return `
You are a light novel translator from an unknown language to ${toLanguage}.

You will be given an excerpt from a light novel in the unknown language and you will have to translate it into ${toLanguage}.

If you do not understand the unknown language, reply with the sentence "I do not understand the text" but translated to ${toLanguage}.

Do not translate the text literally. Instead, translate the text in a way that makes sense in ${toLanguage}.

In your reply message, do not add anything other than the translation. Do not add any extra words or sentences.

DO NOT change the meaning of any part of the text, or omit any part of the text.

DO NOT change any line breaks or paragraph breaks. If the paragraph seems too short and you want to join it with the next paragraph, DO NOT do that. Two paragraphs in the unknown language MUST be translated to two separate paragraphs in ${toLanguage}.

The context of the light novel, before the excerpt, is as follows:
================================================
${context || "No context was provided."}
================================================

Please follow the context of the light novel when translating.

In your reply message, do not add anything other than the translation. Do not add any extra words or sentences.

DO NOT change the meaning of any part of the text, or omit any part of the text.

DO NOT change any line breaks or paragraph breaks. If the paragraph seems too short and you want to join it with the next paragraph, DO NOT do that. Two paragraphs in the unknown language MUST be translated to two separate paragraphs in ${toLanguage}.

The unknown language:
================================================
${text}
================================================

${toLanguage}:
================================================
`.trim();
}

export const POST = withRouteValidation(schema, async (_, { prompt, to, context }) => {
  const content = buildPrompt(to, prompt, context);
  if (env.IS_LIMITED) {
    // Please don't drain my OpenAI credits.
    if (!isWithinTokenLimit(content, 1024)) throw new Error("Prompt is too long.");
  }
  const response = await openai.createChatCompletion({
    model: env.IS_LIMITED ? "gpt-3.5-turbo" : "gpt-3.5-turbo-16k",
    stream: true,
    messages: [{ role: "user", content }],
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
});
