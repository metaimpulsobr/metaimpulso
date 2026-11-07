import { useId } from 'react'

// Brasília's modernist skyline as glowing line art: Palácio da Alvorada columns, Museu Nacional,
// Catedral and Congresso Nacional, mirrored in the reflecting pool. Public-space architecture may be
// freely drawn (Lei 9.610/98, art. 48).
const HORIZON = 230

// Alvorada: columns that touch the ground at a point and open up to the slab
const ALVORADA = Array.from({ length: 6 }, (_, i) => {
  const cx = 70 + i * 50
  return `M${cx - 25},190 C${cx - 9},195 ${cx - 3},210 ${cx},${HORIZON} C${cx + 3},210 ${cx + 9},195 ${cx + 25},190`
})

// Catedral: hyperboloid ribs, narrow at the waist and flaring into a crown
const CATEDRAL = Array.from({ length: 9 }, (_, i) => {
  const k = i - 4
  return `M${590 + k * 9},${HORIZON} Q${590 + k * 3},182 ${590 + k * 15},128`
})

const PATHS = [
  // horizon
  `M0,${HORIZON} L1200,${HORIZON}`,
  // Alvorada slab and floor
  'M40,190 L350,190',
  'M40,186 L350,186',
  ...ALVORADA,
  // Museu Nacional: dome and ramp
  `M375,${HORIZON} A58,58 0 0 1 491,${HORIZON}`,
  `M470,190 Q514,198 520,${HORIZON}`,
  // Catedral
  ...CATEDRAL,
  `M560,${HORIZON} Q590,224 620,${HORIZON}`,
  // Congresso: long platform, Câmara bowl, Senado dome, twin towers and bridge
  `M700,200 L1020,200 L1020,${HORIZON}`,
  `M700,200 L700,${HORIZON}`,
  'M722,184 C736,206 800,206 814,184',
  'M722,184 C740,177 796,177 814,184 C796,191 740,191 722,184',
  'M914,200 C920,174 978,174 984,200',
  'M846,200 L846,58 L857,58 L857,200',
  'M863,200 L863,58 L874,58 L874,200',
  'M857,92 L863,92 M857,98 L863,98',
]

export default function BrasiliaSkyline({ className = '', animate = true }: { className?: string; animate?: boolean }) {
  const id = useId().replace(/:/g, '')
  const stroke = `sky-stroke-${id}`
  const glow = `sky-glow-${id}`
  return (
    <svg
      className={`skyline ${animate ? 'skyline-draw' : ''} ${className}`}
      viewBox="0 40 1200 225"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={stroke} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B3529F" />
          <stop offset="45%" stopColor="#8F7BD0" />
          <stop offset="100%" stopColor="#6BCDE7" />
        </linearGradient>
        <filter id={glow} x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke={`url(#${stroke})`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glow})`}>
        {PATHS.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ animationDelay: `${(i % 12) * 0.08}s` }} />
        ))}
      </g>
      {/* Reflecting pool */}
      <g className="skyline-reflection" fill="none" stroke={`url(#${stroke})`} strokeWidth="1.2" transform={`translate(0 ${HORIZON * 2}) scale(1 -1)`}>
        {PATHS.slice(1).map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ animationDelay: `${(i % 12) * 0.08 + 0.4}s` }} />
        ))}
      </g>
    </svg>
  )
}
