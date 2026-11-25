import React, { useState, useEffect } from 'react';
import { useSonicStore } from './core/sonic_store';
import { AudioSession } from './types';
import { Header } from './components/Header';
import { SessionMixerStrip } from './components/SessionMixerStrip';
import { EqualizerModal } from './components/EqualizerModal';
import { DeviceManagerModal } from './components/DeviceManagerModal';
import { Waves, Sliders, Volume2 } from 'lucide-react';

export const App: React.FC = () => {
  const { sessions, devices, updatePeakMeters } = useSonicStore();
  const [activeEqSession, setActiveEqSession] = useState<AudioSession | null>(null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Animate studio peak meters
  useEffect(() => {
    const timer = setInterval(() => {
      updatePeakMeters();
    }, 90);

    return () => clearInterval(timer);
  }, [updatePeakMeters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Mixer Header */}
      <Header onOpenDevices={() => setIsDeviceModalOpen(true)} />

      {/* Main Studio Channel Strips */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-200">
              Active Audio Channels ({sessions.length})
            </span>
            <span className="text-slate-600">•</span>
            <span>Real-time per-app WASAPI routing and stereo peak levels</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>Solo: [S]</span>
            <span>•</span>
            <span>Mute: [M]</span>
          </div>
        </div>

        {/* Mixer Strips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.map((session) => (
            <SessionMixerStrip
              key={session.id}
              session={session}
              devices={devices}
              onOpenEq={(sess) => setActiveEqSession(sess)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-600 bg-slate-950/80">
        <p>SonicCtrl • Advanced Audio Routing & Per-Application Volume Controller • Autonomous Software Production Pipeline</p>
      </footer>

      {/* Modals */}
      <EqualizerModal
        session={activeEqSession}
        onClose={() => setActiveEqSession(null)}
      />
      <DeviceManagerModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />
    </div>
  );
};

export default App;
