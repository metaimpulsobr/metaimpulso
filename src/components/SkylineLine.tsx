// Brasília's skyline as a single thin line (Alvorada, Museu Nacional, Catedral, Congresso).
const H = 230
const ALVORADA = Array.from({ length: 6 }, (_, i) => {
  const cx = 70 + i * 50
  return `M${cx - 25},190 C${cx - 9},195 ${cx - 3},210 ${cx},${H} C${cx + 3},210 ${cx + 9},195 ${cx + 25},190`
})
const CATEDRAL = Array.from({ length: 9 }, (_, i) => {
  const k = i - 4
  return `M${590 + k * 9},${H} Q${590 + k * 3},182 ${590 + k * 15},128`
})
const PATHS = [
  `M0,${H} L1200,${H}`,
  'M40,190 L350,190',
  ...ALVORADA,
  `M375,${H} A58,58 0 0 1 491,${H}`,
  `M470,190 Q514,198 520,${H}`,
  ...CATEDRAL,
  `M700,200 L1020,200 L1020,${H}`,
  `M700,200 L700,${H}`,
  'M722,184 C736,206 800,206 814,184',
  'M722,184 C740,177 796,177 814,184 C796,191 740,191 722,184',
  'M914,200 C920,174 978,174 984,200',
  'M846,200 L846,58 L857,58 L857,200',
  'M863,200 L863,58 L874,58 L874,200',
]

export default function SkylineLine({ className = '' }: { className?: string }) {
  return (
    <svg className={`skyline-line ${className}`} viewBox="0 50 1200 184" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {PATHS.map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" />)}
      </g>
    </svg>
  )
}
