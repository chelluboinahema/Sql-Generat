import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { logout } from "../redux/authSlice";
import { FiMenu } from "react-icons/fi";

export default function Topbar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between mb-10 items-center bg-card p-4 rounded-2xl ring-1 ring-primary/6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggleSidebar"))}
          className="md:hidden p-2 rounded-lg hover:bg-primary/10"
          aria-label="Open menu"
        >
          <FiMenu className="text-primary" />
        </button>

        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SQL Assistant</h2>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-primary to-accent px-5 py-3 rounded-xl text-white shadow-md hover:opacity-95"
      >
        Logout
      </button>
    </div>
  );
}
