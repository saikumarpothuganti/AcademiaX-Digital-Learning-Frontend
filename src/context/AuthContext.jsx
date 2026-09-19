import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("academiax_token");
    const storedUsername = localStorage.getItem("academiax_username");
    const storedRole = localStorage.getItem("academiax_role");

    if (storedToken && storedUsername && storedRole) {
      setToken(storedToken);
      setUser({ username: storedUsername, role: storedRole });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authApi.login(username, password);
    const data = response.data;

    const rawRole = data.role || "STUDENT";
    const role = rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
    const authToken = data.token || data.accessToken;

    localStorage.setItem("academiax_token", authToken);
    localStorage.setItem("academiax_username", data.username || username);
    localStorage.setItem("academiax_role", role);

    setToken(authToken);
    setUser({ username: data.username || username, role });
    return { username: data.username || username, role };
  };

  const register = async (username, email, password, role) => {
    const cleanRole = role.startsWith("ROLE_") ? role.replace("ROLE_", "") : role.toUpperCase();
    const response = await authApi.register(username, email, password, cleanRole);
    return response.data;
  };

  const forgotPassword = async (email) => {
    const response = await authApi.forgotPassword(email);
    return response.data;
  };

  const resetPassword = async (token, newPassword) => {
    const response = await authApi.resetPassword(token, newPassword);
    return response.data;
  };

  const verifyEmail = async (token) => {
    const response = await authApi.verifyEmail(token);
    return response.data;
  };

  const googleLogin = async (idToken, role = "STUDENT") => {
    const response = await authApi.googleLogin(idToken, role);
    const data = response.data;

    const rawRole = data.role || role;
    const cleanRole = rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
    const authToken = data.token;

    localStorage.setItem("academiax_token", authToken);
    localStorage.setItem("academiax_username", data.username);
    localStorage.setItem("academiax_role", cleanRole);

    setToken(authToken);
    setUser({ username: data.username, role: cleanRole });
    return { username: data.username, role: cleanRole };
  };

  const ssoLogin = async (provider, idToken, role = "STUDENT") => {
    const fn = provider === "microsoft" ? authApi.microsoftLogin : authApi.googleLogin;
    const response = await fn(idToken, role);
    const data = response.data;

    const rawRole = data.role || role;
    const cleanRole = rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
    const authToken = data.token;

    localStorage.setItem("academiax_token", authToken);
    localStorage.setItem("academiax_username", data.username);
    localStorage.setItem("academiax_role", cleanRole);

    setToken(authToken);
    setUser({ username: data.username, role: cleanRole });
    return { username: data.username, role: cleanRole };
  };

  const logout = () => {
    localStorage.removeItem("academiax_token");
    localStorage.removeItem("academiax_username");
    localStorage.removeItem("academiax_role");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        googleLogin,
        ssoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
