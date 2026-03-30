interface Props {
  outcome: "win" | "lose";
  turns: number;
  abilitiesUsed: number;
  onRestart: () => void;
}

export default function WinLoseScreen({
  outcome,
  turns,
  abilitiesUsed,
  onRestart,
}: Props) {
  const isWin = outcome === "win";

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto min-h-dvh flex flex-col items-center justify-center px-6 text-center"
      data-ocid="winlose.page"
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: isWin
            ? "radial-gradient(circle at 50% 40%, oklch(0.78 0.14 218 / 0.2) 0%, transparent 60%)"
            : "radial-gradient(circle at 50% 40%, oklch(0.58 0.18 25 / 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div
          className="anim-intro anim-win-pulse"
          style={{ animationDelay: "0s" }}
        >
          <div className="text-6xl mb-4">{isWin ? "✦" : "☠"}</div>
          <h1
            className={`text-4xl font-display font-black uppercase tracking-[0.15em] ${
              isWin ? "text-nova anim-glow-title" : "text-destructive"
            }`}
          >
            {isWin ? "REALITY" : "DARKNESS"}
          </h1>
          <h1
            className={`text-4xl font-display font-black uppercase tracking-[0.15em] ${
              isWin ? "text-nova anim-glow-title" : "text-destructive"
            }`}
          >
            {isWin ? "RESTORED" : "PREVAILS"}
          </h1>
        </div>

        <p
          className="anim-intro text-sm text-foreground/70 leading-relaxed max-w-[320px]"
          style={{ animationDelay: "0.3s" }}
        >
          {isWin
            ? "The Architect falls. Astrid, Chronos, and Seraphina unite their powers — sealing the breach. The cosmos breathes again."
            : "The Architect's laughter echoes across shattered dimensions. Reality folds in on itself. All that was... unmade."}
        </p>

        <div
          className="anim-intro glass-panel rounded-2xl p-5 w-full"
          style={{ animationDelay: "0.5s" }}
          data-ocid="winlose.card"
        >
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            Battle Summary
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-display font-black text-primary">
                {turns}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Turns
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="text-3xl font-display font-black"
                style={{ color: "#F5C542" }}
              >
                {abilitiesUsed}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Abilities Used
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          data-ocid="winlose.primary_button"
          onClick={onRestart}
          className="anim-intro btn-cosmic w-full py-4 rounded-2xl font-display font-black text-lg uppercase tracking-widest text-foreground border-0 cursor-pointer"
          style={{ animationDelay: "0.7s" }}
        >
          {isWin ? "⚔ PLAY AGAIN" : "↺ TRY AGAIN"}
        </button>
      </div>

      <footer className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-muted-foreground text-[10px]">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
