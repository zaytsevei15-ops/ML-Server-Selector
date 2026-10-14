const { withMainApplication, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

function register(contents) {
  const line = 'add(com.mlselector.nodeping.NodePingPackage())';
  if (contents.includes(line)) return contents;
  const anchor = 'PackageList(this).packages.apply {';
  if (!contents.includes(anchor)) throw new Error('NodePing MainApplication registration mismatch');
  return contents.replace(anchor, `${anchor}\n              ${line}`);
}
module.exports = function withNodePing(config) {
  config = withMainApplication(config, mod => {
    if (mod.modResults.language !== 'kt') throw new Error('NodePing requires Kotlin MainApplication');
    mod.modResults.contents = register(mod.modResults.contents);
    return mod;
  });
  return withDangerousMod(config, ['android', async mod => {
    const target = path.join(mod.modRequest.platformProjectRoot, 'app/src/main/java/com/mlselector/nodeping');
    fs.mkdirSync(target, { recursive: true });
    fs.copyFileSync(path.join(mod.modRequest.projectRoot, 'native/NodePingModule.kt'), path.join(target, 'NodePingModule.kt'));
    return mod;
  }]);
};
module.exports.register = register;