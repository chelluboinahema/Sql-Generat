import { Link } from "react-router-dom";

import { FiPlus, FiClock, FiX } from "react-icons/fi";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);

  const isAdmin =
    user?.isAdmin || (user?.role && String(user.role).toLowerCase() === "admin");

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    const openHandler = () => setOpen(true);
    window.addEventListener("toggleSidebar", openHandler);
    return () => window.removeEventListener("toggleSidebar", openHandler);
  }, []);

  const content = (
    <div className="p-6 flex flex-col h-full">
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

  return (
    <>
      <div className="hidden md:flex w-full md:w-[300px] bg-card md:border-r p-6 flex-col ring-1 ring-primary/6">
        {content}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="text-lg font-semibold">Menu</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md">
                <FiX />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
