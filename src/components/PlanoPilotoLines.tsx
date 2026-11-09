/**
 * Background of the page tops: the Plano Piloto of Brasília (the Eixo Monumental crossing the
 * curved "wings") reduced to thin abstract lines, with a few points of brand color.
 * Pure SVG, decorative, no image download.
 */
export default function PlanoPilotoLines({ className = '' }: { className?: string }) {
  return (
    <svg className={`pp-lines ${className}`} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g fill="none" strokeLinecap="round">
        <path d="M520 560 Q1040 300 1500 520" stroke="#DCD8EA" strokeWidth="1.5" />
        <path d="M520 600 Q1040 340 1500 560" stroke="#E8E6F0" strokeWidth="1" />
        <path d="M520 640 Q1040 380 1500 600" stroke="#F0EFF5" strokeWidth="1" />
        <line x1="1180" y1="-20" x2="900" y2="920" stroke="#DCD8EA" strokeWidth="1.5" />
        <line x1="1220" y1="-20" x2="940" y2="920" stroke="#E8E6F0" strokeWidth="1" />
      </g>
      <circle className="pp-dot" cx="1362" cy="470" r="7" fill="#725BA7" />
      <circle className="pp-dot" cx="1362" cy="470" r="20" fill="none" stroke="#725BA7" strokeWidth="1.2" />
      <circle className="pp-dot" cx="1112" cy="210" r="5" fill="#15141A" />
      <circle cx="930" cy="820" r="5" fill="#6BCDE7" />
    </svg>
  )
}
