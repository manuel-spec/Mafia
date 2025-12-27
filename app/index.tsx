import { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { useRouter } from "expo-router";

import { RoleSetup } from "@/components/role-setup";
import { useGameStore } from "@/stores/game-store";
import { useTheme } from "@/stores/theme-store";
import type { Role } from "@/types/role";

export default function Index() {
  const { colors } = useTheme();
  const router = useRouter();
  const setGameRoles = useGameStore((state) => state.setRoles);
  const [playerCount, setPlayerCount] = useState("8");
  const [mafiaCount, setMafiaCount] = useState("2");
  const [error, setError] = useState<string | null>(null);

  const maxMafia = useMemo(() => {
    const players = Number(playerCount) || 0;
    return Math.max(0, players - 1);
  }, [playerCount]);

  const assignRoles = () => {
    const players = Number(playerCount);
    const mafia = Number(mafiaCount);

    if (!Number.isInteger(players) || players <= 0) {
      setError("Enter a valid player count (>=1).");
      return;
    }

    if (!Number.isInteger(mafia) || mafia < 0) {
      setError("Enter a valid mafia count (>=0).");
      return;
    }

    if (mafia >= players) {
      setError("Mafia count must be less than total players.");
      return;
    }

    setError(null);

    const pool: Role[] = [
      ...Array.from({ length: mafia }, () => "Mafia" as Role),
      ...Array.from({ length: players - mafia }, () => "Civilian" as Role),
    ];

    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setGameRoles(pool);
    router.push("/reveal");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <RoleSetup
          playerCount={playerCount}
          mafiaCount={mafiaCount}
          maxMafia={maxMafia}
          error={error}
          onPlayerCountChange={setPlayerCount}
          onMafiaCountChange={setMafiaCount}
          onAssign={assignRoles}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
