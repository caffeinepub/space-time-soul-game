import { useEffect, useReducer, useState } from "react";
import BattleScreen from "./components/BattleScreen";
import IntroScreen from "./components/IntroScreen";
import Starfield from "./components/Starfield";
import WinLoseScreen from "./components/WinLoseScreen";
import {
  checkLose,
  checkWin,
  createInitialState,
  gameReducer,
} from "./gameLogic";

type Screen = "intro" | "battle" | "winlose";

export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [gameState, dispatch] = useReducer(
    gameReducer,
    null,
    createInitialState,
  );
  const [outcome, setOutcome] = useState<"win" | "lose">("win");
  const [abilitiesUsed, setAbilitiesUsed] = useState(0);

  useEffect(() => {
    if (screen !== "battle") return;
    if (checkWin(gameState)) {
      setOutcome("win");
      setScreen("winlose");
    } else if (checkLose(gameState)) {
      setOutcome("lose");
      setScreen("winlose");
    }
  }, [gameState, screen]);

  // Auto-trigger villain turn
  useEffect(() => {
    if (gameState.phase !== "villain_turn") return;
    if (gameState.gameStatus !== "playing") return;
    const timer = setTimeout(() => {
      dispatch({ type: "VILLAIN_TURN" });
      setTimeout(() => dispatch({ type: "CLEAR_ANIMATIONS" }), 400);
    }, 1000);
    return () => clearTimeout(timer);
  }, [gameState.phase, gameState.gameStatus]);

  useEffect(() => {
    if (!gameState.warpFlash) return;
    const timer = setTimeout(
      () => dispatch({ type: "CLEAR_WARP_FLASH" }),
      1500,
    );
    return () => clearTimeout(timer);
  }, [gameState.warpFlash]);

  function handleStart() {
    setScreen("battle");
  }

  function handleRestart() {
    window.location.reload();
  }

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden font-body">
      <Starfield />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/generated/cosmic-bg.dim_480x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-start">
        {screen === "intro" && <IntroScreen onStart={handleStart} />}
        {screen === "battle" && (
          <BattleScreen
            state={gameState}
            dispatch={dispatch}
            onAbilityUsed={() => setAbilitiesUsed((c) => c + 1)}
          />
        )}
        {screen === "winlose" && (
          <WinLoseScreen
            outcome={outcome}
            turns={gameState.turn}
            abilitiesUsed={abilitiesUsed}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
