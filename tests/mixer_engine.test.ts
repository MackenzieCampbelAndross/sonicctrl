import { describe, it, expect } from 'vitest';
import { MixerEngine } from '../src/core/mixer_engine';
import { AudioSession } from '../src/types';

describe('MixerEngine', () => {
  const dummySession: AudioSession = {
    id: 's1',
    processName: 'spotify.exe',
    displayName: 'Spotify',
    icon: 'Music',
    volume: 80,
    isMuted: false,
    isSolo: false,
    panBalance: 0.0,
    peakL: 0,
    peakR: 0,
    outputDeviceId: 'dev-1',
    eqPreset: 'FLAT',
    eqBands: [0, 0, 0, 0, 0]
  };

  it('calculates effective volume respecting master and session levels', () => {
    // Session 80% * Master 50% = 40%
    const eff = MixerEngine.calculateEffectiveVolume(dummySession, 50, false, false);
    expect(eff).toBe(40);
  });

  it('mutes channel if either session or master is muted', () => {
    expect(MixerEngine.calculateEffectiveVolume(dummySession, 80, true, false)).toBe(0);

    const mutedSession = { ...dummySession, isMuted: true };
    expect(MixerEngine.calculateEffectiveVolume(mutedSession, 80, false, false)).toBe(0);
  });

  it('silences non-solo channels when another channel is in solo mode', () => {
    // Solo active elsewhere, but dummySession is not solo
    const nonSoloVol = MixerEngine.calculateEffectiveVolume(dummySession, 100, false, true);
    expect(nonSoloVol).toBe(0);

    // If session is solo, it remains active
    const soloSession = { ...dummySession, isSolo: true };
    const soloVol = MixerEngine.calculateEffectiveVolume(soloSession, 100, false, true);
    expect(soloVol).toBe(80);
  });

  it('calculates stereo pan distribution multipliers accurately', () => {
    const center = MixerEngine.calculatePanMultipliers(0.0);
    expect(center.left).toBe(1.0);
    expect(center.right).toBe(1.0);

    const hardLeft = MixerEngine.calculatePanMultipliers(-1.0);
    expect(hardLeft.left).toBe(1.0);
    expect(hardLeft.right).toBe(0.0);

    const hardRight = MixerEngine.calculatePanMultipliers(1.0);
    expect(hardRight.left).toBe(0.0);
    expect(hardRight.right).toBe(1.0);
  });
});
