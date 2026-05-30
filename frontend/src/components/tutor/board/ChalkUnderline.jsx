import { motion } from 'framer-motion';

export default function ChalkUnderline({ width = 120, color = '#FCD34D' }) {
  return (
    <motion.div
      className="mt-1 h-0.5 rounded-full"
      style={{ background: color }}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width, opacity: 1 }}
      transition={{ duration: 0.45 }}
    />
  );
}
