import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RocketPreloaderProps {
  onComplete: () => void
}

export default function RocketPreloader({ onComplete }: RocketPreloaderProps) {
  const [countdown, setCountdown] = useState(3)
  const [status, setStatus] = useState<'calibrating' | 'countdown' | 'launch'>('calibrating')

  const logs = [
    '✦ SISTEMA OPERACIONAL META_OS... OK',
    '✦ CONECTANDO PROPULSORES ESTELARES... OK',
    '✦ INICIANDO VETORES DE TRÁFEGO... OK',
    '✦ CALIBRANDO CRMs DE ATENDIMENTO... OK',
    '✦ VERIFICANDO INTEGRAÇÕES DE IA... OK',
    '✦ DIRECIONANDO ANTENAS DE SEO... OK',
    '✦ SISTEMAS EM PRONTIDÃO PARA LANÇAMENTO... OK'
  ]

  const [visibleLogs, setVisibleLogs] = useState<string[]>([])

  useEffect(() => {
    // Add logs one by one
    if (status === 'calibrating') {
      const logInterval = setInterval(() => {
        if (visibleLogs.length < logs.length) {
          setVisibleLogs((prev) => [...prev, logs[prev.length]])
        } else {
          clearInterval(logInterval)
          setTimeout(() => setStatus('countdown'), 600)
        }
      }, 350)
      return () => clearInterval(logInterval)
    }
  }, [visibleLogs, status])

  useEffect(() => {
    if (status === 'countdown') {
      const countdownInterval = setInterval(() => {
        if (countdown > 1) {
          setCountdown((prev) => prev - 1)
        } else {
          clearInterval(countdownInterval)
          setStatus('launch')
          setTimeout(() => {
            onComplete()
          }, 800) // Reveal website after liftoff blast
        }
      }, 800)
      return () => clearInterval(countdownInterval)
    }
  }, [status, countdown])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#020308',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)'
      }}
    >
      {/* Background Star Drift */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(123, 46, 255, 0.1) 0%, transparent 80%)',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '500px', padding: '2rem', textAlign: 'center' }}>
        {/* Cockpit radar pulse */}
        <AnimatePresence mode="wait">
          {status === 'calibrating' && (
            <motion.div
              key="calib"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Spinning circular radar indicator */}
              <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '2.5rem' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: 'var(--cyan-neon)',
                    borderBottomColor: 'var(--magenta-neon)'
                  }}
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    inset: '10px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(255, 255, 255, 0.15)',
                    borderLeftColor: 'var(--cyan-neon)'
                  }}
                />
              </div>

              {/* Console log list */}
              <div 
                style={{
                  textAlign: 'left',
                  width: '100%',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  fontSize: '0.75rem',
                  lineHeight: '1.8',
                  minHeight: '220px',
                  color: 'var(--text-tech)'
                }}
              >
                {visibleLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      color: i === logs.length - 1 ? 'var(--cyan-neon)' : 'inherit',
                      fontWeight: i === logs.length - 1 ? 'bold' : 'normal'
                    }}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {status === 'countdown' && (
            <motion.div
              key="count"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--magenta-neon)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Preparar Propulsão Principal
              </span>
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.8 }}
                style={{
                  fontSize: '7.5rem',
                  fontWeight: 950,
                  fontFamily: 'var(--font-heading)',
                  color: 'white',
                  textShadow: '0 0 40px rgba(0, 240, 255, 0.6)',
                  lineHeight: 1
                }}
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}

          {status === 'launch' && (
            <motion.div
              key="launch"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  textShadow: [
                    '0 0 30px var(--magenta-neon)',
                    '0 0 60px var(--cyan-neon)',
                    '0 0 30px var(--magenta-neon)'
                  ]
                }}
                transition={{ duration: 0.3, repeat: 3 }}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 950,
                  fontFamily: 'var(--font-heading)',
                  color: 'white',
                  letterSpacing: '0.1em'
                }}
              >
                DECOLAR!
              </motion.div>

              {/* Fire blast lines */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 80, 10] }}
                    transition={{ repeat: Infinity, duration: 0.15, delay: i * 0.03 }}
                    style={{
                      width: '6px',
                      background: 'linear-gradient(to bottom, #FFEAA7, #FF9F43, rgba(214,73,251,0))',
                      borderRadius: '3px'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen Blast Transition (Flashes / Slides away on launch) */}
      <AnimatePresence>
        {status === 'launch' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #FF9F43, #D649FB, #020308)',
              mixBlendMode: 'screen',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
