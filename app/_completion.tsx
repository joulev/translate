"use client";

import { useCompletion } from "ai/react";
import clsx from "clsx";
import { useState } from "react";

import Button from "~/components/button";
import Select from "~/components/select";
import ShareButton from "~/components/share-button";
import Textarea from "~/components/textarea";

import Markdown from "./_markdown";

type AllowedLanguage = "English" | "Spanish" | "French" | "Japanese" | "Vietnamese";
const allowedLanguages: AllowedLanguage[] = [
  "English",
  "Spanish",
  "French",
  "Japanese",
  "Vietnamese",
];

export default function Completion() {
  const [content, setContent] = useState("");
  const [to, setTo] = useState<AllowedLanguage>("English");
  const [context, setContext] = useState("");
  const { complete, completion, isLoading } = useCompletion({
    api: "/completion",
    body: { to, context },
  });
  return (
    <>
      <div className="grid h-screen w-screen place-items-center md:hidden">
        <p className="px-6 text-center">
          This app is only meant as an experiment and is not responsive. Please use a wider screen.
        </p>
      </div>
      <form
        className="hidden h-screen w-screen grid-cols-2 gap-6 p-6 md:grid"
        onSubmit={async e => {
          e.preventDefault();
          try {
            await complete(content);
          } catch {
            alert(
              "Request failed. This can be due to the prompt being too long, or you have been rate limited."
            );
          }
        }}
      >
        <div className="flex flex-col gap-6">
          <Button
            disabled={isLoading}
            variant="secondary"
            type="button"
            onClick={async () => {
              const { content, context } = await import("./_sample");
              setContent(content);
              setContext(context);
              alert(
                `Preset loaded: Excerpt from "Wandering Witch: The Journey of Elaina", Volume 9, Chapter 3. © 白石定規, SB Creative Corp. Short excerpt used for educational research purposes. For readers, please buy the book to read the full story.`
              );
            }}
          >
            Use a preset
          </Button>
          <div className="grid flex-grow grid-rows-2 gap-6">
            <Textarea get={content} set={setContent} placeholder="Enter your text..." required />
            <Textarea
              get={context}
              set={setContext}
              placeholder="Enter the context of the story at this point."
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-2 gap-6">
            <Select values={allowedLanguages} get={to} set={setTo} displayValue={x => x} />
            <Button disabled={isLoading}>Translate</Button>
          </div>
          <div
            className={clsx(
              "group relative flex-grow overflow-hidden border px-6 py-2 border-daw-main-300",
              isLoading && "cursor-wait select-none"
            )}
          >
            <div className="h-full overflow-y-auto">
              <Markdown className="prose prose-zinc dark:prose-invert" content={completion} />
            </div>
            {!isLoading && <ShareButton text={completion} />}
          </div>
        </div>
      </form>
    </>
  );
}
