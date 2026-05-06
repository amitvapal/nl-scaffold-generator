export default function PromptInput({ value, onChange, onSubmit, loading }) {
  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative group">
        <textarea
          rows={5}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 p-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 leading-relaxed resize-none transition-colors duration-150 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
          placeholder="A FastAPI app that fetches weather data from OpenWeather and caches it in Redis, with a /forecast endpoint that takes a city name."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <kbd className="absolute bottom-2.5 right-2.5 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-[10px] font-mono text-zinc-500 pointer-events-none">
          ⌘ ↵
        </kbd>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className={
          "group relative inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
          "bg-accent text-white shadow-[0_0_0_1px_rgba(94,106,210,0.4),0_4px_20px_-6px_rgba(94,106,210,0.5)] " +
          "hover:bg-accent-hover hover:shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_6px_24px_-6px_rgba(94,106,210,0.6)] " +
          "active:scale-[0.985] " +
          "disabled:bg-zinc-900 disabled:text-zinc-600 disabled:shadow-[inset_0_0_0_1px_rgb(39,39,42)] disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-zinc-900"
        }
      >
        {loading ? (
          <>
            <Spinner />
            <span>Generating</span>
          </>
        ) : (
          <>
            <span>Generate scaffold</span>
            <svg
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-disabled:translate-x-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
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
