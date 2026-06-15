import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const loadUser = () => {
  try {
    const stored = localStorage.getItem("jp_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("jp_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jp_user");
    }
  }, [user]);

  const login = (role) => {
    setUser(
      role === "employer"
        ? { id: "e1", name: "Employer User", role: "employer" }
        : { id: "s1", name: "Job Seeker", role: "seeker" }
    );
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}