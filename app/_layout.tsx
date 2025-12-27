import { useEffect } from "react";

import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#050505").catch(() => {});
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#050505" },
      }}
    />
  );
}
