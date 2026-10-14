# Vendored OpenVPN module (ML Server Selector)

Source: `@aliakhgar1/react-native-openvpn@1.0.0` (npm, https://github.com/AliAkhgar/react-native-openvpn).
The React Native bridge (`com.openvpn.*`) is MIT (see `LICENSE`).
`android/src/main/java/de/blinkt/**`, `net/openvpn/**`, prebuilt `.so` files and `pie_openvpn.*`
come from ics-openvpn / OpenVPN 3 by Arne Schwabe and OpenVPN Inc. and are licensed under
**GNU GPL v2 with additional terms**. Distributing an APK with this code means the GPL applies:
publish the complete corresponding source (this archive) together with the APK.

## Changes vs. upstream 1.0.0 (ML 1.0.0-ml.1)
- RN 0.81: `onActivityResult(activity: Activity, …)` / `onNewIntent(intent: Intent)` non-null
  (upstream nullable overrides do not compile against RN ≥ 0.77).
- `reactApplicationContext.currentActivity`, `hasActiveReactInstance()` instead of deprecated APIs.
- `build.gradle`: no own `buildscript`/AGP 8.7.2 classpath (uses the app's AGP/Kotlin), Java/Kotlin
  target 17, `lint {}` instead of `lintOptions`, explicit `core-ktx`/`appcompat`.
- Codegen JNI files regenerated with `@react-native/codegen` 0.81.5.
- Manifest: no legacy `package=` attribute; no BOOT_COMPLETED / external storage permissions.
- Only `arm64-v8a` and `x86_64` native libraries kept (the app builds only these ABIs).
- Privacy: no VPN logs to logcat, no disk log cache, no StrictMode logging, temporary profiles never
  written to disk; `connect` rejects with `VPN_PERMISSION_REQUIRED` until `prepare()` succeeded;
  `disconnect` rejects with `SERVICE_NOT_READY` instead of silently resolving.
- iOS sources removed (the app is Android-only for VPN).
