import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const auth = useSelector((state) => state.auth);
  const token = auth.token;
  const user = auth.user;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin) {
    const isAdmin = user?.isAdmin || (user?.role && String(user.role).toLowerCase() === "admin");
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
