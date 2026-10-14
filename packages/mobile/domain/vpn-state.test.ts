import { describe, expect, test } from 'bun:test';
import { nativeSignal } from './vpn-state';
const idle = { busy: false, active: false, stopping: false };
const waiting = { ...idle, busy: true };
const tunnel = { ...waiting, active: true };
describe('native signal safety (not device handshake tests)', () => {
  test('only state 3 can report connected', () => {
    for (const state of ['0', '1', '2', '-1', '-2', 'unknown']) expect(nativeSignal(state, tunnel)).not.toBe('connected');
    expect(nativeSignal('3', tunnel)).toBe('connected');
  });
  test('late connecting or connected events after cancel require stop', () => {
    expect(nativeSignal('3', { ...idle, stopping: true })).toBe('stop');
    expect(nativeSignal('2', { ...idle, stopping: true })).toBe('stop');
  });
  test('initial disconnected event cannot cancel permission or profile loading', () => {
    expect(nativeSignal('0', waiting)).toBe('ignore');
    expect(nativeSignal('-1', idle)).toBe('ignore');
    expect(nativeSignal('0', tunnel)).toBe('disconnected');
  });
  test('upstream invalid/auth failure maps to error when active', () => {
    expect(nativeSignal('-1', tunnel)).toBe('error');
    expect(nativeSignal('-2', tunnel)).toBe('error');
    expect(nativeSignal('1', tunnel)).toBe('disconnecting');
  });
});