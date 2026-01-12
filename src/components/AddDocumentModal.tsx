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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 animate-fade-in"
      role="dialog" 
      aria-modal="true" 
      aria-label="Add CORD Slice"
    >
      <div className="w-full max-w-195 max-h-[calc(100vh-24px)] overflow-auto glass-card text-gray-100 rounded-2xl shadow-dark-lg p-5 animate-scale-in">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="m-0 text-xl font-semibold gradient-text">Add CORD Slice</h2>
          <button 
            className="px-3 py-1.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300" 
            type="button" 
            onClick={onClose} 
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <p className="mb-3 text-gray-300">
            Upload a <b className="text-indigo-300">CORD-19 slice zip</b> with this structure:
          </p>
          <pre className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 whitespace-pre-wrap text-sm text-gray-300 font-mono">
{`cord19_sliced
├─ document_parses/
│  ├─ pdf_json/
│  └─ pmc_json/
├─ COVID.DATA.LIC.AGMT.pdf
├─ json_schema.txt
├─ metadata.csv
└─ metadata.readme`}
          </pre>

          <label className="block font-semibold text-sm mb-2 text-white">Zip file</label>
          <div className="flex gap-3 items-center">
            <input
              type="file"
              className="flex-1 px-4 py-2.5 text-sm bg-white/5 border border-white/20 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
              accept=".zip,application/zip"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
            <span className="text-xs text-gray-400 whitespace-nowrap">{fileLabel}</span>
          </div>

          {err && (
            <div className="mt-4 p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-sm animate-fade-in">
              {err}
            </div>
          )}
          {ok && (
            <div className="mt-4 p-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm animate-fade-in">
              {ok}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-5">
            <button 
              className="px-5 py-2.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300" 
              type="button" 
              onClick={onClose} 
              disabled={loading}
            >
              Close
            </button>
            <button 
              className="px-5 py-2.5 text-sm bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2" 
              type="submit" 
              disabled={loading || !file}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Indexing..." : "Upload & Index"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
