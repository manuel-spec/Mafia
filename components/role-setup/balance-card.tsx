import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/stores/theme-store";

export type BalanceCardProps = {
  villagers: number;
  mafia: number;
  balanceLabel: string;
  balanceColor: string;
  villagerFlex: number;
  mafiaFlex: number;
};

export function BalanceCard({
  villagers,
  mafia,
  balanceLabel,
  balanceColor,
  villagerFlex,
  mafiaFlex,
}: BalanceCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.muted }]}>
          Current Balance
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: colors.surface, borderColor: balanceColor },
          ]}
        >
          <Text style={[styles.badgeText, { color: balanceColor }]}>
            {balanceLabel}
          </Text>
        </View>
      </View>

      <View style={styles.meterRow}>
        <Text style={[styles.meterLabel, { color: colors.muted }]}>
          Villagers
        </Text>
        <Text style={[styles.meterLabel, { color: colors.muted }]}>Mafia</Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surfaceStrong }]}>
        <View style={[styles.fillVillager, { flex: villagerFlex }]} />
        <View style={{ width: 6 }} />
        <View style={[styles.fillMafia, { flex: mafiaFlex }]} />
      </View>

      <View style={styles.countRow}>
        <Text style={[styles.countValue, { color: colors.text }]}>
          {villagers}
        </Text>
        <Text style={[styles.countValue, { color: colors.text }]}>{mafia}</Text>
      </View>

      <Text style={[styles.reco, { color: colors.muted }]}>
        Recommended: 1 Mafia for every 4 players.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
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
    fontSize: 13,
    fontWeight: "700",
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 6,
    gap: 0,
  },
  fillVillager: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#7ba2c8",
  },
  fillMafia: {
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
    fontSize: 16,
    fontWeight: "800",
  },
  reco: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 6,
  },
});
