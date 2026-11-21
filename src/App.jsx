import "./App.scss";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen/IntroScreen";
import { Component } from "react";
import { MotionProvider } from "./Experience/hooks/useMotionPolicy";

// Source: Andrew Woan, MIT, https://github.com/andrewwoan/mr-pandas-psychologically-safe-portfolio
// Reference media is QA-only; see REFERENCE.md. The runtime uses the original GLB/KTX2 scene.
export function SceneFallback() {
  return (
    <section className="scene-fallback" role="alert">
      <h1>Mr. Panda's Psychologically Safe Portfolio</h1>
      <p>The paper world could not load. Please use a browser with WebGL 2 or WebGPU support, then try again.</p>
      <button type="button" onClick={() => window.location.reload()}>Try again</button>
    </section>
  );
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

function App() {
  return (
    <MotionProvider>
      <main id="portfolio" tabIndex={0} aria-label="Mr. Panda's Psychologically Safe Portfolio" aria-describedby="portfolio-instructions">
        <div className="sr-only">
          <h1>Mr. Panda's Psychologically Safe Portfolio</h1>
          <p>Welcome to my portfolio!! — Mr. Panda. P.S. I love traveling!!</p>
          <p id="portfolio-instructions">An interactive hand-drawn papercraft animation. Scroll or drag up and down to navigate. With the portfolio focused, use the arrow keys or Page Up and Page Down to travel; Home returns to the beginning. Handwritten story cards remain part of the original paper artwork.</p>
        </div>
        <SceneBoundary>
          <IntroScreen />
          <Experience />
        </SceneBoundary>
      </main>
    </MotionProvider>
  );
}

export default App;
