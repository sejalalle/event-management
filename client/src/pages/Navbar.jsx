import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

        <Link to="/" className="text-2xl font-bold">
          EventHub
        </Link>

        <div className="flex flex-wrap items-center gap-5">

          <Link to="/" className="hover:text-indigo-400">
            Home
          </Link>

          <Link to="/events" className="hover:text-indigo-400">
            Events
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-300">
                Hi, {user.name}
              </span>

              <Link
                to="/my-registrations"
                className="hover:text-indigo-400"
              >
                My Registrations
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-indigo-400"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-400">
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;