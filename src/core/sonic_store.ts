import { create } from 'zustand';
import {
  AudioSession,
  AudioDevice,
  SoundProfile,
  EqPreset
} from '../types';
import { DeviceManager } from './device_manager';
import { MixerEngine } from './mixer_engine';
import { PROFILE_DEFINITIONS, EQ_PRESETS } from './profile_presets';

interface SonicStore {
  masterVolume: number;
  isMasterMuted: boolean;
  activeProfile: SoundProfile;
  isNormalizing: boolean;
  activeOutputDeviceId: string;
  devices: AudioDevice[];
  sessions: AudioSession[];
  meterTick: number;

  // Actions
  setMasterVolume: (vol: number) => void;
  toggleMasterMute: () => void;
  setSessionVolume: (id: string, vol: number) => void;
  toggleSessionMute: (id: string) => void;
  toggleSessionSolo: (id: string) => void;
  setSessionPan: (id: string, pan: number) => void;
  setSessionDevice: (sessionId: string, deviceId: string) => void;
  setSessionEqPreset: (sessionId: string, preset: EqPreset) => void;
  setSessionEqBand: (sessionId: string, bandIndex: number, dbValue: number) => void;
  applyProfile: (profile: SoundProfile) => void;
  toggleNormalization: () => void;
  setDefaultOutputDevice: (deviceId: string) => void;
  updatePeakMeters: () => void;
}

const INITIAL_DEVICES = DeviceManager.getInitialDevices();

const INITIAL_SESSIONS: AudioSession[] = [
  {
    id: 'sess-spotify',
    processName: 'spotify.exe',
    displayName: 'Spotify Music',
    icon: 'Music',
    volume: 75,
    isMuted: false,
    isSolo: false,
    panBalance: 0.0,
    peakL: 60,
    peakR: 62,
    outputDeviceId: 'dev-headphones',
    eqPreset: 'IMMERSIVE',
    eqBands: [5, 2, -2, 3, 5]
  },
  {
    id: 'sess-discord',
    processName: 'discord.exe',
    displayName: 'Discord Voice & Video',
    icon: 'MessageSquare',
    volume: 85,
    isMuted: false,
    isSolo: false,
    panBalance: 0.0,
    peakL: 45,
    peakR: 45,
    outputDeviceId: 'dev-headphones',
    eqPreset: 'VOCAL',
    eqBands: [-4, -1, 5, 4, 0]
  },
  {
    id: 'sess-game',
    processName: 'game.exe',
    displayName: 'Cyberpunk 2077',
    icon: 'Gamepad2',
    volume: 90,
    isMuted: false,
    isSolo: false,
    panBalance: 0.0,
    peakL: 78,
    peakR: 82,
    outputDeviceId: 'dev-speakers',
    eqPreset: 'BASS_BOOST',
    eqBands: [6, 4, 0, -1, -2]
  },
  {
    id: 'sess-chrome',
    processName: 'chrome.exe',
    displayName: 'Google Chrome (YouTube)',
    icon: 'Globe',
    volume: 65,
    isMuted: false,
    isSolo: false,
    panBalance: -0.2,
    peakL: 55,
    peakR: 45,
    outputDeviceId: 'dev-headphones',
    eqPreset: 'FLAT',
    eqBands: [0, 0, 0, 0, 0]
  }
];

export const useSonicStore = create<SonicStore>((set, get) => ({
  masterVolume: 80,
  isMasterMuted: false,
  activeProfile: 'DEFAULT',
  isNormalizing: false,
  activeOutputDeviceId: 'dev-headphones',
  devices: INITIAL_DEVICES,
  sessions: INITIAL_SESSIONS,
  meterTick: 0,

  setMasterVolume: (masterVolume) =>
    set({ masterVolume: Math.max(0, Math.min(100, masterVolume)) }),

  toggleMasterMute: () =>
    set((state) => ({ isMasterMuted: !state.isMasterMuted })),

  setSessionVolume: (id, vol) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, volume: Math.max(0, Math.min(100, vol)) } : s
      )
    })),

  toggleSessionMute: (id) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, isMuted: !s.isMuted } : s
      )
    })),

  toggleSessionSolo: (id) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, isSolo: !s.isSolo } : s
      )
    })),

  setSessionPan: (id, pan) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, panBalance: Math.max(-1.0, Math.min(1.0, pan)) } : s
      )
    })),

  setSessionDevice: (sessionId, deviceId) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, outputDeviceId: deviceId } : s
      )
    })),

  setSessionEqPreset: (sessionId, preset) => {
    const bands = EQ_PRESETS[preset] || EQ_PRESETS.FLAT;
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, eqPreset: preset, eqBands: [...bands] } : s
      )
    }));
  },

  setSessionEqBand: (sessionId, bandIndex, dbValue) =>
    set((state) => ({
      sessions: state.sessions.map((s) => {
        if (s.id !== sessionId) return s;
        const newBands = [...s.eqBands] as [number, number, number, number, number];
        newBands[bandIndex] = Math.max(-12, Math.min(12, dbValue));
        return { ...s, eqBands: newBands };
      })
    })),

  applyProfile: (profile) => {
    const def = PROFILE_DEFINITIONS[profile];
    set((state) => {
      const updatedSessions = state.sessions.map((s) => {
        let vol = s.volume;
        if (def.appVolumeOverrides && def.appVolumeOverrides[s.processName] !== undefined) {
          vol = def.appVolumeOverrides[s.processName];
        }
        return {
          ...s,
          volume: vol,
          eqBands: [...def.defaultEqBands] as [number, number, number, number, number]
        };
      });

      return {
        activeProfile: profile,
        sessions: updatedSessions
      };
    });
  },

  toggleNormalization: () =>
    set((state) => ({ isNormalizing: !state.isNormalizing })),

  setDefaultOutputDevice: (deviceId) => {
    const updatedDevices = DeviceManager.setDefaultDevice(get().devices, deviceId);
    set({
      activeOutputDeviceId: deviceId,
      devices: updatedDevices
    });
  },

  updatePeakMeters: () => {
    const { sessions, masterVolume, isMasterMuted, meterTick, isNormalizing, activeProfile } = get();
    const nextTick = meterTick + 1;
    const anySolo = sessions.some((s) => s.isSolo);
    const def = PROFILE_DEFINITIONS[activeProfile];

    const updated = sessions.map((s) => {
      let effVol = MixerEngine.calculateEffectiveVolume(s, masterVolume, isMasterMuted, anySolo);
      if (isNormalizing) {
        effVol = MixerEngine.applyNormalization(effVol, def.normalizerCompressionRatio);
      }
      const peaks = MixerEngine.generatePeakLevels(effVol, s.panBalance, nextTick);
      return {
        ...s,
        peakL: peaks.peakL,
        peakR: peaks.peakR
      };
    });

    set({ sessions: updated, meterTick: nextTick });
  }
}));
