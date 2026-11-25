import React from 'react';
import { AudioSession, AudioDevice } from '../types';
import { useSonicStore } from '../core/sonic_store';
import { Volume2, VolumeX, Sliders, Headphones, Speaker, Globe, Music, MessageSquare, Gamepad2 } from 'lucide-react';

interface SessionMixerStripProps {
  session: AudioSession;
  devices: AudioDevice[];
  onOpenEq: (session: AudioSession) => void;
}

export const SessionMixerStrip: React.FC<SessionMixerStripProps> = ({ session, devices, onOpenEq }) => {
  const {
    setSessionVolume,
    toggleSessionMute,
    toggleSessionSolo,
    setSessionPan,
    setSessionDevice
  } = useSonicStore();

  const getAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'Music':
        return <Music className="w-4 h-4 text-emerald-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4 text-rose-400" />;
      case 'Globe':
      default:
        return <Globe className="w-4 h-4 text-cyan-400" />;
    }
  };

  const outputDevices = devices.filter((d) => d.type === 'OUTPUT');

  return (
    <div className={`p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
      session.isSolo
        ? 'bg-purple-950/30 border-purple-500 shadow-xl shadow-purple-950/20'
        : session.isMuted
        ? 'bg-slate-900/50 border-slate-800/60 opacity-60'
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg'
    }`}>
      {/* App Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-2 truncate">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
              {getAppIcon(session.icon)}
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-slate-100 truncate">{session.displayName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{session.processName}</div>
            </div>
          </div>

          {/* Mute & Solo Toggles */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => toggleSessionSolo(session.id)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                session.isSolo
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={session.isSolo ? 'Solo Active' : 'Solo Channel'}
            >
              S
            </button>

            <button
              onClick={() => toggleSessionMute(session.id)}
              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                session.isMuted
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={session.isMuted ? 'Unmute' : 'Mute'}
            >
              {session.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Fader & Stereo Peak Meters */}
      <div className="flex items-center space-x-4 py-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
        {/* Stereo Peak Meter LED Bars (Left & Right) */}
        <div className="flex space-x-1 h-36 w-6 shrink-0 py-1">
          {/* Left Channel */}
          <div className="flex-1 bg-slate-900 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div
              className={`w-full rounded-full transition-all duration-75 ${
                session.peakL > 85
                  ? 'bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500'
                  : 'bg-gradient-to-t from-emerald-500 to-amber-400'
              }`}
              style={{ height: `${session.isMuted ? 0 : session.peakL}%` }}
            />
          </div>

          {/* Right Channel */}
          <div className="flex-1 bg-slate-900 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
            <div
              className={`w-full rounded-full transition-all duration-75 ${
                session.peakR > 85
                  ? 'bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500'
                  : 'bg-gradient-to-t from-emerald-500 to-amber-400'
              }`}
              style={{ height: `${session.isMuted ? 0 : session.peakR}%` }}
            />
          </div>
        </div>

        {/* Vertical Volume Fader */}
        <div className="flex-1 flex flex-col items-center justify-between h-36">
          <div className="text-xs font-mono font-bold text-slate-200">
            {session.volume}%
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center">
            <input
              type="range"
              min="0"
              max="100"
              value={session.volume}
              onChange={(e) => setSessionVolume(session.id, parseInt(e.target.value))}
              className="w-28 accent-purple-500 cursor-pointer -rotate-90"
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {session.volume === 0 ? '-∞ dB' : `${(20 * Math.log10(session.volume / 100)).toFixed(1)} dB`}
          </div>
        </div>
      </div>

      {/* Stereo Pan Balance */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>L</span>
          <span>Pan: {session.panBalance === 0 ? 'Center' : session.panBalance < 0 ? `${Math.round(session.panBalance * -100)}% L` : `${Math.round(session.panBalance * 100)}% R`}</span>
          <span>R</span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={session.panBalance}
          onChange={(e) => setSessionPan(session.id, parseFloat(e.target.value))}
          className="w-full accent-indigo-400 cursor-pointer h-1.5"
        />
      </div>

      {/* Audio Routing Device Selector & EQ Trigger */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div>
          <label className="block text-[10px] text-slate-400 mb-1 flex items-center gap-1">
            <Speaker className="w-3 h-3 text-purple-400" /> Output Device Routing
          </label>
          <select
            value={session.outputDeviceId}
            onChange={(e) => setSessionDevice(session.id, e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 truncate"
          >
            {outputDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onOpenEq(session)}
          className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>EQ Preset ({session.eqPreset})</span>
        </button>
      </div>
    </div>
  );
};
