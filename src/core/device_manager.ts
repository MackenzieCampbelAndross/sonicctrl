import { AudioDevice } from '../types';

export class DeviceManager {
  static getInitialDevices(): AudioDevice[] {
    return [
      {
        id: 'dev-headphones',
        name: 'Headphones (Realtek High Definition Audio)',
        type: 'OUTPUT',
        isDefault: true,
        sampleRate: 48000,
        channels: 2
      },
      {
        id: 'dev-speakers',
        name: 'Desktop Studio Monitors (USB Audio DAC)',
        type: 'OUTPUT',
        isDefault: false,
        sampleRate: 96000,
        channels: 2
      },
      {
        id: 'dev-hdmi',
        name: 'LG UltraFine Display (HDMI Audio)',
        type: 'OUTPUT',
        isDefault: false,
        sampleRate: 48000,
        channels: 2
      },
      {
        id: 'dev-virtual-cable',
        name: 'VB-Audio Virtual Cable (Virtual Routing)',
        type: 'OUTPUT',
        isDefault: false,
        sampleRate: 48000,
        channels: 2
      },
      {
        id: 'dev-mic',
        name: 'HyperX QuadCast Microphone',
        type: 'INPUT',
        isDefault: true,
        sampleRate: 48000,
        channels: 2
      }
    ];
  }

  static getDeviceById(devices: AudioDevice[], id: string): AudioDevice | undefined {
    return devices.find((d) => d.id === id);
  }

  static setDefaultDevice(devices: AudioDevice[], id: string): AudioDevice[] {
    return devices.map((d) => ({
      ...d,
      isDefault: d.id === id
    }));
  }
}
