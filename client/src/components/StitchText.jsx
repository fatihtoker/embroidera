import { useEffect, useRef, useState, useCallback, useId } from 'react';
import '../styles/stitch-animation.css';

/**
 * Multiple embroidery stitch animation variants.
 * The needle moves across and stitches form behind it — no solid fill.
 * A random variant is picked on each mount (page load).
 */

const VARIANTS = [
  // Variant 1: Elegant cursive with looping thread
  {
    id: 'cursive',
    viewBox: '0 0 360 100',
    fontSize: 44,
    fontStyle: 'italic',
    textY: 58,
    needlePath: 'M 10,58 C 50,20 90,65 130,38 C 170,12 210,62 250,35 C 290,15 330,55 355,58',
    decorations: 'loops',
    strokeWidth: 2,
    stitchDash: '5 3',
  },
  // Variant 2: Bold block letters with cross-stitch marks
  {
    id: 'block',
    viewBox: '0 0 380 100',
    fontSize: 40,
    fontStyle: 'normal',
    textY: 60,
    needlePath: 'M 10,60 L 60,50 L 100,60 L 150,45 L 190,60 L 240,50 L 280,60 L 330,48 L 375,60',
    decorations: 'crosses',
    strokeWidth: 2.5,
    stitchDash: '8 3',
  },
  // Variant 3: Delicate handwritten with scattered dots
  {
    id: 'delicate',
    viewBox: '0 0 340 100',
    fontSize: 38,
    fontStyle: 'italic',
    textY: 55,
    needlePath: 'M 5,55 Q 45,30 85,55 Q 125,25 165,55 Q 205,30 245,55 Q 285,25 335,55',
    decorations: 'dots',
    strokeWidth: 1.5,
    stitchDash: '3 2',
  },
  // Variant 4: Whimsical arc text with flower accents
  {
    id: 'arc',
    viewBox: '0 0 360 110',
    fontSize: 42,
    fontStyle: 'italic',
    textY: 62,
    needlePath: 'M 10,65 C 50,30 110,22 175,28 C 240,34 300,22 355,65',
    decorations: 'flowers',
    strokeWidth: 2,
    stitchDash: '6 2',
  },
];

function Decorations({ type }) {
  if (type === 'loops') {
    return (
      <g className="stitch-anim__deco" opacity="0">
        {[40, 120, 200, 280].map((x, i) => (
          <ellipse
            key={i}
            cx={x}
            cy={78}
            rx={8}
            ry={4}
            fill="none"
            stroke="var(--color-cream, #F8F4EF)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
      </g>
    );
  }

  if (type === 'crosses') {
    return (
      <g className="stitch-anim__deco" opacity="0">
        {[50, 110, 170, 230, 290, 350].map((x, i) => (
          <g key={i}>
            <line x1={x - 5} y1={75} x2={x + 5} y2={85} stroke="var(--color-cream, #F8F4EF)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <line x1={x + 5} y1={75} x2={x - 5} y2={85} stroke="var(--color-cream, #F8F4EF)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        ))}
      </g>
    );
  }

  if (type === 'dots') {
    return (
      <g className="stitch-anim__deco" opacity="0">
        {[30, 70, 130, 180, 230, 270, 320].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={75 + (i % 2 === 0 ? 0 : 6)}
            r={2}
            fill="var(--color-cream, #F8F4EF)"
            opacity="0.5"
          />
        ))}
      </g>
    );
  }

  if (type === 'flowers') {
    const petalPath = (cx, cy, size) => {
      const petals = [];
      for (let a = 0; a < 5; a++) {
        const angle = (a * 72 - 90) * Math.PI / 180;
        const px = cx + Math.cos(angle) * size;
        const py = cy + Math.sin(angle) * size;
        petals.push(`M ${cx},${cy} Q ${(cx + px) / 2 + 3},${(cy + py) / 2 - 3} ${px},${py}`);
      }
      return petals.join(' ');
    };
    return (
      <g className="stitch-anim__deco" opacity="0">
        {[60, 180, 300].map((x, i) => (
          <g key={i}>
            <path
              d={petalPath(x, 85, 7)}
              fill="none"
              stroke="var(--color-cream, #F8F4EF)"
              strokeWidth="1"
              opacity="0.5"
              strokeLinecap="round"
            />
            <circle cx={x} cy={85} r={2} fill="var(--color-secondary, #C17B4A)" opacity="0.6" />
          </g>
        ))}
      </g>
    );
  }

  return null;
}

export default function StitchText() {
  const needleRef = useRef(null);
  const pathRef = useRef(null);
  const clipRectRef = useRef(null);
  const containerRef = useRef(null);
  const uniqueId = useId();

  // Cycle through variants
  const [variantIndex, setVariantIndex] = useState(
    () => Math.floor(Math.random() * VARIANTS.length)
  );
  const variant = VARIANTS[variantIndex];

  const nextVariant = useCallback(() => {
    setVariantIndex((prev) => (prev + 1) % VARIANTS.length);
  }, []);

  // Parse viewBox dimensions for clip rect
  const [, , vbWidth, vbHeight] = variant.viewBox.split(' ').map(Number);
  const clipId = `stitch-clip${uniqueId}`;
  const filterId = `stitch-rough${uniqueId}`;

  useEffect(() => {
    const path = pathRef.current;
    const needle = needleRef.current;
    const clipRect = clipRectRef.current;
    if (!path || !needle || !clipRect) return;

    // Reset state for new variant
    clipRect.setAttribute('width', 0);
    needle.style.opacity = 0;

    const length = path.getTotalLength();
    let start = null;
    const duration = 3500;
    const holdDuration = 2500; // pause after stitching completes
    const fadeOutDuration = 600;
    let animId;
    let phaseTimer;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      const point = path.getPointAtLength(progress * length);

      // Needle bobs up/down — piercing in & out of fabric
      const bobY = Math.sin(progress * Math.PI * 22) * 2.5;
      needle.setAttribute('cx', point.x);
      needle.setAttribute('cy', point.y + bobY);

      // Needle opacity pulses — visible when "above" fabric
      const opacity = 0.35 + 0.65 * Math.max(0, Math.sin(progress * Math.PI * 22));
      needle.style.opacity = opacity;

      // Reveal stitched text up to where the needle is
      clipRect.setAttribute('width', point.x + 6);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Full reveal, hide needle
        clipRect.setAttribute('width', vbWidth);
        needle.style.opacity = 0;

        // Hold the completed text, then fade out & cycle
        phaseTimer = setTimeout(() => {
          // Fade out the container
          if (containerRef.current) {
            containerRef.current.style.transition = `opacity ${fadeOutDuration}ms ease-out`;
            containerRef.current.style.opacity = 0;
          }
          // After fade, switch variant
          phaseTimer = setTimeout(() => {
            nextVariant();
          }, fadeOutDuration);
        }, holdDuration);
      }
    }

    // Fade in
    if (containerRef.current) {
      containerRef.current.style.transition = 'opacity 0.4s ease-in';
      containerRef.current.style.opacity = 1;
    }

    const startTimer = setTimeout(() => {
      needle.style.opacity = 1;
      animId = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(phaseTimer);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [variant, vbWidth, nextVariant]);

  return (
    <div ref={containerRef} className={`stitch-anim stitch-anim--${variant.id}`} aria-hidden="true">
      <svg
        viewBox={variant.viewBox}
        className="stitch-anim__svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id={clipId}>
            <rect ref={clipRectRef} x="0" y="0" width="0" height={vbHeight} />
          </clipPath>
        </defs>

        {/* Text revealed progressively by clipPath as needle passes */}
        <g clipPath={`url(#${clipId})`}>
          {/* Shadow (pressed-into-fabric depth) */}
          <text
            x="50%"
            y={variant.textY + 2}
            textAnchor="middle"
            className="stitch-anim__shadow"
            style={{ fontSize: variant.fontSize, fontStyle: variant.fontStyle }}
          >
            embroidera
          </text>

          {/* Stitched text — dashed stroke, never fills */}
          <text
            x="50%"
            y={variant.textY}
            textAnchor="middle"
            className="stitch-anim__text"
            style={{
              fontSize: variant.fontSize,
              fontStyle: variant.fontStyle,
              strokeWidth: variant.strokeWidth,
              strokeDasharray: variant.stitchDash,
            }}
            filter={`url(#${filterId})`}
          >
            embroidera
          </text>
        </g>

        {/* Invisible path the needle follows */}
        <path ref={pathRef} d={variant.needlePath} fill="none" stroke="none" />

        {/* Needle — controlled entirely by JS */}
        <circle ref={needleRef} cx="0" cy="0" r="3.5" className="stitch-anim__needle" />

        {/* Decorations appear after stitching completes */}
        <Decorations type={variant.decorations} />
      </svg>
    </div>
  );
}
