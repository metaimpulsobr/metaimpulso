/**
 * Plano Piloto line system for the sections below the hero.
 * Same vocabulary as PlanoPilotoLines (the Eixo Monumental and the curved "wings" of Brasília as
 * thin lines, a few points of brand color), arranged differently per section so the page has rhythm.
 * Each drawing sits in a corner or margin of its section; decorative only.
 */
export type SectionLinesVariant =
  | 'arc-tl' // wing arcs out of the top-left corner
  | 'arc-tr' // same, mirrored to the top-right
  | 'axis-r' // tilted double axis down the right margin, with a ring
  | 'axis-l' // same, mirrored to the left margin
  | 'wings-top' // wide shallow wings over the section head, ring at the apex
  | 'wings-bottom' // same, flipped along the bottom edge
  | 'cross-tr' // axis crossing a wing in the top-right corner
  | 'orbit-l' // partial concentric circles from the left margin
  | 'steps' // dotted wing running behind a row of cards
  | 'horizon' // one faint wing along the top of the footer

function Arc() {
  return (
    <svg viewBox="0 0 700 520" preserveAspectRatio="xMinYMin meet">
      <path className="l1" d="M-20 460 Q200 80 700 -20" />
      <path className="l2" d="M-20 500 Q220 120 700 20" />
      <path className="l3" d="M-20 540 Q240 160 700 60" />
      <circle className="dot-c" cx="270" cy="150" r="5" />
      <path className="bar-k" d="M40 40 h90" />
      <path className="bar-c" d="M40 56 h50" />
    </svg>
  )
}

function Axis() {
  return (
    <svg viewBox="0 0 360 1000" preserveAspectRatio="xMaxYMid slice">
      <path className="l1" d="M300 -20 L220 1020" />
      <path className="l2" d="M336 -20 L256 1020" />
      <circle className="dot-v" cx="275" cy="300" r="7" />
      <circle className="ring-v" cx="275" cy="300" r="20" />
      <circle className="dot-c" cx="276" cy="760" r="5" />
    </svg>
  )
}

function Wings() {
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMin slice">
      <path className="l1" d="M-40 260 Q720 -220 1480 260" />
      <path className="l2" d="M-40 296 Q720 -184 1480 296" />
      <path className="l3" d="M-40 332 Q720 -148 1480 332" />
      <circle className="dot-v" cx="720" cy="20" r="5" />
      <circle className="ring-v" cx="720" cy="20" r="15" />
      <circle className="dot-c" cx="180" cy="168" r="4" />
      <circle className="dot-k" cx="1262" cy="172" r="4" />
    </svg>
  )
}

function Cross() {
  return (
    <svg viewBox="0 0 640 560" preserveAspectRatio="xMaxYMin meet">
      <path className="l1" d="M120 -20 Q360 300 680 360" />
      <path className="l2" d="M120 16 Q360 336 680 396" />
      <path className="l1" d="M560 -20 L380 600" />
      <path className="l2" d="M600 -20 L420 600" />
      <circle className="dot-c" cx="271" cy="149" r="5" />
      <circle className="dot-k" cx="531" cy="80" r="4" />
    </svg>
  )
}

function Orbit() {
  return (
    <svg viewBox="0 0 520 700" preserveAspectRatio="xMinYMid meet">
      <circle className="l1" cx="-60" cy="350" r="260" />
      <circle className="l2" cx="-60" cy="350" r="300" />
      <circle className="l3" cx="-60" cy="350" r="340" />
      <circle className="dot-v" cx="165" cy="220" r="6" />
      <circle className="ring-v" cx="165" cy="220" r="17" />
      <circle className="dot-c" cx="170" cy="543" r="4" />
    </svg>
  )
}

function Steps() {
  return (
    <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
      <path className="l1 dashed" d="M-20 280 Q720 60 1460 280" />
      <path className="l3" d="M-20 316 Q720 96 1460 316" />
      <circle className="dot-c" cx="96" cy="258" r="4" />
      <circle className="dot-v" cx="1344" cy="258" r="5" />
    </svg>
  )
}

function Horizon() {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="xMidYMin slice">
      <path className="l1" d="M-40 150 Q720 -110 1480 150" />
      <path className="l3" d="M-40 176 Q720 -84 1480 176" />
      <circle className="dot-c" cx="720" cy="20" r="4" />
    </svg>
  )
}

const DRAWINGS: Record<SectionLinesVariant, () => React.ReactElement> = {
  'arc-tl': Arc,
  'arc-tr': Arc,
  'axis-r': Axis,
  'axis-l': Axis,
  'wings-top': Wings,
  'wings-bottom': Wings,
  'cross-tr': Cross,
  'orbit-l': Orbit,
  steps: Steps,
  horizon: Horizon,
}

export default function SectionLines({ variant }: { variant: SectionLinesVariant }) {
  const Drawing = DRAWINGS[variant]
  return (
    <div className={`sl sl-${variant}`} aria-hidden="true">
      <Drawing />
    </div>
  )
}
