/**
 * Domain types and models for SonicCtrl (Audio Routing & Volume Controller).
 */

export type SoundProfile = 'GAMING' | 'MOVIES' | 'VOICE' | 'MUSIC' | 'NIGHT_MODE' | 'DEFAULT';

export type EqPreset = 'FLAT' | 'BASS_BOOST' | 'VOCAL' | 'TREBLE' | 'IMMERSIVE';

export interface AudioDevice {
  id: string;
  name: string;
  type: 'OUTPUT' | 'INPUT';
  isDefault: boolean;
  sampleRate: number; // e.g. 48000
  channels: number; // e.g. 2
}

export interface AudioSession {
  id: string;
  processName: string; // e.g. "chrome.exe", "spotify.exe", "discord.exe", "game.exe"
  displayName: string;
  icon: string; // e.g. "Globe", "Music", "MessageSquare", "Gamepad2"
  volume: number; // 0 to 100
  isMuted: boolean;
  isSolo: boolean;
  panBalance: number; // -1.0 (Full Left) to +1.0 (Full Right)
  peakL: number; // 0 to 100 (Peak meter left)
  peakR: number; // 0 to 100 (Peak meter right)
  outputDeviceId: string;
  eqPreset: EqPreset;
  eqBands: [number, number, number, number, number]; // 60Hz, 250Hz, 1kHz, 4kHz, 16kHz in dB (-12 to +12)
}

export interface MasterAudioState {
  masterVolume: number; // 0 to 100
  isMasterMuted: boolean;
  activeProfile: SoundProfile;
  isNormalizing: boolean;
  activeOutputDeviceId: string;
}
