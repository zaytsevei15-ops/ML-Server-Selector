import { useEditor } from '../state/editor-context';
import { applyCountries, visibleNodes } from '../domain/local-edits';
import { vpnCountries } from '../domain/vpn-countries';
import { useVpnGate } from './vpn-gate';
export function useLocalCatalog() {
  const gate = useVpnGate(); const { edits, ready } = useEditor();
  const servers = visibleNodes(gate.data?.servers ?? [], edits);
  const countries = applyCountries(vpnCountries(gate.data?.servers ?? []), edits);
  return { gate, servers, countries, edits, ready };
}