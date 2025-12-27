import React, { createContext, useContext, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

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
  background: "#f5f0ff",
  surface: "#ffffff",
  surfaceStrong: "#f0e7ff",
  primary: "#e53935",
  primaryText: "#ffffff",
  text: "#1f1426",
  muted: "#6c6172",
  border: "#e1d6f1",
  cardBorder: "#e3d9f3",
  success: "#1a9c60",
  warning: "#f5a524",
  shadow: "#00000033",
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

const ThemeContext = createContext<{
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
} | null>(null);

function getInitialMode(system: ColorSchemeName): ThemeMode {
  if (system === "light") return "light";
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(getInitialMode(system));

  const value = useMemo(() => {
    const colors = mode === "dark" ? darkColors : lightColors;
    return {
      mode,
      colors,
      toggle: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
      setMode,
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
