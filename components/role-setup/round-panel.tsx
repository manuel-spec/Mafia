import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/stores/theme-store";

export type RoundPanelProps = {
  minutes: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function RoundPanel({
  minutes,
  onIncrement,
  onDecrement,
}: RoundPanelProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: colors.surfaceStrong,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <MaterialCommunityIcons
            name="timer-sand"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.label, { color: colors.text }]}>Round Time</Text>
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
            onPress={onDecrement}
          >
            <MaterialCommunityIcons
              name="minus"
              size={22}
              color={colors.text}
            />
          </Pressable>
          <View style={styles.valueCol}>
            <Text style={[styles.value, { color: colors.text }]}>
              {minutes}
            </Text>
            <Text style={[styles.unit, { color: colors.muted }]}>MIN</Text>
          </View>
          <Pressable
            style={[
              styles.iconButton,
              { backgroundColor: colors.surfaceStrong },
            ]}
            onPress={onIncrement}
          >
            <MaterialCommunityIcons name="plus" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <Text style={[styles.helper, { color: colors.muted }]}>
        1-30 minutes. Recommended: 5 minutes per round.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "800",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
    borderWidth: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  valueCol: {
    alignItems: "center",
    minWidth: 64,
  },
  value: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  unit: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  helper: {
    fontSize: 13,
    marginTop: 4,
  },
});
