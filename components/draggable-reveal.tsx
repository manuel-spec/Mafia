import { useMemo, useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

type DraggableRevealProps = {
  label?: string;
  onReveal: () => void;
  onRelease?: (revealed: boolean) => void;
};

const MIN_Y = -200;
const THRESHOLD_Y = -90;

export function DraggableReveal({
  label = "Drag up to reveal",
  onReveal,
  onRelease,
}: DraggableRevealProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  const arrowRotate = translateY.interpolate({
    inputRange: [MIN_Y, 0],
    outputRange: ["0deg", "180deg"],
    extrapolate: "clamp",
  });

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderMove: (_, gesture) => {
          const next = Math.min(0, Math.max(MIN_Y, gesture.dy));
          translateY.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const didReveal = gesture.dy < THRESHOLD_Y;
          if (didReveal) {
            onReveal();
          }

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 80,
          }).start(() => {
            onRelease?.(didReveal);
          });
        },
      }),
    [onReveal, onRelease, translateY]
  );

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[styles.container, { transform: [{ translateY }] }]}
    >
      <View style={styles.handle}>
        <Animated.Text
          style={[styles.label, { transform: [{ rotate: arrowRotate }] }]}
        >
          ⬆︎
        </Animated.Text>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    width: "80%",
    zIndex: 10,
  },
  handle: {
    backgroundColor: "#161820",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#242732",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  label: {
    color: "#e53935",
    fontSize: 16,
    fontWeight: "800",
  },
  text: {
    color: "#e3e6ed",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
