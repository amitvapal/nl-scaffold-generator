const BASE = import.meta.env.VITE_API_BASE ?? "";

async function postJSON(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      if (data?.detail) message = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    } catch {
      // body wasn't JSON; keep statusText
    }
    throw new Error(message);
  }
  return res.json();
}

export function generateScaffold(description, appType, followUp) {
  return postJSON("/api/generate", {
    description,
    app_type: appType,
    follow_up: followUp || null,
  });
}

export function refineScaffold(jobId, instruction) {
  return postJSON("/api/refine", { job_id: jobId, instruction });
}

export function getDownloadUrl(jobId) {
  return `${BASE}/api/download/${jobId}`;
}
