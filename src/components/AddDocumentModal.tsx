// src/components/AddDocumentModal.tsx
import React, { useMemo, useState } from "react";
import { addCordSlice as apiAddCordSlice } from "../api";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function AddDocumentModal({ show, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const fileLabel = useMemo(() => {
    if (!file) return "No file chosen";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!file) {
      setErr("Please choose a .zip file (CORD-19 cord_slice).");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErr("File must be a .zip.");
      return;
    }

    setLoading(true);
    try {
      const out = await apiAddCordSlice(file);
      const ms =
        out?.total_time_ms != null && typeof out.total_time_ms === "number"
          ? out.total_time_ms.toFixed(2)
          : String(out?.total_time_ms ?? "?");

      setOk(
        `Indexed ${out?.docs_indexed ?? "?"} docs into ${out?.segment ?? "?"} (reloaded=${
          out?.reloaded ?? "?"
        }) in ${ms}ms`
      );
      setFile(null);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3"
      role="dialog" 
      aria-modal="true" 
      aria-label="Add CORD Slice"
    >
      <div className="w-full max-w-[780px] max-h-[calc(100vh-24px)] overflow-auto bg-white text-gray-900 rounded-2xl border border-black/10 shadow-2xl p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="m-0 text-lg font-semibold">Add CORD Slice</h2>
          <button 
            className="px-2 py-1 text-sm border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors" 
            type="button" 
            onClick={onClose} 
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <p className="mb-2">
            Upload a <b>CORD-19 slice zip</b> with this structure:
          </p>
          <pre className="bg-gray-100 border border-black/10 rounded-xl p-3 mb-3 whitespace-pre-wrap text-sm">
{`cord19_sliced
├─ document_parses/
│  ├─ pdf_json/
│  └─ pmc_json/
├─ COVID.DATA.LIC.AGMT.pdf
├─ json_schema.txt
├─ metadata.csv
└─ metadata.readme`}
          </pre>

          <label className="block font-semibold text-sm mb-1">Zip file</label>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".zip,application/zip"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{fileLabel}</span>
          </div>

          {err && (
            <div className="mt-3 p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm">
              {err}
            </div>
          )}
          {ok && (
            <div className="mt-3 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm">
              {ok}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button 
              className="px-4 py-2 text-sm border border-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition-colors" 
              type="button" 
              onClick={onClose} 
              disabled={loading}
            >
              Close
            </button>
            <button 
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit" 
              disabled={loading || !file}
            >
              {loading ? "Indexing..." : "Upload & Index"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
