# Сборка APK через GitHub Actions → Expo EAS

Репозиторий: **https://github.com/zaytsevei15-ops/MLselector**

Важно: у меня нет доступа к этому репозиторию, поэтому файлы туда **не загружены**. Workflow **ни разу не запускался**, APK **не собирался**. Ниже описано, как один раз всё настроить, а потом собирать APK кнопкой в GitHub.

## Как это работает

1. В GitHub вы вручную запускаете workflow **Android APK (Expo EAS)** с галочкой `confirm_build`.
2. GitHub Actions ставит зависимости по `bun.lock` и прогоняет проверки: TypeScript, 23 unit-теста, проверку нативных плагинов.
3. Если проверки прошли, workflow отправляет сборку в облако Expo EAS (профиль `github-apk`, тип `apk`) и сразу завершается.
4. Android/Gradle-сборка идёт уже на серверах Expo. Готовый APK скачивается со страницы сборки в Expo.

Зелёный workflow в GitHub значит только одно: **сборка поставлена в очередь**. Собрался ли APK, видно в Expo. Сам APK в артефакты GitHub не попадает — там лежит только JSON с ID сборки.

## Шаг 1. Загрузите исходники в корень репозитория

Распакуйте `ML-Server-Selector-source.zip`. В **корне** репозитория должно оказаться содержимое папки `ML-Server-Selector` (сама папка не нужна):

```
.github/workflows/android-apk.yml
.easignore
bun.lock
package.json
packages/mobile/...
packages/web/...
verification/...
```

Скрытые `.github` и `.easignore` обязательны. В macOS их видно в Finder после Cmd+Shift+. — проверьте, что они не потерялись.

Через веб-интерфейс GitHub за один раз можно загрузить не больше 100 файлов, а в архиве их больше. Поэтому лучше через git:

```bash
git clone https://github.com/zaytsevei15-ops/MLselector.git
cd MLselector
# скопируйте сюда СОДЕРЖИМОЕ папки ML-Server-Selector, включая .github и .easignore
git add -A
git commit -m "ML Server Selector 1.4.0"
git push
```

Кнопка запуска появится во вкладке **Actions**, только когда workflow окажется в основной ветке (обычно `main`).

## Шаг 2. Один раз настройте проект в Expo

Нужен бесплатный аккаунт на https://expo.dev и компьютер с Node.js 20+ (подойдёт 22).

```bash
cd MLselector
bun install            # или: npm i -g bun, если bun ещё не установлен
cd packages/mobile
npx eas-cli@24.12.1 login
npx eas-cli@24.12.1 init          # создаёт/привязывает проект и записывает projectId в app.json
npx eas-cli@24.12.1 credentials -p android
```

В `eas credentials` выберите профиль **github-apk**, затем пункт про Keystore → **Set up a new keystore**. Ключ подписи хранится в Expo. Если позже приложение подпишут другим ключом, Android не даст обновить уже установленную копию — её придётся удалять.

Expo советует один раз запустить сборку интерактивно (`npx eas-cli@24.12.1 build -p android --profile github-apk`): тогда все недостающие настройки будут созданы заранее. Это необязательно, если ключ уже создан командой выше, но так надёжнее.

Если после `eas init` поменялся `packages/mobile/app.json` (там появились `extra.eas.projectId` и, возможно, `owner`), закоммитьте эти изменения. Остальные поля `extra` и `scheme` не трогайте.

Скопируйте **Project ID** (UUID) на странице проекта в expo.dev.

## Шаг 3. Секрет и переменная в GitHub

В репозитории откройте **Settings → Secrets and variables → Actions**:

| Тип | Имя | Значение |
|---|---|---|
| Secret | `EXPO_TOKEN` | Personal access token: expo.dev → Account settings → Access tokens |
| Variable | `EAS_PROJECT_ID` | UUID проекта Expo из шага 2 |

Токен вводится только в GitHub. В коде, архиве и чате его быть не должно.

## Шаг 4. Сборка

1. **Actions** → **Android APK (Expo EAS)** → **Run workflow**.
2. Включите `confirm_build` (по умолчанию выключено, чтобы не тратить лимит сборок случайно).
3. Через несколько минут откройте ссылку на сборку в summary запуска или раздел **Builds** проекта на expo.dev.
4. Когда сборка завершится, нажмите **Download** или откройте QR-код на телефоне. Для установки APK разрешите Android ставить приложения из этого источника.

На бесплатном тарифе Expo число сборок в месяц ограничено, и они могут ждать в очереди. Актуальные лимиты смотрите на https://expo.dev/pricing.

## Что учесть до раздачи APK

- **Backend.** Список VPN Gate и проверку профилей APK получает с API из `packages/mobile/app.json` → `extra.apiUrl`. Сейчас там адрес превью Runable, и он работает, только пока превью активно. GitHub этот backend не хостит. Перед сборкой опубликуйте приложение в Runable и убедитесь, что `apiUrl` указывает на опубликованный адрес.
- **Не протестировано на устройстве:** нативная сборка Kotlin/Gradle, реальный ICMP-пинг, TLS-рукопожатие OpenVPN, утечки IP/DNS/IPv6, жизненный цикл VPN-сервиса. Первую сборку считайте тестовой.
- **TLS.** Ожидаемое имя сертификата `<HostName>.opengw.net` — непроверенное допущение. Если оно не совпадёт, подключение будет отклонено (fail closed). Проверку TLS отключать нельзя.
- **Лицензии.** OpenVPN-библиотека использует GPLv2 и другие нативные лицензии. Если вы раздаёте APK, нужно выполнить их требования, в том числе предоставить исходный код. Пока это не решено.
- **Версия:** 1.4.0, Android `versionCode` 4. Для каждой следующей раздаваемой сборки увеличивайте `versionCode` в `packages/mobile/app.json`.

## Что проверено в этой среде (без запуска Actions и EAS)

- `actionlint` 1.7.12: workflow без ошибок.
- `eas.json` разобран библиотекой `@expo/eas-json` из `eas-cli` 24.12.1: профиль `github-apk` → `distribution: internal`, `buildType: apk`, `bun 1.3.14`, `node 22.21.1`.
- `bun install --frozen-lockfile` на Bun **1.3.14** (как в workflow) проходит, typecheck, тесты и проверка плагинов в этой копии тоже проходят.
- Симуляция `.easignore` (gitignore-семантика): в загрузку попадают `bun.lock`, `packages/mobile/plugins`, `packages/mobile/native` и пакет `packages/web`. Не попадают `.env`, `node_modules`, сгенерированные `android/` и `ios/`, ключи и APK. Реальную загрузку в EAS это не заменяет.
- JS-бандлы для Android (Hermes) и web собираются через Metro. Это не Gradle-сборка.
