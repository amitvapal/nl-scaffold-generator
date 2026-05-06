export default function FileTreePreview({ files, selected, onSelect }) {
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
  return (
    <ul className="text-sm font-mono">
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
                "block w-full text-left px-2 py-1 rounded hover:bg-gray-100 truncate " +
                (isSelected ? "bg-indigo-50 text-indigo-900" : "text-gray-700")
              }
              style={{ paddingLeft: `${0.5 + depth}rem` }}
              title={f.path}
            >
              {basename}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
