import type { UserInfoType } from "@/types/user-info";
import { create } from "zustand";

type User = {
  user: UserInfoType | undefined;
  setUser: (user: UserInfoType | undefined) => void;
};

export const useUserStore = create<User>((set) => ({
  user: undefined,
  setUser: (user) => set({ user })
}));
