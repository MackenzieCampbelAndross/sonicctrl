import React from 'react';
import { useSonicStore } from '../core/sonic_store';
import { SoundProfile } from '../types';
import { Volume2, VolumeX, Sliders, Waves, Speaker, Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenDevices: () => void;
}

const PROFILES: Array<{ profile: SoundProfile; label: string; icon: string }> = [
  { profile: 'DEFAULT', label: 'Default', icon: '⚖️' },
  { profile: 'GAMING', label: 'Gaming', icon: '🎮' },
  { profile: 'MOVIES', label: 'Movies', icon: '🎬' },
  { profile: 'VOICE', label: 'Voice & Pod', icon: '🎙️' },
  { profile: 'MUSIC', label: 'Music', icon: '🎵' },
  { profile: 'NIGHT_MODE', label: 'Night Mode', icon: '🌙' }
];

export const Header: React.FC<HeaderProps> = ({ onOpenDevices }) => {
  const {
    masterVolume,
    setMasterVolume,
    isMasterMuted,
    toggleMasterMute,
    activeProfile,
    applyProfile,
    isNormalizing,
    toggleNormalization,
    activeOutputDeviceId,
    setDefaultOutputDevice,
    devices
  } = useSonicStore();

  const outputDevices = devices.filter((d) => d.type === 'OUTPUT');

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30 px-6 py-4 space-y-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                SonicCtrl
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Advanced Desktop Audio Mixer & Per-App Router</p>
          </div>
        </div>

        {/* Master Output Device & Volume */}
        <div className="flex flex-1 max-w-xl w-full items-center gap-4 bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMasterMute}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isMasterMuted
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="text-xs font-mono font-bold text-slate-200 w-10">
              {masterVolume}%
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseInt(e.target.value))}
            className="flex-1 accent-purple-500 cursor-pointer"
          />

          {/* Master Output Routing */}
          <select
            value={activeOutputDeviceId}
            onChange={(e) => setDefaultOutputDevice(e.target.value)}
            className="max-w-[160px] px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 truncate focus:ring-2 focus:ring-purple-500"
          >
            {outputDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleNormalization}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isNormalizing
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Compress peak transients and boost low whisper dialog"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Normalizer</span>
          </button>

          <button
            onClick={onOpenDevices}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Speaker className="w-3.5 h-3.5 text-purple-400" />
            <span>Device Hub</span>
          </button>
        </div>
      </div>

      {/* Profile Selector Strip */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pt-1 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 mr-1 font-semibold uppercase tracking-wider text-[10px]">
            Sound Profiles:
          </span>
          {PROFILES.map((p) => (
            <button
              key={p.profile}
              onClick={() => applyProfile(p.profile)}
              className={`px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeProfile === p.profile
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
