import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/stores/theme-store";

export function SetupHeader() {
  const { colors, mode, toggle } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>New Game</Text>

        <View style={styles.actionsRow}>
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
      </View>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Configure your dossier before briefing the agents.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepLabel: {
    fontSize: 14,
    letterSpacing: 1.2,
    fontWeight: "700",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  infoButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
