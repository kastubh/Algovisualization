import { motion } from 'framer-motion';

export default function ChalkCircle({ cx, cy, r = 24, color = '#FCD34D', delay = 0 }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      strokeWidth="2.5"
      fill="transparent"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 0.55 }}
      style={{ filter: 'drop-shadow(0 0 4px rgba(252,211,77,0.35))' }}
    />
  );
}
