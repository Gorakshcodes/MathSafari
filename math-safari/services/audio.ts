// Use the global Tone object from the window
const Tone = (window as any).Tone;

export const playClick = () => {
  if (!Tone || Tone.Destination.mute || Tone.context.state !== 'running') return;
  try {
    const synth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.05 },
      volume: -5
    }).toDestination();
    synth.triggerAttackRelease("G5", "32n");
  } catch (e) {
    // Ignore audio errors
  }
};

export const playPop = () => {
  if (!Tone || Tone.Destination.mute || Tone.context.state !== 'running') return;
  try {
    const synth = new Tone.MembraneSynth({
      volume: -10
    }).toDestination();
    synth.triggerAttackRelease("C4", "32n");
  } catch (e) {
    // Ignore audio errors
  }
};

export const playCorrect = () => {
  if (!Tone || Tone.Destination.mute || Tone.context.state !== 'running') return;
  try {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 },
      volume: -8
    }).toDestination();
    
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "16n", now);
    synth.triggerAttackRelease("E5", "16n", now + 0.1);
    synth.triggerAttackRelease("G5", "16n", now + 0.2);
    synth.triggerAttackRelease("C6", "4n", now + 0.3);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playWrong = () => {
  if (!Tone || Tone.Destination.mute || Tone.context.state !== 'running') return;
  try {
    const synth = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.3 },
      volume: -8
    }).toDestination();
    
    const now = Tone.now();
    synth.triggerAttackRelease("G3", "8n", now);
    synth.frequency.rampTo("C3", 0.2, now);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playLevelSelect = () => {
  if (!Tone || Tone.Destination.mute || Tone.context.state !== 'running') return;
  try {
      const synth = new Tone.Synth({
          oscillator: { type: "square" },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
          volume: -10
      }).toDestination();
      synth.triggerAttackRelease("C5", "16n");
  } catch(e) {}
}
