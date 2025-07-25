import { create } from 'zustand';

export interface User {
    id: number;
    username: string;
    email: string;
    roles?: string[];
}

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
