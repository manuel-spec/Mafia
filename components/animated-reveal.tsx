import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnimatedRevealProps = {
  label?: string;
  onRevealStart: () => void;
  onRevealEnd: () => void;
};

const UP_DISTANCE = -170;

export function AnimatedReveal({
  label = "Reveal",
  onRevealStart,
  onRevealEnd,
}: AnimatedRevealProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [busy, setBusy] = useState(false);

  const runAnimation = () => {
    if (busy) return;
    setBusy(true);
    onRevealStart();

    Animated.sequence([
      Animated.timing(translateY, {
        toValue: UP_DISTANCE,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRevealEnd();
      setBusy(false);
    });
  };

  return (
    <Pressable
      style={styles.wrapper}
      onPress={runAnimation}
      disabled={busy}
      hitSlop={24}
    >
      <Animated.View
        style={[styles.button, { transform: [{ translateY }] }]}
        pointerEvents="none"
      >
        <View style={styles.iconBubble}>
          <Text style={styles.icon}>⬆︎</Text>
        </View>
        <Text style={styles.label}>{busy ? "Revealing…" : label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    zIndex: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#161820",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#242732",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#222533",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "#e53935",
    fontSize: 20,
    fontWeight: "800",
  },
  label: {
    color: "#e3e6ed",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
