import { create } from "zustand";

type Settings = {
    site_name: string;
    site_email: string;
    default_image: string;
    twitter_username: string;
    instagram_username: string;
};

type SettingsStore = {
    settings: Settings | null;
    setSettings: (settings: Settings) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: null,
    setSettings: (settings) => set({ settings }),
}));
