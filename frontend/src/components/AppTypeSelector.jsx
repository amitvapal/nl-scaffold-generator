const APP_TYPES = [
  { id: "rest_api", label: "REST API" },
  { id: "cli_tool", label: "CLI Tool" },
  { id: "dashboard", label: "Dashboard" },
  { id: "chatbot", label: "Chatbot" },
  { id: "data_pipeline", label: "Data Pipeline" },
];

export default function AppTypeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {APP_TYPES.map((t) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={
              "px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
              (selected
                ? "bg-accent/10 border-accent/40 text-accent shadow-[inset_0_0_0_1px_rgba(94,106,210,0.15)]"
                : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200")
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
