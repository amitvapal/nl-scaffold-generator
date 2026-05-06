import { useState } from "react";

import { generateScaffold } from "./api";
import AppTypeSelector from "./components/AppTypeSelector";
import DownloadButton from "./components/DownloadButton";
import FileTreePreview from "./components/FileTreePreview";
import FileViewer from "./components/FileViewer";
import PromptInput from "./components/PromptInput";
import RefineInput from "./components/RefineInput";

export default function App() {
  const [description, setDescription] = useState("");
  const [appType, setAppType] = useState("rest_api");
  const [scaffold, setScaffold] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateScaffold(description, appType, null);
      setScaffold(result);
      setSelectedFile(result.files[0] ?? null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRefined(result) {
    setScaffold(result);
    setSelectedFile(result.files[0] ?? null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <header
        className="relative border-b border-zinc-900"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(94, 106, 210, 0.10), transparent 70%)",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <span className="font-mono text-[11px] font-semibold text-accent">
                {"{}"}
              </span>
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
                Scaffold Generator
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Describe an app. Get production-ready code.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
              Beta
            </span>
            <span className="text-xs font-mono text-zinc-600">v0.1</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-4 py-3 text-sm text-red-300 flex items-start gap-3">
            <svg
              className="h-4 w-4 mt-0.5 shrink-0 text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6">
          <div className="space-y-7">
            <Section label="Project type">
              <AppTypeSelector value={appType} onChange={setAppType} />
            </Section>

            <Section label="Describe your app">
              <PromptInput
                value={description}
                onChange={setDescription}
                onSubmit={handleGenerate}
                loading={loading}
              />
            </Section>

            {scaffold && (
              <div className="pt-7 border-t border-zinc-900">
                <Section label="Refine">
                  <RefineInput
                    jobId={scaffold.job_id}
                    onRefined={handleRefined}
                    onError={setError}
                  />
                </Section>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {scaffold ? (
              <>
                <div className="rounded-lg border border-zinc-900 bg-zinc-900/30 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.12em]">
                      Files
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      {scaffold.files.length}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    <FileTreePreview
                      files={scaffold.files}
                      selected={selectedFile}
                      onSelect={setSelectedFile}
                    />
                  </div>
                </div>
                <FileViewer file={selectedFile} />
                <DownloadButton jobId={scaffold.job_id} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        <footer className="mt-16 pt-6 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-600">
          <span className="font-mono">scaffold-generator</span>
        </footer>
      </main>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <section>
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.12em] mb-3">
        {label}
      </label>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/10 p-14 text-center">
      <div className="mx-auto h-11 w-11 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
        <svg
          className="h-5 w-5 text-zinc-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-200">No scaffold yet</p>
      <p className="text-xs text-zinc-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        Pick a project type and describe what you want to build. A complete,
        runnable Python project will appear here.
      </p>
    </div>
  );
}
