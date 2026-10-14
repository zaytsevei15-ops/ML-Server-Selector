import { useQuery } from '@tanstack/react-query';
import { orpc } from '../lib/api';
import { useSelector } from '../state/selector-context';

export function useVpnGate() {
  const { prefs } = useSelector();
  return useQuery(orpc.vpnGate.list.queryOptions({ enabled: prefs.consent,
    staleTime: 60_000, retry: 1, refetchOnWindowFocus: false }));
}
export function profileInspectionOptions() {
  return orpc.vpnGate.inspect.mutationOptions();
}