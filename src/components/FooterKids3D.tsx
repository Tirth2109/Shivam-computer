import { useRef, useState, useCallback, useEffect } from "react";

export default function FooterKids3D() {
  const [rotation, setRotation] = useState({ x: 12, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      if (isDragging) return;
      setRotation((prev) => ({ ...prev, y: prev.y + 0.3 }));
    }, 50);
    return () => clearInterval(id);
  }, [isDragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setRotation((prev) => ({ x: prev.x + dy, y: prev.y + dx }));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  return (
    <section className="rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-5">
      <h4 className="text-lg font-semibold text-[#ecf3ff]">Kids Corner - 3D Cartoon</h4>
      <p className="mt-1 text-sm text-[#a8b6ca]">Drag to rotate the mini gaming cube.</p>
      <div
        className="mx-auto mt-4 h-56 w-full max-w-md cursor-grab [perspective:1000px] active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="application"
        aria-label="Interactive 3D cartoon scene - kid playing game on computer"
      >
        <div
          className="relative mx-auto h-44 w-44 [transform-style:preserve-3d]"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-[#324660] bg-[#0f1629]"
            style={{ transform: "translateZ(72px)" }}
          >
            <div className="text-center">
              <div className="text-4xl">🧒</div>
              <div className="text-xl">🖥️</div>
              <div className="mt-1 text-xs font-semibold text-[#5ec7ff]">GAME!</div>
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-xl border border-[#324660] bg-[#131c33]"
            style={{ transform: "translateZ(-72px) rotateY(180deg)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-[#324660] bg-[#0f1625]"
            style={{ transform: "rotateY(90deg) translateZ(72px)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-[#324660] bg-[#0f1625]"
            style={{ transform: "rotateY(-90deg) translateZ(72px)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-[#324660] bg-[#0f1625]"
            style={{ transform: "rotateX(90deg) translateZ(72px)" }}
          />
          <div
            className="absolute inset-0 rounded-xl border border-[#324660] bg-[#0f1625]"
            style={{ transform: "rotateX(-90deg) translateZ(72px)" }}
          />
        </div>
      </div>
    </section>
  );
}
