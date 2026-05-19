---
name: amazon-uk-vitamin-listing
description: End-to-end Amazon UK food supplement workflow — validates packaging labels (vision-based) against UK FIC + 2002/46/EC + GB NHC Register, creates SEO-optimised compliant listings (title/bullets/description/backend), and analyses keyword CSVs (Helium 10, ZonGuru, Brand Analytics) into prioritised placement maps. Covers vitamins, minerals, sleep botanicals, omega-3, probiotics, multivitamins, sports supplements, sex/men's vitality. Use when user says "проверь этикетку", "label check", "правки для дизайнера", "создай листинг", "напиши листинг", "Amazon UK листинг", "vitamin listing", "supplement listing", "проанализируй ключевики", "keyword map", "листинг витаминов", "label validation", "UK FIC compliance", "food supplement label", "supplement compliance".
version: "1.3.0"
last_updated: "2026-05-19"
---

# Amazon UK Vitamin & Supplement Listing — Label Check + Listing + Keywords

> **Версия:** 1.3.0 (2026-05-19) — added structured Seller Central attributes (20+ form fields), risk-tier classification (5 tiers), SV uplift analysis (Cerebro intersection + bullet placement weight), listing mechanisms runbook (v1→v4 workflow), Amazon-listing-scraber as MANDATORY scraper, 2026 backend doctrine (relevance check via Amazon search), Path A/B/C risk decision framework.
>
> **Версия 1.2.0** (2026-05-18) — added empirical risk-budget extractor (n-gram analysis), Claude Haiku brand-swap judge, JSONL audit log, image-brief generator for 7-slot product photography, menopause category corpus + Vitgem brand profile.
>
> **Версия 1.1.0** (2026-05-18) — added validators.py, golden tests, brand profiles, Vision prompting checklist, "When in doubt" decision tree.
>
> **Data freshness:** все compliance-данные (GB NHC Register, FIC regulations, ASA precedents) — snapshot на 2026-05. Перед production listing launch проверяй актуальный текст regulations на legislation.gov.uk и live GB NHC Register на gov.uk. См. footer-блок ["Источники"](#источники) в конце каждого reference-файла.

End-to-end workflow для Amazon UK food supplements. Три режима в одном навыке:

1. **LABEL_CHECK** — валидирует этикетку (JPG/PNG/PDF/text-spec) против UK FIC Regulation, UK Food Supplements Directive (2002/46/EC), и GB NHC Register. Output: правки для дизайнера в формате `LABEL_CORRECTIONS_for_designer.md`.
2. **LISTING_CREATE** — пишет полный compliant листинг (Title ≤200 chars, 5 Bullets ≤1000 bytes total, Description ≤2000 chars, Backend ≤249 bytes, **+ 20+ Seller Central structured attributes, + 5 Important Information fields, + risk-tier classification, + addressable SV analysis**). Output: блок `═══ AMAZON UK LISTING ═══`.
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
Если нужно scrape Amazon UK — ТОЛЬКО Amazon-listing-scraber/scrape_asin_v2.js.
Если LISTING_CREATE без 20+ structured attribute fields — INCOMPLETE.
```

## ⛔ Amazon UK scraping — ТОЛЬКО ОДИН ИНСТРУМЕНТ

**Любой scrape amazon.co.uk = [scrape_asin_v2.js](references/scraping-playbook.md) из репо [darkedid89/Amazon-listing-scraber](https://github.com/darkedid89/Amazon-listing-scraber).**

**Запрещено:** WebFetch (HTTP 500), Playwright snapshot (token-heavy), Firecrawl без UK residential proxy.

Локальная копия установлена: `/Users/igor/Downloads/NEW PRODUCTS/Amazon-listing-scraber/`

scrape_asin_v2.js возвращает: title, bullets, brand, price, rating, BSR, A+ content, mainImage, **productDetails (20+ fields), importantInformation (Ingredients/Directions/Safety/Storage)**.

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
- LISTING_CREATE → `references/listing-templates.md` + `references/output-templates.md` + `references/scraping-playbook.md` (competitor research) + **`references/structured-attributes.md` (Seller Central form fields)** + **`references/risk-tier-classification.md`** + **`references/sv-uplift-analysis.md`** + **`references/listing-mechanisms.md`** (v1→v4 runbook)
- KEYWORD_MAP → `references/keyword-analysis.md` + `references/output-templates.md` + `references/scraping-playbook.md` (data sourcing) + **`references/risk-tier-classification.md`** (competitor audit) + **`references/sv-uplift-analysis.md`** (intersection method)

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

Если приложен JPG/PNG/PDF — открыть через `Read`. Если качество фото плохое — сразу запросить лучшее изображение или manufacturer spec в текстовом виде.

**Vision prompting checklist — пройти по каждому пункту явно, не пропускать:**

1. **Лицевая сторона (Front-of-Pack):**
   - Brand name — точный текст, capitalization
   - Product name — точный текст
   - **Legal name** "Food Supplement" — присутствует? Отдельной строкой? Шрифт читаем?
   - Flavour descriptor — точная формулировка ("Natural Mango Flavour" / "Mango Flavoured")
   - **Sweetener declaration** "with Sweeteners" / "with Sugar and Sweeteners" — присутствует?
   - Count + Net Weight — точные числа
   - Trust badges на лицевой — список всех (Vegan, Sugar Free, GMO Free, Gluten Free, etc.)

2. **Nutritional Information / Supplement Facts:**
   - Serving size text — verbatim
   - Servings per container
   - Для каждого active ingredient: точное название, доза per serving, **% NRV**, equiv. (если extract с ratio)
   - Сноска "† NRV not established" присутствует?
   - **Не пропускать слово "powder"** в equiv. — это типичная ошибка

3. **Ingredients list:**
   - Слово "Ingredients:" присутствует?
   - Полный список verbatim — точно как написано на этикетке
   - **Функциональный класс у каждого** в скобках или после двоеточия (Sweetener / Humectant / Glazing Agent / Acidity Regulator / Colour / Gelling Agent)
   - Проверить аббревиатуры (MCT, ACV) — должны быть полными названиями
   - Порядок ингредиентов — verbatim, не сортировать

4. **Allergen Information:**
   - Точный текст блока allergen info
   - Какие allergens выделены **жирным**, КАПСОМ, подчёркиванием?
   - Проверить против 14 mandatory allergens (см. `label-requirements.md`)

5. **Suggested Use / Directions:**
   - Точная дозировка
   - Timing (e.g. "before bedtime", "with food")
   - Phrase "Do not exceed the stated recommended daily dose" присутствует?

6. **Storage / "Best Before":**
   - Storage text verbatim
   - BBE формат (MM/YYYY)
   - Batch / Lot number

7. **FBO (Food Business Operator):**
   - Имя компании (с Ltd / LLP / PLC)
   - **Полный** UK address с postcode
   - "Produced in UK" / "Made in UK" / "Produced for" — точная формулировка

8. **Warnings:**
   - 3 mandatory UK warnings — каждое присутствует verbatim?
   - Pregnancy advisory?
   - Дополнительные предупреждения (caffeine, drowsiness)?

9. **Что вызывает сомнения:**
   - Текст не читается чётко → отметить как "uncertain, requires verification"
   - Шрифт мелкий / контраст слабый → отметить как accessibility issue
   - Цвета смазаны → запросить higher-res file

**После извлечения** — выписать всё содержимое в структурированный список в response (чтобы пользователь мог verify что OCR прошёл корректно), и только потом начинать audit.

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

### Шаг 5: Backend Search Terms (2026 doctrine)

Правила:
- **Строго ≤249 байт** — превышение даже на 1 байт = ПОЛНАЯ деиндексация всех backend keywords
- Только lowercase
- Слова через пробелы, без запятых/точек с запятой/кавычек
- НЕ повторять слова из Title или Bullets — Amazon индексирует весь листинг как единый набор
- НЕ включать: бренд, ASIN конкурентов, медицинские/запрещённые термины
- **🆕 2026 RELEVANCE CHECK:** перед добавлением любого слова — открыть `https://www.amazon.co.uk/s?k=<keyword>` и убедиться, что в первой 10 results есть competitors в нашей форме (gummies для gummy SKU). Если результаты — patches/devices/cosmetics — НЕ ADD.
- **🆕 Gummy SKU rule:** НЕ включать `tablets capsules pills drops` — wrong-fit traffic, burns ACoS (см. [[feedback_backend_no_alt_format]])
- Misspellings ОК ТОЛЬКО если verified в Cerebro SV >50
- Включить: relevance-verified синонимы, British/US spelling variants (`flushes`/`flashes`), confirmed misspellings, demographic modifiers (`women men adult mature lady`), age ranges (`40 45 50 55 60`), symptom long-tail (`bloating fatigue tiredness irritability sleeplessness sweating`)

Полные правила: **`references/listing-templates.md` → "Backend Search Terms Formula (2026 best practices)"**.

Проверка байтов **обязательна** через bash:
```bash
echo -n "your backend terms here" | wc -c
```

**Gate 5:** Backend ≤249 байт (verified via bash). Нет повторов с Title/Bullets/Description. Нет brand name, нет конкурентов. Все слова relevance-verified через Amazon search.

### 🆕 Шаг 5b: Structured Seller Central Attributes (NEW v1.3.0)

После Title/Bullets/Description/Backend — заполнить **20+ Seller Central form fields**. **БЕЗ этих полей listing = INCOMPLETE.**

См. **`references/structured-attributes.md`** — полная schema.

**Минимум 12 obligatory fields:**
- **Identity:** Brand Name, Manufacturer, MPN, Model Number, Item model number
- **Format:** Item Form (Gummy/Tablet/Capsule), Container Type (Bottle/Tub), Number of Items, Unit Count, Total Servings Per Container
- **Diet:** Diet Type (multi: Vegan/Gluten Free/Sugar Free/Halal/Kosher), Age Range Description (Adult/Child), Allergen Information
- **Composition:** Primary Supplement Type (comma list of actives), Special Ingredients (branded actives: KSM-66®/Affron®), Material Features (multi), Supplement Formulation
- **Details:** Flavour, Product Dimensions, Item Weight, Country of Origin
- **Use cases:** Specific Uses For Product, Recommended Uses For Product

**+ Important Information** (5 long-form fields ОТДЕЛЬНО от Description):
- **Ingredients** — full INCI verbatim из label (ALWAYS)
- **Directions** — "Chew N gummies daily..."
- **Safety Information** — UK warnings (заменяет paragraph в description → освобождает ~400 chars)
- **Storage** — temperature/light conditions
- **Legal Disclaimer** — UK FBO + "food supplement not medicine"

**Gate 5b:** ≥12 structured fields filled. Все 5 Important Information fields filled. Description освобождена от boilerplate warnings/directions/ingredients.

### Шаг 6: Compliance Check (17-point audit) — UPDATED v1.3.0

См. `references/compliance-rules.md` + **`references/risk-tier-classification.md`**.

Verdict **SAFE TO PUBLISH** только если:
- Все 17 compliance checks ☑
- `validators.py` exit 0 (title + bullets + backend + dedup)
- Risk tier ≤ MEDIUM (0 red flags. Amber count ≤ 10)

Иначе **NEEDS FIXES** с перечислением проблем.

### 🆕 Шаг 6b: Risk-tier classification + Addressable SV (NEW v1.3.0)

См. **`references/risk-tier-classification.md`** и **`references/sv-uplift-analysis.md`**.

1. Pass title+bullets через 5-tier classifier:
   ```python
   tier, red, amber = classify_risk(title + " " + " ".join(bullets))
   ```
   Confirm: 0 red, amber ≤ 10. Report tier (🔴/🟠/🟡/🟢/✅).

2. Если есть Cerebro data → compute addressable SV:
   ```python
   addressable, matched = addressable_sv(cerebro_keywords, listing_tokens(title, bullets, backend))
   ```
   Filter to category-relevant. Compare to top-niche competitors.

3. Show in output: `Risk tier: 🟡 MEDIUM (0 red / 8 amber)` + `Addressable SV: ~63-68K (Y1 Q2 realistic Top30)`.

### Шаг 7: Output

Формат `═══ AMAZON UK LISTING ═══` — см. `references/output-templates.md` → LISTING_CREATE_OUTPUT.

**Output sections (v1.3.0 expansion):**
1. 📌 TITLE (char/byte count)
2. 📌 BULLET POINTS (5 шт с char/byte count)
3. 📌 PRODUCT DESCRIPTION (char count)
4. 📌 BACKEND SEARCH TERMS (byte count)
5. 🆕 📋 STRUCTURED ATTRIBUTES (table of all 20+ Seller Central fields)
6. 🆕 📋 IMPORTANT INFORMATION (5 long-form fields)
7. ✅ COMPLIANCE CHECK (17-point)
8. 🆕 🎯 RISK TIER (red/amber count + tier)
9. 🆕 📊 ADDRESSABLE SV (if Cerebro data available)
10. 📊 SCORE BREAKDOWN (8 categories, total /100)

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
├── SKILL.md                          ← вы здесь (mode dispatcher)
├── README.md                         ← installation + overview
├── validators.py                     ← hard-limit validators (title/bullets/backend/dedup/full)
├── brand_swap_judge.py               ← Claude Haiku-based brand-swap test (~$0.0001/verify)
├── audit_log.py                      ← JSONL append-only audit log (append/query/summary/tail)
├── image_brief.py                    ← 7-slot image brief generator for product photography
├── references/
│   ├── compliance-rules.md           ← UK red/yellow/green flags + 15-point checklist + decision tree
│   ├── claims-database.md            ← GB NHC Register (25 ингредиентов) + safe claims по 9 категориям
│   ├── label-requirements.md         ← UK FIC + 2002/46/EC + 12-point label audit
│   ├── listing-templates.md          ← Title/Bullets/Description/Backend formulas + примеры + 2026 backend doctrine
│   ├── keyword-analysis.md           ← CSV schemas + scoring formula + tier allocation
│   ├── scraping-playbook.md          ← ⛔ HARD RULE: только Amazon-listing-scraber/scrape_asin_v2.js
│   ├── output-templates.md           ← точные форматы output для всех трёх режимов
│   ├── brand-swap-corpora.json       ← labelled examples для brand-swap judge (drug-mimic vs legit)
│   ├── image-specifications.md       ← Amazon UK image требования + 7 slot patterns
│   ├── empirical-risk-budget-*.md    ← auto-generated per category (run refresh_risk_budget.py)
│   ├── 🆕 structured-attributes.md   ← ★ Seller Central 20+ form fields schema (v1.3.0)
│   ├── 🆕 risk-tier-classification.md ← ★ 5-tier risk classification (red/amber regex dictionaries)
│   ├── 🆕 sv-uplift-analysis.md      ← ★ Cerebro intersection + placement weight uplift method
│   └── 🆕 listing-mechanisms.md      ← ★ Vitgem v1→v4 full workflow runbook (10 mechanisms)
├── tools/
│   └── refresh_risk_budget.py        ← n-gram analysis competitor corpus → empirical risk-budget
├── data/
│   └── menopause-corpus-2026-05-17/  ← seed corpus (13 menopause survivors with bullets + ingredients)
│       ├── README.md
│       └── competitors.json
├── brands/
│   ├── README.md                     ← как использовать brand profiles
│   ├── _template.md                  ← шаблон для нового бренда
│   ├── meleva.md                     ← Meleva Night-Time Gummies (sleep)
│   └── vitgem-menopause.md           ← Vitgem Menopause Gummies (планируемый launch)
└── tests/
    ├── README.md
    ├── case-01-meleva-night-time-pass/      (real production listing → SAFE TO PUBLISH)
    ├── case-02-bad-cures-insomnia/          (adversarial)
    ├── case-03-bad-title-over-200/          (title limit regression)
    ├── case-04-bad-backend-over-249/        (backend deindexation regression)
    └── case-05-bad-ashwagandha-claim/       (botanical claim regression)
```

## Use cases новых модулей v1.2.0

### Empirical risk-budget (n-gram analysis)

Что: считает frequency каждой 1-3-граммы в surviving competitor listings, выдаёт buckets SAFE/COMMON/RARE/UNIQUE/RISKY с per-phrase usage rate.

Когда использовать:
- **Перед launch в новой категории** — собрать corpus (10-50 живых конкурентов) → запустить → получить data-driven списки безопасных и рискованных фраз
- **Перед refresh listing** — sanity-check что используемые фразы не drift'нули из SAFE в RARE

```bash
# Стартовый сценарий с готовым menopause corpus
python3 tools/refresh_risk_budget.py \
  --corpus data/menopause-corpus-2026-05-17/competitors.json \
  --category menopause

# Output: references/empirical-risk-budget-menopause.md
```

Для своей категории:
1. Скрейпь top-30 surviving competitors (через Helium 10 Xray + ручной agent-browser для bullets)
2. Положи в `data/<category>-corpus-<date>/competitors.json` по схеме `data/menopause-corpus-2026-05-17/README.md`
3. Запусти `refresh_risk_budget.py`

### Brand-swap judge (Claude Haiku, $0.0001/verify)

Что: классифицирует draft листинг как `drug-mimic` или `legitimate-supplement` после удаления бренда. Семантический test поверх лексических hard rules.

Требует: `ANTHROPIC_API_KEY` env var. Без ключа → возвращает `ADVISORY` (не блокирует).

```bash
python3 brand_swap_judge.py \
  --brand "Vitgem" \
  --title "Vitgem Menopause Gummies — Sage + KSM-66® — Hormonal Activity — 60 Sugar Free Gummies" \
  --bullets bullet1.txt bullet2.txt bullet3.txt bullet4.txt bullet5.txt \
  --json

# Output: {"category": "legitimate-supplement", "confidence": 0.92, "reasoning": "..."}
# Verdict: PASS
```

### Audit log (JSONL)

Что: append-only log всех verdicts. PII-scrubbed (brand → hash). Для retrospective analysis типа "какой процент LISTING_CREATE прошёл с первого раза за последний месяц?".

```bash
# Append verdict
python3 audit_log.py append --mode LISTING_CREATE --verdict "SAFE TO PUBLISH" \
  --brand "Meleva" --product "Night-Time Gummies" --score 15 --score-max 15

# Summary за 30 дней
python3 audit_log.py summary --days 30

# Last 20 verdicts
python3 audit_log.py tail --n 20
```

Лог пишется в `~/.amazon-uk-vitamin-listing-audit.jsonl` (или `$LAMBA_AUDIT_LOG`).

### Image brief generator

Что: генерирует 7 структурированных image briefs (Main + Infographic Ingredients + Benefits + Lifestyle + Quality + How-to-use + Size/Scale) с prompts для передачи в `/blog image` или `/fal-ai-media` skill, либо дизайнеру.

```bash
# Quick start
python3 image_brief.py --brand "Vitgem" --product-name "Menopause Gummies" --category menopause

# Или через JSON spec
python3 image_brief.py --product-spec spec.json --output briefs/vitgem/
```

Output структура брифа (на каждый slot):
- `subject` — что показать
- `action` — что происходит
- `context` — где / какой background
- `composition` — расположение элементов
- `lighting` — освещение
- `style` — стиль (photoreal / infographic / lifestyle)
- `prompt_template` — готовая строка для image-generation MCP
- `amazon_requirement` (для main slot) — точные технические требования Amazon UK

## Использование validators.py

Python скрипт для **детерминированной** проверки hard limits (вместо "на глаз"):

```bash
# Проверка только title
python3 ~/.claude/skills/amazon-uk-vitamin-listing/validators.py title "Your title text here"

# Полная проверка через JSON
python3 ~/.claude/skills/amazon-uk-vitamin-listing/validators.py full listing.json
# JSON shape: {"title": str, "bullets": [str x 5], "backend": str, "description": str}

# Прогон golden test
python3 ~/.claude/skills/amazon-uk-vitamin-listing/validators.py full \
  ~/.claude/skills/amazon-uk-vitamin-listing/tests/case-01-meleva-night-time-pass/input.json
```

Выходные коды: `0` = PASS, `1` = FAIL, `2` = usage error. Подходит для CI/automation.

## Использование brand profiles

Если бренд упомянут в запросе — скил загружает `brands/<brand-name>.md` для подмены defaults:
- forbidden_combos (zero-tolerance phrases)
- mandatory certifications в каждом листинге
- predefined claim strategy (через какие ингредиенты строить health claims)

Если бренд новый — скил предлагает скопировать `brands/_template.md`, заполнить, сохранить.

## Golden test regression check

Перед merge правок в `compliance-rules.md` или `claims-database.md`:

```bash
cd ~/.claude/skills/amazon-uk-vitamin-listing/tests
for case in case-*/input.json; do
  echo "=== $case ==="
  python3 ../validators.py full "$case" 2>&1 | tail -3
done
```

Ожидается:
- case-01 → `VERDICT: SAFE TO PUBLISH`
- case-02, 03, 04, 05 → `VERDICT: NEEDS FIXES`

Если case-01 начинает FAIL — это **regression bug**.

## Источники / Verification

Все compliance-данные имеют **last verified date** и URL источника в header каждого reference-файла. Перед production launch — проверяй live регуляции:
- [GB Nutrition and Health Claims Register](https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register)
- [Food Information Regulations 2014](https://www.legislation.gov.uk/uksi/2014/1855/contents/made)
- [Food Supplements Regulations 2003](https://www.legislation.gov.uk/uksi/2003/1387/contents/made)
- [ASA Rulings](https://www.asa.org.uk/codes-and-rulings/rulings.html)
- [MHRA Herbal Medicines](https://www.gov.uk/government/collections/herbal-medicines-regulation-in-the-uk)
- [Amazon UK Selling Policies](https://sellercentral.amazon.co.uk/help/hub/reference/G201833410)
