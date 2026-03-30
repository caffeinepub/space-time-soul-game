import { useState } from "react";
import type { Ability } from "../gameLogic";

interface Props {
  ability: Ability;
  heroColor: string;
  disabled?: boolean;
  index: number;
  onUse: () => void;
}

export default function AbilityButton({
  ability,
  heroColor,
  disabled,
  index,
  onUse,
}: Props) {
  const [showDesc, setShowDesc] = useState(false);
  const onCooldown = ability.cooldown > 0;
  const isDisabled = disabled || onCooldown;

  let longPressTimer: ReturnType<typeof setTimeout> | null = null;

  function handleTouchStart() {
    longPressTimer = setTimeout(() => setShowDesc(true), 500);
  }

  function handleTouchEnd() {
    if (longPressTimer) clearTimeout(longPressTimer);
    setTimeout(() => setShowDesc(false), 2000);
  }

  return (
    <button
      type="button"
      data-ocid={`ability.button.${index + 1}`}
      className={`
        relative flex flex-col items-center justify-center gap-1
        min-h-[72px] px-2 py-2 rounded-xl border glass-panel
        transition-all duration-150
        ${
          isDisabled
            ? "opacity-40 cursor-not-allowed border-border"
            : "cursor-pointer active:scale-95 hover:scale-105"
        }
      `}
      style={
        !isDisabled
          ? {
              borderColor: `${heroColor}60`,
              boxShadow: `0 0 8px ${heroColor}20`,
            }
          : {}
      }
      disabled={isDisabled}
      onClick={!isDisabled ? onUse : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      {/* Cooldown overlay */}
      {onCooldown && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center">
          <span className="text-[9px] font-bold text-destructive">
            {ability.cooldown}
          </span>
        </div>
      )}

      {/* Description tooltip */}
      {showDesc && !onCooldown && (
        <div className="absolute inset-0 rounded-xl bg-black/92 flex items-center justify-center z-10 p-2">
          <p className="text-[10px] text-foreground text-center leading-tight">
            {ability.desc}
          </p>
        </div>
      )}

      <span className="text-xl leading-none">{ability.icon}</span>
      <span className="text-[10px] font-display font-bold uppercase tracking-wide text-foreground leading-tight text-center">
        {ability.name}
      </span>
      {ability.maxCooldown > 0 ? (
        <span className="text-[9px] text-muted-foreground">
          {onCooldown ? `CD: ${ability.cooldown}` : "Ready"}
        </span>
      ) : (
        <span className="text-[9px]" style={{ color: heroColor }}>
          No CD
        </span>
      )}
    </button>
  );
}
