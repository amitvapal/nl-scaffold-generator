import { useState } from "react";
import { refineScaffold } from "../api";

export default function RefineInput({ jobId, onRefined, onError }) {
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!instruction.trim()) return;
    setLoading(true);
    try {
      const result = await refineScaffold(jobId, instruction);
      onRefined(result);
      setInstruction("");
    } catch (e) {
      onError?.(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        rows={2}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
        placeholder="Refine: e.g. add JWT auth, swap SQLite for Postgres..."
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !instruction.trim()}
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {loading ? "Refining..." : "Refine"}
      </button>
    </div>
  );
}
