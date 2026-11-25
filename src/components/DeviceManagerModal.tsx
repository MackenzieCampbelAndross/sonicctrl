import React from 'react';
import { useSonicStore } from '../core/sonic_store';
import { X, Speaker, Mic, Check } from 'lucide-react';

interface DeviceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceManagerModal: React.FC<DeviceManagerModalProps> = ({ isOpen, onClose }) => {
  const { devices, setDefaultOutputDevice, activeOutputDeviceId } = useSonicStore();

  if (!isOpen) return null;

  const outputDevices = devices.filter((d) => d.type === 'OUTPUT');
  const inputDevices = devices.filter((d) => d.type === 'INPUT');

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
            <Speaker className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Audio Hardware Device Hub</h2>
            <p className="text-xs text-slate-400">Discover and route Windows Core Audio hardware devices</p>
          </div>
        </div>

        {/* Output Devices */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Speaker className="w-3.5 h-3.5 text-purple-400" />
            <span>Output Endpoints ({outputDevices.length})</span>
          </div>

          <div className="space-y-2">
            {outputDevices.map((dev) => {
              const isSelected = activeOutputDeviceId === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => setDefaultOutputDevice(dev.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-md shadow-purple-950/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{dev.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {dev.sampleRate} Hz • {dev.channels} Channels • Low Latency WASAPI
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-purple-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Devices */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Input Endpoints ({inputDevices.length})</span>
          </div>

          <div className="space-y-2">
            {inputDevices.map((dev) => (
              <div
                key={dev.id}
                className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-300 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs">{dev.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {dev.sampleRate} Hz • {dev.channels} Channels
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Default Input
                </span>
              </div>
            ))}
          </div>
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
