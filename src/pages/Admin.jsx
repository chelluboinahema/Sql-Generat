import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import { getAllUsersHistory, deleteUserHistory } from "../api/adminApi";

import AdminCard from "../components/AdminCard";

import { useNotification } from "../context/NotificationContext";

export default function Admin() {
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const { showNotification } = useNotification();

  const load = async () => {
    try {
      const res = await getAllUsersHistory();

      setHistory(res);
    } catch {
      showNotification("403 Access Denied", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await deleteUserHistory(id);

    load();
  };

  const filtered = history.filter((x) =>
    x.user?.email

      ?.toLowerCase()

      .includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-4xl">Admin Dashboard</h1>

          <div className="flex gap-3">
            <div className="bg-card p-5 rounded-2xl">
              Queries
              {history.length}
            </div>
          </div>
        </div>

        <input
          placeholder="Search user"
          className="mt-8 mb-8 w-full p-5 rounded-xl text-black bg-slate-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filtered.length === 0 ? (
          <div>No Data</div>
        ) : (
          filtered.map((item) => (
            <AdminCard key={item.id} item={item} remove={remove} />
          ))
        )}
      </div>
    </div>
  );
}
