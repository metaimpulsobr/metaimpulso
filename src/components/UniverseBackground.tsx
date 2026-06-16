import React, { useRef, useEffect } from 'react';

const UniverseBackground: React.FC = () => {
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

    const particles: Particle[] = [];
    const particleCount = Math.floor((width * height) / 10000); 
    const colors = ['#D649FB', '#7B2EFF', '#00F0FF', '#ffffff'];

    const mouse = { x: width / 2, y: height / 2, radius: 150 };

    let scrollY = window.scrollY;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseSize: number;
      size: number;
      color: string;
      alpha: number;
      depth: number;
      renderX: number;
      renderY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.3;
        // Parallax depth: closer particles move more, farther move less
        this.depth = Math.random() * 0.8 + 0.15;
        this.renderX = this.x;
        this.renderY = this.y;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen base coordinates
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Calculate parallax-shifted coordinate
        this.renderX = this.x;
        let yOffset = (this.y - scrollY * this.depth) % height;
        if (yOffset < 0) yOffset += height;
        this.renderY = yOffset;

        // Mouse interactivity using rendered coordinates
        const dx = mouse.x - this.renderX;
        const dy = mouse.y - this.renderY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 1.5;
          const directionY = forceDirectionY * force * 1.5;
          
          this.x -= directionX;
          this.y -= directionY;
          this.size = this.baseSize * 2; 
        } else {
          if (this.size > this.baseSize) {
            this.size -= 0.1;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.angle = 0;
        this.opacity = 0;
        this.active = false;
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.4); // Start in top portion
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 8 + 6;
        this.angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 deg diagonal down-right
        this.opacity = 1;
        this.active = false;
      }

      launch() {
        this.active = true;
      }

      update() {
        if (!this.active) return;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.015;

        if (this.opacity <= 0 || this.x > width || this.y > height) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active || !ctx) return;
        ctx.beginPath();
        ctx.save();
        const grad = ctx.createLinearGradient(
          this.x, this.y, 
          this.x - Math.cos(this.angle) * this.length, 
          this.y - Math.sin(this.angle) * this.length
        );
        grad.addColorStop(0, `rgba(0, 240, 255, ${this.opacity})`); // Cyan neon head
        grad.addColorStop(0.3, `rgba(214, 73, 251, ${this.opacity * 0.6})`); // Magenta trail
        grad.addColorStop(1, 'rgba(123, 46, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length, 
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 3;
    for (let i = 0; i < maxShootingStars; i++) {
      shootingStars.push(new ShootingStar());
    }

    const animate = () => {
      // Create a trail effect by not clearing completely
      ctx.fillStyle = 'rgba(2, 3, 8, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      // Draw connections (Plexus) using rendered coordinates
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          // Only connect particles that are close to each other in screen space
          // and also have a similar depth to maintain layered structure
          const depthDiff = Math.abs(particles[i].depth - particles[j].depth);
          if (depthDiff > 0.2) continue; // Don't connect stars in completely different planes

          const dx = particles[i].renderX - particles[j].renderX;
          const dy = particles[i].renderY - particles[j].renderY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            // Blended opacity and color
            ctx.strokeStyle = `rgba(214, 73, 251, ${(0.15 - distance / 100) * (1 - depthDiff * 4)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].renderX, particles[i].renderY);
            ctx.lineTo(particles[j].renderX, particles[j].renderY);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Update and draw shooting stars
      shootingStars.forEach(star => {
        if (!star.active && Math.random() < 0.002) {
          star.reset();
          star.launch();
        }
        star.update();
        star.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Re-initialize stars and clear stars
      particles.length = 0;
      const newParticleCount = Math.floor((width * height) / 10000); 
      for (let i = 0; i < newParticleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

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
        background: 'linear-gradient(135deg, #0f0518 0%, #020308 50%, #051421 100%)'
      }}
    />
  );
};

export default UniverseBackground;
