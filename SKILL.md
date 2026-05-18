---
name: amazon-uk-vitamin-listing
description: End-to-end Amazon UK food supplement workflow — validates packaging labels (vision-based) against UK FIC + 2002/46/EC + GB NHC Register, creates SEO-optimised compliant listings (title/bullets/description/backend), and analyses keyword CSVs (Helium 10, ZonGuru, Brand Analytics) into prioritised placement maps. Covers vitamins, minerals, sleep botanicals, omega-3, probiotics, multivitamins, sports supplements, sex/men's vitality. Use when user says "проверь этикетку", "label check", "правки для дизайнера", "создай листинг", "напиши листинг", "Amazon UK листинг", "vitamin listing", "supplement listing", "проанализируй ключевики", "keyword map", "листинг витаминов", "label validation", "UK FIC compliance", "food supplement label", "supplement compliance".
---

# Amazon UK Vitamin & Supplement Listing — Label Check + Listing + Keywords

End-to-end workflow для Amazon UK food supplements. Три режима в одном навыке:

1. **LABEL_CHECK** — валидирует этикетку (JPG/PNG/PDF/text-spec) против UK FIC Regulation, UK Food Supplements Directive (2002/46/EC), и GB NHC Register. Output: правки для дизайнера в формате `LABEL_CORRECTIONS_for_designer.md`.
2. **LISTING_CREATE** — пишет полный compliant листинг (Title ≤200 chars, 5 Bullets ≤1000 bytes total, Description ≤2000 chars, Backend ≤249 bytes). Output: блок `═══ AMAZON UK LISTING ═══`.
3. **KEYWORD_MAP** — анализирует CSV (Helium 10 Cerebro/Xray, ZonGuru KoF, Brand Analytics SQP/Top Search Terms) и строит карту распределения keywords по Title/Bullets/Backend/PPC.

**Язык:** Объяснения, чек-листы, vердикты — **на русском**. Текст листинга, claims, label-elements, backend terms — **на British English**.

## ⚠️ Жёсткое правило

```
⛔ ЗАПРЕЩЕНО действовать в обход скила.
Если скил говорит "≤249 байт" — значит 249. Не 250. Не "примерно".
Если скил говорит "проверить через bash" — проверять через bash.
Никаких "на глаз", никаких "примерно", никаких "должно быть ок".
Если claim не из GB NHC Register — НЕ ПИСАТЬ его.
Если этикетка не указывает FBO + UK address — БЛОКЕР для печати.
```

## Регуляторный контекст (краткий, для триггеров)

- **UK Food Supplements Directive 2002/46/EC** (retained в UK law) — "food supplement" как legal name, обязательные предупреждения, требования к этикетке.
- **UK Food Information Regulations 2014 (FIC, retained Reg. 1169/2011)** — Art. 9-10: обязательная информация на этикетке, декларация подсластителей, аллергенов.
- **GB Nutrition and Health Claims Register** — единственный источник авторизованных health claims. Использовать только verbatim (или ASA-подтверждённые адаптации `supports` / `helps maintain`).
- **MHRA** — мelatonin = POM (prescription-only medicine) в UK. CBD = novel food. Yohimbe = banned.
- **ASA (Advertising Standards Authority)** — enforcement по сравнениям (`best`, `#1`), пропуск `contributes to`, неподтверждённые гарантии (Novomins £50K fine, 2024).
- **Trading Standards** — проверяют FBO, аллергены, чистый вес, BBE, batch number.

Подробности — `references/compliance-rules.md` и `references/label-requirements.md`.

---

## Mode dispatcher

| Сигнал в запросе | Mode |
|---|---|
| "проверь этикетку", "label check", "правки для дизайнера", приложен JPG/PNG/PDF этикетки | **LABEL_CHECK** |
| "создай листинг", "напиши листинг", "Amazon UK listing", "оптимизируй листинг", дан product spec | **LISTING_CREATE** |
| "проанализируй ключевики", "keyword map", приложен CSV из H10/ZonGuru/BA | **KEYWORD_MAP** |
| Запрос неоднозначный | Спросить через `AskUserQuestion` |
| "полный workflow": этикетка → keywords → листинг | Запустить **LABEL_CHECK** → **KEYWORD_MAP** → **LISTING_CREATE** последовательно, использовать output предыдущего шага как input следующего |

---

## Pre-flight: всегда загружать

Перед началом любого режима:

1. **`references/compliance-rules.md`** — UK red/yellow/green flags, ASA enforcement, Amazon limits
2. **`references/claims-database.md`** — GB NHC Register по 22+ ингредиентам + список без авторизованных claims

Дополнительно по режиму:
- LABEL_CHECK → `references/label-requirements.md`
- LISTING_CREATE → `references/listing-templates.md` + `references/output-templates.md`
- KEYWORD_MAP → `references/keyword-analysis.md` + `references/output-templates.md`

---

# MODE 1: LABEL_CHECK

Проверяет этикетку food supplement против UK regulations. Работает с JPG/PNG/PDF (через vision) или текстовой спецификации.

## Входные данные

Запросить через `AskUserQuestion`, если не указано явно:

1. **Файл этикетки** (JPG/PNG/PDF) или текстовая спецификация — обязательно
2. **Спецификация от производителя** (если есть) — формула, ингредиенты, FBO, манипуляции
3. **Название продукта и бренд**
4. **Категория** (vitamins / sleep gummies / probiotics / omega-3 / sports / multivitamin / men's vitality)
5. **Место производства** (UK / EU / non-EU) — критично для "Made in UK" / "Produced for"

## Workflow

### Шаг 1: OCR / Извлечение содержимого этикетки

Если приложен JPG/PNG/PDF — открыть через `Read`. Извлечь и зафиксировать **все** текстовые элементы:

- Лицевая сторона: brand name, product name, legal name ("Food Supplement"), flavour, sweetener declaration, count/net weight, key trust badges
- Nutritional Information / Supplement Facts: ингредиенты, дозировки per serving, % NRV, equiv. ratios
- Ingredients list: полный список с функциональными классами в скобках (Sweetener, Humectant, Glazing Agent, Acidity Regulator, etc.)
- Allergen Information: аллергены жирным/CAPS
- Suggested Use / Directions
- Storage / "Best Before"
- Batch / Lot number
- FBO: имя + полный UK-адрес
- "Made in UK" / "Produced in UK" / "Produced for"
- Badges/Certificates: Vegan, Sugar Free, GMO Free, Gluten Free, GMP, Halal, Kosher

### Шаг 2: 12-point UK compliance audit

Загрузить `references/label-requirements.md`. Применить чек-лист (12 пунктов):

| # | Проверка | Источник |
|---|---|---|
| 1 | "Food Supplement" присутствует как отдельная строка, легко читаемая | 2002/46/EC Art. 6 |
| 2 | FBO имя + полный UK address (постал код обязателен) | FIC Art. 9(1)(h) |
| 3 | Sweetener declaration ("with Sweeteners") на лицевой стороне если содержит подсластители | FIC Art. 10 + Annex III |
| 4 | Все ингредиенты в списке в порядке убывания веса | FIC Art. 18 |
| 5 | Функциональные классы у каждого ингредиента: (Sweetener), (Humectant), (Glazing Agent), (Acidity Regulator), (Colour), (Gelling Agent) | FIC Annex VII Part C |
| 6 | Аллергены выделены (жирный/CAPS/подчёркивание) — milk, soy, nuts, wheat, eggs, fish, shellfish, sesame, sulphites, celery, mustard, lupin, molluscs | FIC Art. 21 + Annex II |
| 7 | Nutritional table: дозировки активных per serving + % NRV для каждого с установленным NRV | 2002/46/EC + Annex I |
| 8 | `equiv.` указано корректно (без слова "powder", только "equiv. [число] mg") если используются стандартизированные экстракты | Industry standard |
| 9 | Suggested Use: чёткая дозировка + timing + "Do not exceed the stated recommended daily dose" | 2002/46/EC Art. 6(3)(b) |
| 10 | Storage instructions присутствуют | FIC Art. 25 |
| 11 | "Best Before" / Batch number / Net Weight | FIC Art. 9(1)(f), (g), (e) |
| 12 | Health claims (если есть) — verbatim из GB NHC Register, с "contributes to" | GB NHC Register + ASA |

Дополнительные проверки:
- "Made in UK" / "Produced in UK" — соответствует ли реальному месту производства? (Если manufacturer в Китае — нельзя писать "Made in UK".)
- "Vegan" / "Gluten Free" / "Organic" — есть ли документированная сертификация?
- Sorbitol Syrup → **(Humectant)**, НЕ (Sweetener). Sorbitol = sugar alcohol, классифицируется как humectant per FIC.
- Carnauba Wax / MCT Oil → **(Glazing Agent)**, не оставлять без класса.
- Названия аббревиатурой (MCT, ACV) — в ingredients list писать полностью.

### Шаг 3: Сравнение с спецификацией (если предоставлена)

Если пользователь предоставил manufacturer spec — сравнить:
- Полнота ингредиентов (нет ли пропущенных)
- Точность дозировок
- Расхождения в названиях ("Trisodium Citrate" vs "Sodium Citrate" — это разные вещества)
- Новые ингредиенты в спецификации, которых нет на этикетке (Steviol Glycosides — частая упущенная позиция)

### Шаг 4: Generate "правки для дизайнера" output

Использовать формат `LABEL_CORRECTIONS_for_designer.md` (см. `references/output-templates.md` → LABEL_CHECK_OUTPUT). Структура:

1. **Сводка правок** (таблица: # / Что исправить / Где / Срочность)
2. **Per-correction sections** — для каждой правки:
   - "Было" (текущая этикетка)
   - "Должно быть" (правильный вариант)
   - "Почему" (со ссылкой на пункт регуляции)
3. **Контрольный чек-лист** для дизайнера перед отправкой в печать
4. **Что НЕ менять** (явный список)
5. **Влияние на Amazon листинг** — какие поля Seller Central обновить после финализации этикетки

### Gate финальный

- [ ] Все 12 пунктов проверены
- [ ] Каждая правка обоснована регуляцией (точная статья FIC / Directive / NHC)
- [ ] Указана срочность каждой правки (Блокер / Обязательно / Рекомендация)
- [ ] Output на русском, label-text на British English

---

# MODE 2: LISTING_CREATE

Создаёт полный compliant Amazon UK listing.

## Входные данные

Запросить, если не указано:

1. **Название продукта** (Sleep Gummies, Keto ACV Gummies, Multivitamin Tablets, etc.)
2. **Бренд**
3. **Активные ингредиенты** с дозировками per serving (e.g. "Vitamin B6 10mg, Magnesium 200mg")
4. **Формат** — count в упаковке, serving size, форма (gummies/tablets/capsules/drops)
5. **Вкус** (если есть)
6. **Сертификаты** — GMP, Vegan, Third-Party Tested, Sugar-Free, Non-GMO, Halal, etc.
7. **Keywords** — приоритетные фразы из исследования (если есть CSV → перенаправить в KEYWORD_MAP first)
8. **Категория продукта** — для подбора подходящих лайфстайл-claims

## Workflow

### Шаг 1: Анализ ингредиентов и mapping claims

Загрузить `references/claims-database.md`. Для каждого ингредиента:
- Если есть авторизованные claims в GB NHC Register → выбрать 1-3 релевантные для позиционирования
- Если нет → описывать только как ингредиент, без health claims
- Использовать lifestyle claims для ингредиентов без NHC (ashwagandha, ACV, berberine, etc.)

**Gate 1:** Все health claims из GB NHC Register или ASA-approved adaptations. Список авторизованных claims зафиксирован.

### Шаг 2: Title

Формула: `[BRAND] [Product Type] [Key Ingredient/Strength] – [Authorised Benefit or Lifestyle Claim] – [Count] [Form] – [Trust Signal]`

Правила:
- **≤200 символов** (жёсткий лимит с 21 января 2025)
- Первые 80 символов = mobile cut: бренд + тип + ингредиент + benefit
- Каждое слово максимум 2 раза
- Запрещены: `! $ ? ^ ~`
- British English (flavour, colours, organise, fibre)
- Benefit ТОЛЬКО из авторизованных claims OR safe lifestyle phrases
- Запрещено: `sleep aid`, `sleeping tablets`, `insomnia`, `melatonin`, `best`, `#1`, `most`, `cures`, `treats`, `prevents`
- "Gummies"/"Tablets"/"Capsules" — обязательно в title для индексации формы

**Gate 2:** Title ≤200 chars (подсчитать через `len()`); первые 80 chars содержат brand + product type + key ingredient + benefit.

### Шаг 3: 5 Bullet Points

Каждый ≤500 chars (оптимально 200-250). Суммарно по байтам ≤1000.

Структура:

| # | Тема | CAPS Label (примеры) |
|---|---|---|
| 1 | Главное преимущество — авторизованный claim + key ingredient | RESTFUL SLEEP SUPPORT, KETO LIFESTYLE SUPPORT, ATHLETIC PERFORMANCE, IMMUNE FUNCTION SUPPORT |
| 2 | Состав — все активные ингредиенты с дозировками + % NRV + serving size | PREMIUM NIGHT BLEND, POTENT FORMULA, 5 ACTIVE INGREDIENTS, COMPREHENSIVE FORMULATION |
| 3 | Качество — Made in UK / Produced in UK + GMP + Third-Party Tested | MADE IN UK TO HIGH STANDARDS, UK QUALITY YOU CAN TRUST, GMP-CERTIFIED MANUFACTURE |
| 4 | Формат — вкус, форма, sugar-free/vegan, supply duration | DELICIOUS & EASY TO TAKE, NATURAL MANGO FLAVOUR, CONVENIENT DAILY GUMMIES |
| 5 | Бренд / Trust / Clean | CLEAN INGREDIENTS, [BRAND] WELLNESS, SIMPLE WELLNESS FOR REAL LIFE |

Каждый bullet начинается с CAPS LABEL (2-4 слова) затем `—` и текст.

**Gate 3:** Каждый bullet ≤500 chars (`len()`). Суммарно `wc -c` по UTF-8 ≤1000 bytes. Все claims авторизованы или явно lifestyle. Дозировки идентичны этикетке.

### Шаг 4: Product Description

≤2000 символов включая HTML. Только теги `<p>`, `<b>`, `<br/>`.

Структура:
- **Параграф 1** (хук + основное преимущество): целевая аудитория + что продукт делает
- **Параграф 2** (что внутри): ингредиенты + дозировки + serving instructions
- **Параграф 3** (качество): Made in UK + GMP + tested
- **FAQ** (3-4 вопроса, оптимизированы для Rufus AI):
  - "How many [units] should I take and when?" → точная дозировка + timing
  - "Are these suitable for vegans?" → Yes/No + перечисление сертификатов
  - "What does [main ingredient] do?" → авторизованные claims verbatim
  - "Do these contain [common worry: melatonin/sugar/gluten/gelatin]?" → No + альтернатива
- **Disclaimer** — 3 обязательных UK предупреждения + pregnancy + storage

**Gate 4:** ≤2000 chars. FAQ ответы прямые (1-3 предложения). Disclaimer содержит все 3 обязательных + pregnancy advisory.

### Шаг 5: Backend Search Terms

Правила:
- **Строго ≤249 байт** — превышение даже на 1 байт = ПОЛНАЯ деиндексация всех backend keywords
- Только lowercase
- Слова через пробелы, без запятых/точек с запятой/кавычек
- НЕ повторять слова из Title или Bullets — Amazon индексирует весь листинг как единый набор
- НЕ включать: бренд, ASIN конкурентов, медицинские/запрещённые термины
- Включить: синонимы, British/American spelling variants, common misspellings, alternative form-factors (если продукт gummies → "tablets capsules pills"), demographic modifiers (women men adult)

Проверка байтов **обязательна** через bash:
```bash
echo -n "your backend terms here" | wc -c
```

**Gate 5:** Backend ≤249 байт (verified via bash). Нет повторов с Title/Bullets/Description. Нет brand name, нет конкурентов.

### Шаг 6: Compliance Check (15-point audit)

См. `references/compliance-rules.md` → "Final 15-point checklist". Verdict только **SAFE TO PUBLISH** если все 15 пунктов ☑. Иначе **NEEDS FIXES** с перечислением проблем.

### Шаг 7: Output

Формат `═══ AMAZON UK LISTING ═══` — см. `references/output-templates.md` → LISTING_CREATE_OUTPUT.

---

# MODE 3: KEYWORD_MAP

Анализирует CSV из Helium 10 / ZonGuru / Brand Analytics и строит keyword placement map.

## Входные данные

1. **CSV-файл(ы)** — обязательно
2. **Контекст продукта** — категория, ключевой ингредиент, формат

## Workflow

### Шаг 1: Parse + identify source

Загрузить `references/keyword-analysis.md` → "Data Schemas". Определить источник по уникальным колонкам:
- `ZG Score` → ZonGuru Keywords on Fire
- `Cerebro IQ Score` → Helium 10 Cerebro
- `Impressions Share` → Brand Analytics SQP
- `Search Frequency Rank` → Brand Analytics Top Search Terms

Если несколько файлов → мерж + cross-reference. **SQP SV всегда приоритетнее Cerebro/ZonGuru** (это first-party Amazon data).

### Шаг 2: Filtering (3 фильтра последовательно)

1. **Нерелевантные**: SV<200 удалить; однословные удалить (кроме определяющих продукт: ashwagandha, melatonin, berberine, creatine, magnesium)
2. **Бренды конкурентов**: вынести в отдельный список "Competitor Keywords — PPC only" (запрещено в листинге Amazon ToS)
3. **Compliance-риски**: пометить keywords с `cure/treat/prevent/heal`, disease names, drug-mimic phrases (`sleeping tablets`, `melatonin`, `anxiety`, `insomnia`) → статус "PPC only with caution"

Отчитаться: "Отфильтровано с [X] до [Y]. Удалено: [Z] нерелевантных, [N] competitor brands, [M] compliance-рисков."

### Шаг 3: Scoring

Использовать формулу из `references/keyword-analysis.md` → "Scoring Formula":
```
Priority Score = (SV × 0.30) + (Sales × 0.25) + (Competition_inv × 0.20) + (Relevance × 0.15) + (Trend × 0.10)
```
Бонусный множитель по Cerebro IQ / ZG Score (×1.0 / ×1.1 / ×1.2).

### Шаг 4: Tier allocation

- **TIER 1 — TITLE** (топ 5-8): обязательно в title, в первых 80 chars highest-SV keywords
- **TIER 2 — BULLETS** (15-25): распределить по 5 буллетам, НЕ повторять Title
- **TIER 3 — BACKEND** (30-50): только слова которых НЕТ в Title/Bullets. Lowercase, через пробелы, ≤249 bytes
- **TIER 4 — SUPPLEMENTARY**: остальные для Description/FAQ/A+/PPC

**PPC PRIORITY LIST** — топ 20: 
- Core (high SV + конвертирующие)
- Compliance (`melatonin gummies`, `sleeping tablets` — PPC only, Broad/Phrase match)
- Competitor brands (SP product targeting)

### Шаг 5: Output

Формат — см. `references/output-templates.md` → KEYWORD_MAP_OUTPUT.

### Шаг 6: 9-point validation

Перед финальным выводом:
1. ✅ Нет дублей слов между Title + Bullets + Backend
2. ✅ Backend ≤249 байт (bash `wc -c`)
3. ✅ Title ≤200 chars
4. ✅ Нет брендов конкурентов в listing fields
5. ✅ Нет compliance-rosk слов в Title/Bullets/Backend
6. ✅ British English во всех front-facing keywords
7. ✅ "food supplement" (не "dietary supplement")
8. ✅ Title читается естественно (не keyword-stuffing)
9. ✅ Tier 2 keywords распределены по буллетам (не все в одном)

---

## Error handling

| Сценарий | Действие |
|---|---|
| Этикетка нечитаемая (плохое качество фото) | Запросить лучшее изображение или manufacturer spec в виде текста |
| Ингредиент отсутствует в claims-database | Описывать только как ингредиент, lifestyle claims. Предложить пользователю добавить в database. |
| Backend превысил 249 байт | Удалить keywords с наименьшим Priority Score, показать что вырезано и почему |
| CSV с неожиданными колонками | Перечислить найденные колонки, запросить подтверждение источника |
| Нет SQP данных | Использовать Cerebro/ZonGuru с пометкой "estimates (точность 76-80%)" |
| Менее 50 keywords после фильтрации | Предупредить: ниша узкая, рекомендовать H10 Magnet для расширения |
| Конкурентный бренд в title запроса пользователя | СТОП. Отказать с обоснованием Amazon ToS violation. |

---

## Файловая структура

```
~/.claude/skills/amazon-uk-vitamin-listing/
├── SKILL.md                          ← вы здесь
└── references/
    ├── compliance-rules.md           ← UK red/yellow/green flags + Amazon limits + 15-point checklist
    ├── claims-database.md            ← GB NHC Register (22+ ингредиентов) + safe claims по категориям
    ├── label-requirements.md         ← UK FIC + 2002/46/EC + 12-point label audit
    ├── listing-templates.md          ← Title/Bullets/Description/Backend formulas + примеры
    ├── keyword-analysis.md           ← CSV schemas + scoring formula + tier allocation
    └── output-templates.md           ← точные форматы output для LABEL_CHECK / LISTING_CREATE / KEYWORD_MAP
```
