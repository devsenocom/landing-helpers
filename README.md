# landing-helpers

Contains helpers for landing creations.

Два независимых хелпера, оба раздаются с jsDelivr из этого репозитория.

## helper.js — обычные лендинги

```html
<script src="https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/helper.js"></script>
```

Редирект на игру с пробросом трекинговых параметров, подстановка title/favicon,
legal-футер, counter.dev + Яндекс.Метрика.

Кастомные события здесь **не используются**: флаг `send_attribution` у `blur_vpn`
оставлен только ради обратной совместимости с уже залитыми лендингами.
Новые кастом-лендинги — на `helper-custom.js`.

## helper-custom.js — кастом-лендинги

```html
<script src="https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/helper-custom.js"></script>
```

Всё то же самое плюс кастомные события: событие шлётся при каждом редиректе,
для **любого** проекта (в `helper.js` это было включено только у `bv`).

Эндпоинт собирается как `https://actions.lu-analytics.com/track/<attribution_project>/`,
где `attribution_project` — слаг проекта из конфига.

API:

| Способ | Что делает |
| --- | --- |
| `onclick="goToSite()"` | событие + редирект |
| `<button data-action="play-redirect">` | событие + редирект |
| `<button data-event="my_event">` | только событие, без редиректа |
| `trackEvent("my_event")` | только событие, из своего JS |

Имя события по умолчанию — `install`, переопределяется полем `attribution_event`
в конфиге проекта.

## Подключение проекта

Код проекта задаётся атрибутом на `<body>`:

```html
<body data-project="bv">
```

Шаблоны: [landing.html](landing.html) (обычный), [landing-custom.html](landing-custom.html) (кастомный).

## Конфиги проектов

Данные и код разделены. Конфиги живут в [projects.json](projects.json) — это
**единственный источник правды**:

```
projects.json                    данные: aliases + projects
src/helper.template.js           код с плейсхолдерами __ALIASES__ / __PROJECTS__
src/helper-custom.template.js
build.js                         подставляет JSON в шаблоны
helper.js                        ← собирается, коммитится, раздаётся с CDN
helper-custom.js                 ← собирается, коммитится, раздаётся с CDN
```

Чтобы поменять конфиг:

```bash
# правим projects.json
node build.js          # пересобирает оба хелпера
node build.js --check  # проверяет, что артефакты не разошлись с источником
```

`helper.js` и `helper-custom.js` — **сборочные артефакты**. Править их руками
бесполезно: следующая сборка перезапишет. Всё, что меняется, меняется в
`projects.json` или в шаблонах.

Артефакты лежат в репозитории намеренно: jsDelivr раздаёт содержимое
репозитория на теге, а не ассеты релиза, так что несобранный файл — это
протухший CDN.

### Формат `projects.json`

- `aliases` — код из `data-project` → имя проекта (бывший `URL_MAPPER`).
  Несколько алиасов на один проект — норма.
- `projects` — конфиг проекта (бывший `URL_CONFIG`).

Обязательные поля проекта: `game_url`, `game_url_android`, `analytics_url`,
`attribution_project`, `landing_path_code`, `title`. `build.js` падает, если
какого-то нет, если алиас указывает на несуществующий проект или если URL не
http(s) — битый конфиг не доедет до CDN.

`landing_path_code` — путь к лендингу, которым пользуются сторонние сервисы.
Значение **намеренно не уникально**: зеркала и enjoylix-варианты одного проекта
делят общий путь. Сейчас используются шесть: `everlustinglife`, `lustgoddess`,
`lagunarosa`, `blurvpn`, `lustfrontiers`, `primedesire`. Проверяется на
URL-безопасность (нижний регистр, без пробелов).

Поля `send_attribution` и `attribution_url` у `blur_vpn` — легаси ради обратной
совместимости `helper.js`; `helper-custom.js` их игнорирует и собирает эндпоинт
из `attribution_project`.

## Релизы

Пуш в `main`, затрагивающий `projects.json`, `src/**`, `build.js` или сами
артефакты, запускает workflow: сборка → коммит пересобранных файлов → новый тег
(patch +1) → GitHub Release → purge кеша jsDelivr для обоих файлов.

Коммит со сборкой делается токеном `GITHUB_TOKEN`, а такие пуши не запускают
workflow повторно — рекурсии не будет.

Линейка тегов общая на репозиторий: правка одного файла бампает версию и второму —
на `@latest` это не влияет.
