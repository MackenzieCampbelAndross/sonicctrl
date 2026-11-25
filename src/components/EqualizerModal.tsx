import React from 'react';
import { AudioSession, EqPreset } from '../types';
import { useSonicStore } from '../core/sonic_store';
import { X, Sliders, Sparkles } from 'lucide-react';

interface EqualizerModalProps {
  session: AudioSession | null;
  onClose: () => void;
}

const BANDS = [
  { label: '60 Hz', desc: 'Sub Bass' },
  { label: '250 Hz', desc: 'Bass & Warmth' },
  { label: '1 kHz', desc: 'Midrange & Presence' },
  { label: '4 kHz', desc: 'High Mid & Clarity' },
  { label: '16 kHz', desc: 'Treble & Air' }
];

const PRESETS: Array<{ preset: EqPreset; label: string }> = [
  { preset: 'FLAT', label: 'Flat' },
  { preset: 'BASS_BOOST', label: 'Bass Boost' },
  { preset: 'VOCAL', label: 'Vocal Clarity' },
  { preset: 'TREBLE', label: 'Treble Boost' },
  { preset: 'IMMERSIVE', label: 'Immersive Spatial' }
];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ session, onClose }) => {
  const { setSessionEqPreset, setSessionEqBand } = useSonicStore();

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              5-Band Graphic Equalizer: {session.displayName}
            </h2>
            <p className="text-xs text-slate-400">Tailor application-specific acoustic frequency bands</p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESETS.map((p) => (
            <button
              key={p.preset}
              onClick={() => setSessionEqPreset(session.id, p.preset)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                session.eqPreset === p.preset
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 5 Vertical EQ Band Sliders */}
        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center h-52">
          {BANDS.map((band, idx) => {
            const dbVal = session.eqBands[idx] || 0;
            return (
              <div key={band.label} className="flex-1 flex flex-col items-center justify-between h-full">
                <span className="text-[10px] font-mono font-bold text-purple-400">
                  {dbVal > 0 ? `+${dbVal}` : dbVal} dB
                </span>

                <div className="relative flex-1 flex items-center justify-center my-1">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={dbVal}
                    onChange={(e) => setSessionEqBand(session.id, idx, parseInt(e.target.value))}
                    className="w-24 accent-purple-500 cursor-pointer -rotate-90"
                  />
                </div>

                <div className="text-center mt-1">
                  <div className="text-[11px] font-bold text-slate-200">{band.label}</div>
                  <div className="text-[9px] text-slate-500">{band.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
