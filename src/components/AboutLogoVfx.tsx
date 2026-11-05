import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function AboutLogoVfx() {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values for 3D tilt on hover
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Spring settings for smooth rotation (tilts up to 15 degrees)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })
  
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left - width / 2
    const mouseY = event.clientY - rect.top - height / 2
    
    // Normalize values between -0.5 and 0.5
    x.set(mouseX / width)
    y.set(mouseY / height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  const handleMouseEnter = () => {
    setHovered(true)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        position: 'relative',
        width: '280px',
        height: '280px',
        margin: '0 auto 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        cursor: 'pointer'
      }}
    >
      {/* 🚀 3D Animated Card Contents */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY
        }}
      >
        {/* 1. Pulsing Glow Background Nebula */}
        <motion.div
          animate={{
            scale: hovered ? [1, 1.15, 1] : [1, 1.08, 1],
            opacity: hovered ? 0.65 : 0.4
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '190px',
            height: '190px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(214, 73, 251, 0.4) 0%, rgba(255, 159, 67, 0.2) 50%, transparent 100%)',
            filter: 'blur(30px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* 2. Rotating HUD Telemetry Rings */}
        {/* Ring 1 (Outer - Slow Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(214, 73, 251, 0.2)',
            borderTopColor: 'rgba(0, 240, 255, 0.45)',
            borderBottomColor: 'rgba(214, 73, 251, 0.45)',
            zIndex: 2,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)'
          }}
        />

        {/* Ring 2 (Middle - Counter Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '1px solid rgba(15, 23, 42, 0.04)',
            borderLeftColor: 'rgba(0, 240, 255, 0.35)',
            borderRightColor: 'rgba(214, 73, 251, 0.35)',
            zIndex: 3,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)'
          }}
        />

        {/* Ring 3 (Inner - Fast Dotted Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '2px dotted rgba(15, 23, 42, 0.06)',
            zIndex: 4,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(30px)'
          }}
        />

        {/* 3. Floating Meta Impulso Logo */}
        <motion.div
          animate={{
            y: hovered ? [-3, 3, -3] : [-5, 5, -5]
          }}
          transition={{
            duration: hovered ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'relative',
            width: '135px',
            height: '135px',
            zIndex: 5,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(40px)',
            filter: hovered 
              ? 'drop-shadow(0 8px 16px rgba(214, 73, 251, 0.25)) drop-shadow(0 4px 8px rgba(0, 240, 255, 0.2))' 
              : 'drop-shadow(0 4px 8px rgba(15, 23, 42, 0.1))'
          }}
        >
          <img 
            src="/logo-320.png" 
            alt="Logo Meta Impulso" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }} 
          />

          {/* 4. Scanner glow sweeping light line */}
          <motion.div
            animate={{
              top: ['-10%', '110%']
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.7), rgba(214, 73, 251, 0.7), transparent)',
              boxShadow: '0 0 6px rgba(0, 240, 255, 0.4), 0 0 12px rgba(214, 73, 251, 0.4)',
              zIndex: 6,
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* 5. Telemetry particles */}
        <div 
          style={{
            position: 'absolute',
            top: '25%',
            left: '18%',
            fontSize: '7px',
            color: 'rgba(15, 23, 42, 0.3)',
            fontFamily: 'var(--font-mono)',
            zIndex: 4,
            transform: 'translateZ(25px)'
          }}
        >
          [LIFT_TRACK]
        </div>

        <div 
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '15%',
            fontSize: '7px',
            color: 'rgba(15, 23, 42, 0.3)',
            fontFamily: 'var(--font-mono)',
            zIndex: 4,
            transform: 'translateZ(25px)'
          }}
        >
          [SYS_TRQ_61]
        </div>
      </motion.div>
    </div>
  )
}
