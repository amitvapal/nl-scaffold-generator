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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            nl-scaffold-generator
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Describe an app in plain English. Get a runnable Python project scaffold.
          </p>
        </header>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <AppTypeSelector value={appType} onChange={setAppType} />
            <PromptInput
              value={description}
              onChange={setDescription}
              onSubmit={handleGenerate}
              loading={loading}
            />
            {scaffold && (
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-sm font-medium text-gray-700 mb-2">Refine</h2>
                <RefineInput
                  jobId={scaffold.job_id}
                  onRefined={handleRefined}
                  onError={setError}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {scaffold ? (
              <>
                <div className="rounded-md border border-gray-200 max-h-64 overflow-y-auto p-2">
                  <FileTreePreview
                    files={scaffold.files}
                    selected={selectedFile}
                    onSelect={setSelectedFile}
                  />
                </div>
                <FileViewer file={selectedFile} />
                <DownloadButton jobId={scaffold.job_id} />
              </>
            ) : (
              <div className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                Generate a scaffold to see a file preview and download the zip.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
