"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/lib/storage";

const AUTH_USER_KEY = "clothes_auth_user";

export const DEMO_USERS: User[] = [
  {
    id: "usr-sophea",
    name: "Sophea Chan",
    email: "sophea.chan@gmail.com",
    phone: "012889977",
    telegram: "@sopheachan",
    address: {
      cityProvince: "Phnom Penh",
      khanDistrict: "Chamkarmon",
      sangkatCommune: "Boeung Keng Kang 1 (BKK1)",
      streetAddress: "House #42, Street 310",
      landmark: "Near Brown Coffee BKK57",
      country: "Cambodia",
    },
  },
  {
    id: "usr-vireak",
    name: "Vireak Roth",
    email: "vireak.roth@outlook.com",
    phone: "098554433",
    telegram: "@vireak_sr",
    address: {
      cityProvince: "Siem Reap",
      khanDistrict: "Krong Siem Reap",
      sangkatCommune: "Sala Kamreuk",
      streetAddress: "St. 07, Wat Bo Village",
      landmark: "Behind Wat Bo Temple",
      country: "Cambodia",
    },
  },
];

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithDemo: (demoIndex?: number) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getStorageItem<User | null>(AUTH_USER_KEY, null);
    if (saved) {
      setUser(saved);
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string, name?: string) => {
    const foundDemo = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    const targetUser: User = foundDemo || {
      id: `usr-${Date.now().toString(36)}`,
      name: name?.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email.trim().toLowerCase(),
      phone: "012000000",
      telegram: "",
      address: {
        cityProvince: "Phnom Penh",
        khanDistrict: "Daun Penh",
        sangkatCommune: "Phsar Thmey",
        streetAddress: "",
        landmark: "",
        country: "Cambodia",
      },
    };

    setUser(targetUser);
    setStorageItem(AUTH_USER_KEY, targetUser);
    return { success: true };
  };

  const loginWithDemo = (demoIndex = 0) => {
    const target = DEMO_USERS[demoIndex] || DEMO_USERS[0];
    setUser(target);
    setStorageItem(AUTH_USER_KEY, target);
  };

  const logout = () => {
    setUser(null);
    removeStorageItem(AUTH_USER_KEY);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedFields };
    setUser(nextUser);
    setStorageItem(AUTH_USER_KEY, nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        login,
        loginWithDemo,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
