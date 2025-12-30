
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5; // Default volume
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.updateGain();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val: number) {
      // val is 0 to 1
      this.volume = Math.max(0, Math.min(1, val));
      this.updateGain();
  }

  toggleMute(shouldMute: boolean) {
      this.isMuted = shouldMute;
      this.updateGain();
  }

  private updateGain() {
      if (this.masterGain && this.ctx) {
          const target = this.isMuted ? 0 : this.volume;
          this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
      }
  }

  playKeystroke() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Mechanical click sound (short burst of noise-like tone)
    osc.type = 'triangle';
    // Slight random pitch for realism
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
    
    // Gain logic is handled by masterGain, but we shape the envelope here
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playBuzzer() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playChime() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.1);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  playSuccess() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Nice ascending chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  playFailure() {
     this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    // Harsh low square wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, t); 
    osc.frequency.linearRampToValueAtTime(55, t + 0.2);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  speakSnippet(text: string) {
      if (!("speechSynthesis" in window)) return;
      if (this.isMuted) return; // Respect mute

      // Cancel existing to prevent overlap/spam
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text.slice(0, 150)); // Limit length
      
      // Randomize voice characteristics for glitchy effect
      // Base Rate: 0.85 (Slow/Creepy)
      // Jitter: +/- 0.15
      u.rate = 0.75 + (Math.random() * 0.3);
      
      // Base Pitch: 0.7 (Low)
      // Jitter: +/- 0.2
      u.pitch = 0.6 + (Math.random() * 0.4);
      
      u.volume = this.volume; // Match master volume
      
      // Try to pick a specific voice if available, but RANDOMIZE if multiple match
      const voices = window.speechSynthesis.getVoices();
      
      // Prefer Google or English voices
      const preferredVoices = voices.filter(v => 
          (v.name.includes("Google") || v.name.includes("English")) && !v.name.includes("Female")
      );
      
      // Fallback to any voice if no preferred ones found
      const candidatePool = preferredVoices.length > 0 ? preferredVoices : voices;
      
      if (candidatePool.length > 0) {
          // Pick a random voice from the pool to simulate multiple entities or instability
          u.voice = candidatePool[Math.floor(Math.random() * candidatePool.length)];
      }

      window.speechSynthesis.speak(u);
  }
}

export const audio = new AudioService();
