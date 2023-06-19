import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

import { withRouteValidation } from "~/lib/with-route-validation";

import { env } from "~/env.mjs";

export const runtime = "edge";

const apiConfig = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(apiConfig);
const schema = z.object({
  prompt: z.string(),
  from: z.string(),
  to: z.string(),
  context: z.string(),
});

function buildPrompt(fromLanguage: string, toLanguage: string, text: string, context: string) {
  return `
You are a light novel translator from ${fromLanguage} to ${toLanguage}.

You will be given an excerpt from a light novel in ${fromLanguage} and you will have to translate it into ${toLanguage}.

Do not translate the text literally. Instead, translate the text in a way that makes sense in ${toLanguage}.

In your reply message, do not add anything other than the translation. Do not add any extra words or sentences.

DO NOT change the meaning of any part of the text, or omit any part of the text.

DO NOT change any line breaks or paragraph breaks. If the paragraph seems too short and you want to join it with the next paragraph, DO NOT do that. Two paragraphs in ${fromLanguage} MUST be translated to two separate paragraphs in ${toLanguage}.

The context of the light novel, before the excerpt, is as follows:
================================================
${context}
================================================

Please follow the context of the light novel when translating.

In your reply message, do not add anything other than the translation. Do not add any extra words or sentences.

DO NOT change the meaning of any part of the text, or omit any part of the text.

DO NOT change any line breaks or paragraph breaks. If the paragraph seems too short and you want to join it with the next paragraph, DO NOT do that. Two paragraphs in ${fromLanguage} MUST be translated to two separate paragraphs in ${toLanguage}.

${fromLanguage}:
================================================
${text}
================================================

${toLanguage}:
================================================
`.trim();
}

export const POST = withRouteValidation(schema, async (_, { prompt, from, to, context }) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    stream: true,
    messages: [{ role: "user", content: buildPrompt(from, to, prompt, context) }],
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
});
