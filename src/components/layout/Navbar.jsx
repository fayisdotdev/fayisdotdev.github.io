import { useEffect, useRef, useState } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";

const Navbar = ({ active, onScrollTo, items, brandName }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundError, setSoundError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioContext = useRef(null);

  const playTone = () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      setSoundError("Sound effects are not supported by this browser.");
      return false;
    }

    try {
      audioContext.current ??= new AudioContextConstructor();
      const context = audioContext.current;
      if (context.state === "suspended") {
        context.resume().catch((error) => {
          console.error("Could not resume sound effects.", error);
          setSoundEnabled(false);
          setSoundError("Tap the sound control again to enable sound.");
        });
      }

      const startAt = context.currentTime + 0.01;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(780, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(280, startAt + 0.1);
      gain.gain.setValueAtTime(0.075, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.1);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.1);
      return true;
    } catch (error) {
      console.error("Could not play sound effects.", error);
      setSoundError("Sound effects could not be started on this device.");
      return false;
    }
  };

  const playClick = () => {
    if (soundEnabled) playTone();
  };

  const toggleSound = () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      setSoundError("");
      return;
    }
    setSoundError("");
    setSoundEnabled(playTone());
  };

  useEffect(() => () => {
    if (audioContext.current && audioContext.current.state !== "closed") {
      void audioContext.current.close();
    }
  }, []);

  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-[#0a0b0e]/85 px-4 backdrop-blur-md">
      <div className="mx-auto max-w-7xl py-3">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <button
            className="truncate text-lg font-bold tracking-wide text-emerald-400"
            onClick={() => { playClick(); onScrollTo("home"); }}
          >
            {brandName}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="rounded border border-slate-800 p-2 text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300 md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="hidden items-center justify-between gap-4 md:flex">
          <button
            className="truncate text-lg font-bold tracking-wide text-emerald-400"
            onClick={() => { playClick(); onScrollTo("home"); }}
          >
            {brandName}
          </button>
          <div className="flex gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => { playClick(); onScrollTo(item.id); }}
                aria-current={active === item.id ? "location" : undefined}
                className={`rounded px-3 py-2 text-center font-mono text-[11px] uppercase tracking-wide transition-colors ${
                  active === item.id
                    ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleSound}
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

        {isMenuOpen && (
          <div id="mobile-navigation-menu" className="mt-3 space-y-2 border-t border-slate-800/80 pt-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick();
                    onScrollTo(item.id);
                    setIsMenuOpen(false);
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className={`rounded border px-3 py-3 text-left font-mono text-xs uppercase tracking-wide transition-colors ${
                    active === item.id
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
              aria-pressed={soundEnabled}
              className={`flex w-full items-center gap-2 rounded border px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                soundEnabled
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-800 text-slate-400 hover:text-slate-100"
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              Sound effects {soundEnabled ? "on" : "off"}
            </button>
            {soundError && (
              <p role="status" className="text-xs text-amber-300">
                {soundError}
              </p>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
