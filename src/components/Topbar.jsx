import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { logout } from "../redux/authSlice";

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
      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">SQL Assistant</h2>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-primary to-accent px-5 py-3 rounded-xl text-white shadow-md hover:opacity-95"
      >
        Logout
      </button>
    </div>
  );
}
