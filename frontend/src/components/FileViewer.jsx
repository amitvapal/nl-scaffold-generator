import { useState } from "react";

export default function FileViewer({ file }) {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="text-sm text-gray-500 italic p-4 border border-dashed border-gray-300 rounded">
        Select a file to view its contents.
      </div>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable in non-secure contexts; silently ignore
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <code className="text-sm font-mono text-gray-700 truncate" title={file.path}>
          {file.path}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 ml-3 shrink-0"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-50 text-sm p-4 rounded overflow-x-auto">
        <code>{file.content}</code>
      </pre>
    </div>
  );
}
