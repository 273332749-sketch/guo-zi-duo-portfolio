import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const MotionContext = createContext({ reduced: false, visible: true });

export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(() =>
    new URLSearchParams(window.location.search).get("motion") === "reduce" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(
      new URLSearchParams(window.location.search).get("motion") === "reduce" || media.matches,
    );
    const updateVisibility = () => setVisible(!document.hidden);
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return <MotionContext.Provider value={{ reduced, visible }}>{children}</MotionContext.Provider>;
}

export const useMotionPolicy = () => useContext(MotionContext);

// Keep the source's scene graph and frame callbacks. A fixed clock and zero
// delta compose the same paper scene without autonomous movement.
export function useMotionFrame(callback) {
  const { reduced, visible } = useMotionPolicy();
  useFrame((state, delta) => {
    if (!visible) return;
    callback(reduced ? { ...state, clock: { elapsedTime: 0 } } : state, reduced ? 0 : delta);
  });
}

export function MotionDriver() {
  const { reduced, visible } = useMotionPolicy();
  const invalidate = useThree((state) => state.invalidate);
  const remaining = useRef(200);

  useEffect(() => {
    if (!reduced || !visible) return;
    // The original camera and vehicle code uses lerps. Allow those to settle
    // to a fixed composition, then stop rendering until another interaction.
    const requestComposition = () => {
      remaining.current = 200;
      invalidate();
    };
    const events = ["wheel", "pointermove", "pointerdown", "touchmove", "keydown", "resize"];
    requestComposition();
    events.forEach((event) => window.addEventListener(event, requestComposition, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, requestComposition));
  }, [reduced, visible, invalidate]);

  useFrame(() => {
    if (reduced && visible && remaining.current > 0) {
      remaining.current--;
      invalidate();
    }
  }, -100);
  return null;
}
