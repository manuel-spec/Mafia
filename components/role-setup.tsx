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

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "@/stores/theme-store";
import { BalanceCard } from "./role-setup/balance-card";
import { CounterPanel } from "./role-setup/counter-panel";
import { RoundPanel } from "./role-setup/round-panel";
import { SetupHeader } from "./role-setup/setup-header";
import { SpecialRolesCard } from "./special-roles";

export type RoleSetupProps = {
  playerCount: string;
  mafiaCount: string;
  maxMafia: number;
  roundMinutes: string;
  doctorEnabled: boolean;
  seerEnabled: boolean;
  error?: string | null;
  onPlayerCountChange: (text: string) => void;
  onMafiaCountChange: (text: string) => void;
  onRoundMinutesChange: (text: string) => void;
  onToggleDoctor: (enabled: boolean) => void;
  onToggleSeer: (enabled: boolean) => void;
  onAssign: () => void;
};

export function RoleSetup({
  playerCount,
  mafiaCount,
  maxMafia,
  roundMinutes,
  doctorEnabled,
  seerEnabled,
  error,
  onPlayerCountChange,
  onMafiaCountChange,
  onRoundMinutesChange,
  onToggleDoctor,
  onToggleSeer,
  onAssign,
}: RoleSetupProps) {
  const { colors } = useTheme();
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
  const clampMafia = (value: number) => Math.min(Math.max(0, value), maxMafia);

  const handlePlayersDelta = (delta: number) => {
    const nextPlayers = clampPlayers(players + delta);
    const nextMafia = clampMafia(mafia);
    onPlayerCountChange(String(nextPlayers));
    onMafiaCountChange(String(nextMafia));
  };

  const handleMafiaDelta = (delta: number) => {
    const nextMafia = clampMafia(mafia + delta);
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

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={32}
    >
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { backgroundColor: colors.background, paddingBottom: 160 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <SetupHeader />

          <CounterPanel
            label="Total Players"
            icon="account-group"
            value={players}
            onIncrement={() => handlePlayersDelta(1)}
            onDecrement={() => handlePlayersDelta(-1)}
          />

          <CounterPanel
            label="Mafia Count"
            icon="drama-masks"
            value={mafia}
            onIncrement={() => handleMafiaDelta(1)}
            onDecrement={() => handleMafiaDelta(-1)}
            helperText={`Max ${maxMafia} mafia for ${players || 0} players.`}
          />

          <SpecialRolesCard
            doctorEnabled={doctorEnabled}
            seerEnabled={seerEnabled}
            onToggleDoctor={onToggleDoctor}
            onToggleSeer={onToggleSeer}
          />

          <RoundPanel
            minutes={round}
            onIncrement={() => handleRoundDelta(1)}
            onDecrement={() => handleRoundDelta(-1)}
          />

          <BalanceCard
            villagers={villagers}
            mafia={mafia}
            balanceLabel={balanceLabel}
            balanceColor={balanceColor}
            villagerFlex={percent(villagers)}
            mafiaFlex={percent(mafia)}
          />

          {error ? (
            <Text style={[styles.error, { color: colors.primary }]}>
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.cardBorder,
              shadowColor: colors.shadow,
            },
          ]}
        >
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
        </View>
      </View>
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
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
});
