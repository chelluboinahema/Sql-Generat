import { Link } from "react-router-dom";

import { FiPlus, FiClock } from "react-icons/fi";

import { useSelector } from "react-redux";

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);

  const isAdmin =
    user?.isAdmin || (user?.role && String(user.role).toLowerCase() === "admin");

  return (
    <div className="w-[300px] bg-card border-r border-gray-800 p-6 flex flex-col ring-1 ring-primary/6">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        SQL AI
      </h1>

      <nav className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10"
        >
          <FiPlus className="text-primary" />
          <span>New Chat</span>
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10"
        >
          <FiClock className="text-accent" />
          <span>My History</span>
        </Link>

        {isAdmin && (
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-100 hover:bg-[#1A2038]">
            Admin
          </Link>
        )}
      </nav>
    </div>
  );
}
