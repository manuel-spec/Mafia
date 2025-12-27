import { useEffect } from "react";

import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";

import { ThemeProvider, useTheme } from "@/theme/theme";

function LayoutInner() {
  const { colors } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LayoutInner />
    </ThemeProvider>
  );
}
