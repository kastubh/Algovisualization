import { motion } from 'framer-motion';

export default function ChalkArrow({ from, to, color = '#FCD34D', label, delay = 0 }) {
  const markerId = `arrowhead-${color.replace('#', '')}`;
  const midX = (from.x + to.x) / 2 + 14;
  const midY = (from.y + to.y) / 2 - 18;
  const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible" width="100%" height="100%">
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <motion.path
        d={pathD}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        markerEnd={`url(#${markerId})`}
      />
      {label && (
        <motion.text x={to.x + 8} y={to.y} fill={color} fontSize="18" fontFamily="'Caveat', cursive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.55 }}>
          {label}
        </motion.text>
      )}
    </svg>
  );
}
