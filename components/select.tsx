import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export default function Select<T>({
  values,
  get,
  set,
  displayValue,
}: {
  values: T[];
  get: T;
  set: React.Dispatch<React.SetStateAction<T>>;
  displayValue: (_: T) => string;
}) {
  return (
    <Listbox value={get} onChange={set}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className={clsx(
              "flex w-full flex-row items-center justify-between border py-2 pl-6 pr-4 outline-none bg-daw-main-50",
              open ? "border-daw-main-700" : "border-daw-main-300"
            )}
          >
            <span>{displayValue(get)}</span>
            <span className={clsx(open && "rotate-180")}>
              <ChevronDown strokeWidth={1} />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute inset-x-0 top-full z-10 flex translate-y-2 flex-col border border-daw-main-300 bg-daw-main-50">
            {values.map((value, i) => (
              <Listbox.Option
                key={i + String(value)}
                value={value}
                className="cursor-pointer px-6 py-2 hover:bg-daw-main-200"
              >
                {displayValue(value)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  );
}
