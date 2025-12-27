import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type RoleSetupProps = {
  playerCount: string;
  mafiaCount: string;
  maxMafia: number;
  error?: string | null;
  onPlayerCountChange: (text: string) => void;
  onMafiaCountChange: (text: string) => void;
  onAssign: () => void;
};

export function RoleSetup({
  playerCount,
  mafiaCount,
  maxMafia,
  error,
  onPlayerCountChange,
  onMafiaCountChange,
  onAssign,
}: RoleSetupProps) {
  const players = Math.max(Number(playerCount) || 0, 1);
  const mafia = Math.max(Number(mafiaCount) || 0, 0);
  const villagers = Math.max(players - mafia, 0);
  const ratio = players > 0 ? mafia / players : 0;

  const balanceLabel =
    ratio === 0
      ? "Add mafia"
      : ratio < 0.2
      ? "Villager heavy"
      : ratio > 0.32
      ? "Mafia heavy"
      : "Balanced";

  const balanceColor = balanceLabel === "Balanced" ? "#35c36b" : "#f5a524";

  const clampPlayers = (value: number) => Math.max(1, value);
  const clampMafia = (value: number, totalPlayers: number) => {
    const maxAllowed = Math.max(totalPlayers - 1, 0);
    return Math.min(Math.max(0, value), maxAllowed);
  };

  const handlePlayersDelta = (delta: number) => {
    const nextPlayers = clampPlayers(players + delta);
    const nextMafia = clampMafia(mafia, nextPlayers);
    onPlayerCountChange(String(nextPlayers));
    onMafiaCountChange(String(nextMafia));
  };

  const handleMafiaDelta = (delta: number) => {
    const nextMafia = clampMafia(mafia + delta, players);
    onMafiaCountChange(String(nextMafia));
  };

  const percent =
    players > 0
      ? (value: number) => Math.max(0.05, value / players)
      : () => 0.5;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={32}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color="#d9cde5" />
          <Text style={styles.stepLabel}>SETUP MISSION</Text>
        </View>
        <Text style={styles.title}>New Game</Text>
        <Text style={styles.subtitle}>
          Configure your dossier before briefing the agents.
        </Text>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <View style={styles.panelLabelRow}>
              <MaterialCommunityIcons
                name="account-group"
                size={22}
                color="#e53935"
              />
              <Text style={styles.panelLabel}>Total Players</Text>
            </View>
            <View style={styles.counter}>
              <Pressable
                style={styles.iconButton}
                onPress={() => handlePlayersDelta(-1)}
              >
                <Ionicons name="remove" size={22} color="#f1e6ff" />
              </Pressable>
              <Text style={styles.counterValue}>{players}</Text>
              <Pressable
                style={styles.iconButton}
                onPress={() => handlePlayersDelta(1)}
              >
                <Ionicons name="add" size={22} color="#f1e6ff" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <View style={styles.panelLabelRow}>
              <MaterialCommunityIcons
                name="drama-masks"
                size={22}
                color="#e53935"
              />
              <Text style={styles.panelLabel}>Mafia Count</Text>
            </View>
            <View style={styles.counter}>
              <Pressable
                style={styles.iconButton}
                onPress={() => handleMafiaDelta(-1)}
              >
                <Ionicons name="remove" size={22} color="#f1e6ff" />
              </Pressable>
              <Text style={styles.counterValue}>{mafia}</Text>
              <Pressable
                style={styles.iconButton}
                onPress={() => handleMafiaDelta(1)}
              >
                <Ionicons name="add" size={22} color="#f1e6ff" />
              </Pressable>
            </View>
          </View>
          <Text style={styles.helper}>
            Max {maxMafia} mafia for {players || 0} players.
          </Text>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View style={[styles.badge, { borderColor: balanceColor }]}>
              <Text style={[styles.badgeText, { color: balanceColor }]}>
                {balanceLabel}
              </Text>
            </View>
          </View>

          <View style={styles.meterRow}>
            <Text style={styles.meterLabel}>Villagers</Text>
            <Text style={styles.meterLabel}>Mafia</Text>
          </View>

          <View style={styles.meterTrack}>
            <View
              style={[styles.meterFillVillager, { flex: percent(villagers) }]}
            />
            <View style={{ width: 6 }} />
            <View style={[styles.meterFillMafia, { flex: percent(mafia) }]} />
          </View>

          <View style={styles.countRow}>
            <Text style={styles.countValue}>{villagers}</Text>
            <Text style={styles.countValue}>{mafia}</Text>
          </View>

          <Text style={styles.recommendation}>
            Recommended: 1 Mafia for every 4 players.
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.cta} onPress={onAssign}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={22}
            color="#fff"
          />
          <Text style={styles.ctaText}>Assign identities</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 24,
    gap: 18,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepLabel: {
    color: "#c8bece",
    fontSize: 14,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  title: {
    color: "#f7f1ff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "#b9aebb",
    fontSize: 17,
    lineHeight: 24,
  },
  panel: {
    backgroundColor: "#1a1016",
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "#22151d",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    gap: 12,
  },
  panelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  panelLabel: {
    color: "#f4eefc",
    fontSize: 20,
    fontWeight: "800",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0b10",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: "#1f1420",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#20141d",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  counterValue: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
    minWidth: 34,
    textAlign: "center",
  },
  helper: {
    color: "#8f8390",
    fontSize: 13,
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: "#120c14",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#231824",
    gap: 10,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#c8bece",
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#0f0b10",
  },
  badgeText: {
    fontWeight: "800",
    fontSize: 13,
  },
  meterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meterLabel: {
    color: "#8f8390",
    fontSize: 13,
    fontWeight: "700",
  },
  meterTrack: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1d1520",
    borderRadius: 10,
    padding: 6,
    gap: 0,
  },
  meterFillVillager: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#7ba2c8",
  },
  meterFillMafia: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#e53935",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  countValue: {
    color: "#f4eefc",
    fontSize: 16,
    fontWeight: "800",
  },
  recommendation: {
    color: "#8f8390",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 6,
  },
  error: {
    color: "#ffb3b3",
    fontSize: 14,
  },
  cta: {
    marginTop: 10,
    backgroundColor: "#e53935",
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#e53935",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
