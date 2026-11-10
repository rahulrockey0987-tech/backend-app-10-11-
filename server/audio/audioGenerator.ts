/**
 * Audio synthesis helper generating standard RIFF/WAV buffers for voice notes.
 * Generates valid, audible 16-bit PCM WAV audio with natural vocal-range formant harmonics.
 */
export function generateVoiceAudioWav(durationSeconds: number, baseFrequency = 180): Buffer {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk 1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // PCM format = 1
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // 'data' chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate pleasant, organic speech-cadence vocal pattern with pauses and inflections
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Speech envelope: natural speech bursts (syllables) and sentence pauses
    const syllableRhythm = Math.sin(2 * Math.PI * 3.5 * t);
    const pauseRhythm = Math.sin(2 * Math.PI * 0.4 * t);
    const isPause = pauseRhythm < -0.4;

    let sampleVal = 0;
    if (!isPause) {
      const envelope = Math.max(0, syllableRhythm) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 1.2 * t));
      // Voice fundamental with 3 vocal tract formant harmonics (speech warmth)
      const f0 = baseFrequency + 15 * Math.sin(2 * Math.PI * 2 * t);
      const f1 = f0 * 2;
      const f2 = f0 * 3;
      const f3 = f0 * 4.2;

      const wave =
        0.5 * Math.sin(2 * Math.PI * f0 * t) +
        0.3 * Math.sin(2 * Math.PI * f1 * t) +
        0.15 * Math.sin(2 * Math.PI * f2 * t) +
        0.05 * Math.sin(2 * Math.PI * f3 * t);

      sampleVal = wave * envelope * 0.7;
    }

    // Convert to 16-bit integer (-32768 to 32767)
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * 28000)));
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}
