import { getDownloadUrl } from "../api";

export default function DownloadButton({ jobId }) {
  function handleDownload() {
    window.location.href = getDownloadUrl(jobId);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
    >
      Download zip
    </button>
  );
}
