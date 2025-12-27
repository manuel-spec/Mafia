import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AnimatedReveal } from "@/components/animated-reveal";
import { useTheme } from "@/theme/theme";
import type { Role } from "@/types/role";

const roleCopy: Record<Role, { title: string; detail: string; color: string }> =
  {
    Mafia: {
      title: "You are Mafia",
      detail: "Stay hidden. Coordinate silently. Strike at night.",
      color: "#ff6b6b",
    },
    Civilian: {
      title: "You are Civilian",
      detail: "Trust your gut. Watch the votes. Protect your town.",
      color: "#63e6be",
    },
  };

type RoleRevealProps = {
  roles: Role[];
  onReset: () => void;
};

export function RoleReveal({ roles, onReset }: RoleRevealProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
  }, [roles]);

  const mafiaTotal = useMemo(
    () => roles.filter((role) => role === "Mafia").length,
    [roles]
  );

  const isDone = currentIndex >= roles.length;
  const role = roles[currentIndex];
  const copy = role ? roleCopy[role] : undefined;

  const advanceToNext = () => {
    const next = currentIndex + 1;
    setRevealed(false);
    if (next >= roles.length) {
      setCurrentIndex(roles.length);
    } else {
      setCurrentIndex(next);
    }
  };

  const remaining = Math.max(
    roles.length - currentIndex - (revealed ? 1 : 0),
    0
  );

  if (isDone) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.header, { color: colors.text }]}>
          All roles assigned
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.doneTitle, { color: colors.text }]}>
            Shuffle complete
          </Text>
          <Text style={[styles.doneDetail, { color: colors.muted }]}>
            {roles.length} players • {mafiaTotal} mafia •{" "}
            {roles.length - mafiaTotal} civilians
          </Text>
          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.cardBorder }]}
            onPress={onReset}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              Restart
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <Text style={[styles.header, { color: colors.text }]}>
          {" "}
          Player {currentIndex + 1}
        </Text>
        <Text style={[styles.subheader, { color: colors.muted }]}>
          Tap the icon—it rises to show your role, then glides down to hide
          before you pass the phone.
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.cardBorder },
        ]}
      >
        {revealed && copy ? (
          <View style={styles.roleBox}>
            <Text style={[styles.roleTitle, { color: copy.color }]}>
              {copy.title}
            </Text>
            <Text style={[styles.roleDetail, { color: colors.muted }]}>
              {copy.detail}
            </Text>
          </View>
        ) : (
          <View style={styles.coverBox}>
            <Text style={[styles.coverTitle, { color: colors.text }]}>
              Ready?
            </Text>
            <Text style={[styles.coverDetail, { color: colors.muted }]}>
              Tap the icon; it will rise to reveal your secret role.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceStrong,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.muted }]}>
            Players left: {remaining}
          </Text>
        </View>
      </View>

      <AnimatedReveal
        onRevealStart={() => setRevealed(true)}
        onRevealEnd={() => {
          setRevealed(false);
          advanceToNext();
        }}
        label="Tap to reveal your role"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 14,
    paddingBottom: 140,
  },
  hero: {
    gap: 6,
    paddingTop: 30,
  },
  header: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subheader: {
    color: "#cfd3d8",
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    backgroundColor: "#0f1014",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f2025",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    gap: 16,
  },
  roleBox: {
    gap: 10,
  },
  roleTitle: {
    fontSize: 26,
    fontWeight: "900",
  },
  roleDetail: {
    color: "#d8dde6",
    fontSize: 16,
    lineHeight: 22,
  },
  coverBox: {
    alignItems: "flex-start",
    gap: 6,
  },
  coverTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  coverDetail: {
    color: "#9ca2ad",
    fontSize: 15,
  },
  footer: {
    marginTop: 6,
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#151820",
    borderWidth: 1,
    borderColor: "#242734",
  },
  badgeText: {
    color: "#cfd3d8",
    fontWeight: "700",
  },
  doneTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  doneDetail: {
    color: "#b7beca",
    fontSize: 15,
    marginBottom: 12,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  secondaryText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
