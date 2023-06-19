import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { z } from "zod";

import { withRouteValidation } from "~/lib/with-route-validation";

import { env } from "~/env.mjs";

export const runtime = "edge";

const apiConfig = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(apiConfig);
const schema = z.object({ prompt: z.string(), test: z.string() });

function buildPrompt(text: string, fromLanguage: string, toLanguage: string) {
  return `
You are a translator from ${fromLanguage} to ${toLanguage}.

You will be given an excerpt from a text in ${fromLanguage} and you will have to translate it into ${toLanguage}.

Do not translate the text literally. Instead, translate the text in a way that makes sense in ${toLanguage}.

In your reply message, do not add anything other than the translation. Do not add any extra words or sentences.

DO NOT change the meaning of any part of the text, or omit any part of the text.

${fromLanguage}:
================================================
${text}
================================================

${toLanguage}:
================================================
`.trim();
}

export const POST = withRouteValidation(schema, async (_, { prompt, test }) => {
  console.log(test);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [{ role: "user", content: buildPrompt(prompt, "English", "Vietnamese") }],
    temperature: 1,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
});
