import { cn } from "@/lib/utils";

/**
 * <WireframeGpu>
 *
 * A purely SVG, line-art rendering of a GPU module — used as the hero
 * artwork on instrument pages. Drawn in 0.5px hairlines on the accent
 * tone with a faint inner glow so the form reads at any size.
 */
export interface WireframeGpuProps extends React.SVGAttributes<SVGSVGElement> {
  /** Override the line tone. Defaults to the amber accent. */
  tone?: string;
}

export function WireframeGpu({
  tone = "var(--accent-amber)",
  className,
  ...rest
}: WireframeGpuProps) {
  return (
    <svg
      role="img"
      aria-label="GPU wireframe"
      viewBox="0 0 320 200"
      className={cn("h-full w-full", className)}
      {...rest}
    >
      <defs>
        <linearGradient id="gpu-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.18" />
          <stop offset="60%" stopColor={tone} stopOpacity="0.06" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="gpu-glow" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor={tone} stopOpacity="0.22" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Backplate glow */}
      <rect x="0" y="0" width="320" height="200" fill="url(#gpu-glow)" />

      {/* Outer chassis */}
      <g
        fill="none"
        stroke={tone}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Heat shroud — top + bottom plates */}
        <path d="M 28 50 L 292 50 L 296 56 L 296 144 L 292 150 L 28 150 L 24 144 L 24 56 Z" />
        <path d="M 28 50 L 28 150" />
        <path d="M 292 50 L 292 150" />

        {/* Inner board face */}
        <rect x="40" y="62" width="240" height="76" fill="url(#gpu-shade)" />

        {/* GPU die centre block */}
        <rect x="120" y="82" width="80" height="36" />
        <text x="160" y="105" fontFamily="var(--font-mono)" fontSize="6" fill={tone} textAnchor="middle" letterSpacing="0.2em" opacity="0.9">
          H100·SXM5
        </text>

        {/* HBM stacks */}
        <rect x="84" y="78" width="22" height="44" />
        <rect x="214" y="78" width="22" height="44" />
        <line x1="86" y1="86" x2="104" y2="86" />
        <line x1="86" y1="98" x2="104" y2="98" />
        <line x1="86" y1="110" x2="104" y2="110" />
        <line x1="216" y1="86" x2="234" y2="86" />
        <line x1="216" y1="98" x2="234" y2="98" />
        <line x1="216" y1="110" x2="234" y2="110" />

        {/* Heat-pipes */}
        <path d="M 40 70 L 50 62 L 270 62 L 280 70" />
        <path d="M 40 130 L 50 138 L 270 138 L 280 130" />

        {/* NVLink edge connectors */}
        <line x1="40" y1="68" x2="40" y2="132" />
        <line x1="34" y1="78" x2="34" y2="122" />
        <line x1="280" y1="68" x2="280" y2="132" />
        <line x1="286" y1="78" x2="286" y2="122" />

        {/* Mounting tabs */}
        <rect x="14" y="76" width="10" height="48" />
        <rect x="296" y="76" width="10" height="48" />
        <circle cx="19" cy="86" r="1.6" />
        <circle cx="19" cy="114" r="1.6" />
        <circle cx="301" cy="86" r="1.6" />
        <circle cx="301" cy="114" r="1.6" />

        {/* Coordinate ticks (mission-critical chrome) */}
        <g opacity="0.55" strokeWidth="0.4">
          <line x1="24" y1="44" x2="24" y2="48" />
          <line x1="160" y1="44" x2="160" y2="48" />
          <line x1="296" y1="44" x2="296" y2="48" />
          <line x1="24" y1="152" x2="24" y2="156" />
          <line x1="160" y1="152" x2="160" y2="156" />
          <line x1="296" y1="152" x2="296" y2="156" />
        </g>
        <g
          opacity="0.7"
          fontFamily="var(--font-mono)"
          fontSize="5"
          fill={tone}
          letterSpacing="0.2em"
        >
          <text x="24" y="40" textAnchor="start">A1</text>
          <text x="160" y="40" textAnchor="middle">B2</text>
          <text x="296" y="40" textAnchor="end">C3</text>
          <text x="24" y="166" textAnchor="start">700W · TDP</text>
          <text x="296" y="166" textAnchor="end">80GB · HBM3E</text>
        </g>
      </g>
    </svg>
  );
}
