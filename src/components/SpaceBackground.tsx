import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";

// ─────────────────────────────────────────────────────────────
//  FULL-PAGE AMBIENT (stars canvas + nebula orbs)
// ─────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

    class Star {
      x: number; y: number; vx: number; vy: number; size: number; alpha: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.08;
        this.vy = (Math.random() - 0.5) * 0.08;
        this.size = Math.random() * 1.8 + 0.6;
        this.alpha = Math.random() * 0.4 + 0.3;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${this.alpha * 0.25})`;
        ctx.fill();
      }
    }

    const starCount = isMobile ? 35 : 75;
    const stars: Star[] = Array.from({ length: starCount }, () => new Star());

    const handleResize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(15, 23, 42, ${0.05 - (dist / 110) * 0.05})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      stars.forEach(s => { s.update(); s.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isClient, isMobile]);

  if (!isClient) return null;

  return (
    <div className="vfx-container">
      {/* 🔮 COSMIC NEBULAE */}
      <div className="vfx-orb vfx-orb-1" />
      <div className="vfx-orb vfx-orb-2" />
      <div className="vfx-orb vfx-orb-3" />
      {/* 🌐 GRID */}
      <div className="vfx-grid" />
      {/* 🌑 VIGNETTE */}
      <div className="vfx-vignette" />
      {/* ✨ STAR CANVAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: -1, pointerEvents: "none"
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  HERO TECH ICONS — confined to the Hero, ejected on scroll
// ─────────────────────────────────────────────────────────────

interface EjectConfig {
  x: number;      // ejection x offset in px
  y: number;      // ejection y offset in px
  rotate: number; // degrees spin on exit
  scale: number;  // shrink or grow on exit
}

interface HeroTechIconProps {
  svg: React.ReactNode;
  rgbColor: string;
  top: string;
  left?: string;
  right?: string;
  desktopSize: number;
  mobileSize: number;
  isMobile: boolean;
  floatConfig: { duration: number; x: number[]; y: number[]; rotate: number[] };
  hudOverlay?: React.ReactNode;
  telemetryText: string;
  /** 0–1 scroll progress of the hero section (0 = top, 1 = fully scrolled past) */
  exitProgress: number;
  eject: EjectConfig;
  /** stagger delay so each icon exits at a slightly different time */
  ejectDelay: number;
}

function HeroTechIcon({
  svg, rgbColor, top, left, right,
  desktopSize, mobileSize, isMobile,
  floatConfig, hudOverlay, telemetryText,
  exitProgress, eject, ejectDelay,
}: HeroTechIconProps) {
  const size = isMobile ? mobileSize : desktopSize;

  // Start exit animation after ejectDelay threshold
  const threshold = ejectDelay;
  const raw = Math.max(0, (exitProgress - threshold) / (1 - threshold));
  const t = Math.min(1, raw * 2.2); // accelerate the exit curve

  // Easing: ease-in (icons accelerate as they leave)
  const ease = t * t;

  const translateX = eject.x * ease;
  const translateY = eject.y * ease;
  const rotate = eject.rotate * ease;
  const scale = 1 + (eject.scale - 1) * ease;
  const opacity = Math.max(0, 1 - ease * 1.4);
  const blur = ease * 14;

  return (
    <div
      style={{
        position: "absolute",
        top, left, right,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        pointerEvents: opacity < 0.05 ? "none" : "auto",
        zIndex: 2,
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Outer float motion */}
      <motion.div
        animate={{ x: floatConfig.x, y: floatConfig.y, rotate: floatConfig.rotate }}
        transition={{ duration: floatConfig.duration, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Hover inner */}
        <motion.div
          className="tech-bg-icon"
          whileHover={{ scale: 1.15, filter: `drop-shadow(0 0 25px rgba(${rgbColor}, 0.65))` }}
          style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {/* Neon glow aura */}
          <div style={{
            position: "absolute", inset: "-15px", borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${rgbColor}, 0.22) 0%, transparent 70%)`,
            zIndex: -2, filter: "blur(10px)", pointerEvents: "none"
          }} />

          {hudOverlay}

          <div style={{ width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>{svg}</div>

          {/* Telemetry label */}
          <div style={{
            position: "absolute", bottom: isMobile ? "-18px" : "-24px",
            left: "50%", transform: "translateX(-50%)",
            fontSize: "8px", color: "rgba(15, 23, 42, 0.35)",
            fontFamily: "var(--font-mono)", whiteSpace: "nowrap",
            letterSpacing: "0.05em", pointerEvents: "none"
          }}>
            {telemetryText}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PUBLIC EXPORT — drop inside the Hero <section>
// ─────────────────────────────────────────────────────────────
export function HeroTechIcons() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const [exitProgress, setExitProgress] = useState(0);

  // Use raw scrollYProgress value so we get a 0–1 range for the *entire page*.
  // The hero occupies roughly the first 15-18% of the page height.
  // We map [0 → 0.18] to [0 → 1] for our exit effect.
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const unsub = scrollYProgress.on("change", (v) => {
      // Start fading when hero begins to leave (around 4% scroll), fully gone by 18%
      const mapped = Math.max(0, Math.min(1, (v - 0.03) / 0.15));
      setExitProgress(mapped);
    });
    return () => {
      window.removeEventListener("resize", checkMobile);
      unsub();
    };
  }, [scrollYProgress]);

  // HUD overlays ────────────────────────────────────────────────
  const ReactHud = (
    <>
      <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "1.2px dotted rgba(0, 216, 255, 0.25)", pointerEvents: "none", zIndex: -1 }} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        style={{ position: "absolute", inset: "-12px", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", width: "6px", height: "6px", borderRadius: "50%", background: "#00d8ff", boxShadow: "0 0 8px #00d8ff", transform: "translate(-50%, -50%)" }} />
      </motion.div>
    </>
  );

  const TSHud = (
    <motion.div
      animate={{ scale: [0.97, 1.05, 0.97], rotate: [0, 2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute", inset: "-10px", pointerEvents: "none", zIndex: -1 }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="rgba(49, 120, 198, 0.4)" strokeWidth="3.2" strokeLinecap="round">
        <path d="M 16 32 L 16 16 L 32 16" /><path d="M 68 16 L 84 16 L 84 32" />
        <path d="M 16 68 L 16 84 L 32 84" /><path d="M 68 84 L 84 84 L 84 68" />
      </svg>
    </motion.div>
  );

  const NextHud = (
    <div style={{ position: "absolute", inset: "-15px", pointerEvents: "none", zIndex: -1 }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25], rotate: [0, 360] }}
        transition={{ scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 18, repeat: Infinity, ease: "linear" } }}
        style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(15,23,42,0.22)" }}
      />
      <motion.div
        animate={{ scale: [1.12, 1.0, 1.12], opacity: [0.15, 0.3, 0.15], rotate: [360, 0] }}
        transition={{ scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 24, repeat: Infinity, ease: "linear" } }}
        style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: "1px dashed rgba(15,23,42,0.15)" }}
      />
    </div>
  );

  const TailwindHud = (
    <div style={{ position: "absolute", inset: "-10px", overflow: "hidden", pointerEvents: "none", zIndex: -1 }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1.6">
        <motion.path d="M -50 30 Q -25 22 0 30 T 50 30 T 100 30 T 150 30" animate={{ x: [-50, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} />
        <motion.path d="M -50 50 Q -25 58 0 50 T 50 50 T 100 50 T 150 50" animate={{ x: [0, -50] }} transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }} />
        <motion.path d="M -50 70 Q -25 62 0 70 T 50 70 T 100 70 T 150 70" animate={{ x: [-50, 0] }} transition={{ repeat: Infinity, duration: 4.8, ease: "linear" }} />
      </svg>
    </div>
  );

  const NodeHud = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", inset: "-12px", pointerEvents: "none", zIndex: -1 }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="rgba(51,153,51,0.35)" strokeWidth="1.5">
        <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" strokeDasharray="6 4" />
        {[["50","5"],["89","27.5"],["89","72.5"],["50","95"],["11","72.5"],["11","27.5"]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.2" fill="#339933" />
        ))}
      </svg>
    </motion.div>
  );

  const JSHud = (
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", inset: "-14px", pointerEvents: "none", zIndex: -1 }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="rgba(247,223,30,0.4)">
        <circle cx="50" cy="50" r="45" strokeWidth="2.5" strokeDasharray="1 7.85" />
        <circle cx="50" cy="50" r="41" strokeWidth="0.8" opacity="0.3" />
        <polygon points="50,2 53,7 47,7" fill="#f7df1e" stroke="none" />
      </svg>
    </motion.div>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {/* ① React — ejects to top-right */}
      <HeroTechIcon
        rgbColor="0, 216, 255"
        top="15%" right={isMobile ? "4%" : "8%"}
        desktopSize={110} mobileSize={70}
        floatConfig={{ duration: 7, x: [-6, 6, -6], y: [-10, 10, -10], rotate: [-8, 8, -8] }}
        isMobile={isMobile}
        hudOverlay={ReactHud}
        telemetryText="[RT.V19 // ONLINE]"
        exitProgress={exitProgress}
        eject={{ x: 220, y: -180, rotate: 145, scale: 0.3 }}
        ejectDelay={0}
        svg={
          <svg viewBox="-11.5 -10.23174 23 20.46348" width="100%" height="100%">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="0.8" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        }
      />

      {/* ② TypeScript — ejects to left + down */}
      <HeroTechIcon
        rgbColor="49, 120, 198"
        top="30%" left={isMobile ? "3%" : "6%"}
        desktopSize={85} mobileSize={55}
        floatConfig={{ duration: 6, x: [6, -6, 6], y: [10, -10, 10], rotate: [8, -8, 8] }}
        isMobile={isMobile}
        hudOverlay={TSHud}
        telemetryText="[TS.V5 // STABLE]"
        exitProgress={exitProgress}
        eject={{ x: -250, y: 160, rotate: -200, scale: 0.2 }}
        ejectDelay={0.05}
        svg={
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect width="100%" height="100%" fill="#3178c6" rx="12" />
            <text x="50" y="70" fill="white" fontFamily="var(--font-heading)" fontWeight="900" fontSize="42" textAnchor="middle">TS</text>
          </svg>
        }
      />

      {/* ③ Next.js — ejects to right + down */}
      <HeroTechIcon
        rgbColor="71, 85, 105"
        top="48%" right={isMobile ? "3%" : "12%"}
        desktopSize={95} mobileSize={60}
        floatConfig={{ duration: 8, x: [5, -5, 5], y: [-8, 8, -8], rotate: [-5, 5, -5] }}
        isMobile={isMobile}
        hudOverlay={NextHud}
        telemetryText="[NX.V15 // READY]"
        exitProgress={exitProgress}
        eject={{ x: 180, y: 250, rotate: 120, scale: 0.25 }}
        ejectDelay={0.08}
        svg={
          <svg viewBox="0 0 180 180" width="100%" height="100%">
            <circle cx="90" cy="90" r="85" fill="#020308" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
            <path d="M140 140 L80 65 V125 H68 V55 H80 L140 130 Z" fill="white" />
          </svg>
        }
      />

      {/* ④ Tailwind — ejects to left + up */}
      <HeroTechIcon
        rgbColor="56, 189, 248"
        top="65%" left={isMobile ? "4%" : "8%"}
        desktopSize={90} mobileSize={60}
        floatConfig={{ duration: 6.5, x: [-6, 6, -6], y: [10, -10, 10], rotate: [6, -6, 6] }}
        isMobile={isMobile}
        hudOverlay={TailwindHud}
        telemetryText="[TW.V4 // PASSING]"
        exitProgress={exitProgress}
        eject={{ x: -190, y: -200, rotate: -160, scale: 0.2 }}
        ejectDelay={0.03}
        svg={
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
            <path d="M12 6.00012C15.5 6.00012 17 8.00012 17 8.00012C17 8.00012 18.5 5.00012 21.5 5.00012C21.5 5.00012 22 7.50012 19 9.50012C22 9.50012 23 11.5001 23 11.5001C23 11.5001 21.5 14.5001 18.5 14.5001C15 14.5001 13.5 12.5001 13.5 12.5001C13.5 12.5001 12 15.5001 9 15.5001C9 15.5001 8.5 13.0001 11.5 11.0001C8.5 11.0001 7.5 9.00012 7.5 9.00012C7.5 9.00012 9 6.00012 12 6.00012Z" fill="#38bdf8" />
            <path d="M6 12.0001C9.5 12.0001 11 14.0001 11 14.0001C11 14.0001 12.5 11.0001 15.5 11.0001C15.5 11.0001 16 13.5001 13 15.5001C16 15.5001 17 17.5001 17 17.5001C17 17.5001 15.5 20.5001 12.5 20.5001C9 20.5001 7.5 18.5001 7.5 18.5001C7.5 18.5001 6 21.5001 3 21.5001C3 21.5001 2.5 19.0001 5.5 17.0001C2.5 17.0001 1.5 15.0001 1.5 15.0001C1.5 15.0001 3 12.0001 6 12.0001Z" fill="#00D084" />
          </svg>
        }
      />

      {/* ⑤ Node.js — ejects to bottom-right with big spin */}
      <HeroTechIcon
        rgbColor="51, 153, 51"
        top="78%" right={isMobile ? "2%" : "7%"}
        desktopSize={85} mobileSize={55}
        floatConfig={{ duration: 7.5, x: [4, -4, 4], y: [-9, 9, -9], rotate: [-8, 8, -8] }}
        isMobile={isMobile}
        hudOverlay={NodeHud}
        telemetryText="[ND.V22 // STABLE]"
        exitProgress={exitProgress}
        eject={{ x: 260, y: 300, rotate: 280, scale: 0.15 }}
        ejectDelay={0.1}
        svg={
          <svg viewBox="0 0 128 128" width="100%" height="100%">
            <path d="M115.5 32.4L68.2 5.1c-2.6-1.5-5.8-1.5-8.4 0L12.5 32.4c-2.6 1.5-4.2 4.3-4.2 7.3v54.7c0 3 1.6 5.8 4.2 7.3l47.3 27.3c2.6 1.5 5.8 1.5 8.4 0l47.3-27.3c2.6-1.5 4.2-4.3 4.2-7.3V39.7c0-3-1.6-5.8-4.2-7.3z" fill="#339933" opacity="0.9" />
            <text x="64" y="74" fill="white" fontFamily="var(--font-heading)" fontWeight="bold" fontSize="24" textAnchor="middle">node</text>
          </svg>
        }
      />

      {/* ⑥ JavaScript — ejects to bottom-left */}
      <HeroTechIcon
        rgbColor="247, 223, 30"
        top="90%" left={isMobile ? "5%" : "15%"}
        desktopSize={75} mobileSize={50}
        floatConfig={{ duration: 5.5, x: [-5, 5, -5], y: [8, -8, 8], rotate: [10, -10, 10] }}
        isMobile={isMobile}
        hudOverlay={JSHud}
        telemetryText="[JS.ES15 // ACTIVE]"
        exitProgress={exitProgress}
        eject={{ x: -220, y: 260, rotate: -230, scale: 0.2 }}
        ejectDelay={0.06}
        svg={
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect width="100%" height="100%" fill="#f7df1e" rx="10" />
            <text x="50" y="70" fill="black" fontFamily="var(--font-heading)" fontWeight="900" fontSize="42" textAnchor="middle">JS</text>
          </svg>
        }
      />
    </div>
  );
}
