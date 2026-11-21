import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import * as THREE from "three/webgpu";
import normalizeWheel from "normalize-wheel";
import { useMotionPolicy } from "./hooks/useMotionPolicy";

const Experience = () => {
  const { reduced, visible } = useMotionPolicy();
  const [sceneVersion, setSceneVersion] = useState(0);
  const camera = useRef();
  const cameraGroup = useRef();
  const scrollProgress = useRef(0);
  const targetScrollProgress = useRef(0);
  const baseScrollSpeed = 0.0085;
  const scrollSpeedMultiplier = useRef(1);
  const lerpFactor = 0.1;
  const isSwiping = useRef(false);
  const mousePositionOffset = useRef(new THREE.Vector3());
  const mouseRotationOffset = useRef(new THREE.Euler());
  const lastTouchY = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      const normalized = normalizeWheel(e);

      targetScrollProgress.current +=
        Math.sign(normalized.pixelY) *
        baseScrollSpeed *
        scrollSpeedMultiplier.current *
        Math.min(Math.abs(normalized.pixelY) / 100, 1);
    };

    const handleMouseMove = (e) => {
      if (reduced) return;
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      const sensitivityX = 0.05;
      const sensitivityY = 0.05;

      mousePositionOffset.current.x = mouseX * sensitivityX;
      mousePositionOffset.current.y = mouseY * sensitivityY;

      const rotationSensitivityX = 0.05;
      const rotationSensitivityY = 0.05;

      mouseRotationOffset.current.x = mouseY * rotationSensitivityX;
      mouseRotationOffset.current.y = mouseX * rotationSensitivityY;
    };

    const handleTouchStart = (e) => {
      if (e.target.closest("a, button, input, select, textarea")) return;
      isSwiping.current = true;
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;

      if (lastTouchY.current !== null) {
        const deltaY = e.touches[0].clientY - lastTouchY.current;
        const touchMultiplier = 0.3;
        targetScrollProgress.current +=
          Math.sign(deltaY) *
          baseScrollSpeed *
          touchMultiplier *
          scrollSpeedMultiplier.current;
      }
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      isSwiping.current = false;
      lastTouchY.current = null;
    };

    const handleMouseDown = (e) => {
      if (e.button !== 0 || e.target.closest("a, button, input, select, textarea")) return;
      if (e.pointerType === "touch") return;
      isSwiping.current = true;
    };

    const handleMouseDrag = (e) => {
      if (!isSwiping.current || e.pointerType === "touch") return;
      const mouseMultiplier = 0.2;
      targetScrollProgress.current +=
        Math.sign(e.movementY) * baseScrollSpeed * scrollSpeedMultiplier.current * mouseMultiplier;
    };

    const handleMouseUp = () => {
      isSwiping.current = false;
    };

    const handleKeyDown = (e) => {
      if (e.target.closest("a, button, input, select, textarea")) return;
      const steps = { ArrowDown: 0.025, ArrowRight: 0.025, ArrowUp: -0.025, ArrowLeft: -0.025, PageDown: 0.12, PageUp: -0.12 };
      if (e.key === "Home") {
        e.preventDefault();
        scrollProgress.current = 0;
        targetScrollProgress.current = 0;
        mousePositionOffset.current.set(0, 0, 0);
        mouseRotationOffset.current.set(0, 0, 0);
        setSceneVersion((value) => value + 1);
      } else if (e.key in steps) {
        e.preventDefault();
        targetScrollProgress.current += steps[e.key];
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("blur", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("blur", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reduced]);

  return (
    <Canvas
      fallback={null}
      frameloop={visible && !reduced ? "always" : "demand"}
      shadows
      flat={true}
      gl={(props) => {
        extend(THREE);
        const renderer = new THREE.WebGPURenderer(props);
        return renderer.init().then(() => renderer);
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Scene
        key={sceneVersion}
        cameraGroup={cameraGroup}
        camera={camera}
        scrollProgress={scrollProgress}
        targetScrollProgress={targetScrollProgress}
        lerpFactor={lerpFactor}
        mousePositionOffset={mousePositionOffset}
        mouseRotationOffset={mouseRotationOffset}
        scrollSpeedMultiplier={scrollSpeedMultiplier}
      />

      <group ref={cameraGroup}>
        <PerspectiveCamera
          ref={camera}
          makeDefault
          fov={35}
          // position={[0, 0, 30]}
        />
        {/* <OrbitControls enableZoom={false} enableRotate={false} /> */}
      </group>
    </Canvas>
  );
};

export default Experience;
