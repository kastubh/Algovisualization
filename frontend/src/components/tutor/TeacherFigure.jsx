import { motion } from 'framer-motion';

export default function TeacherFigure({ isSpeaking, pointDirection = 'right', emotion = 'neutral' }) {
  const armRotation = { left: -42, right: 30, up: -70, center: 8 }[pointDirection] ?? 8;
  const excited = emotion === 'excited';

  return (
    <div className="flex w-36 select-none flex-col items-center sm:w-40">
      <svg viewBox="0 0 160 320" className="h-72 w-36 sm:h-80 sm:w-40">
        <motion.g animate={{ y: isSpeaking ? [0, -3, 0] : 0 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}>
          <ellipse cx="80" cy="52" rx="36" ry="10" fill="#4A2C0A" />
          <rect x="44" y="52" width="72" height="8" fill="#4A2C0A" rx="2" />
          <ellipse cx="80" cy="75" rx="34" ry="38" fill="#F5C18A" />
          <ellipse cx="67" cy="68" rx="5" ry="6" fill="#2D1A0E" />
          <ellipse cx="93" cy="68" rx="5" ry="6" fill="#2D1A0E" />
          <circle cx="69" cy="66" r="2" fill="white" />
          <circle cx="95" cy="66" r="2" fill="white" />
          <path d={excited ? 'M 58 59 Q 67 52 76 58' : 'M 58 60 Q 67 56 76 60'} stroke="#4A2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={excited ? 'M 84 58 Q 93 52 102 59' : 'M 84 60 Q 93 56 102 60'} stroke="#4A2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {isSpeaking ? (
            <motion.ellipse cx="80" cy="90" rx="10" ry="6" fill="#C2410C" animate={{ ry: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.3 }} />
          ) : (
            <path d="M 68 90 Q 80 98 92 90" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          <ellipse cx="80" cy="55" rx="36" ry="7" fill="none" stroke="#D97706" strokeWidth="4" />
        </motion.g>
        <rect x="48" y="112" width="64" height="90" fill="#0D9488" rx="8" />
        <polygon points="80,115 70,130 80,125 90,130" fill="white" />
        <circle cx="80" cy="155" r="5" fill="#0F766E" />
        <circle cx="80" cy="175" r="4" fill="#0F766E" />
        <rect x="30" y="118" width="20" height="55" fill="#0D9488" rx="10" />
        <rect x="24" y="168" width="6" height="24" fill="#1F2937" rx="3" />
        <rect x="24" y="190" width="6" height="5" fill="#E11D48" rx="1" />
        <motion.g style={{ originX: '112px', originY: '125px' }} animate={{ rotate: armRotation }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <rect x="108" y="118" width="20" height="60" fill="#0D9488" rx="10" />
          <ellipse cx="118" cy="182" rx="10" ry="8" fill="#F5C18A" />
          <rect x="122" y="174" width="7" height="20" fill="#F5C18A" rx="3" />
        </motion.g>
        <rect x="55" y="200" width="22" height="70" fill="#1E293B" rx="6" />
        <rect x="83" y="200" width="22" height="70" fill="#1E293B" rx="6" />
        <ellipse cx="66" cy="272" rx="16" ry="7" fill="#0F172A" />
        <ellipse cx="94" cy="272" rx="16" ry="7" fill="#0F172A" />
      </svg>
      <span className="mt-1 text-sm text-ink/60" style={{ fontFamily: "'Caveat', cursive" }}>AI Tutor - Alex</span>
    </div>
  );
}
