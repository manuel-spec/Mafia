import { useEffect } from "react";

import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";

import { useTheme } from "@/stores/theme-store";

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
        statusBarHidden: true,
      }}
    />
  );
}

export default function RootLayout() {
  return <LayoutInner />;
}
