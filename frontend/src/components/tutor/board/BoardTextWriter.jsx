import { useEffect, useRef, useState } from 'react';

export default function BoardTextWriter({ text = '', speed = 35, onComplete, prefix = '', className = '', delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setCharIndex(0);
  }, [text]);

  useEffect(() => {
    window.clearTimeout(timeoutRef.current);
    if (charIndex >= text.length) {
      onComplete?.();
      return undefined;
    }
    timeoutRef.current = window.setTimeout(
      () => {
        setDisplayed((current) => current + text[charIndex]);
        setCharIndex((current) => current + 1);
      },
      charIndex === 0 ? delay : speed,
    );
    return () => window.clearTimeout(timeoutRef.current);
  }, [charIndex, delay, onComplete, speed, text]);

  return (
    <p className={`leading-relaxed text-chalk ${className}`} style={{ fontFamily: "'Caveat', cursive" }}>
      <span className="text-[#86EFAC]">{prefix}</span>
      {displayed}
      {charIndex < text.length && <span className="ml-0.5 animate-caret text-gold">|</span>}
    </p>
  );
}
