import { useEffect, useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useGameStore } from "@/stores/game-store";
import { useTheme } from "@/stores/theme-store";
import type { RoundResult } from "@/types/round";

const formatSeconds = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function FinalScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const rounds = useGameStore((state) => state.rounds);
  const resetStore = useGameStore((state) => state.reset);

  useEffect(() => {
    if (!rounds || rounds.length === 0) {
      router.replace("/");
    }
  }, [rounds, router]);

  const totalSeconds = useMemo(
    () => rounds.reduce((sum, r) => sum + r.durationSeconds, 0),
    [rounds]
  );

  const longest = useMemo(() => {
    if (!rounds.length) return 1;
    return Math.max(...rounds.map((r) => r.durationSeconds), 1);
  }, [rounds]);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalRemSec = totalSeconds % 60;

  const handleNewGame = () => {
    resetStore();
    router.replace("/");
  };

  const renderRoundTitle = (round: RoundResult, index: number) => {
    if (index === rounds.length - 1) return "Final Round";
    return `Round ${round.id}`;
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.screen}>
        <View style={styles.stickyTop}>
          <View style={styles.topBar}>
            <Text style={[styles.sessionLabel, { color: colors.text }]}>
              Session Ended
            </Text>
            <Pressable
              onPress={handleNewGame}
              style={[styles.iconButton, { borderColor: colors.cardBorder }]}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Ionicons
              name="hourglass-outline"
              size={110}
              color={colors.primary}
            />
            <Text style={[styles.gameOver, { color: colors.text }]}>
              GAME OVER
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              STATISTICS REPORT
            </Text>
          </View>

          <View
            style={[
              styles.totalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.totalLabel, { color: colors.muted }]}>
              TOTAL DURATION
            </Text>
            <View style={styles.totalRow}>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {totalMinutes}
              </Text>
              <Text style={[styles.totalUnit, { color: colors.muted }]}>
                min
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {totalRemSec.toString().padStart(2, "0")}
              </Text>
              <Text style={[styles.totalUnit, { color: colors.muted }]}>
                sec
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="refresh" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Round Timings
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.roundsScroll}
          contentContainerStyle={styles.roundsList}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.roundsRail, { borderColor: colors.cardBorder }]}
          />
          {rounds.map((round, idx) => {
            const ratio = Math.min(round.durationSeconds / longest, 1);
            return (
              <View
                key={round.id}
                style={[
                  styles.roundCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.roundHeader}>
                  <Text style={[styles.roundTitle, { color: colors.text }]}>
                    {renderRoundTitle(round, idx)}
                  </Text>
                  <View
                    style={[
                      styles.timePill,
                      { backgroundColor: colors.cardBorder },
                    ]}
                  >
                    <Ionicons name="time-sharp" size={16} color={colors.text} />
                    <Text style={[styles.timeValue, { color: colors.text }]}>
                      {formatSeconds(round.durationSeconds)}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: colors.cardBorder },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${ratio * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface, borderColor: colors.cardBorder },
        ]}
      >
        <Pressable style={styles.newGameButton} onPress={handleNewGame}>
          <Ionicons name="refresh" size={20} color={colors.border} />
          <Text style={[styles.newGameText]}>New Game</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  stickyTop: {
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionLabel: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  hero: {
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  gameOver: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  totalCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  totalValue: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  totalUnit: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  roundsScroll: {
    flex: 1,
  },
  roundsList: {
    paddingBottom: 120,
    gap: 12,
  },
  roundsRail: {
    position: "absolute",
    left: 4,
    top: 24,
    bottom: 80,
    borderLeftWidth: 1,
    opacity: 0.6,
  },
  roundCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginLeft: 20,
  },
  roundHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  timePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeValue: {
    fontWeight: "800",
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  newGameButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  newGameText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.4,
    color: "#000",
  },
});
