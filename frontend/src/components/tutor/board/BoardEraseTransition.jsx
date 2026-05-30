import { AnimatePresence, motion } from 'framer-motion';

export default function BoardEraseTransition({ isErasing, onEraseComplete }) {
  return (
    <AnimatePresence>
      {isErasing && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: 'linear-gradient(90deg, rgba(220,220,205,0.62) 0%, rgba(220,220,205,0.22) 42%, transparent 100%)' }}
          initial={{ x: '-105%' }}
          animate={{ x: '105%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onAnimationComplete={onEraseComplete}
        />
      )}
    </AnimatePresence>
  );
}
