import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth as useOidcAuth } from "react-oidc-context";
import { authApi } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const oidc = useOidcAuth();
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync OIDC token to local storage when SSO happens
  useEffect(() => {
    if (oidc.isAuthenticated && oidc.user) {
      const authToken = oidc.user.access_token;
      
      // Parse token for roles
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const realmAccess = payload.realm_access || {};
        const roles = realmAccess.roles || [];
        
        let highestRole = "STUDENT";
        if (roles.includes("ADMIN")) highestRole = "ADMIN";
        else if (roles.includes("INSTRUCTOR")) highestRole = "INSTRUCTOR";
        
        const username = payload.preferred_username;
        
        localStorage.setItem("academiax_token", authToken);
        localStorage.setItem("academiax_username", username);
        localStorage.setItem("academiax_role", highestRole);
        
        setToken(authToken);
        setUser({ username, role: highestRole });
      } catch(e) {}
    } else {
      // Load local token on startup
      const storedToken = localStorage.getItem("academiax_token");
      const storedUsername = localStorage.getItem("academiax_username");
      const storedRole = localStorage.getItem("academiax_role");

      if (storedToken && storedUsername && storedRole) {
        setToken(storedToken);
        setUser({ username: storedUsername, role: storedRole });
      }
    }
    setLoading(false);
  }, [oidc.isAuthenticated, oidc.user]);

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

  const resetPassword = async (resetToken, newPassword) => {
    const response = await authApi.resetPassword(resetToken, newPassword);
    return response.data;
  };

  const verifyEmail = async (verificationToken) => {
    const response = await authApi.verifyEmail(verificationToken);
    return response.data;
  };

  const googleLogin = async () => {
    try {
      if (oidc.signinPopup) {
         await oidc.signinPopup({ extraQueryParams: { kc_idp_hint: "google" } });
      } else {
         await oidc.signinRedirect({ extraQueryParams: { kc_idp_hint: "google" } });
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const ssoLogin = async (provider) => {
    if (provider === "google") {
      return googleLogin();
    }
    try {
      if (oidc.signinPopup) {
         await oidc.signinPopup({ extraQueryParams: { kc_idp_hint: provider } });
      } else {
         await oidc.signinRedirect({ extraQueryParams: { kc_idp_hint: provider } });
      }
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem("academiax_token");
    localStorage.removeItem("academiax_username");
    localStorage.removeItem("academiax_role");
    setToken(null);
    setUser(null);
    if (oidc.isAuthenticated) {
      await oidc.signoutRedirect();
    }
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
