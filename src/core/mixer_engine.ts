import { AudioSession } from '../types';

export class MixerEngine {
  /**
   * Compute effective output volume (0 to 100) taking into account master volume,
   * mute states, and active solo channels.
   */
  static calculateEffectiveVolume(
    session: AudioSession,
    masterVolume: number,
    isMasterMuted: boolean,
    anySoloActive: boolean
  ): number {
    if (isMasterMuted || session.isMuted) {
      return 0;
    }

    if (anySoloActive && !session.isSolo) {
      return 0;
    }

    const scaledMaster = Math.max(0, Math.min(100, masterVolume)) / 100;
    const scaledSession = Math.max(0, Math.min(100, session.volume)) / 100;

    return Math.round(scaledMaster * scaledSession * 100);
  }

  /**
   * Calculate stereo gain multipliers based on pan balance (-1.0 to +1.0).
   * Pan of -1.0 means full left (L: 1.0, R: 0.0), 0.0 means center (L: 1.0, R: 1.0),
   * +1.0 means full right (L: 0.0, R: 1.0).
   */
  static calculatePanMultipliers(panBalance: number): { left: number; right: number } {
    const clamped = Math.max(-1.0, Math.min(1.0, panBalance));
    let left = 1.0;
    let right = 1.0;

    if (clamped < 0) {
      right = 1.0 + clamped; // Decrease right
    } else if (clamped > 0) {
      left = 1.0 - clamped; // Decrease left
    }

    return {
      left: parseFloat(left.toFixed(2)),
      right: parseFloat(right.toFixed(2))
    };
  }

  /**
   * Compute realistic dynamic stereo peak levels (0 to 100) for visual meters.
   */
  static generatePeakLevels(
    effectiveVolume: number,
    panBalance: number,
    tick: number
  ): { peakL: number; peakR: number } {
    if (effectiveVolume === 0) {
      return { peakL: 0, peakR: 0 };
    }

    const { left, right } = this.calculatePanMultipliers(panBalance);

    // Natural fluctuation wave
    const wave = Math.sin(tick * 0.25) * 0.15 + Math.cos(tick * 0.4) * 0.1;
    const baseEnergy = (effectiveVolume / 100) * (0.8 + wave);

    const peakL = Math.max(0, Math.min(100, Math.round(baseEnergy * left * 100)));
    const peakR = Math.max(0, Math.min(100, Math.round(baseEnergy * right * 100)));

    return { peakL, peakR };
  }

  /**
   * Apply dynamic range volume normalization (boost low signals, compress loud signals).
   */
  static applyNormalization(volume: number, ratio: number): number {
    if (ratio <= 1.0 || volume === 0) return volume;
    // Compress toward 65dB target
    const target = 65;
    const diff = target - volume;
    const normalized = volume + (diff / ratio);
    return Math.round(Math.max(0, Math.min(100, normalized)));
  }
}
