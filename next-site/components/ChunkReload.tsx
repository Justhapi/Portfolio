"use client";

import { useEffect } from "react";

/* When the code behind a page changes while a tab is open (a new deploy, or a
   branch switch with the dev server running), the tab can ask for script
   files that no longer exist and Next shows "This page couldn't load".
   Reload once to pick up the current files; the sessionStorage guard keeps a
   real outage from looping. */
const KEY = "chunk-reload-at";

function isChunkError(e: unknown) {
  const err = e as { name?: string; message?: string } | null;
  return !!err && (err.name === "ChunkLoadError" || /Loading (CSS )?chunk .* failed/i.test(err.message ?? ""));
}

export default function ChunkReload() {
  useEffect(() => {
    const recover = (e: unknown) => {
      if (!isChunkError(e)) return;
      try {
        const last = Number(sessionStorage.getItem(KEY) || 0);
        if (Date.now() - last < 10_000) return;
        sessionStorage.setItem(KEY, String(Date.now()));
      } catch { /* storage blocked: still reload once */ }
      window.location.reload();
    };
    const onError = (e: ErrorEvent) => recover(e.error);
    const onReject = (e: PromiseRejectionEvent) => recover(e.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
    };
  }, []);
  return null;
}
