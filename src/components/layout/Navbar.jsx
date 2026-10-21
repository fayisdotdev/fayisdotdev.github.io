import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const Navbar = ({ active, onScrollTo, items, brandName }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContext = useRef(null);

  const playClick = () => {
    if (!soundEnabled) return;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    audioContext.current ??= new AudioContextConstructor();
    const context = audioContext.current;
    if (context.state === "suspended") void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(240, context.currentTime + 0.045);
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.045);
  };

  useEffect(() => () => {
    if (audioContext.current && audioContext.current.state !== "closed") {
      void audioContext.current.close();
    }
  }, []);

  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-[#0a0b0e]/85 px-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3">
          <button
            className="truncate text-lg font-bold tracking-wide text-emerald-400"
            onClick={() => { playClick(); onScrollTo("home"); }}
          >
            {brandName}
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled((enabled) => !enabled)}
            aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
            aria-pressed={soundEnabled}
            className={`rounded border p-2 transition-colors ${
              soundEnabled
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                : "border-slate-800 text-slate-500 hover:text-slate-200"
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        <div className="grid w-full grid-cols-3 gap-1 md:flex md:w-auto md:gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { playClick(); onScrollTo(item.id); }}
              aria-current={active === item.id ? "location" : undefined}
              className={`rounded px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wide transition-colors sm:text-[11px] md:px-3 ${
                active === item.id
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
