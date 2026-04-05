import { useEffect, useRef, useState } from 'react';
import '../styles/scroll-stitch.css';

/**
 * A decorative vertical embroidery thread fixed on the left edge.
 * Cross-stitches (×) fill the viewport height and are revealed
 * progressively as the user scrolls.
 */

const STITCH_GAP = 52;   // px between each cross-stitch
const THREAD_COLOR = '#8B6F4E';
const CROSS_SIZE = 7;

export default function ScrollStitch() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [stitchCount, setStitchCount] = useState(0);
  const stitchRefs = useRef([]);
  const threadRef = useRef(null);

  // Calculate how many stitches fit the viewport
  useEffect(() => {
    function calc() {
      const vh = window.innerHeight;
      setStitchCount(Math.ceil(vh / STITCH_GAP) + 1);
    }
    calc();
    window.addEventListener('resize', calc, { passive: true });
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Scroll-driven reveal
  useEffect(() => {
    if (stitchCount === 0) return;

    const thread = threadRef.current;
    if (!thread) return;

    const threadLength = thread.getTotalLength();
    thread.style.strokeDasharray = threadLength;
    thread.style.strokeDashoffset = threadLength;

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;

        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

        // Always show at least the first few stitches + some based on scroll
        const baseReveal = 0.15; // 15% always visible
        const reveal = baseReveal + progress * (1 - baseReveal);

        // Reveal thread
        thread.style.strokeDashoffset = threadLength * (1 - reveal);

        // Reveal crosses
        const revealCount = Math.floor(reveal * stitchCount);
        stitchRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i < revealCount) {
            el.style.opacity = '0.3';
            el.style.transform = 'scale(1)';
          } else {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.3)';
          }
        });
      });
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stitchCount]);

  if (stitchCount === 0) return null;

  const vbHeight = (stitchCount + 1) * STITCH_GAP;

  // Thread path
  const segs = ['M 18,0'];
  for (let i = 0; i <= stitchCount; i++) {
    const y = 20 + i * STITCH_GAP;
    const cx = i % 2 === 0 ? 26 : 10;
    segs.push(`Q ${cx},${y - STITCH_GAP * 0.35} 18,${y}`);
  }
  const threadPath = segs.join(' ');

  return (
    <div ref={containerRef} className="scroll-stitch" aria-hidden="true">
      <svg
        className="scroll-stitch__svg"
        viewBox={`0 0 36 ${vbHeight}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thread */}
        <path
          ref={threadRef}
          d={threadPath}
          fill="none"
          stroke={THREAD_COLOR}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Cross stitches */}
        {Array.from({ length: stitchCount }, (_, i) => {
          const y = 20 + i * STITCH_GAP;
          return (
            <g
              key={i}
              ref={(el) => (stitchRefs.current[i] = el)}
              className="scroll-stitch__cross"
            >
              <line
                x1={18 - CROSS_SIZE} y1={y - CROSS_SIZE}
                x2={18 + CROSS_SIZE} y2={y + CROSS_SIZE}
                stroke={THREAD_COLOR}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={18 + CROSS_SIZE} y1={y - CROSS_SIZE}
                x2={18 - CROSS_SIZE} y2={y + CROSS_SIZE}
                stroke={THREAD_COLOR}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx={18} cy={y}
                r="1.8"
                fill={THREAD_COLOR}
                opacity="0.6"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
