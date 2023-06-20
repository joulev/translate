import clsx from "clsx";

export default function Textarea({
  get,
  set,
  className,
  placeholder,
  required,
}: {
  get: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      className={clsx(
        "prose prose-zinc w-full max-w-full flex-grow resize-none border p-6 outline-none border-daw-main-300 bg-daw-main-50 dark:prose-invert",
        className
      )}
      placeholder={placeholder}
      required={required}
      value={get}
      onChange={e => set(e.target.value)}
    />
  );
}