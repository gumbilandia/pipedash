// audio.js
// Todo el sonido y la música se generan por código con Web Audio API.
// No se usa ningún archivo de audio externo con copyright.

const SFX = (() => {
  let ctx = null;
  let muted = false;
  let musicNodes = [];
  let musicTimer = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, duration, type = 'square', vol = 0.2, delay = 0, slideTo = null) {
    if (muted) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    if (slideTo) {
      osc.frequency.linearRampToValueAtTime(slideTo, c.currentTime + delay + duration);
    }
    gain.gain.setValueAtTime(vol, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.02);
  }

  function noiseBurst(duration, vol = 0.25, delay = 0) {
    if (muted) return;
    const c = getCtx();
    const bufferSize = c.sampleRate * duration;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, c.currentTime + delay);
    src.connect(gain);
    gain.connect(c.destination);
    src.start(c.currentTime + delay);
  }

  function jump() {
    tone(520, 0.11, 'square', 0.18, 0, 780);
  }

  function score() {
    tone(880, 0.09, 'square', 0.18, 0);
    tone(1175, 0.14, 'square', 0.18, 0.09);
  }

  function hit() {
    noiseBurst(0.25, 0.3, 0);
    tone(160, 0.35, 'sawtooth', 0.22, 0, 60);
  }

  function swoosh() {
    tone(300, 0.18, 'triangle', 0.12, 0, 120);
  }

  // Pequeña melodía en bucle estilo chiptune (secuencia original, 8 compases)
  const melody = [
    659, 659, 0, 659, 0, 523, 659, 0,
    784, 0, 0, 0, 392, 0, 0, 0,
    523, 0, 0, 392, 0, 0, 330, 0,
    0, 440, 0, 494, 0, 466, 440, 0,
    392, 659, 784, 880, 0, 698, 784, 0,
    659, 0, 523, 587, 494, 0, 523, 0
  ];
  let step = 0;

  function playMusicStep() {
    if (muted) { return; }
    const c = getCtx();
    const freq = melody[step % melody.length];
    if (freq > 0) {
      tone(freq, 0.13, 'triangle', 0.07, 0);
      // bajo de acompañamiento
      tone(freq / 2, 0.13, 'square', 0.03, 0);
    }
    step++;
  }

  function startMusic() {
    stopMusic();
    step = 0;
    musicTimer = setInterval(playMusicStep, 150);
  }

  function stopMusic() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
  }

  function setMuted(v) {
    muted = v;
    if (muted) stopMusic();
  }

  function unlock() {
    getCtx();
  }

  return { jump, score, hit, swoosh, startMusic, stopMusic, setMuted, unlock };
})();
