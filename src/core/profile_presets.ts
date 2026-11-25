import { SoundProfile, EqPreset } from '../types';

export interface ProfileDefinition {
  profile: SoundProfile;
  title: string;
  tagline: string;
  defaultEqBands: [number, number, number, number, number]; // 60Hz, 250Hz, 1kHz, 4kHz, 16kHz
  normalizerCompressionRatio: number;
  appVolumeOverrides?: Record<string, number>;
}

export const PROFILE_DEFINITIONS: Record<SoundProfile, ProfileDefinition> = {
  DEFAULT: {
    profile: 'DEFAULT',
    title: 'Balanced Reference',
    tagline: 'Neutral, linear frequency response for all applications',
    defaultEqBands: [0, 0, 0, 0, 0],
    normalizerCompressionRatio: 1.0
  },
  GAMING: {
    profile: 'GAMING',
    title: 'Pro Gaming & Footsteps',
    tagline: 'Boosts high-mid spatial footsteps and positional audio cues',
    defaultEqBands: [2, 1, 3, 5, 4],
    normalizerCompressionRatio: 1.5,
    appVolumeOverrides: {
      'game.exe': 100,
      'discord.exe': 85,
      'spotify.exe': 30
    }
  },
  MOVIES: {
    profile: 'MOVIES',
    title: 'Cinematic Theater',
    tagline: 'Deep sub-bass rumble with crystal dialogue clarity',
    defaultEqBands: [6, 2, 0, 3, 4],
    normalizerCompressionRatio: 1.8
  },
  VOICE: {
    profile: 'VOICE',
    title: 'Voice & Podcasts',
    tagline: 'High-pass filter cutting mud, highlighting human speech frequencies',
    defaultEqBands: [-4, -2, 4, 3, -1],
    normalizerCompressionRatio: 2.2,
    appVolumeOverrides: {
      'discord.exe': 100,
      'spotify.exe': 25
    }
  },
  MUSIC: {
    profile: 'MUSIC',
    title: 'Studio Audiophile',
    tagline: 'Warm acoustic curve with tight bass and sparkling air',
    defaultEqBands: [4, 1, -1, 2, 4],
    normalizerCompressionRatio: 1.2
  },
  NIGHT_MODE: {
    profile: 'NIGHT_MODE',
    title: 'Midnight Stealth',
    tagline: 'Aggressive dynamic range compression preventing sudden volume spikes',
    defaultEqBands: [-6, -3, 2, -2, -4],
    normalizerCompressionRatio: 3.5
  }
};

export const EQ_PRESETS: Record<EqPreset, [number, number, number, number, number]> = {
  FLAT: [0, 0, 0, 0, 0],
  BASS_BOOST: [6, 4, 0, -1, -2],
  VOCAL: [-4, -1, 5, 4, 0],
  TREBLE: [-2, 0, 1, 4, 6],
  IMMERSIVE: [5, 2, -2, 3, 5]
};
