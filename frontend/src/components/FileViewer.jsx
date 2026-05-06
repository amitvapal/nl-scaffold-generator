import { useState } from "react";

export default function FileViewer({ file }) {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="rounded-lg border border-zinc-900 bg-zinc-900/20 p-10 text-center">
        <p className="text-xs text-zinc-500">
          Select a file to view its contents
        </p>
      </div>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable in non-secure contexts
    }
  }

  const lineCount = file.content.split("\n").length;

  return (
    <div className="rounded-lg border border-zinc-900 bg-zinc-900/30 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileIcon className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <code
            className="text-xs font-mono text-zinc-300 truncate"
            title={file.path}
          >
            {file.path}
          </code>
          <span className="text-[10px] font-mono text-zinc-600 shrink-0">
            · {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={
            "shrink-0 ml-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium transition-all duration-150 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 " +
            (copied
              ? "text-accent"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80")
          }
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-xs leading-[1.65] p-4 overflow-x-auto max-h-[60vh]">
        <code className="font-mono text-zinc-300">{file.content}</code>
      </pre>
    </div>
  );
}

function FileIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
