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
  const setRoundDurationSeconds = useGameStore(
    (state) => state.setRoundDurationSeconds
  );
  const specialRoles = useGameStore((state) => state.specialRoles);
  const setSpecialRoles = useGameStore((state) => state.setSpecialRoles);
  const [playerCount, setPlayerCount] = useState("8");
  const [mafiaCount, setMafiaCount] = useState("2");
  const [roundMinutes, setRoundMinutes] = useState("5");
  const [error, setError] = useState<string | null>(null);

  const maxMafia = useMemo(() => {
    const players = Number(playerCount) || 0;
    return Math.max(0, players - 1);
  }, [playerCount]);

  const assignRoles = () => {
    const players = Number(playerCount);
    const mafia = Number(mafiaCount);
    const minutes = Number(roundMinutes);

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

    if (!Number.isInteger(minutes) || minutes < 1) {
      setError("Enter a valid round time (>=1 minute).");
      return;
    }

    if (minutes > 30) {
      setError("Round time cannot exceed 30 minutes.");
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
    setRoundDurationSeconds(minutes * 60);
    router.push("/reveal");
  };

  const handleToggleDoctor = (enabled: boolean) => {
    setSpecialRoles({ ...specialRoles, doctor: enabled });
  };

  const handleToggleSeer = (enabled: boolean) => {
    setSpecialRoles({ ...specialRoles, seer: enabled });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <RoleSetup
          playerCount={playerCount}
          mafiaCount={mafiaCount}
          maxMafia={maxMafia}
          roundMinutes={roundMinutes}
          doctorEnabled={specialRoles.doctor}
          seerEnabled={specialRoles.seer}
          error={error}
          onPlayerCountChange={setPlayerCount}
          onMafiaCountChange={setMafiaCount}
          onRoundMinutesChange={setRoundMinutes}
          onToggleDoctor={handleToggleDoctor}
          onToggleSeer={handleToggleSeer}
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
