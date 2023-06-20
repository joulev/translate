import clsx from "clsx";

export default function Button({ className, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={clsx(
        "px-6 py-2 bg-daw-main-700 text-daw-main-50 hover:bg-daw-main-600 disabled:cursor-wait disabled:bg-daw-main-100 disabled:text-daw-main-500",
        className
      )}
      {...props}
    />
  );
}
