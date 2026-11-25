import { describe, it, expect } from 'vitest';
import { PROFILE_DEFINITIONS, EQ_PRESETS } from '../src/core/profile_presets';

describe('ProfilePresets', () => {
  it('contains valid definitions for all supported sound profiles', () => {
    const profiles = ['DEFAULT', 'GAMING', 'MOVIES', 'VOICE', 'MUSIC', 'NIGHT_MODE'] as const;

    for (const p of profiles) {
      const def = PROFILE_DEFINITIONS[p];
      expect(def).toBeDefined();
      expect(def.defaultEqBands.length).toBe(5);
      expect(def.normalizerCompressionRatio).toBeGreaterThanOrEqual(1.0);
    }
  });

  it('defines distinct EQ presets for graphic equalization', () => {
    const flat = EQ_PRESETS.FLAT;
    const bass = EQ_PRESETS.BASS_BOOST;
    const vocal = EQ_PRESETS.VOCAL;

    expect(flat).toEqual([0, 0, 0, 0, 0]);
    expect(bass[0]).toBeGreaterThan(0); // 60Hz boosted
    expect(vocal[2]).toBeGreaterThan(0); // 1kHz boosted
  });
});
