"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserT } from "@/db/type";
import { redirect } from "next/navigation";
interface UserContext {
  user: UserT | null;
  isLoading: boolean;
  getUserInfo: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}
export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useMemo(() => user?.role === "ADMIN", [user]);
  const getUserInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/users/me");
      const data = await response.json();
      if (!response.ok) return;
      setUser(data.user as UserT);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout");
      if (!response.ok) return;
      redirect("/");
    } catch (error) {
      console.error(error);
    }
  }, []);

  const contextValues = {
    user,
    isAdmin,
    getUserInfo,
    logout,
    isLoading,
  };

  useEffect(() => {
    if (user) return;
    getUserInfo();
  }, []);
  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
