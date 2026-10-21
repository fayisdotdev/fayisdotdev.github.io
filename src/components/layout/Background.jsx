import { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodeCount = 32;
    let animationFrame;
    let width = 0;
    let height = 0;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
    }));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      nodes.forEach((node, index) => {
        const x = node.x * width;
        const y = node.y * height;
        nodes.slice(index + 1).forEach((other) => {
          const dx = x - other.x * width;
          const dy = y - other.y * height;
          const distance = Math.hypot(dx, dy);
          if (distance > 145) return;
          context.strokeStyle = `rgba(16, 185, 129, ${(1 - distance / 145) * 0.12})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(other.x * width, other.y * height);
          context.stroke();
        });
        context.fillStyle = "rgba(16, 185, 129, 0.28)";
        context.beginPath();
        context.arc(x, y, 1.5, 0, Math.PI * 2);
        context.fill();
        if (!reducedMotion.matches) {
          node.x = (node.x + node.vx + 1) % 1;
          node.y = (node.y + node.vy + 1) % 1;
        }
      });

      if (!reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    const handleMotionChange = () => {
      window.cancelAnimationFrame(animationFrame);
      draw();
    };
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", handleMotionChange);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
};

export default Background;
