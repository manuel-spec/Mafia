import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/stores/theme-store";
import type { Role } from "@/types/role";
import { ExitConfirmModal } from "./exit-confirm-modal";
import {
  CivilianBadge,
  DoctorBadge,
  MafiaBadge,
  SeerBadge,
} from "./role-avatars";

const roleCopy: Record<Role, { title: string; detail: string }> = {
  Mafia: {
    title: "You are Mafia",
    detail: "Stay hidden. Coordinate silently. Strike at night.",
  },
  Civilian: {
    title: "You are Civilian",
    detail: "Trust your gut. Watch the votes. Protect your town.",
  },
  Doctor: {
    title: "You are Doctor",
    detail: "Choose wisely. Save one player when danger strikes.",
  },
  Seer: {
    title: "You are Seer",
    detail: "Read the table. Reveal a player’s true role each night.",
  },
};

type RoleRevealProps = {
  roles: Role[];
  onRestart: () => void;
  onExit: () => void;
  onStartRound?: () => void;
};

export function RoleReveal({
  roles,
  onRestart,
  onExit,
  onStartRound,
}: RoleRevealProps) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const holdScale = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
  }, [roles]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setExitVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  const mafiaTotal = useMemo(
    () => roles.filter((role) => role === "Mafia").length,
    [roles]
  );

  const isDone = currentIndex >= roles.length;
  const role = roles[currentIndex];
  const copy = role ? roleCopy[role] : undefined;
  const AvatarBadge = useMemo(() => {
    if (revealed && role) {
      switch (role) {
        case "Mafia":
          return MafiaBadge;
        case "Doctor":
          return DoctorBadge;
        case "Seer":
          return SeerBadge;
        case "Civilian":
        default:
          return CivilianBadge;
      }
    }
    return CivilianBadge;
  }, [revealed, role]);
  const remaining = Math.max(
    roles.length - currentIndex - (revealed ? 0 : 1),
    0
  );

  const advanceToNext = () => {
    const next = currentIndex + 1;
    setRevealed(false);
    if (next >= roles.length) {
      setCurrentIndex(roles.length);
    } else {
      setCurrentIndex(next);
    }
  };

  const handleHoldStart = () => {
    Animated.spring(holdScale, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
    setRevealed(true);
  };

  const handleHoldEnd = () => {
    Animated.spring(holdScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
    setRevealed(false);
    advanceToNext();
  };

  useEffect(() => {
    if (isDone) {
      if (onStartRound) {
        onStartRound();
      } else {
        onRestart();
      }
    }
  }, [isDone, onRestart, onStartRound]);

  if (isDone) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => setExitVisible(true)}
          style={[styles.iconButton, { borderColor: colors.cardBorder }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.roundText, { color: colors.text }]}>Round 1</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.avatarArea}>
        <View style={[styles.avatarRing, { shadowColor: colors.primary }]}>
          <AvatarBadge />
          {!revealed && <View style={styles.avatarScrim} />}
          <View
            style={[styles.secretPill, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="lock-closed" size={14} color={colors.primaryText} />
            <Text style={[styles.secretText, { color: colors.primaryText }]}>
              Secret
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          Current Turn
        </Text>
        <Text style={[styles.playerLabel, { color: colors.text }]}>
          Player {currentIndex + 1}
        </Text>
        <Text style={[styles.helper, { color: colors.muted }]}>
          Pass the phone to Player {currentIndex + 1}. Ensure no one else is
          watching your screen.
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceStrong,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Ionicons
            name={revealed ? "eye" : "eye-off"}
            size={16}
            color={colors.muted}
          />
          <Text style={[styles.badgeText, { color: colors.muted }]}>
            {revealed ? "Role is shown" : "Role is hidden"}
          </Text>
        </View>
        <Text style={[styles.remainingText, { color: colors.muted }]}>
          {remaining} left
        </Text>
      </View>

      <View
        style={[
          styles.roleCard,
          {
            borderColor: colors.cardBorder,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {revealed && copy ? (
          <View style={styles.roleContent}>
            <Text style={[styles.roleTitle, { color: colors.text }]}>
              {copy.title}
            </Text>
            <Text style={[styles.roleDetail, { color: colors.muted }]}>
              {copy.detail}
            </Text>
          </View>
        ) : (
          <View style={styles.coverContent}>
            <Text style={[styles.coverTitle, { color: colors.text }]}>
              Hold to reveal
            </Text>
            <Text style={[styles.coverDetail, { color: colors.muted }]}>
              Release to conceal instantly and pass the phone.
            </Text>
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.holdPanel,
          {
            borderColor: colors.cardBorder,
            backgroundColor: colors.surface,
            transform: [{ scale: holdScale }],
          },
        ]}
      >
        <Pressable
          onPressIn={handleHoldStart}
          onPressOut={handleHoldEnd}
          style={[
            styles.holdButton,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
        >
          <Text style={[styles.holdText, { color: colors.primaryText }]}>
            HOLD TO REVEAL
          </Text>
        </Pressable>
        <Text style={[styles.holdHint, { color: colors.muted }]}>
          Release to conceal instantly
        </Text>
      </Animated.View>

      <ExitConfirmModal
        visible={exitVisible}
        onStay={() => setExitVisible(false)}
        onConfirm={() => {
          setExitVisible(false);
          onExit();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 18,
    paddingBottom: 36,
    justifyContent: "flex-start",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  roundText: {
    fontSize: 18,
    fontWeight: "800",
  },
  avatarArea: {
    alignItems: "center",
    marginTop: 8,
  },
  avatarRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  avatarScrim: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  secretPill: {
    position: "absolute",
    bottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  secretText: {
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  hero: {
    alignItems: "center",
    gap: 6,
  },
  sectionLabel: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "800",
  },
  playerLabel: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  helper: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: "700",
  },
  remainingText: {
    fontSize: 14,
  },
  roleCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    minHeight: 140,
    justifyContent: "center",
  },
  roleContent: {
    gap: 10,
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },
  roleDetail: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  coverContent: {
    gap: 8,
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  coverDetail: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
  },
  holdPanel: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  holdButton: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  holdText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  holdHint: {
    fontSize: 14,
  },
  summaryCard: {
    marginTop: 40,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  doneDetail: {
    fontSize: 15,
    lineHeight: 21,
  },
});
