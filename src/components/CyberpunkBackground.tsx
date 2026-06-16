import React, { useRef, useEffect } from 'react';

const CyberpunkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let scrollY = window.scrollY;
    let offsetY = 0;
    let hudAngle = 0;
    let sonarRadius = 15;

    // Perspective floor boundary (where the grid starts horizontally)
    let horizonY = height * 0.4; 

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      horizonY = height * 0.4;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const animate = () => {
      // Clear with very dark slate color to preserve trails slightly
      ctx.fillStyle = 'rgba(2, 3, 8, 0.25)'; 
      ctx.fillRect(0, 0, width, height);

      // --- 1. HUD Telemetry Graphics (Background Circles) ---
      hudAngle += 0.0025;

      // Radar Indicator 1 (Top-Right)
      ctx.save();
      ctx.translate(width * 0.85, height * 0.25);
      ctx.rotate(hudAngle);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      
      // Dashed outer ring
      ctx.setLineDash([6, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 180, 0, Math.PI * 2);
      ctx.stroke();

      // Inner rings
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(-200, 0); ctx.lineTo(200, 0);
      ctx.moveTo(0, -200); ctx.lineTo(0, 200);
      ctx.stroke();
      ctx.restore();

      // Radar Indicator 2 (Left Mid-Bottom)
      ctx.save();
      ctx.translate(width * 0.12, height * 0.7);
      ctx.rotate(-hudAngle * 1.4);
      ctx.strokeStyle = 'rgba(214, 73, 251, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([2, 20]);
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- 2. 3D Perspective Grid ---
      const gridSpeed = 2.0;
      const scrollSpeedMultiplier = 0.8;
      
      // Increment vertical offset of the horizontal lines
      offsetY += (gridSpeed + scrollY * scrollSpeedMultiplier) * 0.08;
      if (offsetY >= 100) offsetY = 0;

      // Vertical lines starting from vanishing point (width / 2, horizonY)
      const numVertical = 36;
      for (let i = 0; i <= numVertical; i++) {
        const ratio = i / numVertical;
        const xStart = width * ratio;
        
        ctx.beginPath();
        const gridGrad = ctx.createLinearGradient(width / 2, horizonY, xStart, height);
        gridGrad.addColorStop(0, 'rgba(0, 240, 255, 0.0)'); // invisible at vanishing point
        gridGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.04)');
        gridGrad.addColorStop(1, 'rgba(123, 46, 255, 0.35)'); // purple electric at bottom
        
        ctx.strokeStyle = gridGrad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(xStart, height);
        ctx.stroke();
      }

      // Horizontal grid lines extending down exponentially
      const numHorizontal = 20;
      for (let i = 0; i < numHorizontal; i++) {
        const ratio = (i + offsetY / 100) / numHorizontal;
        // Cubic scaling for dramatic 3D perspective depth
        const y = horizonY + (height - horizonY) * Math.pow(ratio, 3.2);

        ctx.beginPath();
        // Fade lines near the horizon (lower ratio)
        const opacity = Math.min(0.28, Math.pow(ratio, 2.5) * 0.35);
        ctx.strokeStyle = `rgba(214, 73, 251, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- 3. Telemetry HUD Overlay (Corner Brackets & Metadata) ---
      ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.font = '9px "JetBrains Mono", monospace';
      
      const margin = 30;
      const bracketLen = 15;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1.2;

      // Top-Left Bracket
      ctx.beginPath();
      ctx.moveTo(margin + bracketLen, margin);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin, margin + bracketLen);
      ctx.stroke();
      ctx.fillText('SYS_OS // META_IMPULSO_STABLE_V16', margin + 5, margin - 6);

      // Top-Right Bracket
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketLen, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketLen);
      ctx.stroke();
      ctx.fillText(`SYS_LATENCY: 14MS`, width - margin - 120, margin - 6);

      // Bottom-Left Bracket
      ctx.beginPath();
      ctx.moveTo(margin + bracketLen, height - margin);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin, height - margin - bracketLen);
      ctx.stroke();
      ctx.fillText('CORE: STANDBY', margin + 5, height - margin + 14);

      // Bottom-Right Bracket
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketLen, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - bracketLen);
      ctx.stroke();
      ctx.fillText(`SCROLL_DEP_Y: ${Math.floor(scrollY)}PX`, width - margin - 150, height - margin + 14);

      // --- 4. Interactive Scanner Reticle (Mouse Tracking HUD) ---
      // Smooth out the mouse coordinate transitions (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      sonarRadius += 0.8;
      if (sonarRadius > 70) sonarRadius = 15;

      const isMouseInWindow = mouse.targetX > 0 && mouse.targetX < width && mouse.targetY > 0 && mouse.targetY < height;

      if (isMouseInWindow) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.lineWidth = 1.0;

        // Circular sight
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing Sonar Ripple
        ctx.strokeStyle = `rgba(0, 240, 255, ${((70 - sonarRadius) / 55) * 0.3})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, sonarRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair Lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(mouse.x - 30, mouse.y); ctx.lineTo(mouse.x - 8, mouse.y);
        ctx.moveTo(mouse.x + 8, mouse.y); ctx.lineTo(mouse.x + 30, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 30); ctx.lineTo(mouse.x, mouse.y - 8);
        ctx.moveTo(mouse.x, mouse.y + 8); ctx.lineTo(mouse.x, mouse.y + 30);
        ctx.stroke();

        // Telemetry Data adjacent to crosshair
        ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
        ctx.fillText(`LOC_X: ${mouse.x.toFixed(0)}`, mouse.x + 38, mouse.y - 8);
        ctx.fillText(`LOC_Y: ${mouse.y.toFixed(0)}`, mouse.x + 38, mouse.y + 4);
        ctx.fillText('CMD: SYSTEM_SCAN', mouse.x + 38, mouse.y + 16);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -3,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default CyberpunkBackground;
