// Generates WAV sound files for UI clicks
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'sounds');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

const SR = 44100;

function makeWav(samples) {
  const dataLen = samples.length * 2;
  const buf = Buffer.alloc(44 + dataLen);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);   // PCM
  buf.writeUInt16LE(1, 22);   // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataLen, 40);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  return buf;
}

function noise(len) {
  return Array.from({ length: len }, () => Math.random() * 2 - 1);
}

// 1. Glass tap — three sine harmonics with sharp attack, long decay
function glassSound() {
  const dur = 0.5, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const freqs = [1047, 1319, 2093];
  const vols  = [0.18,  0.14,  0.09];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    freqs.forEach((f, fi) => {
      const env = Math.exp(-t * 9) * (i < 220 ? i / 220 : 1);
      v += Math.sin(2 * Math.PI * f * t) * env * vols[fi];
    });
    s[i] = v;
  }
  return s;
}

// 2. Wood knock — low triangle + filtered noise burst
function woodSound() {
  const dur = 0.12, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const raw = noise(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 28);
    // simple lowpass: average 8 samples
    let lp = 0;
    for (let k = Math.max(0, i-8); k <= i; k++) lp += raw[k];
    lp /= (i < 8 ? i + 1 : 9);
    const tri = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * 155 * t));
    s[i] = (lp * 0.22 + tri * 0.18) * env;
  }
  return s;
}

// 3. Plastic toggle — bandpass noise click
function toggleSound() {
  const dur = 0.04, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const raw = noise(n);
  // simple bandpass: HP then LP
  let hp = 0, lp = 0;
  const hpA = Math.exp(-2 * Math.PI * 900 / SR);
  const lpA = Math.exp(-2 * Math.PI * 2200 / SR);
  for (let i = 0; i < n; i++) {
    hp = hpA * hp + (1 - hpA) * raw[i];
    const bp = raw[i] - hp;
    lp = lpA * lp + (1 - lpA) * bp;
    const env = Math.exp(-(i / SR) * 60);
    s[i] = lp * env * 0.55;
  }
  return s;
}

// 4. Metal ping — sine with very slow decay
function metalSound() {
  const dur = 0.45, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const freqs = [740, 1480, 2220];
  const vols  = [0.20, 0.14, 0.09];
  const decays = [6, 10, 16];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    freqs.forEach((f, fi) => {
      const env = Math.exp(-t * decays[fi]) * (i < 110 ? i / 110 : 1);
      v += Math.sin(2 * Math.PI * f * t) * env * vols[fi];
    });
    s[i] = v;
  }
  return s;
}

// 5. Soft tap — very short low thud
function softSound() {
  const dur = 0.06, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const raw = noise(n);
  let lp = 0;
  const lpA = Math.exp(-2 * Math.PI * 550 / SR);
  for (let i = 0; i < n; i++) {
    lp = lpA * lp + (1 - lpA) * raw[i];
    const env = Math.exp(-(i / SR) * 45);
    s[i] = lp * env * 0.55;
  }
  return s;
}

// 6. Type click — very short highpass noise burst
function typeSound() {
  const dur = 0.022, n = Math.floor(SR * dur);
  const s = new Float32Array(n);
  const raw = noise(n);
  let hp = 0;
  const hpA = Math.exp(-2 * Math.PI * 1800 / SR);
  for (let i = 0; i < n; i++) {
    hp = hpA * hp + (1 - hpA) * raw[i];
    const env = 1 - i / n;
    s[i] = (raw[i] - hp) * env * 0.28;
  }
  return s;
}

const sounds = {
  'click-glass.wav':  glassSound(),
  'click-wood.wav':   woodSound(),
  'click-toggle.wav': toggleSound(),
  'click-metal.wav':  metalSound(),
  'click-soft.wav':   softSound(),
  'click-type.wav':   typeSound(),
};

for (const [name, samples] of Object.entries(sounds)) {
  const out = path.join(DIR, name);
  fs.writeFileSync(out, makeWav(samples));
  console.log('wrote', out);
}
console.log('done');
