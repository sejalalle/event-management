import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser as loginAPI,
  registerUser as registerAPI,
  getCurrentUser,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check saved token when application starts
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login function
  async function login(email, password) {
    const data = await loginAPI({
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  }

  // Registration function
  async function register(name, email, password) {
    const data = await registerAPI({
      name,
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data.user;
  }

  // Logout function
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}