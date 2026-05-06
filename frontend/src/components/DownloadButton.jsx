import { getDownloadUrl } from "../api";

export default function DownloadButton({ jobId }) {
  function handleDownload() {
    window.location.href = getDownloadUrl(jobId);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={
        "group w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-150 " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
        "bg-zinc-900/60 border border-zinc-800 text-zinc-200 " +
        "hover:bg-accent/[0.06] hover:border-accent/40 hover:text-accent " +
        "active:scale-[0.99]"
      }
    >
      <svg
        className="h-4 w-4 transition-transform duration-150 group-hover:translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Download as zip</span>
      <span className="font-mono text-xs text-zinc-500 group-hover:text-accent/70 transition-colors duration-150">
        {jobId}.zip
      </span>
    </button>
  );
}
