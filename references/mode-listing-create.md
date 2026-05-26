# MODE 2: LISTING_CREATE — Detailed Workflow

> **Loaded by skill when:** "создай листинг", "напиши листинг", "Amazon UK listing", "оптимизируй листинг", product spec given.
>
> **Prerequisites:** `references/compliance-rules.md` + `references/claims-database.md` + `references/decision-tree.md` (pre-flight). Additionally load when this mode triggers:
> - `references/listing-templates.md` (Title/Bullets/Description/Backend formulas)
> - `references/output-templates.md` (LISTING_CREATE_OUTPUT block)
> - `references/scraping-playbook.md` (competitor PDP scrape)
> - `references/structured-attributes.md` (20+ Seller Central fields schema)
> - `references/risk-tier-classification.md` (5-tier RED/AMBER classifier)
> - `references/sv-uplift-analysis.md` (Cerebro intersection method)
> - `references/listing-mechanisms.md` (v1→v4 runbook + 10 mechanisms)
> - If brand mentioned → `brands/<brand>.md` (per `brand-profiles-convention.md`)

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
- Использовать lifestyle claims для ингредиентов без NHC (ashwagandha, ACV, berberine, etc.) — см. `decision-tree.md` §2

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
- **Brand at position 1** (Amazon style guide), unless intentionally omitted

**Gate 2:** Title ≤200 chars (подсчитать через `len()`); первые 80 chars содержат brand + product type + key ingredient + benefit.

### Шаг 3: 5 Bullet Points

Каждый ≤500 chars (оптимально 200-250). Суммарно по байтам ≤1000.

Структура:

| # | Тема | CAPS Label (примеры) |
|---|---|---|
| 1 | Главное преимущество — авторизованный claim + key ingredient | RESTFUL SLEEP SUPPORT, KETO LIFESTYLE SUPPORT, ATHLETIC PERFORMANCE, IMMUNE FUNCTION SUPPORT |
| 2 | Состав — все активные ингредиенты с дозировками + % NRV + serving size | PREMIUM NIGHT BLEND, POTENT FORMULA, 5 ACTIVE INGREDIENTS, COMPREHENSIVE FORMULATION |
| 3 | Качество — Made in UK / Produced in UK + GMP + Third-Party Tested | MADE IN UK TO HIGH STANDARDS, UK QUALITY YOU CAN TRUST, GMP-CERTIFIED MANUFACTURE |
| 4 | Формат — вкус, форма, sugar-free/vegan, supply duration | DELICIOUS & EASY TO TAKE, NATURAL MANGO FLAVOUR, CONVENIENT DAILY GUMMIES, 60 GUMMIES & 30-DAY SUPPLY |
| 5 | Бренд / Trust / Clean | CLEAN INGREDIENTS, [BRAND] WELLNESS, SIMPLE WELLNESS FOR REAL LIFE |

Каждый bullet начинается с CAPS LABEL (2-4 слова, chars: `A-Z 0-9 space & , + / -`) затем ` — ` и текст.

**Gate 3:** Каждый bullet ≤500 chars (`len()`). Суммарно `wc -c` по UTF-8 ≤1000 bytes. Все claims авторизованы или явно lifestyle. Дозировки идентичны этикетке. No trailing periods (house style per brand profile).

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
- **2026 RELEVANCE CHECK:** перед добавлением любого слова — открыть `https://www.amazon.co.uk/s?k=<keyword>` и убедиться, что в первой 10 results есть competitors в нашей форме (gummies для gummy SKU). Если результаты — patches/devices/cosmetics — НЕ ADD.
- **Gummy SKU rule:** НЕ включать `tablets capsules pills drops` — wrong-fit traffic, burns ACoS
- Misspellings ОК ТОЛЬКО если verified в Cerebro SV >50
- Включить: relevance-verified синонимы, British/US spelling variants (`flushes`/`flashes`), confirmed misspellings, demographic modifiers (`women men adult mature lady`), age ranges (`40 45 50 55 60`), symptom long-tail (`bloating fatigue tiredness irritability sleeplessness sweating`)

Полные правила: `references/listing-templates.md` → "Backend Search Terms Formula (2026 best practices)".

Проверка байтов **обязательна** через bash:
```bash
echo -n "your backend terms here" | wc -c
```

**Gate 5:** Backend ≤249 байт (verified via bash). Нет повторов с Title/Bullets/Description. Нет brand name, нет конкурентов. Все слова relevance-verified через Amazon search.

### Шаг 5b: Structured Seller Central Attributes (v1.3.0)

После Title/Bullets/Description/Backend — заполнить **20+ Seller Central form fields**. **БЕЗ этих полей listing = INCOMPLETE.**

См. `references/structured-attributes.md` — полная schema.

**Минимум 12 obligatory fields:**
- **Identity:** Brand Name, Manufacturer, MPN, Model Number, Item model number
- **Format:** Item Form (Gummy/Tablet/Capsule), Container Type (Bottle/Tub), Number of Items, Unit Count, Total Servings Per Container
- **Diet:** Diet Type (multi: Vegan/Gluten Free/Sugar Free/Halal/Kosher), Age Range Description (Adult/Child), Allergen Information
- **Composition:** Primary Supplement Type (comma list of actives), Special Ingredients (branded actives: KSM-66®/Affron®), Material Features (multi), Supplement Formulation
- **Details:** Flavour, Product Dimensions, Item Weight, Country of Origin (see `decision-tree.md` §8 if TBD)
- **Use cases:** Specific Uses For Product, Recommended Uses For Product

**+ Important Information** (5 long-form fields ОТДЕЛЬНО от Description):
- **Ingredients** — full INCI verbatim из label (ALWAYS)
- **Directions** — "Chew N gummies daily..."
- **Safety Information** — UK warnings (заменяет paragraph в description → освобождает ~400 chars)
- **Storage** — temperature/light conditions
- **Legal Disclaimer** — UK FBO + "food supplement not medicine"

**Gate 5b:** ≥12 structured fields filled. Все 5 Important Information fields filled. Description освобождена от boilerplate warnings/directions/ingredients.

### Шаг 6: Compliance Check (17-point audit) — v1.3.0

См. `references/compliance-rules.md` + `references/risk-tier-classification.md`.

Verdict **SAFE TO PUBLISH** только если:
- Все 17 compliance checks ☑
- `validators.py full <listing>.json` exit 0 (title + bullets + backend + dedup + CAPS regex `[A-Z0-9 &,+/-]`)
- Risk tier ≤ MEDIUM (0 red flags. Amber count ≤ 10)

Иначе **NEEDS FIXES** с перечислением проблем — см. `decision-tree.md` §10 для troubleshoot.

### Шаг 6b: Risk-tier classification + Addressable SV (v1.3.0)

См. `references/risk-tier-classification.md` и `references/sv-uplift-analysis.md`.

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
5. 📋 STRUCTURED ATTRIBUTES (table of all 20+ Seller Central fields)
6. 📋 IMPORTANT INFORMATION (5 long-form fields)
7. ✅ COMPLIANCE CHECK (17-point)
8. 🎯 RISK TIER (red/amber count + tier)
9. 📊 ADDRESSABLE SV (if Cerebro data available)
10. 📊 SCORE BREAKDOWN (8 categories, total /100)
