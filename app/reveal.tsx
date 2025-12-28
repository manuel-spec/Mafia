import { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";

import { RoleReveal } from "@/components/role-reveal";
import { useGameStore } from "@/stores/game-store";
import { useTheme } from "@/stores/theme-store";

export default function RevealScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const roles = useGameStore((state) => state.roles);
  const reset = useGameStore((state) => state.reset);

  useEffect(() => {
    if (roles.length === 0) {
      router.replace("/");
    }
  }, [roles, router]);

  if (roles.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.screen}>
        <RoleReveal
          roles={roles}
          onRestart={() => {
            reset();
            router.replace("/");
          }}
          onExit={() => {
            reset();
            router.back();
          }}
          onStartRound={() => {
            router.push("/round");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
