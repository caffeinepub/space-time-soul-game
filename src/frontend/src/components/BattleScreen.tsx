import { useEffect, useRef } from "react";
import type { GameAction, GameState } from "../gameLogic";
import AbilityButton from "./AbilityButton";
import CharacterSprite from "./CharacterSprite";
import HealthBar from "./HealthBar";

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onAbilityUsed: () => void;
}

const PHASE_LABELS: Record<1 | 2 | 3, string> = {
  1: "Phase I",
  2: "Phase II · Reality Warps",
  3: "⚠ Phase III · ENRAGED",
};

const PHASE_COLORS: Record<1 | 2 | 3, string> = {
  1: "text-villain",
  2: "text-orange-400",
  3: "text-destructive",
};

export default function BattleScreen({
  state,
  dispatch,
  onAbilityUsed,
}: Props) {
  const logRef = useRef<HTMLDivElement>(null);
  const activeHero = state.heroes[state.activeHeroIndex];
  const isHeroTurn =
    state.phase === "hero_turn" && state.gameStatus === "playing";

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [state.combatLog.length]);

  function handleAbility(abilityId: string) {
    dispatch({
      type: "USE_ABILITY",
      heroIndex: state.activeHeroIndex,
      abilityId,
    });
    onAbilityUsed();
  }

  const { statusEffects } = state;

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto flex flex-col min-h-dvh"
      data-ocid="battle.page"
    >
      {/* Reality Warp Flash */}
      {state.warpFlash && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            animation: "screen-flash 1.5s ease-out forwards",
            background:
              "radial-gradient(circle, oklch(0.66 0.25 330 / 0.8) 0%, oklch(0.56 0.22 290 / 0.4) 60%, transparent 100%)",
          }}
        />
      )}

      {/* ── TOP BAR ── */}
      <div
        className="glass-panel px-4 py-2 flex items-center justify-between rounded-none"
        data-ocid="battle.panel"
      >
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Turn
          </span>
          <span className="text-lg font-display font-black text-foreground leading-none">
            {state.turn}
          </span>
        </div>

        <div className="text-center">
          <h1 className="text-xs font-display font-black uppercase tracking-widest text-foreground">
            <span className="text-nova">SPACE</span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-[#A855F7]">TIME</span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-[#F5C542]">SOUL</span>
          </h1>
          <div
            className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full ${
              isHeroTurn
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-villain/20 text-villain border border-villain/40"
            }`}
          >
            {isHeroTurn ? "⚔ YOUR TURN" : "👁 VILLAIN ACTS"}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Phase
          </span>
          <span
            className={`text-xs font-bold ${PHASE_COLORS[state.villain.phase]}`}
          >
            {PHASE_LABELS[state.villain.phase].split(" · ")[0]}
          </span>
        </div>
      </div>

      {/* Warp Message */}
      {state.warpMessage && state.warpFlash && (
        <div
          className="mx-3 mt-1 px-3 py-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider"
          style={{
            background: "oklch(0.66 0.25 330 / 0.15)",
            border: "1px solid oklch(0.66 0.25 330 / 0.5)",
            color: "oklch(0.76 0.25 330)",
            animation: "reality-warp 4s ease-in-out",
          }}
          data-ocid="battle.toast"
        >
          {state.warpMessage}
        </div>
      )}

      {/* ── VILLAIN SECTION ── */}
      <div
        className="mx-3 mt-2 glass-panel-villain rounded-2xl p-3 flex gap-3"
        data-ocid="battle.card"
      >
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <CharacterSprite
            type="villain"
            hp={state.villain.hp}
            maxHp={state.villain.maxHp}
            isShaking={state.shakingVillain}
            isActing={state.phase === "villain_turn"}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-display font-black uppercase tracking-wider text-villain">
              THE ARCHITECT
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                state.villain.phase === 3
                  ? "border-destructive/60 text-destructive bg-destructive/10"
                  : "border-villain/40 text-villain bg-villain/10"
              }`}
            >
              {PHASE_LABELS[state.villain.phase]}
            </span>
          </div>

          <HealthBar
            current={state.villain.hp}
            max={state.villain.maxHp}
            type="villain"
          />

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-destructive font-semibold">
              {state.villain.hp} / {state.villain.maxHp} HP
            </span>
            <div className="flex gap-1">
              {state.villain.stunned && (
                <span className="bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 rounded px-1.5 py-0.5 text-[9px] font-bold">
                  STUNNED
                </span>
              )}
              {state.villain.slowed && (
                <span className="bg-[#F5C542]/20 text-[#F5C542] border border-[#F5C542]/40 rounded px-1.5 py-0.5 text-[9px] font-bold">
                  SLOWED
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ROSTER ── */}
      <div
        className="mx-3 mt-2 grid grid-cols-3 gap-1.5"
        data-ocid="battle.row"
      >
        {state.heroes.map((hero, idx) => {
          const isActive = state.activeHeroIndex === idx;
          const isDead = hero.hp <= 0;
          return (
            <button
              type="button"
              key={hero.id}
              data-ocid="battle.tab"
              disabled={isDead || !isHeroTurn}
              onClick={() =>
                !isDead &&
                isHeroTurn &&
                dispatch({ type: "SELECT_HERO", index: idx })
              }
              className={`
                glass-panel rounded-xl p-2 flex flex-col items-center gap-1 border transition-all duration-200
                ${isDead ? "opacity-30 border-border cursor-not-allowed" : ""}
                ${isActive && !isDead ? "border-current" : "border-border/40"}
                ${!isDead && isHeroTurn ? "cursor-pointer active:scale-95" : ""}
              `}
              style={
                isActive && !isDead
                  ? {
                      borderColor: hero.color,
                      boxShadow: `0 0 12px ${hero.color}40`,
                    }
                  : {}
              }
            >
              <CharacterSprite
                type="hero"
                heroId={hero.id}
                heroImage={hero.image}
                heroColor={hero.color}
                hp={hero.hp}
                maxHp={hero.maxHp}
                isShaking={state.shakingHeroIndex === idx}
              />
              <div
                className="text-[10px] font-display font-bold uppercase tracking-wide"
                style={{ color: hero.color }}
              >
                {hero.name}
              </div>
              <HealthBar current={hero.hp} max={hero.maxHp} type="hp" small />
              {isDead && (
                <div className="text-[9px] text-destructive font-bold uppercase">
                  FALLEN
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Effects Bar */}
      {(statusEffects.heroShielded || statusEffects.heroDodging > 0) && (
        <div className="mx-3 mt-1.5 flex gap-1.5" data-ocid="battle.panel">
          {statusEffects.heroShielded && (
            <span className="text-[10px] bg-nova/15 text-nova border border-nova/30 rounded-full px-2 py-0.5 font-bold">
              🛡 SHIELDED
            </span>
          )}
          {statusEffects.heroDodging > 0 && (
            <span className="text-[10px] bg-[#F5C542]/15 text-[#F5C542] border border-[#F5C542]/30 rounded-full px-2 py-0.5 font-bold">
              👻 DODGE ×{statusEffects.heroDodging}
            </span>
          )}
        </div>
      )}

      {/* ── COMBAT LOG ── */}
      <div
        ref={logRef}
        className="mx-3 mt-2 glass-panel rounded-xl px-3 py-2 h-[72px] overflow-y-auto flex flex-col-reverse space-y-reverse space-y-0.5"
        data-ocid="battle.panel"
      >
        {state.combatLog.map((entry) => (
          <div
            key={entry.id}
            className={`text-[10px] leading-tight ${
              entry.type === "villain"
                ? "text-villain/90"
                : entry.type === "reality"
                  ? "text-villain font-bold"
                  : entry.type === "hero"
                    ? "text-foreground/80"
                    : "text-muted-foreground"
            }`}
          >
            {entry.text}
          </div>
        ))}
      </div>

      {/* ── ACTIVE HERO PANEL ── */}
      <div className="glass-panel rounded-none border-t border-border/50 px-3 py-3 mt-auto">
        {/* Hero selector tabs */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {state.heroes.map((hero, idx) => {
            const isActive = state.activeHeroIndex === idx;
            const isDead = hero.hp <= 0;
            return (
              <button
                type="button"
                key={hero.id}
                data-ocid="battle.tab"
                disabled={isDead || !isHeroTurn}
                onClick={() =>
                  !isDead &&
                  isHeroTurn &&
                  dispatch({ type: "SELECT_HERO", index: idx })
                }
                className={`py-1.5 rounded-lg border font-display font-bold text-xs uppercase tracking-wide transition-all duration-150 ${
                  isDead ? "opacity-30 border-border text-muted-foreground" : ""
                } ${
                  !isDead && isHeroTurn ? "cursor-pointer active:scale-95" : ""
                }`}
                style={
                  isActive && !isDead
                    ? {
                        borderColor: hero.color,
                        color: hero.color,
                        backgroundColor: `${hero.color}15`,
                      }
                    : {
                        borderColor: "oklch(0.25 0.05 255)",
                        color: "oklch(0.55 0.05 250)",
                      }
                }
              >
                {hero.name}
                {isDead ? " ✕" : ""}
              </button>
            );
          })}
        </div>

        {/* Active hero info */}
        {activeHero && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-display font-black text-sm uppercase tracking-wider"
                  style={{ color: activeHero.color }}
                >
                  {activeHero.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {activeHero.title}
                </span>
              </div>
              <div className="mt-1">
                <HealthBar
                  current={activeHero.hp}
                  max={activeHero.maxHp}
                  type="hp"
                />
                <div className="flex justify-between text-[10px] mt-0.5">
                  <span className="text-muted-foreground">
                    {activeHero.hp} / {activeHero.maxHp} HP
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ability Buttons */}
        {activeHero && activeHero.hp > 0 ? (
          <div className="grid grid-cols-3 gap-2" data-ocid="ability.panel">
            {activeHero.abilities.map((ability, idx) => (
              <AbilityButton
                key={ability.id}
                ability={ability}
                heroColor={activeHero.color}
                disabled={!isHeroTurn}
                index={idx}
                onUse={() => handleAbility(ability.id)}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-4 text-muted-foreground text-sm"
            data-ocid="ability.empty_state"
          >
            {activeHero?.name ?? "This hero"} has fallen. Select another hero.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-3">
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
