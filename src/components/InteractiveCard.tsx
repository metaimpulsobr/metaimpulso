import React, { useRef, useState } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'magenta' | 'cyan';
}

export default function InteractiveCard({ children, className = '', glowColor = 'magenta' }: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const glowColorMap = {
    magenta: {
      spotlight: 'rgba(214, 73, 251, 0.06)',
      border: 'rgba(214, 73, 251, 0.45)',
    },
    cyan: {
      spotlight: 'rgba(0, 240, 255, 0.05)',
      border: 'rgba(0, 240, 255, 0.45)',
    }
  };

  const selectedGlow = glowColorMap[glowColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      style={{ position: 'relative', overflow: 'hidden' }}
      className={`card-premium ${className}`}
    >
      {/* SPOTLIGHT EFFECT */}
      <div
        style={{
          position: 'absolute',
          inset: '-1px',
          pointerEvents: 'none',
          opacity: opacity,
          transition: 'opacity 0.4s ease',
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${selectedGlow.spotlight}, transparent 80%)`,
          zIndex: 1
        }}
      />
      
      {/* BORDER GLOW */}
      <div
        style={{
          position: 'absolute',
          inset: '-1px',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: opacity,
          transition: 'opacity 0.4s ease',
          background: `radial-gradient(110px circle at ${mousePos.x}px ${mousePos.y}px, ${selectedGlow.border}, transparent 80%)`,
          padding: '1.2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 2
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
