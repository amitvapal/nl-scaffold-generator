const APP_TYPES = [
  { id: "rest_api", label: "REST API" },
  { id: "cli_tool", label: "CLI Tool" },
  { id: "dashboard", label: "Dashboard" },
  { id: "chatbot", label: "Chatbot" },
  { id: "data_pipeline", label: "Data Pipeline" },
];

export default function AppTypeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {APP_TYPES.map((t) => {
        const selected = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={
              "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
              (selected
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800")
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
