import type { HeroId } from "../gameLogic";

interface HeroProps {
  type: "hero";
  heroId: HeroId;
  heroImage: string;
  heroColor: string;
  hp: number;
  maxHp: number;
  isShaking?: boolean;
}

interface VillainProps {
  type: "villain";
  hp: number;
  maxHp: number;
  isShaking?: boolean;
  isActing?: boolean;
}

type Props = HeroProps | VillainProps;

const VILLAIN_IMAGE = "/assets/generated/villain-architect.dim_400x500.png";

export default function CharacterSprite(props: Props) {
  if (props.type === "villain") {
    const { hp, isShaking, isActing } = props;
    const isDead = hp <= 0;
    let animClass = "anim-glow-villain anim-float-villain";
    if (isShaking) animClass = "anim-shake anim-damage";
    if (isActing) animClass = "anim-glow-villain";
    if (isDead) animClass = "";

    return (
      <div
        className={`relative w-20 h-28 ${animClass} ${
          isDead ? "opacity-20 grayscale" : ""
        } transition-all duration-300`}
      >
        <img
          src={VILLAIN_IMAGE}
          alt="The Architect"
          className="w-full h-full object-contain"
          draggable={false}
        />
        {isActing && !isDead && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: "ability-burst 0.6s ease-out forwards",
              background:
                "radial-gradient(circle, oklch(0.66 0.25 330 / 0.6) 0%, transparent 70%)",
            }}
          />
        )}
      </div>
    );
  }

  const { heroImage, heroId, hp, isShaking } = props;
  const isDead = hp <= 0;

  const glowAnimation =
    heroId === "space"
      ? "anim-glow-nova"
      : heroId === "time"
        ? "anim-glow-chronos"
        : "anim-glow-essence";

  let animClass = `${glowAnimation} anim-float`;
  if (isShaking) animClass = "anim-shake anim-damage";
  if (isDead) animClass = "";

  return (
    <div
      className={`relative w-14 h-16 ${animClass} ${
        isDead ? "opacity-20 grayscale" : ""
      } transition-all duration-300`}
    >
      <img
        src={heroImage}
        alt={heroId}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}
