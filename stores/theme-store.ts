import { useEffect } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { create } from "zustand";

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceStrong: string;
  primary: string;
  primaryText: string;
  text: string;
  muted: string;
  border: string;
  cardBorder: string;
  success: string;
  warning: string;
  shadow: string;
};

const lightColors: ThemeColors = {
  background: "#f7f9fc",
  surface: "#ffffff",
  surfaceStrong: "#eef2f8",
  primary: "#e53935",
  primaryText: "#ffffff",
  text: "#1c1f2a",
  muted: "#5d6474",
  border: "#d9e0ec",
  cardBorder: "#dfe6f1",
  success: "#1a9c60",
  warning: "#f5a524",
  shadow: "#00000024",
};

const darkColors: ThemeColors = {
  background: "#050505",
  surface: "#120c14",
  surfaceStrong: "#1a1016",
  primary: "#e53935",
  primaryText: "#ffffff",
  text: "#f7f1ff",
  muted: "#b9aebb",
  border: "#231824",
  cardBorder: "#22151d",
  success: "#35c36b",
  warning: "#f5a524",
  shadow: "#00000055",
};

function palette(mode: ThemeMode) {
  return mode === "dark" ? darkColors : lightColors;
}

type ThemeState = {
  mode: ThemeMode;
  colors: ThemeColors;
  followSystem: boolean;
  setMode: (mode: ThemeMode, opts?: { fromSystem?: boolean }) => void;
  toggle: () => void;
  syncWithSystem: (system: ColorSchemeName) => void;
};

function getInitialMode(system: ColorSchemeName): ThemeMode {
  if (system === "light") return "light";
  return "dark";
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const system = Appearance.getColorScheme();
  const initialMode = getInitialMode(system);

  return {
    mode: initialMode,
    colors: palette(initialMode),
    followSystem: true,
    setMode: (mode, opts) => {
      const nextMode = mode === "dark" ? "dark" : "light";
      set({
        mode: nextMode,
        colors: palette(nextMode),
        followSystem: opts?.fromSystem ?? false,
      });
    },
    toggle: () => {
      const nextMode = get().mode === "dark" ? "light" : "dark";
      set({ mode: nextMode, colors: palette(nextMode), followSystem: false });
    },
    syncWithSystem: (systemMode) => {
      if (!systemMode) return;
      const { followSystem, mode } = get();
      const nextMode = getInitialMode(systemMode);
      if (followSystem && nextMode !== mode) {
        set({ mode: nextMode, colors: palette(nextMode) });
      }
    },
  };
});

export function useTheme() {
  const system = useColorScheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = useThemeStore((state) => state.colors);
  const followSystem = useThemeStore((state) => state.followSystem);
  const setMode = useThemeStore((state) => state.setMode);
  const toggle = useThemeStore((state) => state.toggle);
  const syncWithSystem = useThemeStore((state) => state.syncWithSystem);

  useEffect(() => {
    syncWithSystem(system);
  }, [system, syncWithSystem]);

  const setManualMode = (next: ThemeMode) =>
    setMode(next, { fromSystem: false });

  return { mode, colors, followSystem, setMode: setManualMode, toggle };
}
