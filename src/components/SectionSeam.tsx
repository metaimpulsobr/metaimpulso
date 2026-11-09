/**
 * Geometry on the break between two sections: each seam is drawn across the boundary, half in the
 * section above and half in the one below, so the page reads as one continuous drawing.
 * Same vocabulary as the Plano Piloto lines (thin wings and axes, brand-color points) plus the
 * domes of Brasília: a half circle in the color of one section reaching into the next.
 * Rendered between two <section>s; decorative only.
 */
type SeamVariant =
  | 'dome-up' // half circle of the section below rising into the section above
  | 'dome-down' // half circle of the section above dropping into the section below
  | 'node' // vertical axis crossing the break, ring exactly on the line
  | 'bridge' // S-shaped wing leaving one section and landing in the next
  | 'wing' // shallow wing arcs crossing the break

interface SectionSeamProps {
  variant: SeamVariant
  /** Horizontal position of the drawing */
  pos?: 'l' | 'c' | 'r'
  /** Color of the dome: mist (tinted sections) or paper (white sections) */
  tone?: 'mist' | 'paper'
}

// All drawings share a 360 x 300 box with the break on y = 150.
function Dome({ tone }: { tone: 'mist' | 'paper' }) {
  return (
    <svg viewBox="0 0 360 300">
      <path className={`seam-fill-${tone}`} d="M90 150 A90 90 0 0 1 270 150 Z" />
      <path className="seam-edge" d="M90 150 A90 90 0 0 1 270 150" />
      <path className="l2" d="M58 150 A122 122 0 0 1 302 150" />
      <path className="l3" d="M26 150 A154 154 0 0 1 334 150" />
      <path className="l1" d="M180 150 V292" />
      <circle className="dot-c" cx="94" cy="64" r="4.5" />
      <circle className="dot-v" cx="180" cy="292" r="4" />
    </svg>
  )
}

function Node() {
  return (
    <svg viewBox="0 0 360 300">
      <path className="l3" d="M180 4 V40" />
      <path className="l1" d="M180 40 V260" />
      <path className="l3" d="M180 260 V296" />
      <path className="l2" d="M140 150 A40 40 0 0 1 220 150" />
      <circle className="ring-v" cx="180" cy="150" r="18" />
      <circle className="dot-v" cx="180" cy="150" r="6" />
      <circle className="dot-c" cx="180" cy="62" r="4" />
      <path className="bar-k" d="M196 238 h46" />
      <path className="bar-c" d="M196 250 h26" />
    </svg>
  )
}

function Bridge() {
  return (
    <svg viewBox="0 0 360 300">
      <path className="l1" d="M30 0 C30 150 330 150 330 300" />
      <path className="l3" d="M62 0 C62 132 362 132 362 300" />
      <circle className="ring-v" cx="180" cy="150" r="16" />
      <circle className="dot-v" cx="180" cy="150" r="5" />
      <circle className="dot-k" cx="30" cy="20" r="3.5" />
      <circle className="dot-c" cx="330" cy="282" r="4" />
    </svg>
  )
}

function Wing() {
  return (
    <svg viewBox="0 0 360 300">
      <path className="l1" d="M-10 250 Q180 30 370 120" />
      <path className="l2" d="M-10 280 Q180 60 370 150" />
      <path className="l3" d="M-10 310 Q180 90 370 180" />
      <circle className="dot-c" cx="106" cy="150" r="4.5" />
      <circle className="dot-k" cx="300" cy="114" r="3.5" />
    </svg>
  )
}

export default function SectionSeam({ variant, pos = 'l', tone = 'mist' }: SectionSeamProps) {
  return (
    <div className={`seam seam-${variant} seam-${pos}`} aria-hidden="true">
      {variant === 'dome-up' || variant === 'dome-down' ? <Dome tone={tone} /> : null}
      {variant === 'node' ? <Node /> : null}
      {variant === 'bridge' ? <Bridge /> : null}
      {variant === 'wing' ? <Wing /> : null}
    </div>
  )
}
