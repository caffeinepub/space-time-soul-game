// ─── Types ────────────────────────────────────────────────────────────────────

export type HeroId = "space" | "time" | "soul";

export type Ability = {
  id: string;
  name: string;
  desc: string;
  damage: number;
  heal: number;
  effect:
    | "damage"
    | "stun"
    | "shield"
    | "heal"
    | "slow"
    | "drain"
    | "bind"
    | "dodge";
  cooldown: number;
  maxCooldown: number;
  icon: string;
};

export type Hero = {
  id: HeroId;
  name: string;
  title: string;
  maxHp: number;
  hp: number;
  color: string;
  abilities: Ability[];
  image: string;
};

export type Villain = {
  name: string;
  maxHp: number;
  hp: number;
  phase: 1 | 2 | 3;
  stunned: boolean;
  slowed: boolean;
};

export type StatusEffects = {
  heroShielded: boolean;
  heroDodging: number;
  villainSlowed: boolean;
  villainStunned: boolean;
};

export type BattleLog = {
  id: number;
  text: string;
  type: "hero" | "villain" | "reality" | "status" | "info";
};

export type GamePhase = "hero_turn" | "villain_turn";

export type GameState = {
  heroes: Hero[];
  villain: Villain;
  activeHeroIndex: number;
  turn: number;
  phase: GamePhase;
  combatLog: BattleLog[];
  logIdCounter: number;
  gameStatus: "playing" | "won" | "lost";
  statusEffects: StatusEffects;
  warpFlash: boolean;
  warpMessage: string;
  shakingHeroIndex: number | null;
  shakingVillain: boolean;
};

// ─── Initial State ─────────────────────────────────────────────────────────────

export function createInitialState(): GameState {
  return {
    heroes: [
      {
        id: "space",
        name: "Astrid",
        title: "Space Master",
        maxHp: 300,
        hp: 300,
        color: "#38BDF8",
        image: "/assets/generated/hero-astrid.dim_200x260.png",
        abilities: [
          {
            id: "warp_strike",
            name: "Warp Strike",
            desc: "Tears space, deals 45 damage",
            damage: 45,
            heal: 0,
            effect: "damage",
            cooldown: 0,
            maxCooldown: 0,
            icon: "⚡",
          },
          {
            id: "black_hole",
            name: "Black Hole",
            desc: "Stuns villain, deals 30 damage",
            damage: 30,
            heal: 0,
            effect: "stun",
            cooldown: 0,
            maxCooldown: 2,
            icon: "🌀",
          },
          {
            id: "dim_shield",
            name: "Dim Shield",
            desc: "Block next attack, heal 20 HP",
            damage: 0,
            heal: 20,
            effect: "shield",
            cooldown: 0,
            maxCooldown: 3,
            icon: "🛡️",
          },
        ],
      },
      {
        id: "time",
        name: "Chronos",
        title: "Time Keeper",
        maxHp: 280,
        hp: 280,
        color: "#A855F7",
        image: "/assets/generated/hero-chronos-v2.dim_200x260.png",
        abilities: [
          {
            id: "time_slash",
            name: "Time Slash",
            desc: "Slash through time, 50 damage",
            damage: 50,
            heal: 0,
            effect: "damage",
            cooldown: 0,
            maxCooldown: 0,
            icon: "⏱️",
          },
          {
            id: "rewind",
            name: "Rewind",
            desc: "Restore 60 HP to self",
            damage: 0,
            heal: 60,
            effect: "heal",
            cooldown: 0,
            maxCooldown: 3,
            icon: "↩️",
          },
          {
            id: "slow_field",
            name: "Slow Field",
            desc: "Reduce villain dmg 50% next turn",
            damage: 15,
            heal: 0,
            effect: "slow",
            cooldown: 0,
            maxCooldown: 2,
            icon: "🐢",
          },
        ],
      },
      {
        id: "soul",
        name: "Seraphina",
        title: "Soul Binder",
        maxHp: 260,
        hp: 260,
        color: "#F5C542",
        image: "/assets/generated/hero-seraphina.dim_200x260.png",
        abilities: [
          {
            id: "soul_drain",
            name: "Soul Drain",
            desc: "Drain 40 dmg, heal self 20 HP",
            damage: 40,
            heal: 20,
            effect: "drain",
            cooldown: 0,
            maxCooldown: 0,
            icon: "💀",
          },
          {
            id: "spirit_bind",
            name: "Spirit Bind",
            desc: "Prevent reality warp + 25 dmg",
            damage: 25,
            heal: 0,
            effect: "bind",
            cooldown: 0,
            maxCooldown: 3,
            icon: "🔗",
          },
          {
            id: "ethereal_form",
            name: "Ethereal Form",
            desc: "Dodge next 2 attacks",
            damage: 0,
            heal: 0,
            effect: "dodge",
            cooldown: 0,
            maxCooldown: 4,
            icon: "👻",
          },
        ],
      },
    ],
    villain: {
      name: "THE ARCHITECT",
      maxHp: 900,
      hp: 900,
      phase: 1,
      stunned: false,
      slowed: false,
    },
    activeHeroIndex: 0,
    turn: 1,
    phase: "hero_turn",
    combatLog: [
      {
        id: 0,
        text: "The Architect descends... Reality itself trembles!",
        type: "reality",
      },
    ],
    logIdCounter: 1,
    gameStatus: "playing",
    statusEffects: {
      heroShielded: false,
      heroDodging: 0,
      villainSlowed: false,
      villainStunned: false,
    },
    warpFlash: false,
    warpMessage: "",
    shakingHeroIndex: null,
    shakingVillain: false,
  };
}

// ─── Action Types ──────────────────────────────────────────────────────────────

export type GameAction =
  | { type: "SELECT_HERO"; index: number }
  | { type: "USE_ABILITY"; heroIndex: number; abilityId: string }
  | { type: "VILLAIN_TURN" }
  | { type: "CLEAR_ANIMATIONS" }
  | { type: "CLEAR_WARP_FLASH" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function addLog(
  state: GameState,
  text: string,
  type: BattleLog["type"],
): GameState {
  const entry: BattleLog = { id: state.logIdCounter, text, type };
  return {
    ...state,
    combatLog: [entry, ...state.combatLog].slice(0, 20),
    logIdCounter: state.logIdCounter + 1,
  };
}

function getVillainPhase(hp: number): 1 | 2 | 3 {
  if (hp > 600) return 1;
  if (hp > 300) return 2;
  return 3;
}

function getFirstLivingHeroIndex(heroes: Hero[]): number {
  return heroes.findIndex((h) => h.hp > 0);
}

function tickCooldowns(heroes: Hero[]): Hero[] {
  return heroes.map((hero) => ({
    ...hero,
    abilities: hero.abilities.map((ab) => ({
      ...ab,
      cooldown: Math.max(0, ab.cooldown - 1),
    })),
  }));
}

// ─── Hero Ability ─────────────────────────────────────────────────────────────

function applyHeroAbility(
  state: GameState,
  heroIndex: number,
  abilityId: string,
): GameState {
  let s = { ...state };
  const heroes = s.heroes.map((h) => ({
    ...h,
    abilities: h.abilities.map((a) => ({ ...a })),
  }));
  const hero = heroes[heroIndex];
  const abilityIndex = hero.abilities.findIndex((a) => a.id === abilityId);
  if (abilityIndex === -1) return state;
  const ability = hero.abilities[abilityIndex];
  if (ability.cooldown > 0) return state;

  // Set cooldown
  hero.abilities[abilityIndex] = { ...ability, cooldown: ability.maxCooldown };

  const villain = { ...s.villain };
  let statusEffects = { ...s.statusEffects };
  let logText = `${hero.name} uses ${ability.name}!`;

  switch (ability.effect) {
    case "damage": {
      const dmg = ability.damage;
      villain.hp = clamp(villain.hp - dmg, 0, villain.maxHp);
      logText = `${hero.name} uses ${ability.name} — ${dmg} damage to The Architect!`;
      break;
    }
    case "stun": {
      villain.hp = clamp(villain.hp - ability.damage, 0, villain.maxHp);
      villain.stunned = true;
      logText = `${hero.name} uses ${ability.name} — ${ability.damage} dmg! Villain STUNNED!`;
      break;
    }
    case "shield": {
      hero.hp = clamp(hero.hp + ability.heal, 0, hero.maxHp);
      statusEffects = { ...statusEffects, heroShielded: true };
      logText = `${hero.name} activates ${ability.name} — Shield up! +${ability.heal} HP!`;
      break;
    }
    case "heal": {
      const healed = Math.min(ability.heal, hero.maxHp - hero.hp);
      hero.hp = clamp(hero.hp + ability.heal, 0, hero.maxHp);
      logText = `${hero.name} uses ${ability.name} — Restored ${healed} HP!`;
      break;
    }
    case "slow": {
      villain.hp = clamp(villain.hp - ability.damage, 0, villain.maxHp);
      villain.slowed = true;
      statusEffects = { ...statusEffects, villainSlowed: true };
      logText = `${hero.name} uses ${ability.name} — ${ability.damage} dmg! Villain SLOWED!`;
      break;
    }
    case "drain": {
      villain.hp = clamp(villain.hp - ability.damage, 0, villain.maxHp);
      hero.hp = clamp(hero.hp + ability.heal, 0, hero.maxHp);
      logText = `${hero.name} uses ${ability.name} — ${ability.damage} dmg drained! +${ability.heal} HP!`;
      break;
    }
    case "bind": {
      villain.hp = clamp(villain.hp - ability.damage, 0, villain.maxHp);
      logText = `${hero.name} uses ${ability.name} — ${ability.damage} dmg! Reality warp prevented!`;
      // bind effect tracked via log; prevents next warp
      break;
    }
    case "dodge": {
      statusEffects = { ...statusEffects, heroDodging: 2 };
      logText = `${hero.name} enters ${ability.name} — Will dodge 2 attacks!`;
      break;
    }
  }

  heroes[heroIndex] = hero;
  villain.phase = getVillainPhase(villain.hp);
  s = {
    ...s,
    heroes,
    villain,
    statusEffects,
    shakingVillain: ability.damage > 0,
    phase: "villain_turn",
  };
  s = addLog(s, logText, "hero");

  // Check win
  if (villain.hp <= 0) {
    s = { ...s, gameStatus: "won" };
    s = addLog(s, "THE ARCHITECT FALLS! Reality is restored!", "reality");
  }

  return s;
}

// ─── Villain Turn ─────────────────────────────────────────────────────────────

function resolveVillainTurn(state: GameState): GameState {
  let s = { ...state };
  const villain = { ...s.villain };
  let heroes = s.heroes.map((h) => ({ ...h }));
  let statusEffects = { ...s.statusEffects };

  // Tick cooldowns
  heroes = tickCooldowns(heroes);

  // Check stun
  if (villain.stunned) {
    villain.stunned = false;
    statusEffects = { ...statusEffects, villainStunned: false };
    s = {
      ...s,
      heroes,
      villain,
      statusEffects,
      turn: s.turn + 1,
      phase: "hero_turn",
      shakingVillain: false,
      shakingHeroIndex: null,
    };
    s = addLog(s, "The Architect is stunned — loses their action!", "status");
    // ensure active hero is alive
    const aliveIdx = getFirstLivingHeroIndex(heroes);
    if (s.activeHeroIndex !== -1 && heroes[s.activeHeroIndex].hp <= 0) {
      s = { ...s, activeHeroIndex: aliveIdx === -1 ? 0 : aliveIdx };
    }
    return s;
  }

  // Find active target (lowest HP living hero, or active hero)
  const livingIndices = heroes
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => h.hp > 0);
  if (livingIndices.length === 0) {
    s = {
      ...s,
      heroes,
      villain,
      statusEffects,
      gameStatus: "lost",
      turn: s.turn + 1,
      phase: "hero_turn",
    };
    return s;
  }

  // Pick hero with lowest HP
  const targetEntry = livingIndices.reduce((min, cur) =>
    cur.h.hp < min.h.hp ? cur : min,
  );
  const targetIndex = targetEntry.i;
  const target = { ...heroes[targetIndex] };

  // Calculate damage
  const phase = villain.phase;
  let baseDmg: number;
  if (phase === 1)
    baseDmg = 35 + Math.floor(Math.random() * 16); // 35-50
  else if (phase === 2)
    baseDmg = 50 + Math.floor(Math.random() * 21); // 50-70
  else baseDmg = 70 + Math.floor(Math.random() * 21); // 70-90

  if (villain.slowed || statusEffects.villainSlowed) {
    baseDmg = Math.floor(baseDmg * 0.5);
    villain.slowed = false;
    statusEffects = { ...statusEffects, villainSlowed: false };
  }

  // Check dodge
  if (statusEffects.heroDodging > 0) {
    statusEffects = {
      ...statusEffects,
      heroDodging: statusEffects.heroDodging - 1,
    };
    s = addLog(s, `The Architect strikes ${target.name}... DODGED!`, "villain");
    s = { ...s, heroes, villain, statusEffects };
  } else if (statusEffects.heroShielded) {
    // Shield absorbs attack
    statusEffects = { ...statusEffects, heroShielded: false };
    s = addLog(
      s,
      `The Architect strikes ${target.name} — SHIELD ABSORBS IT!`,
      "villain",
    );
    s = { ...s, heroes, villain, statusEffects, shakingHeroIndex: targetIndex };
  } else {
    // Deal damage
    target.hp = clamp(target.hp - baseDmg, 0, target.maxHp);
    heroes[targetIndex] = target;
    s = addLog(
      s,
      `The Architect strikes ${target.name} for ${baseDmg} damage!`,
      "villain",
    );
    s = { ...s, shakingHeroIndex: targetIndex };
  }

  // Reality warp (every 3 turns, phase 2+)
  const doWarp = s.turn % 3 === 0 && villain.phase >= 2;
  let warpFlash = false;
  let warpMessage = "";

  if (doWarp) {
    // Check if bound (spirit_bind used recently - we check by seeing if there's a bind in the log)
    const recentBind = s.combatLog
      .slice(0, 3)
      .some((l) => l.text.includes("warp prevented"));
    if (!recentBind) {
      const warps = [
        "⚠ REALITY WARPS! Gravity inverts — heroes struggle to stand!",
        "⚠ REALITY WARPS! Mirror world — left is right, right is left!",
        "⚠ REALITY WARPS! Time fractures — the battlefield stutters!",
        ...(villain.phase === 3
          ? [
              "⚠ CHAOS UNLEASHED! Ability buttons scramble!",
              "⚠ RULES REWRITTEN! Power levels shift!",
            ]
          : []),
      ];
      warpMessage = warps[Math.floor(Math.random() * warps.length)];
      warpFlash = true;
      s = addLog(s, warpMessage, "reality");
    }
  }

  villain.phase = getVillainPhase(villain.hp);

  // Determine active hero for next turn (ensure alive)
  let nextActive = s.activeHeroIndex;
  if (heroes[nextActive]?.hp <= 0) {
    const aliveIdx = getFirstLivingHeroIndex(heroes);
    nextActive = aliveIdx === -1 ? 0 : aliveIdx;
  }

  s = {
    ...s,
    heroes,
    villain,
    statusEffects,
    warpFlash,
    warpMessage: warpMessage || s.warpMessage,
    turn: s.turn + 1,
    phase: "hero_turn",
    activeHeroIndex: nextActive,
    shakingVillain: false,
  };

  // Check all dead
  if (heroes.every((h) => h.hp <= 0)) {
    s = { ...s, gameStatus: "lost" };
    s = addLog(s, "All heroes have fallen. Darkness prevails...", "reality");
  }

  return s;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_HERO": {
      if (state.heroes[action.index]?.hp <= 0) return state;
      return { ...state, activeHeroIndex: action.index };
    }
    case "USE_ABILITY": {
      if (state.phase !== "hero_turn") return state;
      if (state.gameStatus !== "playing") return state;
      const hero = state.heroes[action.heroIndex];
      if (!hero || hero.hp <= 0) return state;
      const ability = hero.abilities.find((a) => a.id === action.abilityId);
      if (!ability || ability.cooldown > 0) return state;
      return applyHeroAbility(state, action.heroIndex, action.abilityId);
    }
    case "VILLAIN_TURN": {
      if (state.phase !== "villain_turn") return state;
      if (state.gameStatus !== "playing") return state;
      return resolveVillainTurn(state);
    }
    case "CLEAR_ANIMATIONS":
      return { ...state, shakingHeroIndex: null, shakingVillain: false };
    case "CLEAR_WARP_FLASH":
      return { ...state, warpFlash: false };
    default:
      return state;
  }
}

export function checkWin(state: GameState): boolean {
  return state.gameStatus === "won";
}

export function checkLose(state: GameState): boolean {
  return state.gameStatus === "lost";
}
