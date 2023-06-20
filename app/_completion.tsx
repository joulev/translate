"use client";

import { useCompletion } from "ai/react";
import clsx from "clsx";
import { useState } from "react";

import Markdown from "./_markdown";

export default function Completion() {
  const [content, setContent] = useState("");
  const [to, setTo] = useState("English");
  const [context, setContext] = useState("");
  const { complete, completion, isLoading } = useCompletion({
    api: "/completion",
    body: { to, context },
  });
  const onChangeHandlerGenerator =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };
  return (
    <div className="grid h-screen w-screen grid-cols-2 gap-6 p-6">
      <form
        className="flex flex-col gap-6"
        onSubmit={async e => {
          e.preventDefault();
          await complete(content);
        }}
      >
        <textarea
          className="prose prose-zinc w-full max-w-full flex-grow border p-6 outline-none border-daw-main-300 bg-daw-main-50 dark:prose-invert"
          placeholder="Enter your text..."
          required
          value={content}
          onChange={onChangeHandlerGenerator(setContent)}
        />
        <input
          className="border px-6 py-2 outline-none border-daw-main-300 bg-daw-main-50"
          placeholder="English"
          type="text"
          value={to}
          onChange={onChangeHandlerGenerator(setTo)}
        />
        <textarea
          className="prose prose-zinc w-full max-w-full flex-grow border p-6 outline-none border-daw-main-300 bg-daw-main-50 dark:prose-invert"
          placeholder="Enter context..."
          value={context}
          onChange={onChangeHandlerGenerator(setContext)}
        />
        <button
          className="px-6 py-2 bg-daw-main-950 text-daw-main-50 hover:bg-daw-main-800 disabled:cursor-wait disabled:bg-daw-main-100 disabled:text-daw-main-500"
          disabled={isLoading}
        >
          Translate
        </button>
      </form>
      <Markdown
        className={clsx(
          "prose prose-zinc max-w-full overflow-y-auto border p-6 border-daw-main-300 dark:prose-invert",
          isLoading && "cursor-wait select-none"
        )}
        content={completion}
      />
    </div>
  );
}
