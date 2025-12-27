import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/theme/theme";

export default function InfoScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Mafia Quick Rules
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            - Roles: Mafia (eliminate), Villagers (survive & identify).
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            - Night: Mafia secretly chooses a target.
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            - Day: All players discuss and vote to eliminate a suspect.
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            - Win: Mafia wins when they equal villagers; Villagers win when all
            mafia are gone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
  },
});
