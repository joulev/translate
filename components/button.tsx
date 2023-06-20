import clsx from "clsx";

export default function Button({
  variant = "primary",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      className={clsx(
        "border px-6 py-2 disabled:cursor-wait disabled:border-daw-main-100 disabled:bg-daw-main-100 disabled:text-daw-main-500",
        variant === "primary"
          ? "border-daw-main-700 bg-daw-main-700 text-daw-main-50 hover:border-daw-main-600 hover:bg-daw-main-600"
          : "border-daw-main-300 active:border-daw-main-700",
        className
      )}
      {...props}
    />
  );
}
