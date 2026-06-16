import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0–10
  voteCount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreRing({ score, voteCount, size = "md", className }: ScoreRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = score / 10;
  const offset = circumference * (1 - pct);

  const sizeMap = {
    sm: { svg: 60, r: 22, stroke: 3, textScore: "text-sm", textVotes: "text-[9px]" },
    md: { svg: 96, r: 36, stroke: 4, textScore: "text-xl", textVotes: "text-[10px]" },
    lg: { svg: 128, r: 48, stroke: 5, textScore: "text-3xl", textVotes: "text-xs" },
  };

  const s = sizeMap[size];
  const c = 2 * Math.PI * s.r;
  const o = c * (1 - pct);
  const cx = s.svg / 2;

  const scoreColor =
    score >= 8 ? "oklch(0.78 0.18 140)" :
    score >= 6 ? "oklch(0.78 0.12 80)" :
    score >= 4 ? "oklch(0.75 0.14 50)" :
    "oklch(0.60 0.18 25)";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg width={s.svg} height={s.svg} viewBox={`0 0 ${s.svg} ${s.svg}`} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={s.r}
          fill="none"
          stroke="oklch(0.28 0.02 70)"
          strokeWidth={s.stroke}
        />
        {/* Fill */}
        <circle
          cx={cx}
          cy={cx}
          r={s.r}
          fill="none"
          stroke={scoreColor}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={score === 0 ? c : o}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.23,1,0.32,1)" }}
        />
      </svg>
      {/* Text overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: s.svg, height: s.svg }}
      >
        <span
          className={cn("font-bold leading-none", s.textScore)}
          style={{ color: scoreColor, fontFamily: "'Playfair Display', serif" }}
        >
          {score === 0 ? "—" : score.toFixed(1)}
        </span>
        <span className={cn("text-muted-foreground leading-none mt-0.5", s.textVotes)}>
          {voteCount === 0 ? "no votes" : `${voteCount} vote${voteCount !== 1 ? "s" : ""}`}
        </span>
      </div>
    </div>
  );
}

// Inline version (no absolute positioning needed)
export function ScoreRingInline({ score, voteCount, size = "md", className }: ScoreRingProps) {
  const sizeMap = {
    sm: { svg: 60, r: 22, stroke: 3, textScore: "text-sm", textVotes: "text-[9px]" },
    md: { svg: 96, r: 36, stroke: 4, textScore: "text-xl", textVotes: "text-[10px]" },
    lg: { svg: 128, r: 48, stroke: 5, textScore: "text-3xl", textVotes: "text-xs" },
  };

  const s = sizeMap[size];
  const c = 2 * Math.PI * s.r;
  const pct = score / 10;
  const o = c * (1 - pct);
  const cx = s.svg / 2;

  const scoreColor =
    score >= 8 ? "oklch(0.78 0.18 140)" :
    score >= 6 ? "oklch(0.78 0.12 80)" :
    score >= 4 ? "oklch(0.75 0.14 50)" :
    "oklch(0.60 0.18 25)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={s.svg} height={s.svg} viewBox={`0 0 ${s.svg} ${s.svg}`} className="rotate-[-90deg]">
        <circle cx={cx} cy={cx} r={s.r} fill="none" stroke="oklch(0.28 0.02 70)" strokeWidth={s.stroke} />
        <circle
          cx={cx} cy={cx} r={s.r} fill="none"
          stroke={scoreColor} strokeWidth={s.stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={score === 0 ? c : o}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.23,1,0.32,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span
          className={cn("font-bold leading-none", s.textScore)}
          style={{ color: scoreColor, fontFamily: "'Playfair Display', serif" }}
        >
          {score === 0 ? "—" : score.toFixed(1)}
        </span>
        <span className={cn("text-muted-foreground leading-none mt-0.5", s.textVotes)}>
          {voteCount === 0 ? "no votes" : `${voteCount}`}
        </span>
      </div>
    </div>
  );
}
