import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ text }: { text: string }) {
  const [showCopied, setShowCopied] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);
  function copy() {
    if (currentTimeout) clearTimeout(currentTimeout);
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setCurrentTimeout(setTimeout(() => setShowCopied(false), 1000));
  }
  const CopiedIcon = showCopied ? Check : Copy;
  return (
    <button
      className="absolute right-4 top-4 hidden border p-2 border-daw-main-300 bg-daw-main-50 hover:border-daw-main-700 group-hover:block"
      onClick={copy}
      type="button"
    >
      <CopiedIcon strokeWidth={1} size={18} absoluteStrokeWidth />
    </button>
  );
}
