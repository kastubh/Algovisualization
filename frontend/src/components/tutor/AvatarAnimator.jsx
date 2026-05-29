export default function AvatarAnimator({ isSpeaking, name = 'Alex' }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-32 w-32">
        <svg viewBox="0 0 100 100" className={isSpeaking ? 'animate-bob' : ''} role="img" aria-label="AI tutor avatar">
          <circle cx="50" cy="50" r="45" fill="#F3B56B" stroke="#8A5A21" strokeWidth="2" />
          <ellipse cx="35" cy="42" rx="5" ry={isSpeaking ? '5' : '4'} fill="#17211d" />
          <ellipse cx="65" cy="42" rx="5" ry={isSpeaking ? '5' : '4'} fill="#17211d" />
          <circle cx="37" cy="40" r="1.5" fill="white" />
          <circle cx="67" cy="40" r="1.5" fill="white" />
          {isSpeaking ? (
            <ellipse cx="50" cy="66" rx="12" ry="7" fill="#9f2f24" className="animate-mouth" />
          ) : (
            <path d="M 38 65 Q 50 72 62 65" stroke="#9f2f24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          <path d="M 28 34 Q 35 30 42 34" stroke="#6f4318" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 58 34 Q 65 30 72 34" stroke="#6f4318" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-ink/60">AI Tutor · {name}</span>
    </div>
  );
}
