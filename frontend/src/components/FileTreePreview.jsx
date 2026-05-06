export default function FileTreePreview({ files, selected, onSelect }) {
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
  return (
    <ul className="space-y-0.5">
      {sorted.map((f) => {
        const depth = (f.path.match(/\//g) || []).length;
        const isSelected = selected?.path === f.path;
        const basename = f.path.split("/").pop();
        return (
          <li key={f.path}>
            <button
              type="button"
              onClick={() => onSelect(f)}
              className={
                "group flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors duration-100 " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-inset " +
                (isSelected
                  ? "bg-accent/10 text-accent"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100")
              }
              style={{ paddingLeft: `${0.5 + depth * 0.875}rem` }}
              title={f.path}
            >
              <FileIcon
                className={
                  "h-3.5 w-3.5 shrink-0 transition-colors duration-100 " +
                  (isSelected
                    ? "text-accent"
                    : "text-zinc-600 group-hover:text-zinc-400")
                }
              />
              <span className="truncate">{basename}</span>
            </button>
          </li>
        );
      })}
    </ul>
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
