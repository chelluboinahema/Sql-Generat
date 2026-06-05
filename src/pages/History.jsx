import { useEffect, useState, useMemo } from "react";

import Sidebar from "../components/Sidebar";
import { FiTrash, FiSearch } from "react-icons/fi";

import HistoryCard from "../components/HistoryCard";

import {
  getAllHistory,
  deleteHistory,
  deleteAllHistory,
} from "../api/historyApi";
import { useNotification } from "../context/NotificationContext";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showNotification } = useNotification();

  const load = async () => {
    const res = await getAllHistory();

    setHistory(res);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await deleteHistory(id);

    load();
  };

  const removeAll = async () => {
    await deleteAllHistory(history);

    load();
  };

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleConfirmDeleteAll = async () => {
    await removeAll();
    handleCloseConfirm();
    showNotification("All history deleted", "success");
  };

  const extractContent = (payload) => {
    if (payload == null) return "";

    if (typeof payload !== "string") {
      return (
        payload.sql || payload.response || payload.output || payload.message || JSON.stringify(payload)
      );
    }

    const text = payload.trim();
    if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
      try {
        const parsed = JSON.parse(text);
        return extractContent(parsed);
      } catch {
        // not JSON
      }
    }

    // strip code fences if present
    const codeMatch = text.match(/```(?:\w*)\n([\s\S]*?)```/);
    if (codeMatch) return codeMatch[1];

    return text;
  };

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    if (!q) return history;

    return history.filter((h) => {
      const input = (h.inputText || "").toLowerCase();
      const gen = (h.generatedSql && extractContent(h.generatedSql)) || (h.output && extractContent(h.output)) || (h.message && extractContent(h.message)) || "";
      const hay = `${input} ${gen}`.toLowerCase();
      return hay.includes(q);
    });
  }, [history, search]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold">My History</h1>
            <div className="text-sm text-gray-400">{history.length} queries</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                placeholder="Search history..."
                className="pl-10 py-2 rounded-lg bg-slate-900 text-white px-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                if (history.length === 0) return;
                handleOpenConfirm();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${history.length === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-accent text-white"}`}
              disabled={history.length === 0}
            >
              <FiTrash />
              <span>Delete All</span>
            </button>

            <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
              <DialogTitle>Confirm delete</DialogTitle>
              <DialogContent>Are you sure you want to delete all history? This action cannot be undone.</DialogContent>
              <DialogActions>
                <Button onClick={handleCloseConfirm}>Cancel</Button>
                <Button color="error" onClick={handleConfirmDeleteAll}>Delete All</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-gray-400">No history found</div>
          ) : (
            filtered.map((item) => (
              <HistoryCard key={item.id} item={item} remove={remove} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
