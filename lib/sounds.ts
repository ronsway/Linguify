// Web Audio API sound effects — no audio files needed
let _ctx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) _ctx = new AudioContext();
  // Resume if suspended (browsers require user gesture first)
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function tone(
  freq: number,
  type: OscillatorType,
  startAt: number,
  duration: number,
  volume = 0.25
) {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  osc.start(startAt);
  osc.stop(startAt + duration);
}

/** Happy ascending arpeggio — played on a correct answer */
export function playCorrect() {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  // C5 → E5 → G5 quick stagger
  tone(523.25, 'sine', now,        0.35, 0.22);
  tone(659.25, 'sine', now + 0.08, 0.35, 0.22);
  tone(783.99, 'sine', now + 0.16, 0.45, 0.22);
}

/** Low buzz — played on a wrong answer */
export function playWrong() {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** Victory fanfare — played when the lesson is complete */
export function playComplete() {
  const c = ctx();
  if (!c) return;
  const now = c.currentTime;
  const melody = [523.25, 659.25, 783.99, 1046.50];
  melody.forEach((freq, i) => {
    tone(freq, 'sine', now + i * 0.13, 0.5, 0.2);
  });
  // Add a warm undertone
  tone(261.63, 'sine', now, 0.65, 0.12);
}
