import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useAuth();

  // Wait until authentication is checked
  if (loading) {
    return <Loading />;
  }

  // Redirect users who are not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Restrict admin-only routes
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;