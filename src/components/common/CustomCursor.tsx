import React, { useEffect, useState } from 'react';

/**
 * Minimal SentinelAPI cursor.
 * Replaces the old trailing reticle, particles, HUD labels and shockwave
 * with a small, smooth cybersecurity-inspired cursor.
 */
export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Small outer targeting ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/70 transition-all duration-100 ease-out ${
          isClicking
            ? 'w-7 h-7 border-cyan-200/90 shadow-[0_0_18px_rgba(34,211,238,0.65)]'
            : 'w-5 h-5 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
        }`}
        style={{ left: position.x, top: position.y }}
      />

      {/* Sentinel diamond core */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cyan-200 bg-cyan-400/20 transition-transform duration-100 ease-out ${
          isClicking ? 'w-3.5 h-3.5 scale-75' : 'w-2.5 h-2.5 scale-100'
        }`}
        style={{ left: position.x, top: position.y }}
      />

      {/* Four tiny targeting marks */}
      <span
        className="fixed w-1.5 h-px bg-cyan-300/90 -translate-x-[9px] -translate-y-1/2"
        style={{ left: position.x, top: position.y }}
      />
      <span
        className="fixed w-1.5 h-px bg-cyan-300/90 translate-x-[3px] -translate-y-1/2"
        style={{ left: position.x, top: position.y }}
      />
      <span
        className="fixed h-1.5 w-px bg-cyan-300/90 -translate-x-1/2 -translate-y-[9px]"
        style={{ left: position.x, top: position.y }}
      />
      <span
        className="fixed h-1.5 w-px bg-cyan-300/90 -translate-x-1/2 translate-y-[3px]"
        style={{ left: position.x, top: position.y }}
      />
    </div>
  );
};
