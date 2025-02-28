import React, { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isExploring, setIsExploring] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showUfo, setShowUfo] = useState(false);
  const [ufoPosition, setUfoPosition] = useState({
    x: -100,
    y: Math.random() * 300 + 100,
  });

  // Hidden messages in the code (not visible to users)
  const hiddenMessages = [
    "Excellence is not a destination; it's a continuous journey",
    "Together we achieve what alone seems impossible",
    "The greatest glory lies not in never falling, but in rising every time we fall",
    "Persistence prevails when all else fails",
    "Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved",
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isExploring) {
        // Adjust zoom level based on wheel direction
        const newZoom = zoomLevel + (e.deltaY > 0 ? -0.05 : 0.05);
        setZoomLevel(Math.max(0.5, Math.min(3, newZoom)));
        e.preventDefault();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isExploring, zoomLevel]);

  // UFO appearance timer (approximately once per hour)
  useEffect(() => {
    // For demo purposes, we'll make it appear every minute instead of hour
    // In production, you would use 60 * 60 * 1000 for an hour
    const ufoTimer = setInterval(() => {
      setShowUfo(true);
      setUfoPosition({ x: -100, y: Math.random() * 300 + 100 });

      // Hide UFO after it crosses the screen
      setTimeout(() => {
        setShowUfo(false);
      }, 15000); // 15 seconds to cross the screen
    }, 60 * 1000); // Every minute for demo (change to 60 * 60 * 1000 for hourly)

    return () => clearInterval(ufoTimer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create a particle system
    const particles: Particle[] = [];
    const stars: Star[] = [];
    const satellites: Satellite[] = [];
    const particleCount = isExploring ? 200 : 100;
    const starCount = 500;
    const satelliteCount = 8;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX * (isExploring ? 1.5 : 1);
        this.y += this.speedY * (isExploring ? 1.5 : 1);

        // Interaction with mouse (reduced sensitivity)
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (isExploring ? 150 : 100)) {
          // Reduced sensitivity by factor of 5
          this.speedX += dx * (isExploring ? 0.0004 : 0.0002);
          this.speedY += dy * (isExploring ? 0.0004 : 0.0002);
        }

        // Boundary check
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * zoomLevel, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;

      constructor() {
        this.x = (Math.random() - 0.5) * canvas.width * 3;
        this.y = (Math.random() - 0.5) * canvas.height * 3;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 1.5 + 0.5;

        // Create a variety of star colors
        const colorTypes = [
          "hsl(220, 100%, 80%)", // Blue
          "hsl(60, 100%, 90%)", // Yellow
          "hsl(0, 100%, 90%)", // Red
          "hsl(180, 100%, 90%)", // Cyan
          "hsl(280, 100%, 90%)", // Purple
        ];
        this.color = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      }

      update() {
        // Move stars toward viewer when exploring - slowed to 30% of original speed
        if (isExploring) {
          // Original speed was 2, now 0.6 (30% of original)
          this.z -= 0.6;

          // Reset stars that go behind the viewer
          if (this.z < 1) {
            this.z = 1000;
            this.x = (Math.random() - 0.5) * canvas.width * 3;
            this.y = (Math.random() - 0.5) * canvas.height * 3;
          }
        }
      }

      draw() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Project 3D position to 2D screen
        const projectedX = (this.x / this.z) * 500 + centerX;
        const projectedY = (this.y / this.z) * 500 + centerY;

        // Only draw stars that are on screen
        if (
          projectedX > 0 &&
          projectedX < canvas.width &&
          projectedY > 0 &&
          projectedY < canvas.height
        ) {
          // Size based on distance (z) and zoom
          const projectedSize =
            ((1000 - this.z) / 1000) * this.size * zoomLevel;

          // Brightness based on distance
          const brightness = (1000 - this.z) / 1000;

          ctx.beginPath();
          ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = brightness;
          ctx.fill();

          // Add glow effect to brighter stars
          if (brightness > 0.8) {
            ctx.beginPath();
            ctx.arc(projectedX, projectedY, projectedSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = brightness * 0.3;
            ctx.fill();
          }

          ctx.globalAlpha = 1;
        }
      }
    }

    class Satellite {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      color: string;
      type: number; // Different satellite types
      trail: { x: number; y: number }[];

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 50 + 80; // Distance from Earth
        this.speed =
          (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1); // Some go clockwise, some counterclockwise
        this.size = Math.random() * 3 + 2;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
        this.type = Math.floor(Math.random() * 3); // 0: simple, 1: with panels, 2: complex
        this.trail = [];
      }

      update() {
        this.angle += this.speed * (isExploring ? 1.5 : 1);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const x = centerX + Math.cos(this.angle) * this.distance * zoomLevel;
        const y = centerY + Math.sin(this.angle) * this.distance * zoomLevel;

        // Add point to trail
        this.trail.push({ x, y });

        // Limit trail length
        if (this.trail.length > 50) {
          this.trail.shift();
        }
      }

      draw() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const x = centerX + Math.cos(this.angle) * this.distance * zoomLevel;
        const y = centerY + Math.sin(this.angle) * this.distance * zoomLevel;

        // Draw trail
        if (this.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y);

          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }

          ctx.strokeStyle = `rgba(100, 200, 255, ${isExploring ? 0.2 : 0.1})`;
          ctx.lineWidth = 0.5 * zoomLevel;
          ctx.stroke();
        }

        // Draw satellite
        ctx.beginPath();
        ctx.arc(x, y, this.size * zoomLevel, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw satellite details based on type
        if (this.type === 1) {
          // Satellite with solar panels
          ctx.beginPath();
          ctx.moveTo(x - this.size * 3 * zoomLevel, y);
          ctx.lineTo(x + this.size * 3 * zoomLevel, y);
          ctx.strokeStyle = "rgba(200, 200, 100, 0.8)";
          ctx.lineWidth = this.size * 0.8 * zoomLevel;
          ctx.stroke();
        } else if (this.type === 2) {
          // Complex satellite with multiple components
          ctx.beginPath();
          ctx.moveTo(x, y - this.size * 2 * zoomLevel);
          ctx.lineTo(x, y + this.size * 2 * zoomLevel);
          ctx.strokeStyle = "rgba(150, 150, 200, 0.8)";
          ctx.lineWidth = this.size * 0.5 * zoomLevel;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(
            x,
            y - this.size * 2 * zoomLevel,
            this.size * 0.8 * zoomLevel,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "rgba(200, 100, 100, 0.8)";
          ctx.fill();
        }
      }
    }

    // UFO class
    class Ufo {
      x: number;
      y: number;
      speed: number;
      size: number;
      lights: number[];
      lightColors: string[];
      lightPhase: number;

      constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.speed = 2;
        this.size = 15;
        this.lights = [0, 1, 2, 3, 4, 5];
        this.lightColors = [
          "rgba(255, 0, 0, 0.8)",
          "rgba(0, 255, 0, 0.8)",
          "rgba(0, 0, 255, 0.8)",
          "rgba(255, 255, 0, 0.8)",
          "rgba(255, 0, 255, 0.8)",
          "rgba(0, 255, 255, 0.8)",
        ];
        this.lightPhase = 0;
      }

      update() {
        this.x += this.speed;
        this.lightPhase += 0.1;

        // Rotate light colors
        if (this.lightPhase > 1) {
          this.lightPhase = 0;
          this.lightColors.push(this.lightColors.shift() || "");
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // UFO body (saucer shape)
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y,
          this.size * 2,
          this.size * 0.7,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(150, 150, 180, 0.9)";
        ctx.fill();

        // UFO dome
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y - this.size * 0.3,
          this.size * 0.8,
          this.size * 0.5,
          0,
          Math.PI,
          0,
          true
        );
        ctx.fillStyle = "rgba(200, 220, 255, 0.8)";
        ctx.fill();

        // UFO bottom glow
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y + this.size * 0.2,
          this.size * 1.5,
          this.size * 0.3,
          0,
          0,
          Math.PI * 2
        );
        const glowGradient = ctx.createRadialGradient(
          this.x,
          this.y + this.size * 0.2,
          0,
          this.x,
          this.y + this.size * 0.2,
          this.size * 1.5
        );
        glowGradient.addColorStop(0, "rgba(100, 200, 255, 0.8)");
        glowGradient.addColorStop(1, "rgba(100, 200, 255, 0)");
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // UFO lights
        for (let i = 0; i < this.lights.length; i++) {
          const angle = (i / this.lights.length) * Math.PI * 2;
          const lightX = this.x + Math.cos(angle) * this.size * 1.2;
          const lightY = this.y + Math.sin(angle) * this.size * 0.4;

          ctx.beginPath();
          ctx.arc(lightX, lightY, this.size * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = this.lightColors[i];
          ctx.fill();

          // Light beam
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(lightX, lightY);
            ctx.lineTo(
              lightX + Math.cos(angle) * this.size * 0.8,
              lightY + Math.sin(angle) * this.size * 0.8
            );
            ctx.strokeStyle = this.lightColors[i];
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // Initialize satellites
    for (let i = 0; i < satelliteCount; i++) {
      satellites.push(new Satellite());
    }

    // Create UFO instance
    const ufo = new Ufo(ufoPosition.x, ufoPosition.y);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars first (background)
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Connect particles with lines (hidden message pattern)
      ctx.strokeStyle = "rgba(100, 200, 255, 0.05)";
      ctx.lineWidth = 0.5 * zoomLevel;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < (isExploring ? 150 : 100)) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Hidden message in the pattern (not visible to users)
      const messageIndex =
        Math.floor(scrollPosition / 200) % hiddenMessages.length;
      const message = hiddenMessages[messageIndex];

      // Encode the message in a pattern that's not readable
      const encodedPattern = message
        .split("")
        .map((char) => char.charCodeAt(0));

      // Use the encoded pattern to influence particle behavior subtly
      for (
        let i = 0;
        i < Math.min(encodedPattern.length, particles.length);
        i++
      ) {
        const influence = encodedPattern[i] * 0.0001;
        particles[i].speedX += influence;
        particles[i].speedY += influence;
      }

      // Draw Earth in the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const earthRadius = 40 * zoomLevel;

      // Earth glow
      const earthGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        earthRadius * 0.8,
        centerX,
        centerY,
        earthRadius * 1.5
      );
      earthGlow.addColorStop(0, "rgba(100, 200, 255, 0.3)");
      earthGlow.addColorStop(1, "rgba(100, 200, 255, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = earthGlow;
      ctx.fill();

      // Earth base
      const earthGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        earthRadius
      );
      earthGradient.addColorStop(0, "rgba(0, 150, 200, 1)");
      earthGradient.addColorStop(0.5, "rgba(0, 100, 150, 1)");
      earthGradient.addColorStop(0.7, "rgba(0, 80, 120, 1)");
      earthGradient.addColorStop(1, "rgba(0, 50, 100, 1)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = earthGradient;
      ctx.fill();

      // Earth continents (simplified)
      ctx.beginPath();
      // North America
      ctx.moveTo(centerX - earthRadius * 0.3, centerY - earthRadius * 0.2);
      ctx.bezierCurveTo(
        centerX - earthRadius * 0.4,
        centerY - earthRadius * 0.4,
        centerX - earthRadius * 0.2,
        centerY - earthRadius * 0.5,
        centerX - earthRadius * 0.1,
        centerY - earthRadius * 0.3
      );

      // South America
      ctx.moveTo(centerX - earthRadius * 0.1, centerY + earthRadius * 0.1);
      ctx.bezierCurveTo(
        centerX - earthRadius * 0.2,
        centerY + earthRadius * 0.3,
        centerX - earthRadius * 0.1,
        centerY + earthRadius * 0.5,
        centerX,
        centerY + earthRadius * 0.3
      );

      // Europe/Africa
      ctx.moveTo(centerX + earthRadius * 0.1, centerY - earthRadius * 0.3);
      ctx.bezierCurveTo(
        centerX + earthRadius * 0.2,
        centerY - earthRadius * 0.1,
        centerX + earthRadius * 0.3,
        centerY + earthRadius * 0.2,
        centerX + earthRadius * 0.1,
        centerY + earthRadius * 0.4
      );

      // Asia/Australia
      ctx.moveTo(centerX + earthRadius * 0.2, centerY - earthRadius * 0.2);
      ctx.bezierCurveTo(
        centerX + earthRadius * 0.4,
        centerY - earthRadius * 0.1,
        centerX + earthRadius * 0.5,
        centerY,
        centerX + earthRadius * 0.3,
        centerY + earthRadius * 0.1
      );

      ctx.moveTo(centerX + earthRadius * 0.4, centerY + earthRadius * 0.3);
      ctx.arc(
        centerX + earthRadius * 0.4,
        centerY + earthRadius * 0.3,
        earthRadius * 0.1,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(100, 200, 100, 0.7)";
      ctx.fill();

      // Earth atmosphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthRadius * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100, 200, 255, 0.3)";
      ctx.lineWidth = 3 * zoomLevel;
      ctx.stroke();

      // Draw satellites
      satellites.forEach((satellite) => {
        satellite.update();
        satellite.draw();
      });

      // Draw UFO if it's time to show it
      if (showUfo) {
        ufo.x =
          ufoPosition.x + ((canvas.width + 200) * (Date.now() % 15000)) / 15000;
        ufo.update();
        ufo.draw(ctx);

        // Reset UFO if it goes off screen
        if (ufo.x > canvas.width + 100) {
          setShowUfo(false);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    mousePosition,
    scrollPosition,
    isExploring,
    zoomLevel,
    showUfo,
    ufoPosition,
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-blue-950 to-black">
      {/* Canvas for interactive background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* <Compass
                className={`w-24 h-24 text-blue-400 ${
                  isExploring ? "animate-spin" : "animate-pulse"
                }`}
                style={{ animationDuration: isExploring ? "10s" : "2s" }}
              /> */}
              {/* <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-200" /> */}
            </div>
          </div>

          {/* Interactive element */}
        </div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/50 to-transparent" />

      {/* Hidden constellation patterns that subtly encode messages */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {hiddenMessages.map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-400/5"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: "translate(-50%, -50%)",
              opacity: 0.05,
            }}
          />
        ))}
      </div>

      {/* Zoom level indicator (only visible when exploring) */}
      {isExploring && (
        <div className="absolute bottom-8 right-8 flex items-center gap-2">
          <div className="w-32 h-2 bg-blue-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400"
              style={{ width: `${((zoomLevel - 0.5) / 2.5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation hints (only icons, no text) */}
      {isExploring && (
        <div className="absolute top-8 left-8 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
