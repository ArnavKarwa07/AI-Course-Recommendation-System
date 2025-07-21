import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("empId");
    if (stored) setEmpId(Number(stored));
  }, []);

  const login = (id) => {
    setEmpId(id);
    localStorage.setItem("empId", id);
  };

  const logout = () => {
    setEmpId(null);
    localStorage.removeItem("empId");
  };

  return (
    <AuthContext.Provider value={{ empId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
