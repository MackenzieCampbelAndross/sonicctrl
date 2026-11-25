import { describe, it, expect } from 'vitest';
import { DeviceManager } from '../src/core/device_manager';

describe('DeviceManager', () => {
  it('discovers and categorizes audio hardware endpoints', () => {
    const devices = DeviceManager.getInitialDevices();
    expect(devices.length).toBeGreaterThan(0);

    const outputs = devices.filter((d) => d.type === 'OUTPUT');
    const inputs = devices.filter((d) => d.type === 'INPUT');

    expect(outputs.length).toBeGreaterThanOrEqual(3);
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('switches default audio device atomically', () => {
    const devices = DeviceManager.getInitialDevices();
    const updated = DeviceManager.setDefaultDevice(devices, 'dev-speakers');

    const newDefault = updated.find((d) => d.isDefault);
    expect(newDefault?.id).toBe('dev-speakers');

    const oldDefault = updated.find((d) => d.id === 'dev-headphones');
    expect(oldDefault?.isDefault).toBe(false);
  });
});
