import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/stores/theme-store";

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
        <Text style={[styles.heading, { color: colors.text }]}>
          How to Play
        </Text>
        <Text style={[styles.subheading, { color: colors.muted }]}>
          Keep this close during the game—night actions, day votes, and quick
          tips are all here.
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>Roles</Text>
          <InfoRow
            label="Mafia"
            detail="Eliminate villagers at night. Stay hidden during the day."
            color={colors.primary}
            textColor={colors.text}
            mutedColor={colors.muted}
          />
          <InfoRow
            label="Villagers"
            detail="Survive, share clues, and vote out the mafia."
            color={colors.success}
            textColor={colors.text}
            mutedColor={colors.muted}
          />
          <InfoRow
            label="Optional"
            detail="Doctor saves one player; Seers checks one player (house rules)."
            color={colors.warning}
            textColor={colors.text}
            mutedColor={colors.muted}
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Round Flow
          </Text>
          <StepRow
            index="1"
            title="Night"
            detail="Mafia silently chooses a target. Optional roles act (Doctor/Detective)."
            colors={colors}
          />
          <StepRow
            index="2"
            title="Dawn"
            detail="Moderator announces if anyone was eliminated."
            colors={colors}
          />
          <StepRow
            index="3"
            title="Day"
            detail="Everyone debates. Players share suspicions and defend themselves."
            colors={colors}
          />
          <StepRow
            index="4"
            title="Vote"
            detail="Group votes to eliminate one suspect. Majority rules; reveal the role."
            colors={colors}
          />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceStrong,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Win Conditions
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            • Mafia wins when they are equal to the remaining villagers.
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            • Villagers win when every mafia player is eliminated.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Quick Tips
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            • Keep accusations short—focus on voting patterns and hesitations.
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            • Mafia: avoid agreeing too quickly; let villagers argue.
          </Text>
          <Text style={[styles.paragraph, { color: colors.muted }]}>
            • Villagers: beware of perfect agreement—push for specifics.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoRowProps = {
  label: string;
  detail: string;
  color: string;
  textColor: string;
  mutedColor: string;
};

function InfoRow({
  label,
  detail,
  color,
  textColor,
  mutedColor,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.bullet, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: textColor }]}>{label}</Text>
        <Text style={[styles.infoDetail, { color: mutedColor }]}>{detail}</Text>
      </View>
    </View>
  );
}

type StepRowProps = {
  index: string;
  title: string;
  detail: string;
  colors: {
    text: string;
    muted: string;
    surfaceStrong: string;
    cardBorder: string;
    primary: string;
  };
};

function StepRow({ index, title, detail, colors }: StepRowProps) {
  return (
    <View
      style={[
        styles.stepRow,
        {
          borderColor: colors.cardBorder,
          backgroundColor: colors.surfaceStrong,
        },
      ]}
    >
      <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.stepBadgeText}>{index}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.stepDetail, { color: colors.muted }]}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
    gap: 14,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
  },
  subheading: {
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 21,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  infoDetail: {
    fontSize: 14,
    color: "#b0b0b7",
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  stepDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
});
