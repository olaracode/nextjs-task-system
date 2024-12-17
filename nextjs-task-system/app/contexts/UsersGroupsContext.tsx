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
import { UserT, GroupT } from "@/db/type";
import { redirect } from "next/navigation";
import { useUserContext } from "./UserContext";
interface UserGroupContext {
  groups: GroupT[] | undefined;
  users: UserT[] | undefined;
}
export const UserGroupsContext = createContext<UserGroupContext | undefined>(
  undefined,
);

export const UsersGroupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [users, setUsers] = useState<UserT[]>();
  const [groups, setGroups] = useState<GroupT[]>();
  const getUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/users");
      if (!response.ok) throw new Error("Unkwown");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const getGroups = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/groups");
      const data = await response.json();
      if (!response.ok) throw new Error("Unkown");
      setGroups(data.groups);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const contextValues = { groups, users };

  useEffect(() => {
    // avoid running this logic if there's no user to check their role
    if (!user) return;
    if (user.role !== "ADMIN") return;
    getUsers();
    getGroups();
  }, [user]);
  return (
    <UserGroupsContext.Provider value={contextValues}>
      {children}
    </UserGroupsContext.Provider>
  );
};

export const useUserGroupContext = () => {
  const context = useContext(UserGroupsContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
