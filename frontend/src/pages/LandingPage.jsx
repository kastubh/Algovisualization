import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <section className="space-y-6">
        <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-6xl">AlgoViz</h1>
        <p className="max-w-xl text-lg text-ink/70">
          Convert pseudocode or plain-English algorithms into step-by-step animated visualizations with your own LLM key.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="focus-ring inline-flex items-center gap-2 bg-ink px-5 py-3 font-semibold text-white" to="/register">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="focus-ring inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-3 font-semibold" to="/login">
            <Play className="h-4 w-4" /> Open App
          </Link>
        </div>
      </section>
      <section className="panel min-h-[420px] rounded-md p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink/60">Bubble Sort Demo</span>
          <span className="bg-gold px-2 py-1 text-xs font-bold text-ink">8 steps</span>
        </div>
        <div className="flex h-80 items-end gap-3 border-b border-black/10 px-4">
          {[64, 34, 25, 12, 22, 11, 90].map((value, index) => (
            <div key={value} className="flex flex-1 flex-col items-center gap-2">
              <div className={`${index < 2 ? 'bg-coral' : 'bg-mint'} w-full`} style={{ height: `${value * 2.7}px` }} />
              <span className="text-xs font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
