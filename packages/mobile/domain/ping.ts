export type PingResult = { ip: string; samplesMs: number[]; sent: number; measuredAt: number };
export function summarizePing(value: PingResult) {
  if (value.sent !== 3 || !Array.isArray(value.samplesMs) || value.samplesMs.length > 3 ||
      value.samplesMs.some(n => !Number.isFinite(n) || n < 0 || n > 10000) || !Number.isFinite(value.measuredAt)) throw new Error('INVALID_PING_RESULT');
  const sorted = [...value.samplesMs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianMs = sorted.length === 0 ? null : sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return { medianMs, lossPercent: (3 - sorted.length) / 3 * 100, received: sorted.length };
}