"use client";

import { useCompletion } from "ai/react";
import clsx from "clsx";
import { useState } from "react";

import Textarea from "~/components/textarea";

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
    <form
      className="grid h-screen w-screen grid-cols-2 gap-6 p-6"
      onSubmit={async e => {
        e.preventDefault();
        await complete(content);
      }}
    >
      <div className="grid grid-rows-2 gap-6">
        <Textarea get={content} set={setContent} placeholder="Enter your text..." required />
        <Textarea get={context} set={setContext} placeholder="Enter context..." />
      </div>
      <div className="flex flex-col gap-6 overflow-hidden">
        <div className="grid grid-cols-2 gap-6">
          <input
            className="border px-6 py-2 outline-none border-daw-main-300 bg-daw-main-50"
            placeholder="English"
            type="text"
            value={to}
            onChange={onChangeHandlerGenerator(setTo)}
          />
          <button
            className="px-6 py-2 bg-daw-main-950 text-daw-main-50 hover:bg-daw-main-800 disabled:cursor-wait disabled:bg-daw-main-100 disabled:text-daw-main-500"
            disabled={isLoading}
          >
            Translate
          </button>
        </div>
        <div className="flex-grow overflow-y-auto border p-6 border-daw-main-300">
          <Markdown
            className={clsx(
              "prose prose-zinc dark:prose-invert",
              isLoading && "cursor-wait select-none"
            )}
            content={completion}
          />
        </div>
      </div>
    </form>
  );
}
