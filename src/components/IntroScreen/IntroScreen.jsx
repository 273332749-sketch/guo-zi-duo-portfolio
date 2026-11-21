import React, { useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import styles from "./IntroScreen.module.scss";
import { useMotionPolicy } from "../../Experience/hooks/useMotionPolicy";

const IntroScreen = () => {
  const { reduced } = useMotionPolicy();
  const { progress } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);
  const introRef = useRef(null);

  useGSAP(() => {
    if (progress === 100 && shouldRender && introRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false);
        },
      });

      tl.to(introRef.current, {
        opacity: 0,
        duration: reduced ? 0 : 1,
        ease: "power2.out",
        delay: reduced ? 0 : 1.5,
      });
    }
  }, [progress, reduced, shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <div ref={introRef} className={styles.introScreen}>
        <div className={styles.introScreenContent}>
          <div>
            <br /> 🐼 scroll/drag up/down to navigate!! 😊
          </div>

          <div className={styles.progressBarContainer} role="progressbar" aria-label="Loading paper world" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <a
          href="https://www.youtube.com/watch?v=zyWD2E8AHCg"
          className="tutorial-link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "25%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#000000ff",
            // textDecoration: "none",
          }}
        >
          Watch tutorial here!!
        </a>
        <a
          href="https://github.com/andrewwoan/mr-pandas-psychologically-safe-portfolio"
          className="credits-link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "15%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#000000ff",
            // textDecoration: "none",
          }}
        >
          See full list of credits here!!
        </a>
      </div>
    </>
  );
};

export default IntroScreen;
