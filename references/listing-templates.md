# Amazon UK Listing Templates — Vitamins & Food Supplements

## Title Formula

### Структура

```
[BRAND] [Product Type] [Key Ingredient/Strength] – [Authorised Benefit] – [Count] [Form] – [Trust Signal]
```

### Правила (жёсткие)

1. **≤200 символов** включая пробелы (точный count через `len()`)
2. Первые 80 символов = mobile cut:
   - Бренд + тип продукта + ключевой ингредиент + основное преимущество
3. Разделитель секций: тире `–` (длинное, не дефис) или вертикальная черта `|`
4. Trust signal в конце (Made in UK / Sugar-Free / Vegan)
5. **"Gummies" / "Tablets" / "Capsules"** — обязательно в title для form-factor indexation
6. Strength/dosage — включать, если конкурентное преимущество (`1000mg`, `5g per serving`)
7. Каждое слово ≤2 раз
8. Запрещённые символы: `! $ ? ^ ~`
9. British English
10. Benefit ТОЛЬКО из NHC Register или safe lifestyle phrases
11. Запрещено: `sleep aid`, `sleeping tablets`, `insomnia`, `melatonin`, `best`, `#1`, `most`, `cures`, `treats`, `prevents`
12. Первое слово — бренд
13. Без ALL CAPS слов (кроме брэнда и аббревиатур ACV/GMP/NRV/MCT/EFA)

### Примеры по категориям

**Sleep Gummies (Meleva — реальный пример):**
```
Meleva Night-Time Sleep Gummies for Adults — Ashwagandha, Vitamin B6, Lemon Balm, Chamomile, Lavender — Tiredness & Fatigue — 60 Sugar Free Sleeping Gummies — Natural Mango Flavour, Vegan — Made in UK
```
(200 chars)

**Keto / ACV Gummies:**
```
INTENSE WELLNESS Keto ACV Gummies 1000mg Apple Cider Vinegar – Supports Ketogenic Lifestyle – 60 Gummies – Sugar-Free, Made in UK
```
(135 chars)

**Creatine Gummies:**
```
INTENSE WELLNESS Creatine Monohydrate Gummies 5g per Serving – Supports Athletic Performance – 60 Gummies – Sugar-Free, Made in UK
```
(136 chars)

**Multivitamin (Adults):**
```
[BRAND] Daily Multivitamin Tablets for Adults – 26 Vitamins & Minerals – Immune Function & Energy Support – 120 Tablets, 4 Month Supply – Vegan, Made in UK
```
(159 chars)

**Vitamin D3 + K2:**
```
[BRAND] Vitamin D3 4000 IU + K2 100µg High Strength – Bones, Teeth & Immune Function – 365 Vegan Tablets, 1 Year Supply – Made in UK
```
(138 chars)

**Omega-3 Fish Oil:**
```
[BRAND] Omega 3 Fish Oil 2000mg High Strength – EPA & DHA for Heart, Brain & Eye Function – 120 Capsules, 4 Month Supply – Made in UK
```
(140 chars)

**Magnesium Glycinate:**
```
[BRAND] Magnesium Glycinate 400mg High Strength – Muscle Function & Reduction of Tiredness – 240 Vegan Tablets – Sugar-Free, Made in UK
```
(143 chars)

**Iron + Vitamin C:**
```
[BRAND] Iron 14mg + Vitamin C Tablets – Reduces Tiredness, Supports Immune Function – 365 Vegan Tablets, 1 Year Supply – Made in UK
```
(136 chars)

**Hair Skin Nails (Biotin):**
```
[BRAND] Biotin 10,000µg High Strength – Hair, Skin & Nails Maintenance with Zinc & Selenium – 180 Vegan Tablets – Made in UK
```
(132 chars)

**Probiotic:**
```
[BRAND] Daily Probiotic 50 Billion CFU – 16 Strains with Prebiotics – 60 Vegan Capsules, 2 Month Supply – Gluten-Free, Made in UK
```
(135 chars)
NB: Probiotics — никаких "gut health" claims. Только descriptive + lifestyle.

---

## Bullet Points Formula

### Структура каждого bullet

```
[CAPS LABEL 2-4 слов] — [Benefit/feature description with authorised claims and ingredients]
```

### 5 буллетов по порядку

#### Bullet 1: ГЛАВНОЕ ПРЕИМУЩЕСТВО

- Авторизованный health claim + ключевой ингредиент с верными дозами
- Или lifestyle claim, если основной ингредиент без NHC claims
- Целевая длина: 200-250 chars

**Примеры CAPS LABELS:**
- RESTFUL SLEEP SUPPORT
- IMMUNE FUNCTION SUPPORT
- ENERGY & FATIGUE REDUCTION
- KETO LIFESTYLE SUPPORT
- ATHLETIC PERFORMANCE
- HAIR, SKIN & NAILS MAINTENANCE
- HEART & BRAIN FUNCTION

#### Bullet 2: СОСТАВ И ДОЗИРОВКИ

- Все активные ингредиенты с точными дозировками per serving
- % NRV для каждого с установленным NRV
- Serving size (сколько gummies/tablets/capsules per serving)
- Целевая длина: 200-250 chars

**Примеры CAPS LABELS:**
- PREMIUM NIGHT BLEND
- POTENT FORMULA
- 5 ACTIVE INGREDIENTS
- COMPREHENSIVE FORMULATION
- HIGH STRENGTH FORMULA

#### Bullet 3: КАЧЕСТВО И ПРОИЗВОДСТВО

- Made in UK / Produced in UK
- GMP-certified facility
- Third-Party Lab Tested
- Целевая длина: 180-220 chars

**Примеры CAPS LABELS:**
- MADE IN UK TO HIGH STANDARDS
- UK QUALITY YOU CAN TRUST
- THIRD-PARTY TESTED QUALITY
- TRUSTED UK MANUFACTURER
- PRODUCED IN THE UK

#### Bullet 4: ФОРМАТ И УДОБСТВО

- Вкус + форма (gummies/tablets/capsules)
- Sugar-Free / Vegan / Gluten-Free
- Количество в упаковке + supply duration
- Целевая длина: 180-220 chars

**Примеры CAPS LABELS:**
- DELICIOUS & EASY TO TAKE
- GREAT TASTING GUMMIES
- CONVENIENT DAILY TABLETS
- TASTY MANGO FLAVOUR
- EASY-TO-SWALLOW CAPSULES

#### Bullet 5: TRUST SIGNAL / BRAND / CLEAN

- Brand positioning
- Clean ingredients / No artificial
- Customer-care positioning
- Целевая длина: 150-200 chars

**Примеры CAPS LABELS:**
- CLEAN INGREDIENTS
- [BRAND] WELLNESS PROMISE
- SIMPLE WELLNESS FOR REAL LIFE
- YOUR DAILY WELLNESS PARTNER

### Жёсткие проверки для каждого bullet

- [ ] ≤500 символов
- [ ] Начинается с CAPS LABEL + ` — `
- [ ] Нет RED FLAG слов (cure, treat, prevent, heal, disease names)
- [ ] Все health claims из GB NHC Register
- [ ] "contributes to" НЕ пропущено
- [ ] Botanicals без NHC claims — только как ингредиенты
- [ ] Дозировки совпадают с этикеткой
- [ ] Нет "adaptogen", "nootropic", "detox", "superfood"

### Суммарный лимит

- Суммарно по UTF-8 байтам ≤1000 (Amazon indexation threshold)
- Проверка: 
```python
total = sum(len(b.encode('utf-8')) for b in bullets)
```

---

## Description Formula

### Структура (≤2000 chars с HTML)

```
<p><b>[Hook headline]</b><br/>
[Параграф 1: Хук + основное преимущество + целевая аудитория]</p>

<p><b>What's Inside</b><br/>
[Параграф 2: Ингредиенты + дозировки + serving instructions]</p>

<p><b>Quality You Can Count On</b><br/>
[Параграф 3: Made in UK + GMP + Third-Party Tested]</p>

<p><b>Frequently Asked Questions</b><br/>
<b>Q1?</b><br/>A1.<br/><br/>
<b>Q2?</b><br/>A2.<br/><br/>
<b>Q3?</b><br/>A3.<br/><br/>
<b>Q4?</b><br/>A4.</p>

<p><b>Important:</b> [3 mandatory UK warnings + pregnancy + storage]</p>
```

### FAQ Template (оптимизированы для Rufus AI)

```
Q: How many [units] should I take and when?
A: Take [serving size] [timing]. Do not exceed the stated recommended daily dose.

Q: Are these suitable for vegans?
A: Yes/No. [List of certifications: sugar-free, gluten-free, etc.]

Q: What does [main ingredient] do?
A: [Authorised NHC claims verbatim, with "contributes to"].

Q: Do these contain [melatonin/sugar/gluten/gelatin/common worry]?
A: No. [Alternative content + reassurance].

Q: How long does a bottle last?
A: Each bottle contains [count] [units], providing a [duration]-day supply at [serving size] per day.

Q: When will I notice the effects?
A: [Carefully — НЕ давать guarantees. Use "Many customers prefer to take..." rather than "you will notice"]
```

FAQ ответы должны быть:
- Прямыми (отвечают на конкретный вопрос)
- Конкретными (числа, а не "some", "many")
- Фактическими (без unverified claims)
- Краткими (1-3 предложения)
- Без drug-mimic language

### Disclaimer Template (обязательный)

```
Important: Do not exceed the stated recommended daily dose. Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle. Keep out of the reach of young children. If you are pregnant, breastfeeding, taking medication, or have a medical condition, consult your healthcare professional before use. Store in a cool, dry place away from direct sunlight.
```

---

## Backend Search Terms Formula (2026 best practices)

### ⚡ 2026 Backend Doctrine

Amazon продолжает усиливать **relevance signal** в A10. Backend больше НЕ "хранилище для всего что не влезло".
Каждый word должен **either:**
1. Принести incremental search traffic с релевантными покупателями
2. Capture spelling variant / misspelling существующей релевантной query
3. Capture demographic modifier (women / men / adult) для аудитории нашего SKU

**Иначе word = wasted bytes, decreasing A10 relevance score per byte.**

### ⛔ Hard rule: проверка relevance перед добавлением

**Перед добавлением любого слова в backend — проверить через Amazon search:**

```
Открыть https://www.amazon.co.uk/s?k=<keyword>
Просмотреть первые 10 results
```

| Что видишь в search | Action |
|---|---|
| Direct competitors в нашей форме (gummies/menopause/etc) | ✅ ADD — relevant |
| Adjacent products но в другой форме (tablets, capsules) | ⚠️ EVALUATE — может быть OK для cross-format capture, но НЕ для gummy SKU (см. Vitgem house rule) |
| **Другая ниша / unrelated products** | ❌ DO NOT ADD — irrelevant traffic burns ACoS + decreases relevance |
| Только wear devices / patches / cosmetics | ❌ Off-category — exclude |

**Пример (Vitgem Menopause Gummies):**
- `menopause supplements` → search shows H&H, Menopace, Vitabiotics gummies+tablets → ✅ relevant
- `menopause patches` → search shows hormone patches (medical devices) → ❌ off-category
- `menopause test kit` → search shows diagnostic kits → ❌ off-category
- `irritability` → search shows mixed mood/B-complex/menopause products → ✅ relevant edge case
- `chewable` → search shows tablets/multivitamins (не menopause-specific) → ⚠️ borderline, depends

### Что включать (relevance-verified только)

1. **Misspellings** — **только если confirmed Cerebro SV > 50** OR явно интуитивная опечатка для основной keyword
   - `ashwaganda` (без 'h'), `menapause`, `menaupose`, `menopours` — все имеют real SV в Cerebro data
   - НЕ выдумывать misspellings — verify в Cerebro/Brand Analytics
2. **British + American spelling variants** — `fibre/fiber`, `colour/color`, `flavour/flavor`, `flushes/flashes` (UK/US)
3. **Demographic modifiers** — `women men adult adults kids midlife mature lady` (по аудитории SKU)
4. **Age ranges** — `40 45 50 55 60` (если SKU = midlife targeting)
5. **Symptom long-tail** (relevant!) — `irritability sleeplessness sweating bloating` (НЕ disease words)
6. **Cross-traffic ingredients** — adjacent supplements которые буквально ловит наш продукт (`maca` если используется зеленым клевером)

### ⛔ Что НЕ включать (2026)

- **Слова уже в Title или Bullets** — Amazon индексирует Title + Bullets + Backend как unified set. Дублирование = wasted bytes (см. `validators.py dedup`)
- **Название бренда** — бренд индексируется отдельно
- **ASIN конкурентов / brand names конкурентов** — Amazon ToS violation
- **Медицинские/запрещённые слова** — `cure`, `treat`, `prevent`, disease names, drug names, `HRT`, `estrogen`, `relief`
- **Disease names** — `anxiety`, `depression`, `insomnia`, `arthritis`, `diabetes`, `IBS`, `ADHD`
- **Слова с risk-amplification** — `boost`, `best`, `#1`, `leading`, `most effective`
- **Stop words** — `the and for with on by` — Amazon ignores → wasted bytes
- **Языковая mismatch** — non-English (кроме если SKU targets multi-lingual UK audience)
- **Punctuation** — запятые, точки с запятой, кавычки, hashtags
- **Alt-format keywords у gummy SKU** — НЕ включать `tablets capsules pills drops` в backend гамми SKU (по Vitgem house rule `feedback_backend_no_alt_format` 2026-05-19). Reasoning: люди ищущие `tablets` ≠ хотят купить `gummies` → wrong-fit traffic burns ACoS

### Формат

```
все lowercase через пробелы без запятых без точки в конце
```

### Проверка байтов — ОБЯЗАТЕЛЬНО

```bash
echo -n "ваш backend terms текст" | wc -c
```

Результат **строго ≤249**. Если 250+ — удалить наименее важные термины.

### Пример хорошего backend (Sleep Gummies, 243 bytes) — LEGACY 2025

```
magnesium tablets capsules pills drops relax tranquil peaceful soothe slumber snooze stress relief energy pyridoxine valerian theanine 5htp passionflower women men non habit forming calming nightly nighttime strength berry raspberry adult doze
```

⚠️ **2026 audit:** этот legacy example нарушает несколько новых правил:
- `tablets capsules pills drops` — нарушает Vitgem house rule (gummy SKU не должна включать alt-format)
- `stress relief` — `relief` теперь RED flag (ASA enforcement risk)
- `5htp` — drug-mimicking → лучше убрать

### Пример хорошего backend (Vitgem Menopause v4, 242 bytes) — 2026 ✓

```
menopausal perimenopausal premenopause postmenopause menapause menaupose menopours flashes bloating energy fatigue tiredness complex multivitamin maca herbal natural wellbeing 40 50 irritability sleeplessness sweating mature 45 55 60 lady fem
```

Categories represented:
- **Misspellings (5)** — `menapause menaupose menopours` + spelling variants
- **British/US** — `flushes` (in bullets) + `flashes` (in backend US form)
- **Symptoms (4)** — `bloating energy fatigue tiredness irritability sleeplessness sweating`
- **Cross-traffic (3)** — `complex multivitamin maca`
- **Wellness adjacent (2)** — `herbal natural wellbeing`
- **Demographics (7)** — `40 50 45 55 60 lady fem mature`

NB: no `tablets/capsules/pills` (gummy SKU), no `relief/best/HRT/estrogen` (compliance), no дублирование с
Title/Bullets words.

---

## Structured Seller Central Attributes (NEW 2026, v1.3.0)

**Beyond Title/Bullets/Description/Backend — Amazon UK Seller Central имеет ~20-25 отдельных form fields** для структурированных атрибутов. Большинство брендов их игнорируют — это наше major opportunity.

См. подробный schema в **[structured-attributes.md](structured-attributes.md)**.

**Core principle:** structured fields освобождают description от boilerplate (warnings/directions/ingredients) и
открывают левый sidebar Amazon UI filter "Refine by" — иначе invisible to filter-users.

### Top 12 obligatory fields per LISTING_CREATE output:

| Field | Type | Example |
|---|---|---|
| Brand Name | text | `Vitgem` |
| Manufacturer | text | `Vitgem Ltd` |
| Item Form | enum | `Gummy` |
| Container Type | enum | `Bottle` |
| Diet Type | multi | `Vegan, Gluten Free, Sugar Free` |
| Number of Items | int | `1` |
| Unit Count | text | `60 count` |
| Primary Supplement Type | text | `Sage Leaf, Ashwagandha, Saffron, Red Clover, Vitamin B6` |
| Flavour | text | `Raspberry` |
| Product Dimensions | text | `12 x 6.5 x 6.5 cm; 180 g` |
| Country of Origin | enum | `United Kingdom` |
| **Ingredients** (Important Info) | longform | full INCI verbatim из label |

### Important Information panel (5 separate long-form fields)

| Field | When to fill |
|---|---|
| **Ingredients** | ALWAYS — full INCI verbatim из label |
| **Directions** | ALWAYS — короткая инструкция приёма |
| **Safety Information** | ALWAYS — UK warnings (заменяет paragraph в description) |
| **Storage** | RECOMMENDED — temperature + light conditions |
| **Legal Disclaimer** | RECOMMENDED — UK FBO + "food supplement not medicine" |

### Output template extension

В финальном `═══ AMAZON UK LISTING ═══` block добавить секцию **`📋 STRUCTURED ATTRIBUTES`** с таблицей всех заполненных полей.

---

## Trust Signals — Ranking для UK аудитории

По результатам анализа UK consumer research и competitor listings:

| # | Trust Signal | Важность | Где размещать |
|---|---|---|---|
| 1 | **Made in UK** | Критично #1 | Title + Bullet 3 + Images |
| 2 | **Third-Party Lab Tested** | Сильный дифференциатор | Bullet 3 + Description |
| 3 | **GMP Certified** | Стандарт ожидается | Bullet 3 |
| 4 | **Sugar-Free** | Критично для keto / health-conscious | Title (если место) + Bullet 4 |
| 5 | **Vegan** | Растущий сегмент (7%+ UK) | Title (если место) + Bullet 4 |
| 6 | **Non-GMO** | Менее важно UK vs US | Bullet 4 |
| 7 | **Gluten-Free** | Широко ожидается, важно для coeliac | Bullet 4 |
| 8 | **No Artificial Colours/Flavours** | Clean label trend | Bullet 5 |
| 9 | **Halal / Kosher** | Нишевый, значимый для targeted audience | Bullet 4 (если применимо) |
| 10 | **Plastic-Free Packaging** | Sustainability trend | Bullet 5 / Images |

---

## Keyword Integration Strategy

### Приоритет размещения

1. **Title** — максимальный вес ranking. Highest-SV phrases.
2. **Bullet 1** — второй по важности. Основная фраза + близкий вариант.
3. **Bullets 2-5** — средний вес. Distribute secondary keywords.
4. **Description** — слабый вес для ranking, но важен для conversion и Rufus AI.
5. **Backend** — только слова НЕ из title/bullets. Synonyms, misspellings, alt forms.

### Правило не-дублирования

Amazon индексирует Title + Bullets + Backend как **единый набор**. Повторение слова в backend, которое уже в title — пустая трата байтов.

Проверка:
```python
title_words = set(title.lower().split())
bullets_words = set(' '.join(bullets).lower().split())
backend_words = set(backend.lower().split())

duplicates_t_be = title_words & backend_words
duplicates_b_be = bullets_words & backend_words

if duplicates_t_be or duplicates_b_be:
    print("WARN: дубли между секциями:", duplicates_t_be | duplicates_b_be)
```

---

## Reference example: complete Meleva Night-Time listing

См. полный пример в `/Users/igor/Downloads/meleva listing UK/LISTING_Meleva_NightTime_FINAL.md` или формат output в `references/output-templates.md`.

Ключевые параметры:
- Title: 200/200 chars (на пределе лимита)
- Bullets: 944/1000 bytes (5 буллетов, max 206 chars каждый)
- Description: 1,980/2,000 chars (с HTML)
- Backend: 243/249 bytes (32 unique words)
- Compliance: 15/15 checks passed
- Verdict: SAFE TO PUBLISH
