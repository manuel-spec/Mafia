import { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { RoleReveal } from "@/components/role-reveal";
import { RoleSetup } from "@/components/role-setup";
import type { Role } from "@/types/role";

export default function Index() {
  const [playerCount, setPlayerCount] = useState("8");
  const [mafiaCount, setMafiaCount] = useState("2");
  const [roles, setRoles] = useState<Role[]>([]);
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
      setRoles([]);
      return;
    }

    if (!Number.isInteger(mafia) || mafia < 0) {
      setError("Enter a valid mafia count (>=0).");
      setRoles([]);
      return;
    }

    if (mafia >= players) {
      setError("Mafia count must be less than total players.");
      setRoles([]);
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

    setRoles(pool);
  };

  const resetGame = () => {
    setRoles([]);
    setError(null);
  };

  return (
    <View style={styles.screen}>
      {/* <StatusBar style="light" translucent backgroundColor="transparent" /> */}
      <SafeAreaView style={styles.safeArea}>
        {roles.length === 0 ? (
          <RoleSetup
            playerCount={playerCount}
            mafiaCount={mafiaCount}
            maxMafia={maxMafia}
            error={error}
            onPlayerCountChange={setPlayerCount}
            onMafiaCountChange={setMafiaCount}
            onAssign={assignRoles}
          />
        ) : (
          <RoleReveal roles={roles} onReset={resetGame} />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },
  safeArea: {
    flex: 1,
  },
});
