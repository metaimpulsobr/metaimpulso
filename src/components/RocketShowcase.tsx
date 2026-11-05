import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'

// Deterministic pseudo-random values: identical on the server (prerender) and in the browser,
// so hydration matches and render stays pure.
const seeded = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453
  return v - Math.floor(v)
}

// Floating particles representing rocket exhaust sparks
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  delay: i * 0.08,
  x: (seeded(i + 1) - 0.5) * 60, // spread
  size: seeded(i + 101) * 5 + 2,
  duration: seeded(i + 201) * 1.0 + 0.6,
  color: seeded(i + 301) > 0.55 ? '#00F0FF' : '#D649FB',
}))

export default function RocketShowcase() {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Motion values for 3D tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left - width / 2
    const mouseY = event.clientY - rect.top - height / 2
    x.set(mouseX / width)
    y.set(mouseY / height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }


  return (
    <div 
      ref={containerRef}
      className="rocket-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '540px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        perspective: '1200px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🔮 Glow nebula behind the rocket */}
      <div 
        className="rocket-glow-nebula"
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          background: isHovered 
            ? 'radial-gradient(circle, rgba(255, 159, 67, 0.25) 0%, rgba(214, 73, 251, 0.15) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(123, 46, 255, 0.18) 0%, rgba(0, 240, 255, 0.08) 50%, transparent 70%)',
          filter: 'blur(45px)',
          borderRadius: '50%',
          zIndex: 1,
          transition: 'all 0.6s ease'
        }}
      />

      {/* 🌐 Interactive Telemetry Rings & HUD Launchpad with orbiting nodes */}
      <svg 
        style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        viewBox="0 0 500 500"
      >
        {/* Orbit Ring 1 (Dotted) */}
        <motion.circle 
          cx="250" cy="240" r="180" 
          stroke="rgba(15, 23, 42, 0.06)" 
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="8 16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        />
        {/* Orbiting Node 1 on Outer Ring */}
        <motion.circle
          cx="430"
          cy="240"
          r="4.5"
          fill="#00F0FF"
          style={{ filter: 'drop-shadow(0 0 6px #00F0FF)' }}
          animate={{
            cx: [250 + 180, 250, 250 - 180, 250, 250 + 180],
            cy: [240, 240 - 180, 240, 240 + 180, 240],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear"
          }}
        />

        {/* Orbit Ring 2 (Dashed) */}
        <motion.circle 
          cx="250" cy="240" r="140" 
          stroke="rgba(214, 73, 251, 0.08)" 
          strokeWidth="1.2" 
          fill="none" 
          strokeDasharray="30 15"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
        {/* Orbiting Node 2 on Inner Ring */}
        <motion.circle
          cx="390"
          cy="240"
          r="3.5"
          fill="#D649FB"
          style={{ filter: 'drop-shadow(0 0 6px #D649FB)' }}
          animate={{
            cx: [250 + 140, 250, 250 - 140, 250, 250 + 140],
            cy: [240, 240 + 140, 240, 240 - 140, 240],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear"
          }}
        />

        {/* Launchpad Target crosshairs */}
        <line x1="250" y1="30" x2="250" y2="450" stroke="rgba(15, 23, 42, 0.02)" strokeWidth="1" strokeDasharray="5 5" />
        <line x1="50" y1="240" x2="450" y2="240" stroke="rgba(15, 23, 42, 0.02)" strokeWidth="1" strokeDasharray="5 5" />
      </svg>

      {/* 🚀 Main Rocket Assembly with 3D Parallax Tilt */}
      <motion.div
        style={{
          position: 'relative',
          width: '300px',
          height: '450px',
          zIndex: 5,
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY
        }}
      >
        {/* 3D Elliptical Orbital Flight Loop */}
        <motion.div
          animate={{ 
            x: isHovered ? [0, 28, 0, -28, 0] : [0, 16, 0, -16, 0],
            y: isHovered ? [-16, 0, 16, 0, -16] : [-8, 0, 8, 0, -8],
            rotate: isHovered ? [-4, 4, 3, -3, -4] : [-1.5, 1.5, 1, -1, -1.5]
          }}
          transition={{ 
            repeat: Infinity,
            duration: isHovered ? 4 : 7.5,
            ease: "linear"
          }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Rocket Body SVG */}
          <svg 
            viewBox="0 0 200 320" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
              width: '100%', 
              height: '100%', 
              filter: 'drop-shadow(0 15px 30px rgba(15, 23, 42, 0.15))' 
            }}
          >
            {/* 1. Main Thruster Plume (Center Fire) */}
            <g>
              {/* Outer flame */}
              <motion.path 
                d="M100 230 C72 255 82 295 100 315 C118 295 128 255 100 230 Z" 
                fill="url(#outerFlameGradient)"
                animate={{ 
                  scaleY: isHovered ? [1.1, 1.35, 1.1] : [1, 1.15, 1],
                  scaleX: isHovered ? [1, 1.15, 1] : [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 0.45, ease: "easeInOut" }}
              />
              {/* Inner flame */}
              <motion.path 
                d="M100 230 C82 245 88 275 100 295 C112 275 118 245 100 230 Z" 
                fill="url(#innerFlameGradient)"
                animate={{ 
                  scaleY: isHovered ? [1, 1.4, 0.9] : [1, 1.2, 1],
                  scaleX: isHovered ? [0.9, 1.15, 0.9] : [1, 1.05, 1],
                }}
                transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
              />
            </g>

            {/* 2. Side Booster Flames (Ignite on Hover!) */}
            <g>
              {/* Left booster flame */}
              <motion.path
                d="M64 225 C54 238 58 260 64 270 C70 260 74 238 64 225 Z"
                fill="url(#boosterFlameGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? [1, 1.25, 0.95] : 0,
                  opacity: isHovered ? [0.8, 1, 0.8] : 0 
                }}
                transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
              />
              {/* Right booster flame */}
              <motion.path
                d="M136 225 C126 238 130 260 136 270 C142 260 146 238 136 225 Z"
                fill="url(#boosterFlameGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? [1, 1.25, 0.95] : 0,
                  opacity: isHovered ? [0.8, 1, 0.8] : 0 
                }}
                transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
              />
            </g>

            {/* 3. Lateral Fins (Sunset Orange/Magenta Gradient) */}
            <path d="M50 200 C25 180 15 225 32 245 C42 225 50 212 50 200 Z" fill="url(#finGradient)" stroke="url(#borderGradient)" strokeWidth="0.5" />
            <path d="M150 200 C175 180 185 225 168 245 C158 225 150 212 150 200 Z" fill="url(#finGradient)" stroke="url(#borderGradient)" strokeWidth="0.5" />
            
            {/* 4. Booster Launch Tubes */}
            <rect x="58" y="190" width="12" height="38" rx="6" fill="url(#boosterTubeGradient)" stroke="url(#borderGradient)" strokeWidth="1" />
            <rect x="130" y="190" width="12" height="38" rx="6" fill="url(#boosterTubeGradient)" stroke="url(#borderGradient)" strokeWidth="1" />

            {/* 5. Main Rocket Capsule Body (Premium Glossy White/Silver) */}
            <path 
              d="M100 30 C125 75 140 120 140 190 C140 215 130 230 100 230 C70 230 60 215 60 190 C60 120 75 75 100 30 Z" 
              fill="url(#capsuleGradient)" 
              stroke="url(#borderGradient)" 
              strokeWidth="1.5" 
            />

            {/* 6. Curved Cybernetic Panel Lines & Rivets */}
            {/* Horizontal panel lines */}
            <path d="M62 145 C80 152 120 152 138 145" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1.5" />
            <path d="M60 190 C80 198 120 198 140 190" stroke="rgba(15, 23, 42, 0.08)" strokeWidth="1.5" />
            
            {/* Vertical midline panel division */}
            <path d="M100 132 V230" stroke="rgba(15, 23, 42, 0.06)" strokeWidth="1" />

            {/* Nose Cone (Bright Gradient Trim) */}
            <path 
              d="M100 30 C112 50 120 70 124 90 H76 C80 70 88 50 100 30 Z" 
              fill="url(#noseGradient)" 
            />

            {/* 7. Glass Window 1 (Main Cabin) */}
            <circle 
              cx="100" cy="110" r="22" 
              fill="url(#windowGradient)" 
              stroke="url(#borderGradient)" 
              strokeWidth="2" 
            />
            {/* Glare */}
            <path 
              d="M86 100 C92 92 108 92 114 100" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              opacity="0.6" 
            />

            {/* 8. Glass Window 2 (Lower Telemetry Screen) */}
            <circle 
              cx="100" cy="168" r="10" 
              fill="url(#windowGradientSmall)" 
              stroke="url(#borderGradient)" 
              strokeWidth="1" 
            />
            <path 
              d="M93 164 C96 160 104 160 107 164" 
              stroke="white" 
              strokeWidth="1" 
              strokeLinecap="round" 
              opacity="0.5" 
            />

            {/* 9. Interactive LED Telemetry Lights */}
            <circle cx="100" cy="195" r="3.5" fill="#00F0FF" className="pulse-led" style={{ filter: 'drop-shadow(0 0 4px #00F0FF)' }} />
            <circle cx="100" cy="212" r="3.5" fill="#D649FB" className="pulse-led" style={{ filter: 'drop-shadow(0 0 4px #D649FB)' }} />

            {/* 🌐 Gradients & Custom Colors Definitions */}
            <defs>
              {/* Premium White/Silver Glass Capsule Body */}
              <linearGradient id="capsuleGradient" x1="60" y1="130" x2="140" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F8FAFC" />
                <stop offset="70%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              {/* Nose Cone Sunset Gradient */}
              <linearGradient id="noseGradient" x1="100" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9F43" />
                <stop offset="100%" stopColor="#D649FB" />
              </linearGradient>

              {/* Side Boosters Metal Gradient */}
              <linearGradient id="boosterTubeGradient" x1="58" y1="190" x2="70" y2="190" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Fin Gradient */}
              <linearGradient id="finGradient" x1="100" y1="180" x2="100" y2="245" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D649FB" />
                <stop offset="100%" stopColor="#7B2EFF" />
              </linearGradient>

              {/* Border Glow Gradient */}
              <linearGradient id="borderGradient" x1="60" y1="130" x2="140" y2="130" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9F43" />
                <stop offset="50%" stopColor="#D649FB" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>

              {/* Cabin Glass Window Gradient */}
              <radialGradient id="windowGradient" cx="100" cy="110" r="22" fx="100" fy="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0F172A" />
              </radialGradient>

              {/* Small Telemetry Screen Window Gradient */}
              <radialGradient id="windowGradientSmall" cx="100" cy="168" r="10" fx="100" fy="168" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D649FB" />
                <stop offset="70%" stopColor="#7B2EFF" />
                <stop offset="100%" stopColor="#020308" />
              </radialGradient>

              {/* Main Flame Sunset Plume */}
              <linearGradient id="outerFlameGradient" x1="100" y1="230" x2="100" y2="315" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FF9F43" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#FF5252" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7B2EFF" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="innerFlameGradient" x1="100" y1="230" x2="100" y2="295" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFEAA7" />
                <stop offset="50%" stopColor="#FF9F43" />
                <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
              </linearGradient>

              {/* Booster Lateral Flame Gradient */}
              <linearGradient id="boosterFlameGradient" x1="100" y1="225" x2="100" y2="270" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFEAA7" />
                <stop offset="60%" stopColor="#FF9F43" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF5252" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* 10. Thrust Sparkles / Particles Exhaust */}
          <div style={{ position: 'absolute', bottom: '55px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: 0, scale: 1, opacity: 0.8 }}
                animate={{ 
                  y: isHovered ? [0, 130] : [0, 90], 
                  scale: [1.2, 0.15], 
                  opacity: [0.9, 0] 
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: p.color,
                  borderRadius: '50%',
                  boxShadow: '0 0 10px currentColor',
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
