import { describe, it, expect } from 'vitest';
import { MixerEngine } from '../src/core/mixer_engine';
import { DeviceManager } from '../src/core/device_manager';
import { PROFILE_DEFINITIONS } from '../src/core/profile_presets';
import { AudioSession } from '../src/types';

describe('SonicCtrl End-to-End Audio Routing & Mixing Pipeline Integration', () => {
  it('processes per-app WASAPI session routing, sound profile EQ, normalization, and stereo peak levels', () => {
    // 1. Device discovery & selection
    const devices = DeviceManager.getInitialDevices();
    const updatedDevices = DeviceManager.setDefaultDevice(devices, 'dev-speakers');
    const activeDevice = updatedDevices.find((d) => d.isDefault);
    expect(activeDevice?.id).toBe('dev-speakers');

    // 2. Audio session routing & volume
    const session: AudioSession = {
      id: 'sess-cyberpunk',
      processName: 'game.exe',
      displayName: 'Cyberpunk 2077',
      icon: 'Gamepad2',
      volume: 85,
      isMuted: false,
      isSolo: false,
      panBalance: 0.3, // Slightly right panned
      peakL: 0,
      peakR: 0,
      outputDeviceId: activeDevice!.id,
      eqPreset: 'BASS_BOOST',
      eqBands: [6, 4, 0, -1, -2]
    };

    // 3. Sound profile application: GAMING
    const gamingDef = PROFILE_DEFINITIONS.GAMING;
    expect(gamingDef.normalizerCompressionRatio).toBe(1.5);

    // 4. Calculate effective volume with master volume at 80%
    const masterVolume = 80;
    const isMasterMuted = false;
    const anySolo = false;

    let effVol = MixerEngine.calculateEffectiveVolume(session, masterVolume, isMasterMuted, anySolo);
    expect(effVol).toBe(68); // 85% * 80% = 68%

    // 5. Apply dynamic range volume normalization
    const normalizedVol = MixerEngine.applyNormalization(effVol, gamingDef.normalizerCompressionRatio);
    expect(normalizedVol).toBeDefined();

    // 6. Generate stereo peak levels
    const peaks = MixerEngine.generatePeakLevels(normalizedVol, session.panBalance, 10);
    expect(peaks.peakL).toBeGreaterThan(0);
    expect(peaks.peakR).toBeGreaterThan(0);
    // Because panned right, peakR should be >= peakL
    expect(peaks.peakR).toBeGreaterThanOrEqual(peaks.peakL);
  });
});
