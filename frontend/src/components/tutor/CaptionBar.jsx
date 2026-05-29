export default function CaptionBar({ text, isVisible }) {
  return (
    <div
      className={`flex min-h-14 items-center justify-center bg-ink px-6 py-3 text-center text-base font-medium text-white transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {text}
    </div>
  );
}
