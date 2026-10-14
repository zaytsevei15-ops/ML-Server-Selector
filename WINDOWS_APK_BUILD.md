# Сборка APK на Windows: ML Server Selector 1.4.0

## Что изменено в OpenVPN-модуле

Изменения касаются только `@aliakhgar1/react-native-openvpn`. Остальной проект не трогали.

- Исправленная копия модуля лежит в `packages/mobile/modules/react-native-openvpn`.
- Зависимость подключена так: `"file:./modules/react-native-openvpn"`.
- Модуль больше не скачивается из npm, и файлы в `node_modules` при сборке не правятся. Поэтому ошибки `OpenVPN patch mismatch` больше не будет.
- Под React Native 0.81 исправлено:
  - `onActivityResult` и `onNewIntent` теперь с non-null параметрами. Именно на этом upstream-версия не компилировалась.
  - Убран собственный AGP 8.7.2.
  - Java и Kotlin собираются под JVM 17.
  - Пересозданы codegen JNI-файлы.
  - Из манифеста убран атрибут `package=`.
- Список изменений: `packages/mobile/modules/react-native-openvpn/NOTICE.md`.

## 1. Что установить (один раз)

| Что | Где взять / что выбрать |
|---|---|
| Node.js 22 LTS | https://nodejs.org |
| Bun | В PowerShell: `powershell -c "irm bun.sh/install.ps1 \| iex"` |
| Android Studio | https://developer.android.com/studio. JDK 17/21 (папка `jbr`) уже входит в комплект |

В Android Studio откройте **More Actions → SDK Manager**.

1. На вкладке **SDK Platforms** отметьте **Android 16 (API 36)**.
2. На вкладке **SDK Tools** отметьте:
   - Android SDK Build-Tools 36;
   - **NDK (Side by side) 27.1.12297006**. Чтобы выбрать именно эту версию, включите «Show Package Details»;
   - CMake;
   - Android SDK Platform-Tools.
3. Нажмите **Apply**.

Включите поддержку длинных путей. Это делается один раз: откройте PowerShell **от имени администратора** и выполните:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force
```

## 2. Сборка

1. Распакуйте архив в **короткий путь без пробелов и кириллицы**, например `C:\ml`. Внутри должна получиться папка `C:\ml\ML-Server-Selector`.
2. Дважды щёлкните `C:\ml\ML-Server-Selector\build-apk-windows.cmd`. Можно и запустить его из `cmd`.
3. Дождитесь сообщения `DONE`. Первая сборка идёт 10–30 минут, потому что Gradle скачивает зависимости.
4. Готовый файл: `C:\ml\ML-Server-Selector\ML-Server-Selector-1.4.0.apk`.

Если удобнее вручную, вот то же самое по шагам:

```bat
cd C:\ml\ML-Server-Selector
bun install
cd packages\mobile
bunx expo prebuild -p android --clean --no-install
cd android
gradlew.bat assembleRelease
```

APK появится в `packages\mobile\android\app\build\outputs\apk\release\app-release.apk`.

## 3. Важно

- **Подпись.** Release-APK подписан debug-ключом. Для установки и тестов этого достаточно, для Google Play — нет. Для публикации нужен свой keystore.
- **Сервер.** В `packages/mobile/app.json` поле `expo.extra.apiUrl` указывает на preview-сервер. Перед сборкой для реальных пользователей замените его на адрес опубликованного backend.
- **Не проверено.** В облачной среде, где готовился архив, Gradle/APK не собирались, это запрещено. Проверены TypeScript, тесты, JS-бандл Android, `expo prebuild`, autolinking модуля и конфигурация манифеста. Компиляция Kotlin/Java впервые пройдёт у вас.
- **Лицензия.** Внутри модуля есть код ics-openvpn и OpenVPN 3 под лицензией GPL v2. Если вы распространяете APK, распространяйте вместе с ним и исходники, то есть этот архив.

## 4. Если ошибка

| Сообщение | Что сделать |
|---|---|
| `JAVA_HOME is not set` | Установите Android Studio или задайте `JAVA_HOME` на JDK 17 |
| `SDK location not found` / `ANDROID_HOME` | Задайте `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk` |
| `NDK ... did not have a source.properties` | Установите NDK 27.1.12297006 в SDK Manager (шаг 1) |
| `Filename longer than 260 characters`, ошибки ninja/CMake | Включите длинные пути (шаг 1) и перенесите проект в `C:\ml` |
| `OutOfMemoryError` / `Metaspace` | В `packages\mobile\android\gradle.properties` поставьте `org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m` |
| Любая другая ошибка | Пришлите последние ~50 строк из окна сборки |
