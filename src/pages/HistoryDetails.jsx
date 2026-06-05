import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { getHistory, deleteHistory } from "../api/historyApi";

import Sidebar from "../components/Sidebar";

export default function HistoryDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [history, setHistory] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getHistory(id);

    setHistory(res);
  };

  const remove = async () => {
    await deleteHistory(id);

    navigate("/history");
  };

  if (!history) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-4xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan">Query Details</h1>

        <div className="bg-card rounded-3xl p-8 ring-1 ring-accent/10">
          <h3 className="mb-4 text-muted">Question</h3>

          <div className="mb-8 text-slate-200">{history.inputText}</div>

          <h3 className="mb-4 text-muted">Generated Result</h3>

          <pre className="whitespace-pre-wrap bg-slate-900 p-4 rounded text-slate-100">{history.generatedSql}</pre>

          <button
            className="mt-10 bg-accent px-6 py-3 rounded-xl text-white shadow"
            onClick={remove}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
