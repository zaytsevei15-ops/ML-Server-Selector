const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const mobile = path.join(root, 'packages/mobile');
const plugin = require(path.join(mobile, 'plugins/with-openvpn.cjs'));
const pingPlugin = require(path.join(mobile, 'plugins/with-node-ping.cjs'));
const sampleApp = 'val packages = PackageList(this).packages.apply {\n}';
const registered = pingPlugin.register(sampleApp);
assert.equal(pingPlugin.register(registered), registered);
assert.ok(registered.includes('add(com.mlselector.nodeping.NodePingPackage())'));
assert.throws(() => pingPlugin.register('unknown template'));
const pingSource = fs.readFileSync(path.join(mobile, 'native/NodePingModule.kt'), 'utf8');
assert.ok(pingSource.includes('ProcessBuilder("/system/bin/ping", "-n", "-c", "3"'));
assert.ok(pingSource.includes('waitFor(10, TimeUnit.SECONDS)'));
assert.ok(pingSource.includes('if (!publicIPv4(ip))'));
const engineDir = plugin.checkEngine(mobile); // vendored engine, nothing patched at build time
assert.ok(!fs.readFileSync(path.join(mobile, 'plugins/with-openvpn.cjs'), 'utf8').includes('writeFileSync'), 'plugin must not edit node_modules');
const vendored = path.join(mobile, 'modules/react-native-openvpn');
const mobilePkg = JSON.parse(fs.readFileSync(path.join(mobile, 'package.json'), 'utf8'));
assert.equal(mobilePkg.dependencies['@aliakhgar1/react-native-openvpn'], 'file:./modules/react-native-openvpn');
for (const rel of ['android/build.gradle', 'android/src/main/java/com/openvpn/OpenvpnModule.kt', 'android/generated/jni/CMakeLists.txt']) {
  assert.equal(fs.readFileSync(path.join(engineDir, rel), 'utf8'), fs.readFileSync(path.join(vendored, rel), 'utf8'), `installed copy differs: ${rel}`);
}
const gradle = fs.readFileSync(path.join(vendored, 'android/build.gradle'), 'utf8');
assert.ok(!/buildscript\s*\{/.test(gradle), 'module must not pin its own AGP');
assert.ok(!gradle.includes('lintOptions') && gradle.includes('JavaVersion.VERSION_17') && gradle.includes('JvmTarget.JVM_17'));
const kt = fs.readFileSync(path.join(vendored, 'android/src/main/java/com/openvpn/OpenvpnModule.kt'), 'utf8');
assert.ok(kt.includes('override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?)'), 'RN 0.81 ActivityEventListener signature');
assert.ok(kt.includes('override fun onNewIntent(intent: Intent)'));
assert.ok(!/\bcurrentActivity\b/.test(kt.replace(/reactApplicationContext\.currentActivity/g, '')), 'no deprecated module currentActivity');
assert.ok(!kt.includes('hasActiveCatalystInstance') && kt.includes('SERVICE_NOT_READY'));
assert.ok(fs.readFileSync(path.join(vendored, 'android/generated/jni/CMakeLists.txt'), 'utf8').includes('target_compile_reactnative_options'));
assert.ok(!fs.readFileSync(path.join(vendored, 'android/src/main/AndroidManifest.xml'), 'utf8').includes('package='));
const libManifest = fs.readFileSync(path.join(vendored, 'android/src/main/AndroidManifestNew.xml'), 'utf8');
assert.ok(!libManifest.includes('RECEIVE_BOOT_COMPLETED') && !libManifest.includes('READ_EXTERNAL_STORAGE'));
assert.deepEqual(fs.readdirSync(path.join(vendored, 'android/src/main/libs')).sort(), ['arm64-v8a', 'x86_64']);
const config = JSON.parse(execFileSync('bunx', ['expo', 'config', '--type', 'introspect', '--json'], { cwd: mobile, maxBuffer: 10 * 1024 * 1024 }).toString());
const manifest = config._internal.modResults.android.manifest.manifest;
const app = manifest.application[0];
assert.equal(app.$['android:allowBackup'], 'false');
const vpn = app.service.find(s => s.$['android:name'] === 'de.blinkt.openvpn.core.OpenVPNService');
assert.equal(vpn.$['android:permission'], 'android.permission.BIND_VPN_SERVICE');
assert.equal(vpn.$['android:exported'], 'false');
assert.equal(vpn.$['android:foregroundServiceType'], 'specialUse');
assert.equal(vpn['meta-data'][0].$['android:value'], 'false');
const engine = path.dirname(require.resolve('@aliakhgar1/react-native-openvpn/package.json', { paths: [mobile] }));
let checked = 0;
for (const abi of ['arm64-v8a', 'x86_64']) {
  const folder = path.join(engine, 'android/src/main/libs', abi);
  for (const name of fs.readdirSync(folder).filter(n => n.endsWith('.so'))) {
    const headers = execFileSync('readelf', ['-lW', path.join(folder, name)]).toString();
    const loads = headers.split('\n').filter(line => line.trim().startsWith('LOAD'));
    assert.ok(loads.length);
    for (const line of loads) assert.ok(parseInt(line.trim().split(/\s+/).at(-1), 16) >= 16384, `${abi}/${name} alignment`);
    checked++;
  }
}
const bridge = fs.readFileSync(path.join(engine, 'android/src/main/java/com/openvpn/OpenvpnModule.kt'), 'utf8');
assert.ok(!bridge.includes('Log.e("VXXT",logItem'));
assert.ok(bridge.includes('VPN_PERMISSION_REQUIRED'));
const manager = fs.readFileSync(path.join(engine, 'android/src/main/java/de/blinkt/openvpn/core/ProfileManager.java'), 'utf8');
assert.ok(manager.includes('if (profile.mTemporaryProfile) return;'));
assert.ok(manager.includes('keep temporary profile only in memory'));
const results = { manifest: 'Expo introspection (not final merged APK manifest)', engine: 'vendored modules/react-native-openvpn (RN 0.81 fixes), no build-time patching',
  nativeLibraries: checked, elfAlignment: 'all included 64-bit LOAD segments >=16KiB',
  nodePingRegistration: 'idempotent fixture, not compiled Android application',
  androidBuild: 'not run', devicePing: 'not tested', deviceHandshake: 'not tested', dnsLeaks: 'not tested' };
fs.writeFileSync(path.join(__dirname, 'native-config-results.json'), JSON.stringify(results, null, 2));
console.log(results);