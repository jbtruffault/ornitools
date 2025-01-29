'use client';

import { AuthProvider, OnErrorResponse  } from "@refinedev/core";
import { fetchUser, login, logout } from "@/tanstack/features/client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User } from "@/types/user";

// Créer le contexte pour l'état global de l'utilisateur
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser les données utilisateur lors du chargement
  useEffect(() => {
    const fetchInitialUser = async () => {
      try {
        const fetchedUser = await fetchUser();
        setUser(fetchedUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Intégration avec Refine
export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await login(email, password);
      if (response.success) {
        const user = await fetchUser(); 
        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid credentials",
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return {
        success: false,
        error: {
          message: errorMessage,
          name: "Login Error",
        },
      };
    }
  },
  logout: async (params?: any) => {
    try {
      await logout(); 
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Logout failed:", error);
      return {
        success: false,
        error: {
          message: "Logout failed",
          name: "LogoutError",
        },
      };
    }
  },  
  check: async () => {
    const user = await fetchUser();
    if (user) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },
  getPermissions: async () => {
    const user = await fetchUser();
    return user?.permissions || null;
  },
  getIdentity: async () => {
    const user = await fetchUser();
    return user || null;
  },
  onError: async (error: unknown): Promise<OnErrorResponse> => {
    // Gestion des erreurs globales
    console.error("Error:", error instanceof Error ? error.message : "Unknown error");

    return {
      //redirectTo: "/",
      logout: false,
    };
  },
};
