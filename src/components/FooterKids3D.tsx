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
    <section className="footer-kids-3d">
      <h4 className="footer-kids-3d-title">🎮 Kids Corner — 3D Cartoon</h4>
      <p className="footer-kids-3d-hint">
        Drag to rotate: a kid playing a game on the computer! 👧👦
      </p>
      <div
        className="footer-kids-3d-scene cartoon-scene"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="application"
        aria-label="Interactive 3D cartoon scene - kid playing game on computer"
      >
        <div
          className="cartoon-stage"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          <div className="cartoon-diorama">
            {/* Back face */}
            <div className="diorama-face diorama-back" />
            {/* Left face */}
            <div className="diorama-face diorama-left" />
            {/* Right face */}
            <div className="diorama-face diorama-right" />
            {/* Top face */}
            <div className="diorama-face diorama-top" />
            {/* Bottom face */}
            <div className="diorama-face diorama-bottom" />
            {/* Front face: cartoon scene - kid at computer playing game */}
            <div className="diorama-face diorama-front">
              <div className="cartoon-art">
                <div className="cartoon-room">
                  <div className="cartoon-desk" />
                  <div className="cartoon-monitor">
                    <div className="monitor-frame">
                      <div className="monitor-screen">
                        <div className="game-screen">
                          <div className="game-character" />
                          <span className="game-text">GAME!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cartoon-kid">
                    <div className="kid-head" />
                    <div className="kid-body" />
                    <div className="kid-arm kid-arm-left" />
                    <div className="kid-arm kid-arm-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
