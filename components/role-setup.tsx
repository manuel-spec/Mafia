import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/stores/theme-store";

export type RoleSetupProps = {
  playerCount: string;
  mafiaCount: string;
  maxMafia: number;
  roundMinutes: string;
  error?: string | null;
  onPlayerCountChange: (text: string) => void;
  onMafiaCountChange: (text: string) => void;
  onRoundMinutesChange: (text: string) => void;
  onAssign: () => void;
};

export function RoleSetup({
  playerCount,
  mafiaCount,
  maxMafia,
  roundMinutes,
  error,
  onPlayerCountChange,
  onMafiaCountChange,
  onRoundMinutesChange,
  onAssign,
}: RoleSetupProps) {
  const { colors, mode, toggle } = useTheme();
  const players = Math.max(Number(playerCount) || 0, 1);
  const mafia = Math.max(Number(mafiaCount) || 0, 0);
  const round = Math.max(Number(roundMinutes) || 0, 1);
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

  const balanceColor =
    balanceLabel === "Balanced" ? colors.success : colors.warning;

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

  const clampRound = (value: number) => {
    const min = 1;
    const max = 30;
    return Math.min(Math.max(value, min), max);
  };

  const handleRoundDelta = (delta: number) => {
    const nextRound = clampRound(round + delta);
    onRoundMinutesChange(String(nextRound));
  };

  const percent =
    players > 0
      ? (value: number) => Math.max(0.05, value / players)
      : () => 0.5;

  const panelStyle = useMemo(
    () => [
      {
        backgroundColor: colors.surfaceStrong,
        borderColor: colors.cardBorder,
        shadowColor: colors.shadow,
      },
    ],
    [colors]
  );

  const balanceBadgeStyle = useMemo(
    () => [{ backgroundColor: colors.surface, borderColor: balanceColor }],
    [balanceColor, colors.surface]
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={32}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color={colors.muted} />
          <Text style={[styles.stepLabel, { color: colors.muted }]}>
            SETUP MISSION
          </Text>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={toggle}
            style={[
              styles.toggle,
              {
                backgroundColor: colors.surfaceStrong,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons
              name={mode === "dark" ? "moon" : "sunny"}
              size={18}
              color={colors.muted}
            />
            <Text style={[styles.toggleText, { color: colors.text }]}>
              {mode === "dark" ? "Dark" : "Light"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>New Game</Text>
          <Link href={{ pathname: "/info" }} asChild>
            <Pressable
              style={[styles.infoButton, { borderColor: colors.cardBorder }]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </Link>
        </View>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Configure your dossier before briefing the agents.
        </Text>

        <View style={[styles.panel, ...panelStyle]}>
          <View style={styles.panelRow}>
            <View style={styles.panelLabelRow}>
              <MaterialCommunityIcons
                name="account-group"
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.panelLabel, { color: colors.text }]}>
                Total Players
              </Text>
            </View>
            <View
              style={[
                styles.counter,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handlePlayersDelta(-1)}
              >
                <Ionicons name="remove" size={22} color={colors.text} />
              </Pressable>
              <Text style={[styles.counterValue, { color: colors.text }]}>
                {players}
              </Text>
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handlePlayersDelta(1)}
              >
                <Ionicons name="add" size={22} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.panel, ...panelStyle]}>
          <View style={styles.panelRow}>
            <View style={styles.panelLabelRow}>
              <MaterialCommunityIcons
                name="drama-masks"
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.panelLabel, { color: colors.text }]}>
                Mafia Count
              </Text>
            </View>
            <View
              style={[
                styles.counter,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handleMafiaDelta(-1)}
              >
                <Ionicons name="remove" size={22} color={colors.text} />
              </Pressable>
              <Text style={[styles.counterValue, { color: colors.text }]}>
                {mafia}
              </Text>
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handleMafiaDelta(1)}
              >
                <Ionicons name="add" size={22} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <Text style={[styles.helper, { color: colors.muted }]}>
            Max {maxMafia} mafia for {players || 0} players.
          </Text>
        </View>

        <View style={[styles.panel, ...panelStyle]}>
          <View style={styles.panelRow}>
            <View style={styles.panelLabelRow}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.panelLabel, { color: colors.text }]}>
                Round Time
              </Text>
            </View>
            <View
              style={[
                styles.counter,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handleRoundDelta(-1)}
              >
                <Ionicons name="remove" size={22} color={colors.text} />
              </Pressable>
              <View style={styles.roundValueCol}>
                <Text style={[styles.counterValue, { color: colors.text }]}>
                  {round}
                </Text>
                <Text style={[styles.roundUnit, { color: colors.muted }]}>
                  MIN
                </Text>
              </View>
              <Pressable
                style={[
                  styles.iconButton,
                  { backgroundColor: colors.surfaceStrong },
                ]}
                onPress={() => handleRoundDelta(1)}
              >
                <Ionicons name="add" size={22} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <Text style={[styles.helper, { color: colors.muted }]}>
            1-30 minutes. Recommended: 5 minutes per round.
          </Text>
        </View>

        <View
          style={[
            styles.balanceCard,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.muted }]}>
              Current Balance
            </Text>
            <View style={[styles.badge, ...balanceBadgeStyle]}>
              <Text style={[styles.badgeText, { color: balanceColor }]}>
                {balanceLabel}
              </Text>
            </View>
          </View>

          <View style={styles.meterRow}>
            <Text style={[styles.meterLabel, { color: colors.muted }]}>
              Villagers
            </Text>
            <Text style={[styles.meterLabel, { color: colors.muted }]}>
              Mafia
            </Text>
          </View>

          <View
            style={[
              styles.meterTrack,
              { backgroundColor: colors.surfaceStrong },
            ]}
          >
            <View
              style={[styles.meterFillVillager, { flex: percent(villagers) }]}
            />
            <View style={{ width: 6 }} />
            <View style={[styles.meterFillMafia, { flex: percent(mafia) }]} />
          </View>

          <View style={styles.countRow}>
            <Text style={[styles.countValue, { color: colors.text }]}>
              {villagers}
            </Text>
            <Text style={[styles.countValue, { color: colors.text }]}>
              {mafia}
            </Text>
          </View>

          <Text style={[styles.recommendation, { color: colors.muted }]}>
            Recommended: 1 Mafia for every 4 players.
          </Text>
        </View>

        {error ? (
          <Text style={[styles.error, { color: colors.primary }]}>{error}</Text>
        ) : null}

        <Pressable
          style={[
            styles.cta,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
          onPress={onAssign}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={22}
            color={colors.primaryText}
          />
          <Text style={[styles.ctaText, { color: colors.primaryText }]}>
            Assign identities
          </Text>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  toggleText: {
    fontWeight: "700",
  },
  infoButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
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
  roundValueCol: {
    alignItems: "center",
    minWidth: 64,
  },
  roundUnit: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
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
