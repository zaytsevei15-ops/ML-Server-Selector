const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

// The OpenVPN engine is vendored in modules/react-native-openvpn and already fixed for
// RN 0.81 (see its NOTICE.md). Nothing in node_modules is patched at build time anymore.
function checkEngine(root) {
  const file = require.resolve('@aliakhgar1/react-native-openvpn/package.json', { paths: [root] });
  const { version } = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!String(version).includes('-ml.')) {
    throw new Error(`OpenVPN: expected vendored modules/react-native-openvpn, found ${version} at ${path.dirname(file)}. Run "bun install" in the repo root.`);
  }
  return path.dirname(file);
}

module.exports = function withOpenvpn(config) {
  config = withAndroidManifest(config, mod => {
    const app = mod.modResults.manifest.application[0];
    app.$['android:allowBackup'] = 'false';
    app.service = app.service || [];
    const upsert = (name, attrs, children = {}) => {
      const entry = { $: { 'android:name': name, 'android:exported': 'false', ...attrs }, ...children };
      const index = app.service.findIndex(s => s.$['android:name'] === name);
      if (index >= 0) app.service[index] = entry; else app.service.push(entry);
    };
    upsert('de.blinkt.openvpn.core.OpenVPNService', {
      'android:permission': 'android.permission.BIND_VPN_SERVICE',
      'android:foregroundServiceType': 'specialUse',
    }, {
      'intent-filter': [{ action: [{ $: { 'android:name': 'android.net.VpnService' } }] }],
      property: [{ $: { 'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE', 'android:value': 'User-authorized OpenVPN tunnel' } }],
      'meta-data': [{ $: { 'android:name': 'android.net.VpnService.SUPPORTS_ALWAYS_ON', 'android:value': 'false' } }],
    });
    upsert('de.blinkt.openvpn.core.OpenVPNStatusService', {});
    return mod;
  });
  return withDangerousMod(config, ['android', async mod => {
    checkEngine(mod.modRequest.projectRoot);
    return mod;
  }]);
};
module.exports.checkEngine = checkEngine;