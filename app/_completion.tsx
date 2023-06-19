"use client";

import { useCompletion } from "ai/react";
import clsx from "clsx";
import { useState } from "react";

import Markdown from "./_markdown";

export default function Completion() {
  const [content, setContent] = useState("");
  const { complete, completion, isLoading } = useCompletion({ api: "/completion" });
  return (
    <div className="grid h-screen w-screen grid-cols-1 grid-rows-2 gap-8 p-8 lg:grid-cols-2 lg:grid-rows-1">
      <form
        className="flex flex-col gap-8"
        onSubmit={async e => {
          e.preventDefault();
          await complete(content);
        }}
      >
        <textarea
          className="prose prose-zinc w-full flex-grow border p-8 outline-none border-daw-main-300 bg-daw-main-50 dark:prose-invert"
          placeholder="Enter your text..."
          required
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          className="px-8 py-2 bg-daw-main-950 text-daw-main-50 hover:bg-daw-main-800 disabled:cursor-wait disabled:bg-daw-main-100 disabled:text-daw-main-500"
          disabled={isLoading}
        >
          Translate
        </button>
      </form>
      <Markdown
        className={clsx(
          "prose prose-zinc overflow-y-auto border p-8 border-daw-main-300 dark:prose-invert",
          isLoading && "cursor-wait select-none"
        )}
        content={completion}
      />
    </div>
  );
}
