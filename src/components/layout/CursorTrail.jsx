import { useEffect, useRef } from "react";

const colors = [174, 151, 211];

const CursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!canvas || !context || !finePointer.matches || reducedMotion.matches) {
      return;
    }

    const points = [];
    const cursor = { x: 0, y: 0, active: false, pressed: false };
    let frameId;
    let pixelRatio = 1;

    const resizeCanvas = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const handlePointerMove = (event) => {
      if (event.pointerType !== "mouse") return;

      const previous = points[points.length - 1];
      const distance = previous
        ? Math.hypot(event.clientX - previous.x, event.clientY - previous.y)
        : Infinity;

      cursor.x = event.clientX;
      cursor.y = event.clientY;
      cursor.active = true;

      if (distance > 8) {
        points.push({ x: cursor.x, y: cursor.y, createdAt: performance.now() });
        if (points.length > 24) points.shift();
      }
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse") cursor.pressed = true;
    };

    const handlePointerUp = () => {
      cursor.pressed = false;
    };

    const handlePointerOut = (event) => {
      if (!event.relatedTarget) cursor.active = false;
    };

    const getHue = (time) => {
      const position = (time / 2200) % colors.length;
      const start = Math.floor(position);
      const progress = position - start;
      const from = colors[start];
      const to = colors[(start + 1) % colors.length];
      return from + (to - from) * progress;
    };

    const draw = (time) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const hue = getHue(time);

      points.forEach((point) => {
        const age = time - point.createdAt;
        const opacity = Math.max(0, 1 - age / 620);
        if (opacity === 0) return;

        context.beginPath();
        context.arc(point.x, point.y, 1.5 + opacity * 2.5, 0, Math.PI * 2);
        context.fillStyle = `hsla(${hue}, 95%, 68%, ${opacity * 0.65})`;
        context.fill();
      });

      while (points.length && time - points[0].createdAt > 620) points.shift();

      if (cursor.active) {
        const radius = cursor.pressed ? 7 : 10;
        context.beginPath();
        context.arc(cursor.x, cursor.y, radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${hue}, 95%, 68%, 0.13)`;
        context.fill();
        context.lineWidth = 1.5;
        context.strokeStyle = `hsla(${hue}, 100%, 78%, 0.95)`;
        context.stroke();

        context.beginPath();
        context.arc(cursor.x, cursor.y, 2, 0, Math.PI * 2);
        context.fillStyle = `hsl(${hue}, 100%, 82%)`;
        context.fill();
      }

      frameId = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerout", handlePointerOut);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
};

export default CursorTrail;