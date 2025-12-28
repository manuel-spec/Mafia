import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/stores/theme-store";

function BaseBadge({
  label,
  tone,
}: {
  label: string;
  tone: { background: string; border: string; text: string; accent: string };
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tone.background,
          borderColor: tone.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: tone.accent }]} />
      <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
    </View>
  );
}

const tones = {
  mafia: {
    background: "#2a0f16",
    border: "#4d1823",
    text: "#ffd6de",
    accent: "#ff5067",
  },
  civilian: {
    background: "#0f1d2f",
    border: "#1f3552",
    text: "#d4e4ff",
    accent: "#5ab2ff",
  },
  doctor: {
    background: "#0f241a",
    border: "#1f4634",
    text: "#c9ffe6",
    accent: "#4be0a3",
  },
  seer: {
    background: "#1a1033",
    border: "#2c1a56",
    text: "#e7d8ff",
    accent: "#a26dff",
  },
};

export function MafiaBadge() {
  return <BaseBadge label="Mafia" tone={tones.mafia} />;
}

export function CivilianBadge() {
  return <BaseBadge label="Civilian" tone={tones.civilian} />;
}

export function DoctorBadge() {
  return <BaseBadge label="Doctor" tone={tones.doctor} />;
}

export function SeerBadge() {
  return <BaseBadge label="Seer" tone={tones.seer} />;
}

const styles = StyleSheet.create({
  badge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    gap: 10,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  label: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
