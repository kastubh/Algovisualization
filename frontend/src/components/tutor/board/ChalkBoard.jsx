import BoardEraseTransition from './BoardEraseTransition.jsx';

export default function ChalkBoard({ children, isErasing, onEraseComplete }) {
  return (
    <div className="board-wrapper relative">
      <div
        className="rounded-[var(--radius-lg)] p-4"
        style={{
          background: 'linear-gradient(135deg, #8B5E3C 0%, #6B3A1F 42%, #8B5E3C 100%)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.22)',
        }}
      >
        <div
          className="relative min-h-[420px] overflow-hidden rounded-md"
          style={{
            background: '#1B4332',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.35)',
            fontFamily: "'Caveat', cursive",
            backgroundImage:
              'radial-gradient(ellipse at 15% 25%, rgba(255,255,255,0.025) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(255,255,255,0.02) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.01) 0%, transparent 60%)',
          }}
        >
          <div className={`relative z-[1] p-4 pb-9 transition-opacity duration-500 sm:p-6 ${isErasing ? 'opacity-25' : 'opacity-100'}`}>
            {children}
          </div>
          <BoardEraseTransition isErasing={isErasing} onEraseComplete={onEraseComplete} />
          <svg className="pointer-events-none absolute inset-0 opacity-10" width="100%" height="100%">
            <line x1="10%" y1="15%" x2="25%" y2="16%" stroke="white" strokeWidth="3" opacity="0.3" />
            <line x1="58%" y1="70%" x2="82%" y2="71%" stroke="white" strokeWidth="2" opacity="0.22" />
            <line x1="30%" y1="38%" x2="48%" y2="39%" stroke="white" strokeWidth="2" opacity="0.18" />
            <line x1="68%" y1="26%" x2="92%" y2="27%" stroke="white" strokeWidth="3" opacity="0.18" />
          </svg>
        </div>
        <div className="mt-2 flex h-3 items-center gap-2 rounded-b bg-gradient-to-r from-[#5C3317] via-[#8B5E3C] to-[#5C3317] pl-3">
          {['#E8E8D8', '#F87171', '#86EFAC', '#FCD34D'].map((color) => (
            <span key={color} className="h-1.5 w-7 rounded-full opacity-85" style={{ background: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
