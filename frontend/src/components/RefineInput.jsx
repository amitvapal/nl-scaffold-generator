import { useState } from "react";

import { refineScaffold } from "../api";

export default function RefineInput({ jobId, onRefined, onError }) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!instruction.trim()) return;
    setLoading(true);
    try {
      const result = await refineScaffold(jobId, instruction);
      onRefined(result);
      setInstruction("");
    } catch (e) {
      onError?.(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="space-y-2.5">
      <textarea
        rows={2}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-100 placeholder:text-zinc-600 leading-relaxed resize-none transition-colors duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
        placeholder="Add JWT auth, swap SQLite for Postgres..."
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !instruction.trim()}
        className={
          "group inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
          "bg-zinc-900/60 border border-zinc-800 text-zinc-300 " +
          "hover:border-accent/40 hover:text-accent hover:bg-accent/[0.05] " +
          "active:scale-[0.985] " +
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:text-zinc-300 disabled:hover:bg-zinc-900/60"
        }
      >
        {loading ? (
          <>
            <Spinner />
            <span>Refining</span>
          </>
        ) : (
          <>
            <SparkleIcon />
            <span>Refine scaffold</span>
          </>
        )}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3 w-3 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="h-3 w-3 transition-transform duration-150 group-hover:rotate-12 group-disabled:rotate-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" />
    </svg>
  );
}
