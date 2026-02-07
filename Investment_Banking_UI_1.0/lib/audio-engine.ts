export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null; // Master Gain

  // Effects
  private reverbNode: ConvolverNode | null = null;
  private reverbInput: GainNode | null = null;

  private delayNode: DelayNode | null = null;
  private delayInput: GainNode | null = null;

  private distortionNode: WaveShaperNode | null = null;

  // Effect States
  private isReverbOn: boolean = false;
  private isDelayOn: boolean = false;
  private isDistortionOn: boolean = false;

  // Scheduling
  private isPlaying: boolean = false;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private timerID: number | null = null;
  private tempo: number = 120;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // s

  // Callbacks
  private onStepCallback: ((step: number) => void) | null = null;

  // Tracks
  private tracks: { [key: string]: boolean[] } = {
    kick: new Array(16).fill(false),
    snare: new Array(16).fill(false),
    hihat: new Array(16).fill(false),
    clap: new Array(16).fill(false),
    synth: new Array(16).fill(false),
    piano: new Array(16).fill(false),
    bass: new Array(16).fill(false),
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.gainNode = this.audioContext.createGain();

      // Master Chain: gainNode -> Analyser -> Destination
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.setupEffects();
    }
  }

  private async setupEffects() {
    if (!this.audioContext || !this.gainNode) return;

    // Reverb Setup
    this.reverbNode = this.audioContext.createConvolver();
    this.reverbInput = this.audioContext.createGain();

    const rate = this.audioContext.sampleRate;
    const length = rate * 2; // 2 seconds
    const decay = 2.0;
    const impulse = this.audioContext.createBuffer(2, length, rate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const n = length - i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    this.reverbNode.buffer = impulse;

    this.reverbInput.connect(this.reverbNode);
    this.reverbNode.connect(this.gainNode); // Return to master

    // Delay Setup
    this.delayNode = this.audioContext.createDelay();
    this.delayNode.delayTime.value = 0.3; // 300ms
    this.delayInput = this.audioContext.createGain();

    const feedback = this.audioContext.createGain();
    feedback.gain.value = 0.4;

    this.delayInput.connect(this.delayNode);
    this.delayNode.connect(feedback);
    feedback.connect(this.delayNode);

    this.delayNode.connect(this.gainNode); // Return to master

    // Distortion Setup (Insert effect logic handled in connectToEffects, but node created here)
    this.distortionNode = this.audioContext.createWaveShaper();
    this.distortionNode.curve = this.makeDistortionCurve(400);
    this.distortionNode.oversample = '4x';
  }

  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public start() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.audioContext!.currentTime;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID) {
      window.clearTimeout(this.timerID);
    }
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setTrackStep(track: string, step: number, active: boolean) {
    if (this.tracks[track]) {
      this.tracks[track][step] = active;
    }
  }

  public setEffect(effect: 'reverb' | 'delay' | 'distortion', active: boolean) {
    if (effect === 'reverb') this.isReverbOn = active;
    if (effect === 'delay') this.isDelayOn = active;
    if (effect === 'distortion') this.isDistortionOn = active;
  }

  public setOnStepCallback(callback: (step: number) => void) {
    this.onStepCallback = callback;
  }

  public getAnalyser() {
    return this.analyser;
  }

  private scheduler() {
    if (!this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += 0.25 * secondsPerBeat; // 16th notes
    this.currentStep++;
    if (this.currentStep === 16) {
      this.currentStep = 0;
    }
  }

  private scheduleNote(step: number, time: number) {
    if (this.tracks.kick[step]) this.playKick(time);
    if (this.tracks.snare[step]) this.playSnare(time);
    if (this.tracks.hihat[step]) this.playHiHat(time);
    if (this.tracks.clap[step]) this.playClap(time);
    if (this.tracks.synth[step]) this.playSynth(time);
    if (this.tracks.piano[step]) this.playPiano(time);
    if (this.tracks.bass[step]) this.playBass(time);

    if (this.onStepCallback) {
        const drawTime = (time - this.audioContext!.currentTime) * 1000;
        setTimeout(() => {
            if (this.onStepCallback) this.onStepCallback(step);
        }, Math.max(0, drawTime));
    }
  }

  private connectToEffects(source: AudioNode) {
    if (!this.audioContext || !this.gainNode) return;

    let currentNode = source;

    // Distortion (Insert)
    if (this.isDistortionOn && this.distortionNode) {
      const distGain = this.audioContext.createGain();
      distGain.gain.value = 0.5;
      currentNode.connect(this.distortionNode);
      this.distortionNode.connect(distGain);
      currentNode = distGain;
    }

    // Connect to Master (Dry)
    currentNode.connect(this.gainNode);

    // Delay Send
    if (this.isDelayOn && this.delayInput) {
      const send = this.audioContext.createGain();
      send.gain.value = 0.5;
      currentNode.connect(send);
      send.connect(this.delayInput);
    }

    // Reverb Send
    if (this.isReverbOn && this.reverbInput) {
      const send = this.audioContext.createGain();
      send.gain.value = 0.6;
      currentNode.connect(send);
      send.connect(this.reverbInput);
    }
  }

  // Sound Synthesis

  private playKick(time: number) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    this.connectToEffects(gain);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  private playSnare(time: number) {
    if (!this.audioContext) return;
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(1, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    this.connectToEffects(noiseGain);

    const osc = this.audioContext.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, time);
    const oscGain = this.audioContext.createGain();
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(oscGain);
    this.connectToEffects(oscGain);

    noise.start(time);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playHiHat(time: number) {
    if (!this.audioContext) return;
    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    this.connectToEffects(gain);

    noise.start(time);
  }

  private playClap(time: number) {
    if (!this.audioContext) return;
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 1;

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    this.connectToEffects(gain);

    noise.start(time);
  }

  private playSynth(time: number) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, time); // A4

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.linearRampToValueAtTime(2000, time + 0.1);

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    this.connectToEffects(gain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playPiano(time: number) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, time); // C5

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 1.0);

    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(523.25, time);
    const gain2 = this.audioContext.createGain();
    gain2.gain.setValueAtTime(0.1, time);
    gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

    osc.connect(gain);
    osc2.connect(gain2);

    this.connectToEffects(gain);
    this.connectToEffects(gain2);

    osc.start(time);
    osc.stop(time + 1.0);
    osc2.start(time);
    osc2.stop(time + 1.0);
  }

  private playBass(time: number) {
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, time); // A2

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, time);

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    this.connectToEffects(gain);

    osc.start(time);
    osc.stop(time + 0.4);
  }
}
