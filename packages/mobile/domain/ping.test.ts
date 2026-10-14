import { test, expect } from 'bun:test';
import { summarizePing } from './ping';
const base = { ip: '8.8.8.8', sent: 3, measuredAt: 1 };
test('ping median from actual replies, not timeouts', () => {
  expect(summarizePing({ ...base, samplesMs: [30, 10, 20] })).toEqual({ medianMs: 20, lossPercent: 0, received: 3 });
  expect(summarizePing({ ...base, samplesMs: [10, 30] }).medianMs).toBe(20);
});
test('no reply never invents latency', () => {
  expect(summarizePing({ ...base, samplesMs: [] })).toEqual({ medianMs: null, lossPercent: 100, received: 0 });
  expect(summarizePing({ ...base, samplesMs: [0.5] }).medianMs).toBe(0.5);
});
test('rejects malformed native samples', () => {
  for (const samplesMs of [[NaN], [-1], [Infinity], [10001], [1, 2, 3, 4]]) expect(() => summarizePing({ ...base, samplesMs })).toThrow();
});