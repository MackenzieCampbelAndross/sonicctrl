import { describe, it, expect } from 'vitest';
import { useSonicStore } from '../src/core/sonic_store';

describe('useSonicStore', () => {
  it('manages master volume within bounds', () => {
    useSonicStore.getState().setMasterVolume(120);
    expect(useSonicStore.getState().masterVolume).toBe(100);

    useSonicStore.getState().setMasterVolume(-10);
    expect(useSonicStore.getState().masterVolume).toBe(0);

    useSonicStore.getState().setMasterVolume(75);
    expect(useSonicStore.getState().masterVolume).toBe(75);
  });

  it('updates session volume, pan, and mute states', () => {
    const sessionId = useSonicStore.getState().sessions[0].id;

    useSonicStore.getState().setSessionVolume(sessionId, 60);
    expect(useSonicStore.getState().sessions[0].volume).toBe(60);

    useSonicStore.getState().setSessionPan(sessionId, -0.5);
    expect(useSonicStore.getState().sessions[0].panBalance).toBe(-0.5);

    useSonicStore.getState().toggleSessionMute(sessionId);
    expect(useSonicStore.getState().sessions[0].isMuted).toBe(true);
  });

  it('applies sound profile overrides across application streams', () => {
    useSonicStore.getState().applyProfile('GAMING');
    expect(useSonicStore.getState().activeProfile).toBe('GAMING');

    const gameSession = useSonicStore.getState().sessions.find((s) => s.processName === 'game.exe');
    expect(gameSession?.volume).toBe(100);
  });
});
