import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileState {
  TypeSide: string | undefined;
  setTypeSide: (TypeSide: string) => void;
}

// Tạo Zustand store với persist middleware
export const useSidebar = create<ProfileState>()(
  persist(
    (set) => ({
      TypeSide: "DashBoard",
      setTypeSide: (TypeSide: string) => set({ TypeSide }),
    }),
    {
      name: "TypeSide", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage), // Sử dụng localStorage
    }
  )
);
