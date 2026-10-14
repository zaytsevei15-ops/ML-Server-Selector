export type NativeSignal = 'ignore' | 'stop' | 'connected' | 'connecting' | 'disconnecting' | 'disconnected' | 'error';
// Native promises never produce a Connected state. Only the engine's state 3 can.
export function nativeSignal(state: string, flags: { busy: boolean; active: boolean; stopping: boolean }): NativeSignal {
  if (state === '3') return flags.stopping ? 'stop' : 'connected';
  if (state === '2') return flags.stopping ? 'stop' : flags.active ? 'connecting' : 'ignore';
  if (state === '1') return flags.active || flags.stopping ? 'disconnecting' : 'ignore';
  if (state === '0') return flags.busy && !flags.active && !flags.stopping ? 'ignore' : 'disconnected';
  // Upstream maps authentication failure and other unknown states to -1, not -2.
  if (state === '-1' || state === '-2') return flags.active ? 'error' : 'ignore';
  return 'ignore';
}