import { motion } from 'framer-motion';
import { useVizStore } from '../../store/vizStore.js';

export default function ArrayVisualizer() {
  const { vizData, currentStep } = useVizStore();
  const step = vizData?.steps?.[currentStep];
  const data = step?.state?.data || vizData?.initial_state?.data || [];
  const max = Math.max(...data, 1);

  return (
    <div className="flex h-80 items-end gap-2 border-b border-black/10 px-2 sm:gap-3 sm:px-6">
      {data.map((value, index) => {
        const highlighted = step?.highlights?.includes(index);
        return (
          <motion.div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={`${index}-${value}`} layout transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
            <motion.div
              className={`w-full ${highlighted ? 'bg-coral' : 'bg-mint'}`}
              initial={false}
              animate={{ height: `${Math.max(24, (value / max) * 260)}px` }}
            />
            <span className="text-xs font-semibold">{value}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
