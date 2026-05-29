import { useEffect, useMemo, useState } from 'react';

function buildBoardText(currentCaption, boardNote) {
  if (currentCaption) return currentCaption;
  if (boardNote?.description) return boardNote.description;
  return 'Generate and start the AI Tutor to begin the teacher-style walkthrough.';
}

function DigitalBoard({ isSpeaking, currentCaption, currentStepLabel, boardNote }) {
  const fullText = useMemo(() => buildBoardText(currentCaption, boardNote), [currentCaption, boardNote]);
  const [writtenText, setWrittenText] = useState('');

  useEffect(() => {
    setWrittenText('');
    if (!fullText) return undefined;
    let index = 0;
    const speed = isSpeaking ? 28 : 10;
    const timer = window.setInterval(() => {
      index += 1;
      setWrittenText(fullText.slice(0, index));
      if (index >= fullText.length) window.clearInterval(timer);
    }, speed);
    return () => window.clearInterval(timer);
  }, [fullText, isSpeaking]);

  return (
    <div className="absolute left-6 right-6 top-10 border-4 border-[#6f4d2e] bg-[#1f493c] p-4 text-white shadow-lg md:h-56">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs font-bold uppercase tracking-wide text-white/60">Digital Tutor Board</div>
        <div className={`h-3 w-3 rounded-full ${isSpeaking ? 'animate-pulse-ring bg-gold' : 'bg-white/30'}`} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="bg-white/15 px-2 py-1 text-xs font-bold uppercase text-white/75">Topic</span>
        <span className="text-xl font-bold">{currentStepLabel}</span>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_190px]">
        <div className="min-h-24 border border-white/15 bg-black/10 p-3">
          <div className="font-mono text-sm leading-6 text-[#f7f5ee]">
            {writtenText}
            <span className={`${isSpeaking ? 'animate-caret' : ''} ml-0.5 inline-block h-4 w-2 bg-gold align-middle`} />
          </div>
        </div>
        <div className="space-y-2 text-xs text-white/75">
          <div className="border border-white/15 bg-white/10 p-2">
            <span className="block font-bold uppercase text-white/50">Action</span>
            {boardNote?.action || 'Explain'}
          </div>
          <div className="border border-white/15 bg-white/10 p-2">
            <span className="block font-bold uppercase text-white/50">Focus</span>
            {boardNote?.focus || 'Watch the highlighted step'}
          </div>
        </div>
      </div>
      <div className={`absolute bottom-8 right-12 flex items-center gap-1 ${isSpeaking ? 'animate-write-pen' : ''}`}>
        <span className="h-3 w-3 rounded-full bg-gold shadow" />
        <span className="h-1 w-12 rotate-[-18deg] bg-white" />
      </div>
      <div className="absolute bottom-[-14px] left-0 right-0 h-4 bg-[#8b6238]" />
    </div>
  );
}

export default function AvatarAnimator({ isSpeaking, name = 'Alex', currentCaption = '', currentStepLabel = 'Ready', boardNote = null }) {
  return (
    <div className="overflow-hidden border border-black/10 bg-[#eef3ed] shadow-sm">
      <div className="relative min-h-[560px] md:min-h-[430px]">
        <div className="absolute inset-x-0 top-0 h-8 bg-[#c8d7c4]" />
        <DigitalBoard isSpeaking={isSpeaking} currentCaption={currentCaption} currentStepLabel={currentStepLabel} boardNote={boardNote} />

        <div className={`absolute bottom-32 left-4 h-56 w-48 md:bottom-0 md:left-8 md:h-64 md:w-56 ${isSpeaking ? 'animate-teacher-bob' : ''}`}>
          <svg viewBox="0 0 220 260" className="h-full w-full" role="img" aria-label={`${name} teaching at the board`}>
            <path d="M67 122 C36 142 27 177 26 239 L194 239 C191 176 181 143 150 122 Z" fill="#2f9c7a" />
            <path d="M82 124 L110 157 L138 124" fill="#f7f5ee" />
            <path d="M65 145 C35 150 21 164 18 189" stroke="#2f9c7a" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path
              d={isSpeaking ? 'M156 145 C184 120 190 90 199 64' : 'M156 145 C184 136 197 124 207 105'}
              stroke="#2f9c7a"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              className={isSpeaking ? 'animate-point-arm' : ''}
            />
            <circle cx="55" cy="190" r="9" fill="#f3b56b" />
            <circle cx="204" cy="61" r="9" fill="#f3b56b" />
            <path d="M68 52 C69 18 92 5 117 9 C147 14 161 37 153 71 Z" fill="#4a2f22" />
            <circle cx="110" cy="69" r="48" fill="#f3b56b" stroke="#8a5a21" strokeWidth="2" />
            <path d="M65 58 C79 21 126 13 152 47 C136 38 108 38 88 50 C80 55 73 59 65 58 Z" fill="#4a2f22" />
            <ellipse cx="93" cy="70" rx="6" ry="5" fill="#17211d" className={isSpeaking ? '' : 'animate-blink'} />
            <ellipse cx="128" cy="70" rx="6" ry="5" fill="#17211d" className={isSpeaking ? '' : 'animate-blink'} />
            <circle cx="95" cy="68" r="1.5" fill="white" />
            <circle cx="130" cy="68" r="1.5" fill="white" />
            <path d="M85 57 Q93 52 101 57" stroke="#4a2f22" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M120 57 Q128 52 136 57" stroke="#4a2f22" strokeWidth="3" fill="none" strokeLinecap="round" />
            {isSpeaking ? (
              <ellipse cx="111" cy="92" rx="13" ry="8" fill="#9f2f24" className="animate-mouth" />
            ) : (
              <path d="M98 91 Q111 101 124 91" stroke="#9f2f24" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            <path d="M110 117 L110 239" stroke="#1d6c55" strokeWidth="3" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 right-4 min-h-24 border border-black/10 bg-white/95 p-4 shadow-sm md:left-64 md:right-6">
          <div className="text-xs font-bold uppercase text-ink/45">Teacher explanation</div>
          <p className="mt-2 text-sm leading-6 text-ink/75">{currentCaption || boardNote?.description || 'The tutor will write key ideas on the board while explaining them aloud.'}</p>
        </div>
      </div>
      <div className="border-t border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink/60">AI Tutor - {name}</div>
    </div>
  );
}
