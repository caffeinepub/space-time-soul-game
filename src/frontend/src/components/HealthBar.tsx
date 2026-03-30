interface Props {
  current: number;
  max: number;
  type: "hp" | "villain";
  small?: boolean;
}

export default function HealthBar({ current, max, type, small }: Props) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));

  let barStyle: React.CSSProperties;

  if (type === "villain") {
    barStyle = {
      background:
        "linear-gradient(90deg, oklch(0.45 0.22 25), oklch(0.65 0.25 15))",
      boxShadow: "0 0 8px oklch(0.58 0.18 25 / 0.6)",
    };
  } else {
    // HP bar: green > 50%, yellow 25-50%, red < 25%
    if (pct > 50) {
      barStyle = {
        background:
          "linear-gradient(90deg, oklch(0.55 0.18 145), oklch(0.7 0.15 150))",
        boxShadow: "0 0 6px oklch(0.6 0.18 145 / 0.5)",
      };
    } else if (pct > 25) {
      barStyle = {
        background:
          "linear-gradient(90deg, oklch(0.65 0.18 65), oklch(0.75 0.2 75))",
        boxShadow: "0 0 6px oklch(0.65 0.18 65 / 0.5)",
      };
    } else {
      barStyle = {
        background:
          "linear-gradient(90deg, oklch(0.45 0.22 25), oklch(0.6 0.25 20))",
        boxShadow: "0 0 6px oklch(0.5 0.22 25 / 0.6)",
      };
    }
  }

  return (
    <div
      className={`w-full ${small ? "h-1.5" : "h-2.5"} bg-white/10 rounded-full overflow-hidden`}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, ...barStyle }}
      />
    </div>
  );
}
