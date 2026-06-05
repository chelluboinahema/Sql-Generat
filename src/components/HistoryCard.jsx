import { FiTrash, FiArrowRight } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function HistoryCard({ item, remove }) {
  const navigate = useNavigate();

  const preview = item.generatedSql || item.output || item.message || "";
  const shortPreview = preview.length > 160 ? `${preview.slice(0, 160)}...` : preview;

  return (
    <div className="bg-card p-6 rounded-3xl mb-5 border border-gray-800 ring-1 ring-primary/6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold mb-2 text-white">{item.inputText}</div>
          {shortPreview && (
            <pre className="whitespace-pre-wrap text-sm text-slate-300 mb-3 bg-slate-900 p-3 rounded">{shortPreview}</pre>
          )}
          {item.createdAt && (
            <div className="text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            className="bg-gradient-to-r from-primary to-cyan px-4 py-2 rounded-xl text-white shadow"
            onClick={() => navigate(`/history/${item.id}`)}
            title="View details"
          >
            <FiArrowRight />
          </button>

          <button
            className="bg-accent px-4 py-2 rounded-xl text-white"
            onClick={() => remove(item.id)}
            title="Delete"
          >
            <FiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}
