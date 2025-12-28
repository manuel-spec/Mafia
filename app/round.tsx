import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Svg, { Circle } from "react-native-svg";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useGameStore } from "@/stores/game-store";
import { useTheme } from "@/stores/theme-store";

type RoundResult = {
  id: number;
  durationSeconds: number;
  endedAt: number;
  reason: "complete" | "ended";
};

const READY_SECONDS = 10;
const RING_SIZE = 260;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export default function RoundScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const roles = useGameStore((state) => state.roles);
  const roundDurationSeconds = useGameStore(
    (state) => state.roundDurationSeconds
  );
  const resetStore = useGameStore((state) => state.reset);

  const [readyRemaining, setReadyRemaining] = useState(READY_SECONDS);
  const [remaining, setRemaining] = useState(roundDurationSeconds);
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const finishLock = useRef(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const totalPlayers = roles.length;
  const mafiaCount = useMemo(
    () => roles.filter((r) => r === "Mafia").length,
    [roles]
  );
  const maxRounds = useMemo(() => {
    const limit = totalPlayers - mafiaCount;
    return limit > 0 ? limit : 0;
  }, [mafiaCount, totalPlayers]);

  useEffect(() => {
    if (roundDurationSeconds <= 0) {
      router.replace("/");
      return;
    }
    setReadyRemaining(READY_SECONDS);
    setRemaining(roundDurationSeconds);
    setPhase("ready");
    finishLock.current = false;
  }, [roundDurationSeconds, router]);

  useEffect(() => {
    if (phase !== "ready") return;
    if (readyRemaining <= 0) {
      setPhase("running");
      finishLock.current = false;
      return;
    }
    const id = setInterval(() => {
      setReadyRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, readyRemaining]);

  useEffect(() => {
    if (phase !== "running") return;
    if (remaining <= 0) {
      finishRound("complete");
      return;
    }
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, remaining]);

  useEffect(() => {
    if (phase === "finished" && rounds.length > 0) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [phase, rounds.length]);

  const finishRound = (reason: RoundResult["reason"]) => {
    if (finishLock.current) return;
    finishLock.current = true;
    setPhase("finished");
    setRemaining(0);
    setRounds((prev) => [
      ...prev,
      ...(prev.length < maxRounds
        ? [
            {
              id: prev.length + 1,
              durationSeconds: roundDurationSeconds,
              endedAt: Date.now(),
              reason,
            },
          ]
        : []),
    ]);
  };

  const restartRound = () => {
    finishLock.current = false;
    setRounds([]);
    setReadyRemaining(READY_SECONDS);
    setRemaining(roundDurationSeconds);
    setPhase("ready");
  };

  const startRound = () => {
    if (phase !== "ready") return;
    if (rounds.length >= maxRounds) return;
    finishLock.current = false;
    setReadyRemaining(0);
    setRemaining(roundDurationSeconds);
    setPhase("running");
  };

  const endEarly = () => {
    if (phase === "finished") return;
    finishRound("ended");
  };

  const formattedReady = useMemo(
    () => `00:${String(Math.max(readyRemaining, 0)).padStart(2, "0")}`,
    [readyRemaining]
  );

  const minutes = useMemo(() => Math.floor(remaining / 60), [remaining]);
  const seconds = useMemo(() => remaining % 60, [remaining]);
  const formatted = useMemo(
    () =>
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    [minutes, seconds]
  );

  const progress = useMemo(() => {
    if (phase === "ready") return 0;
    if (roundDurationSeconds <= 0) return 0;
    return 1 - remaining / roundDurationSeconds;
  }, [phase, remaining, roundDurationSeconds]);

  const strokeDashoffset = useMemo(() => {
    const used = Math.min(Math.max(progress, 0), 1);
    return RING_CIRC * used;
  }, [progress]);

  const phaseLabel = useMemo(() => {
    if (phase === "ready") return "Get Ready";
    if (phase === "running") return "Current Phase";
    return "Round Complete";
  }, [phase]);

  const phaseTitle = useMemo(() => {
    if (phase === "ready") return "Starting soon";
    if (phase === "running") return "Argument";
    return "Argument";
  }, [phase]);

  const currentRoundNumber = useMemo(() => {
    const base = phase === "finished" ? rounds.length : rounds.length + 1;
    if (maxRounds <= 0) return base;
    return Math.min(base, maxRounds);
  }, [maxRounds, phase, rounds.length]);

  const roundsCapReached = maxRounds > 0 && rounds.length >= maxRounds;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.screen]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconButton, { borderColor: colors.cardBorder }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.nightLabel, { color: colors.primary }]}>
            NIGHT 1
          </Text>
          <Pressable
            onPress={() => {
              resetStore();
              router.replace("/");
            }}
            style={[styles.iconButton, { borderColor: colors.cardBorder }]}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        <Text style={[styles.roundTitle, { color: colors.text }]}>
          {maxRounds > 0
            ? `Round ${currentRoundNumber} of ${maxRounds}`
            : `Round ${currentRoundNumber}`}
        </Text>

        <View style={styles.phaseBlock}>
          <Text style={[styles.phaseLabel, { color: colors.muted }]}>
            {phaseLabel.toUpperCase()}
          </Text>
          <Text style={[styles.phaseTitle, { color: colors.text }]}>
            {phaseTitle}
          </Text>
        </View>

        <View style={styles.circleCard}>
          <View style={[styles.circleOuter, { shadowColor: colors.primary }]}>
            <Svg
              width={RING_SIZE}
              height={RING_SIZE}
              style={[styles.circleSvg, { transform: [{ rotate: "-90deg" }] }]}
            >
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                stroke={colors.primary}
                strokeWidth={RING_STROKE}
                strokeDasharray={[RING_CIRC, RING_CIRC]}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
            <View
              style={[
                styles.circleInner,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text style={[styles.circleTime, { color: colors.text }]}>
                {phase === "ready" ? formattedReady : formatted}
              </Text>
              <Text style={[styles.circleSub, { color: colors.muted }]}>
                {phase === "ready" ? "Starting in" : "Remaining"}
              </Text>
            </View>
          </View>
        </View>

        {phase !== "ready" && !roundsCapReached ? (
          <Pressable
            style={[
              styles.endButton,
              {
                borderColor: colors.cardBorder,
                backgroundColor: colors.surface,
              },
            ]}
            onPress={endEarly}
          >
            <Ionicons name="stop" size={16} color={colors.text} />
            <Text style={[styles.endText, { color: colors.text }]}>
              End Round
            </Text>
          </Pressable>
        ) : null}

        {phase === "finished" ? (
          <View
            style={[styles.historyCard, { borderColor: colors.cardBorder }]}
          >
            <Text style={[styles.historyTitle, { color: colors.text }]}>
              Rounds
            </Text>
            {rounds.map((r) => (
              <View key={r.id} style={styles.historyRow}>
                <Text style={[styles.historyLabel, { color: colors.muted }]}>
                  Round {r.id}
                </Text>
                <Text style={[styles.historyValue, { color: colors.text }]}>
                  {formatSeconds(r.durationSeconds)}
                  {r.reason === "ended" ? " · ended early" : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.footerActions}>
          {phase === "ready" ? (
            <Pressable
              style={[
                styles.startButton,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.cardBorder,
                  opacity: roundsCapReached ? 0.5 : 1,
                },
              ]}
              disabled={roundsCapReached}
              onPress={startRound}
            >
              <Text style={[styles.startText, { color: colors.text }]}>
                Start round
              </Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: colors.cardBorder,
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={restartRound}
              >
                <Text style={[styles.secondaryText, { color: colors.text }]}>
                  Restart Round
                </Text>
              </Pressable>
              {phase === "finished" ? (
                rounds.length < maxRounds ? (
                  <Pressable
                    style={[
                      styles.primaryButton,
                      {
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary,
                      },
                    ]}
                    onPress={() => {
                      finishLock.current = false;
                      setReadyRemaining(READY_SECONDS);
                      setRemaining(roundDurationSeconds);
                      setPhase("ready");
                    }}
                  >
                    <Text
                      style={[
                        styles.primaryText,
                        { color: colors.primaryText },
                      ]}
                    >
                      Next round
                    </Text>
                  </Pressable>
                ) : null
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: {
    flex: 1,
    padding: 24,
    gap: 18,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  nightLabel: {
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "800",
  },
  roundTitle: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  phaseBlock: {
    alignItems: "center",
    gap: 4,
  },
  phaseLabel: {
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "800",
  },
  phaseTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  circleCard: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  circleOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  circleSvg: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  circleInner: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  circleTime: {
    fontSize: 54,
    fontWeight: "900",
    letterSpacing: 1,
  },
  circleSub: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  circleProgress: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    opacity: 0.5,
  },
  endButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: "center",
  },
  endText: {
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  startButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  startText: {
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  footerActions: {
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  primaryText: {
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryText: {
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
