import { motion } from 'framer-motion';

export default function ArrayOnBoard({ array = [], highlightIndices = [], swapIndices = [], pointers = {}, isVisible = true }) {
  return (
    <div className="relative my-5 flex flex-wrap items-end justify-center gap-2">
      {array.map((value, index) => {
        const highlighted = highlightIndices.includes(index);
        const swapping = swapIndices.includes(index);
        const pointerLabel = Object.entries(pointers)
          .filter(([, pointerIndex]) => pointerIndex === index)
          .map(([name]) => name)
          .join(', ');

        return (
          <motion.div
            key={`${index}-${value}`}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.28 }}
            style={{ willChange: 'transform' }}
          >
            <motion.div
              className="relative flex h-[52px] w-[52px] items-center justify-center"
              animate={{ scale: swapping ? [1, 1.18, 1] : 1, y: swapping ? [-8, 0] : 0 }}
              transition={{ duration: 0.42 }}
              style={{
                border: `2px solid ${highlighted ? '#FCD34D' : 'rgba(232,232,216,0.72)'}`,
                borderRadius: 4,
                background: highlighted ? 'rgba(252,211,77,0.12)' : swapping ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.04)',
                color: highlighted ? '#FCD34D' : swapping ? '#FCA5A5' : '#E8E8D8',
                boxShadow: highlighted ? '0 0 12px rgba(252,211,77,0.5), inset 0 0 8px rgba(252,211,77,0.1)' : swapping ? '0 0 10px rgba(248,113,113,0.4)' : 'none',
                fontFamily: "'Caveat', cursive",
                fontSize: '1.35rem',
                fontWeight: 700,
                transform: `rotate(${index % 3 === 0 ? -0.4 : index % 3 === 1 ? 0.3 : -0.2}deg)`,
                transition: 'all 0.3s ease',
              }}
            >
              {value}
              <span className="absolute -top-5 text-xs text-white/45">{index}</span>
            </motion.div>
            <div className="mt-1 min-h-9 text-center text-[#86EFAC]">
              {pointerLabel && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="text-lg leading-4">↑</div>
                  <div className="text-sm font-bold">{pointerLabel}</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
