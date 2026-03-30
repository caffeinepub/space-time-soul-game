import { useEffect, useState } from "react";

const LORE_TEXT =
  "When The Architect — wielder of infinite Reality — threatens to unmake existence, three cosmic warriors answer the call. Astrid, master of Space; Chronos, keeper of Time; Seraphina, binder of Souls. United by fate, divided by the cosmos, they must fight as one to restore what was lost...";

const HEROES = [
  {
    id: "space",
    name: "Astrid",
    title: "Master of Space",
    image: "/assets/generated/hero-astrid.dim_200x260.png",
    color: "#38BDF8",
  },
  {
    id: "time",
    name: "Chronos",
    title: "Keeper of Time",
    image: "/assets/generated/hero-chronos-v2.dim_200x260.png",
    color: "#A855F7",
  },
  {
    id: "soul",
    name: "Seraphina",
    title: "Soul Binder",
    image: "/assets/generated/hero-seraphina.dim_200x260.png",
    color: "#F5C542",
  },
];

interface Props {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [typewriterDone, setTypewriterDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i < LORE_TEXT.length) {
        setDisplayedText(LORE_TEXT.slice(0, i + 1));
        i++;
      } else {
        setTypewriterDone(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto min-h-dvh flex flex-col items-center px-4 py-8"
      data-ocid="intro.page"
    >
      {/* Title */}
      <div
        className="anim-intro text-center mt-8 mb-6"
        style={{ animationDelay: "0s" }}
      >
        <div className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">
          AN EPIC BATTLE FOR EXISTENCE
        </div>
        <h1
          className="text-5xl font-display font-black uppercase tracking-widest anim-glow-title text-foreground"
          style={{ letterSpacing: "0.15em" }}
        >
          <span style={{ color: "#38BDF8" }}>SPACE</span>
          <span className="text-muted-foreground"> · </span>
          <span style={{ color: "#A855F7" }}>TIME</span>
          <span className="text-muted-foreground"> · </span>
          <span style={{ color: "#F5C542" }}>SOUL</span>
        </h1>
        <div className="text-villain text-sm tracking-[0.2em] uppercase mt-1 font-semibold">
          vs. THE ARCHITECT
        </div>
      </div>

      {/* Hero portraits */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        {HEROES.map((hero, idx) => (
          <div
            key={hero.id}
            className="anim-intro flex flex-col items-center"
            style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
          >
            <div
              className="relative rounded-xl glass-panel overflow-hidden p-1 w-full"
              style={{
                aspectRatio: "200/260",
                borderColor: `${hero.color}60`,
                border: `1px solid ${hero.color}40`,
              }}
            >
              <img
                src={hero.image}
                alt={hero.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div
              className="font-display font-bold text-sm uppercase tracking-wider mt-1"
              style={{ color: hero.color }}
            >
              {hero.name}
            </div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wide text-center">
              {hero.title}
            </div>
          </div>
        ))}
      </div>

      {/* Hero abilities preview */}
      <div
        className="anim-intro w-full mb-4 glass-panel rounded-xl p-3"
        style={{ animationDelay: "0.45s" }}
      >
        <div className="text-xs tracking-[0.2em] text-primary uppercase mb-2 font-semibold">
          ◈ HERO ABILITIES
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              name: "Astrid",
              color: "#38BDF8",
              abilities: ["⚡ Warp Strike", "🌀 Black Hole", "🛡️ Dim Shield"],
            },
            {
              name: "Chronos",
              color: "#A855F7",
              abilities: ["⏱️ Time Slash", "↩️ Rewind", "🐢 Slow Field"],
            },
            {
              name: "Seraphina",
              color: "#F5C542",
              abilities: [
                "💀 Soul Drain",
                "🔗 Spirit Bind",
                "👻 Ethereal Form",
              ],
            },
          ].map((h) => (
            <div key={h.name}>
              <div
                className="text-[10px] font-bold uppercase mb-1"
                style={{ color: h.color }}
              >
                {h.name}
              </div>
              {h.abilities.map((ab) => (
                <div
                  key={ab}
                  className="text-[9px] text-muted-foreground leading-tight"
                >
                  {ab}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lore text */}
      <div
        className="anim-intro glass-panel rounded-xl p-4 mb-6 w-full"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="text-xs tracking-[0.2em] text-primary uppercase mb-2 font-semibold">
          ◈ THE LORE
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed min-h-[70px]">
          {displayedText}
          {!typewriterDone && (
            <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
          )}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        data-ocid="intro.primary_button"
        onClick={onStart}
        className="btn-cosmic w-full py-4 rounded-2xl font-display font-black text-lg uppercase tracking-widest text-foreground border-0 cursor-pointer"
      >
        ⚔ BEGIN BATTLE
      </button>

      <button
        type="button"
        data-ocid="intro.secondary_button"
        onClick={onStart}
        className="mt-3 text-muted-foreground text-xs uppercase tracking-widest underline underline-offset-4 hover:text-foreground transition-colors"
      >
        Skip Intro
      </button>

      <footer className="mt-auto pt-8 text-center">
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
