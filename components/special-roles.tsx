import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/stores/theme-store";

export type SpecialRolesCardProps = {
  doctorEnabled: boolean;
  seerEnabled: boolean;
  onToggleDoctor: (enabled: boolean) => void;
  onToggleSeer: (enabled: boolean) => void;
};

export function SpecialRolesCard({
  doctorEnabled,
  seerEnabled,
  onToggleDoctor,
  onToggleSeer,
}: SpecialRolesCardProps) {
  const { colors } = useTheme();

  const renderToggle = (
    label: string,
    detail: string,
    icon: keyof typeof Ionicons.glyphMap,
    active: boolean,
    onToggle: (enabled: boolean) => void,
    accent: string
  ) => (
    <View style={styles.roleRow}>
      <View style={styles.roleLeft}>
        <View style={[styles.roleIcon, { backgroundColor: accent }]}>
          <Ionicons name={icon} size={18} color={colors.primaryText} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.roleLabel, { color: colors.text }]}>
            {label}
          </Text>
          <Text style={[styles.roleDetail, { color: colors.muted }]}>
            {detail}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.togglePill,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Pressable
          onPress={() => onToggle(false)}
          style={[
            styles.toggleOption,
            !active && {
              backgroundColor: colors.surfaceStrong,
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: !active ? colors.text : colors.muted },
            ]}
          >
            NO
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onToggle(true)}
          style={[
            styles.toggleOption,
            active && {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: active ? colors.primaryText : colors.muted },
            ]}
          >
            YES
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[styles.starBullet, { backgroundColor: colors.primary }]}
        />
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Special Roles
        </Text>
      </View>
      {renderToggle(
        "Doctor",
        "Saves one player",
        "medkit",
        doctorEnabled,
        onToggleDoctor,
        colors.success
      )}
      <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
      {renderToggle(
        "Seer",
        "Reveals one role",
        "eye-outline",
        seerEnabled,
        onToggleSeer,
        colors.warning
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  starBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  roleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  roleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  roleDetail: {
    fontSize: 14,
    fontWeight: "600",
  },
  togglePill: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toggleText: {
    fontWeight: "800",
    letterSpacing: 0.4,
    fontSize: 13,
  },
  divider: {
    height: 1,
    opacity: 0.6,
  },
});
