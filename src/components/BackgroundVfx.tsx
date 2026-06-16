import { useEffect, useRef, useState } from "react";

export default function BackgroundVfx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let scrollY = window.scrollY;

    class Star {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      color: string;

      constructor() {
        this.x = (Math.random() - 0.5) * width * 1.5;
        this.y = (Math.random() - 0.5) * height * 1.5;
        this.z = Math.random() * 1000;
        this.px = 0;
        this.py = 0;
        
        const colors = [
          "rgba(0, 240, 255, 0.45)", // Cyan
          "rgba(214, 73, 251, 0.45)", // Magenta
          "rgba(123, 46, 255, 0.35)"  // Cosmic Purple
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(speed: number) {
        const scale = 350;
        const cx = width / 2;
        const cy = height / 2;

        // Store current projected coordinates as previous coords
        this.px = (this.x / this.z) * scale + cx;
        this.py = (this.y / this.z) * scale + cy;

        // Move closer (decrease depth Z)
        this.z -= speed;

        // Reset if too close
        if (this.z <= 0) {
          this.z = 1000;
          this.x = (Math.random() - 0.5) * width * 1.5;
          this.y = (Math.random() - 0.5) * height * 1.5;
          this.px = (this.x / this.z) * scale + cx;
          this.py = (this.y / this.z) * scale + cy;
        }
      }

      draw() {
        if (!ctx) return;
        const scale = 350;
        const cx = width / 2;
        const cy = height / 2;

        const nextX = (this.x / this.z) * scale + cx;
        const nextY = (this.y / this.z) * scale + cy;

        // Draw speed line trail
        if (
          this.px > 0 && this.px < width && this.py > 0 && this.py < height &&
          nextX > 0 && nextX < width && nextY > 0 && nextY < height
        ) {
          ctx.beginPath();
          ctx.strokeStyle = this.color;
          // Thicker lines closer to viewer
          ctx.lineWidth = Math.min(2.0, (1 - this.z / 1000) * 1.5 + 0.4);
          ctx.moveTo(this.px, this.py);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
    }

    const starCount = isMobile ? 80 : 180;
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    let animationFrameId: number;

    const animate = () => {
      // Clear with slight alpha to produce a smooth motion trail
      ctx.fillStyle = "rgba(2, 3, 8, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // --- 1. Warp Speed Acceleration (Impulso / Catapult) ---
      // Base speed is fast, scroll speed multiplies it dramatically
      const baseSpeed = isMobile ? 3 : 5;
      const scrollSpeed = scrollY * 0.15;
      const currentSpeed = baseSpeed + scrollSpeed;

      stars.forEach((star) => {
        star.update(currentSpeed);
        star.draw();
      });

      // --- 2. Sacred Geometry Mandala (Spiritual & Tech Connection) ---
      const time = Date.now();
      const cx = width / 2;
      const cy = height / 2;
      
      // Pulse scale (breathing effect)
      const breathe = 1 + Math.sin(time * 0.0012) * 0.06;
      const baseRadius = (isMobile ? 55 : 85) * breathe;
      const rotation = time * 0.00015;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      const points: { x: number; y: number }[] = [];
      points.push({ x: 0, y: 0 }); // center

      // Ring 1 (6 vertices)
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push({
          x: Math.cos(angle) * baseRadius,
          y: Math.sin(angle) * baseRadius
        });
      }

      // Ring 2 (12 vertices - star nodes)
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const radius = (i % 2 === 0) ? baseRadius * 1.732 : baseRadius * 2;
        points.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        });
      }

      // Draw Connection Lines (Flower/Metatron structure)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect nodes at specific distances to keep the geometry clean
          if (dist < baseRadius * 2.05) {
            ctx.beginPath();
            if (dist < baseRadius * 1.05) {
              // Inner core breathing lines (magenta)
              ctx.strokeStyle = `rgba(214, 73, 251, ${0.15 + Math.sin(time * 0.002) * 0.05})`;
            } else {
              // Outer technology network lines (cyan)
              ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
            }
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Glowing Vertex Nodes
      points.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, idx === 0 ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? "#00F0FF" : "#D649FB";
        ctx.shadowColor = idx % 2 === 0 ? "#00F0FF" : "#D649FB";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow glow
      });

      // Concentric orbital guide lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.beginPath(); ctx.arc(0, 0, baseRadius, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, baseRadius * 1.732, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, baseRadius * 2, 0, Math.PI * 2); ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isClient, isMobile]);

  if (!isClient) return null;

  return (
    <div className="vfx-container">
      {/* 🔮 GLOW ORBS (AURORA EFFECT) */}
      <div className="vfx-orb vfx-orb-1" />
      <div className="vfx-orb vfx-orb-2" />
      <div className="vfx-orb vfx-orb-3" />

      {/* 🌐 DOTTED GRID WITH RADIAL MASK */}
      <div className="vfx-grid" />

      {/* 🌑 VIGNETTE MASK */}
      <div className="vfx-vignette" />

      {/* 🚀 HIGH PERFORMANCE WARP SPEED STARFIELD & MANDALA CANVAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}
