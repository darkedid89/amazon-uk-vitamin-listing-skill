# Output Templates — Точные форматы вывода по режимам

> Каждый режим (LABEL_CHECK / LISTING_CREATE / KEYWORD_MAP) использует строго определённый output формат. Не отклоняться.

---

## LABEL_CHECK_OUTPUT

Формат основан на реальном примере `LABEL_CORRECTIONS_for_designer.md` (Meleva Night-Time).

```markdown
# Правки этикетки — [Brand] [Product Name]

> **Дата:** [YYYY-MM-DD]
> **Основание:** [Кто запросил review / какой источник проблемы]
> **Приоритет:** [Высокий / Средний / Низкий] — [обоснование]
> **Статус:** На исправление дизайнеру

---

## Сводка: [N] правок

| # | Что исправить | Где | Срочность |
|---|---------------|-----|-----------|
| 1 | [Краткое описание] | [Панель] | [Блокер / Обязательно / Рекомендация] |
| 2 | ... | ... | ... |

---

## Правка 1 — [Заголовок правки]

**Где:** [Точное место на этикетке]

**Описание проблемы:** [Что не так и почему]

### Было:
```
[Текущий текст на этикетке — копировать как есть]
```

### Должно быть:
```
[Правильный текст — копировать в дизайн]
```

### Почему:
[Ссылка на регуляцию: FIC Art. X / 2002/46/EC Art. Y / GB NHC Register / ASA ruling]

---

[Повторить для каждой правки]

---

## Контрольный чек-лист для дизайнера

### Перед отправкой в печать — пройти ВСЕ пункты:

**Лицевая сторона:**
- [ ] "Food Supplement" — отдельная строка, заметный шрифт
- [ ] "with Sweeteners" — присутствует если содержит подсластители
- [ ] Net Weight указан
- [ ] Бренд + Product Name читаемы

**Nutritional Information:**
- [ ] Serving size указан
- [ ] Дозировки per serving для каждого active
- [ ] % NRV для каждого с установленным NRV
- [ ] Сноска "† NRV not established" — если применимо
- [ ] Без слова "powder" в equiv. для extracts

**Ingredients list:**
- [ ] Слово "Ingredients:" в начале
- [ ] Порядок по убыванию веса
- [ ] Функциональный класс у каждого: (Sweetener), (Humectant), (Glazing Agent), (Acidity Regulator), (Colour), (Gelling Agent)
- [ ] Sorbitol = (Humectant), не (Sweetener)
- [ ] Полные названия (без аббревиатур MCT, ACV)
- [ ] Аллергены жирным/CAPS

**Allergen Information:**
- [ ] Все 14 mandatory allergens проверены
- [ ] Выделены жирным/CAPS/подчёркиванием

**Suggested Use / Storage / Warnings:**
- [ ] Чёткая дозировка + timing
- [ ] "Do not exceed the stated recommended daily dose"
- [ ] Storage instructions
- [ ] 3 mandatory UK warnings присутствуют
- [ ] Pregnancy advisory (если применимо)

**FBO / Production:**
- [ ] FBO name + полный UK address (с postcode)
- [ ] "Made in UK" / "Produced in UK" соответствует реальности
- [ ] Batch number / Lot number
- [ ] BBE (Best Before End)

**Certifications (если указаны):**
- [ ] Vegan — с сертификацией?
- [ ] Gluten-Free — < 20 ppm?
- [ ] Sugar-Free — < 0.5g/100g?
- [ ] Organic — с certifier?

**Прочее:**
- [ ] Шрифт читаемый (минимум 1.2mm x-height для обязательной информации)
- [ ] Контраст текст/фон достаточен

---

## Что НЕ менять

| Элемент | Статус |
|---------|--------|
| [Элемент 1] | Оставить |
| [Элемент 2] | Без изменений |

---

## Влияние на Amazon листинг

После финализации этикетки нужно обновить в листинге:

| Поле Amazon | Что обновить |
|-------------|-------------|
| Ingredients (Seller Central) | [Что именно] |
| Description / FAQ | [Что именно] |
| Bullets (с дозировками) | [Что именно] |
| Title (если "Made in UK" больше не соответствует) | [Что именно] |
```

---

## LISTING_CREATE_OUTPUT

Формат основан на `LISTING_Meleva_NightTime_FINAL.md`.

```
═══════════════════════════════════════
AMAZON UK LISTING: [Brand] [Product Name]
═══════════════════════════════════════

📌 TITLE ([X] символов):
[Title text — single line]

📌 BULLET POINTS:

• Bullet 1 ([X] chars):
[CAPS LABEL — Text]

• Bullet 2 ([X] chars):
[CAPS LABEL — Text]

• Bullet 3 ([X] chars):
[CAPS LABEL — Text]

• Bullet 4 ([X] chars):
[CAPS LABEL — Text]

• Bullet 5 ([X] chars):
[CAPS LABEL — Text]

Суммарно bullets: [X] байт (лимит ~1000)

📌 PRODUCT DESCRIPTION ([X] символов):

<p><b>[Headline]</b><br/>
[Paragraph 1]</p>

<p><b>What's Inside</b><br/>
[Paragraph 2]</p>

<p><b>Quality You Can Count On</b><br/>
[Paragraph 3]</p>

<p><b>Frequently Asked Questions</b><br/>
<b>Q1?</b><br/>A1.<br/><br/>
<b>Q2?</b><br/>A2.<br/><br/>
<b>Q3?</b><br/>A3.<br/><br/>
<b>Q4?</b><br/>A4.</p>

<p><b>Important:</b> [Disclaimer with 3 mandatory UK warnings + pregnancy + storage]</p>

📌 BACKEND SEARCH TERMS ([X] байт / 249 max):
[lowercase terms separated by spaces]

═══════════════════════════════════════
✅ COMPLIANCE CHECK:
═══════════════════════════════════════
☑/☐ Нет запрещённых слов (cure, treat, prevent, disease names)
☑/☐ Все health claims из GB NHC Register (exact wording)
☑/☐ "contributes to" НЕ пропущено (ASA ruling)
☑/☐ British English везде (flavour, colours, fibre)
☑/☐ Title ≤200 символов ([X]/200)
☑/☐ Каждый bullet ≤500 символов (max [X])
☑/☐ Суммарно bullets ≤1000 байт ([X])
☑/☐ Backend ≤249 байт ([X])
☑/☐ Нет повторов ключей между Title/Bullets/Backend
☑/☐ "Food supplement" (не "dietary supplement")
☑/☐ Нет сравнений без подтверждения (best, #1, most)
☑/☐ Дозировки консистентны во всех секциях
☑/☐ Disclaimer содержит 3 обязательных UK предупреждения + pregnancy
☑/☐ Нет melatonin / CBD / yohimbe / 5-HTP / DMAA / kratom
☑/☐ Botanicals без NHC claims описаны ТОЛЬКО как ингредиенты
VERDICT: ✅ SAFE TO PUBLISH ([N]/15)  | ⚠️ NEEDS FIXES ([N]/15 — see issues above)
═══════════════════════════════════════

📌 KEYWORD PLACEMENT MAP (если был keyword analysis):

TITLE (SV ~[N]):
┌─────────────────────────────────────┬────────┐
│ Keyword                             │ SV     │
├─────────────────────────────────────┼────────┤
│ [keyword]                           │ [SV]   │
└─────────────────────────────────────┴────────┘

BULLETS — new keywords introduced:
┌─────────────────────────────────────┬────────────┐
│ Keyword                             │ Bullet     │
├─────────────────────────────────────┼────────────┤
│ [keyword]                           │ B[N]       │
└─────────────────────────────────────┴────────────┘

BACKEND ([X] bytes) — [N] unique words:
┌──────────────────────┬─────────────────────────────┐
│ Category             │ Words                       │
├──────────────────────┼─────────────────────────────┤
│ [Category]           │ [words]                     │
└──────────────────────┴─────────────────────────────┘

📌 PPC PRIORITY LIST (если был keyword analysis):

TOP 20 — Core + Compliance Risk:
┌─────────────────────────────────────┬────────┬──────────────┬──────────────┐
│ Keyword                             │ SV     │ Status       │ Match Type   │
├─────────────────────────────────────┼────────┼──────────────┼──────────────┤
│ [keyword]                           │ [SV]   │ ✅/⚠️ Core/PPC│ Exact/Broad  │
└─────────────────────────────────────┴────────┴──────────────┴──────────────┘

TOP 10 — Competitor SP Targeting:
┌─────────────────────────────────────┬────────┬──────────────┐
│ Keyword / Brand                     │ SV     │ Targeting     │
├─────────────────────────────────────┼────────┼──────────────┤
│ [competitor keyword]                │ [SV]   │ SP Product   │
└─────────────────────────────────────┴────────┴──────────────┘

═══════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════
Product:         [Brand] [Product Name]
Brand:           [Brand]
ASIN:            [TBD or actual]
Marketplace:     Amazon UK (amazon.co.uk)
Category:        Food Supplement — [Subcategory]
Price (рек.):    £[X]–[Y] (средняя в нише £[X]–[Y])

Title:           [X] / 200 chars
Bullets:         [X] / ~1000 bytes
Description:     [X] / 2,000 chars
Backend:         [X] / 249 bytes
Compliance:      [N]/15 checks passed
Verdict:         [✅ SAFE TO PUBLISH / ⚠️ NEEDS FIXES]

Total addressable SV:
  Organic (Title+Bullets+Backend): ~[X] searches/month
  PPC (Compliance+Competitor):     ~[X] searches/month
  TOTAL:                           ~[X] searches/month

Data sources:    [H10 Cerebro / ZonGuru KoF / BA SQP / etc.]
Date:            [YYYY-MM-DD]
═══════════════════════════════════════
```

---

## KEYWORD_MAP_OUTPUT

Используется когда вызван только KEYWORD_MAP режим (без LISTING_CREATE).

```
═══════════════════════════════════════
KEYWORD ANALYSIS: [Product Type / Brand]
═══════════════════════════════════════

📊 SOURCE STATS:
- Source(s):       [Cerebro / ZonGuru / BA SQP / BA Top Terms]
- Total rows:      [N]
- After filtering: [Y] working keywords
- Filtered out:    [Z] нерелевантных, [N] competitor brands, [M] compliance-risks

═══════════════════════════════════════
TIER 1 — TITLE ([5-8] keywords, SV ~[N])
═══════════════════════════════════════

┌─────────────────────────────────────┬────────┬──────────────┬───────────┐
│ Keyword                             │ SV     │ Score        │ Position  │
├─────────────────────────────────────┼────────┼──────────────┼───────────┤
│ [keyword]                           │ [SV]   │ [score]      │ First 80  │
│ [keyword]                           │ [SV]   │ [score]      │ Middle    │
└─────────────────────────────────────┴────────┴──────────────┴───────────┘

📌 Предложенная структура Title (≤200 chars):
```
[Title proposal]
```
([X] chars)

═══════════════════════════════════════
TIER 2 — BULLETS ([15-25] keywords)
═══════════════════════════════════════

┌─────────────────────────────────────┬────────┬──────────────┬───────────┐
│ Keyword                             │ SV     │ Score        │ → Bullet  │
├─────────────────────────────────────┼────────┼──────────────┼───────────┤
│ [keyword]                           │ [SV]   │ [score]      │ B1        │
│ [keyword]                           │ [SV]   │ [score]      │ B2        │
└─────────────────────────────────────┴────────┴──────────────┴───────────┘

📌 Распределение по 5 буллетам:
- B1 (Главное преимущество): [keywords list]
- B2 (Состав/дозировки): [keywords list]
- B3 (Качество): [keywords list]
- B4 (Формат): [keywords list]
- B5 (Trust/Brand): [keywords list]

═══════════════════════════════════════
TIER 3 — BACKEND ([≤249 bytes])
═══════════════════════════════════════

Backend string ([X] bytes / 249 max):
```
[lowercase terms separated by spaces]
```

Категории:
- Альтернативные формы: [words]
- Синонимы: [words]
- British/American: [words]
- Demographics: [words]
- Опечатки: [words]
- Adjacent traffic: [words]

═══════════════════════════════════════
TIER 4 — SUPPLEMENTARY (Description / FAQ / A+)
═══════════════════════════════════════

Long-tail для Rufus AI FAQ:
- "[question phrase]" → suggested FAQ answer
- "[question phrase]" → suggested FAQ answer

Для Description / A+ content:
[keyword list]

═══════════════════════════════════════
🎯 PPC PRIORITY LIST — TOP 20
═══════════════════════════════════════

🟢 Core (Exact + Broad in PPC, also in listing):
┌─────────────────────────────────────┬────────┬──────────────┐
│ Keyword                             │ SV     │ Match Type   │
├─────────────────────────────────────┼────────┼──────────────┤
│ [keyword]                           │ [SV]   │ Exact+Broad  │
└─────────────────────────────────────┴────────┴──────────────┘

⚠️ Compliance Risk (PPC Broad/Phrase only, NOT in listing):
┌─────────────────────────────────────┬────────┬──────────────┐
│ Keyword                             │ SV     │ Match Type   │
├─────────────────────────────────────┼────────┼──────────────┤
│ melatonin gummies                   │ [SV]   │ Broad/Phrase │
│ sleeping tablets                    │ [SV]   │ Broad        │
└─────────────────────────────────────┴────────┴──────────────┘

🎯 Competitor SP Targeting:
┌─────────────────────────────────────┬────────┬──────────────┐
│ Keyword / Brand                     │ SV     │ Targeting     │
├─────────────────────────────────────┼────────┼──────────────┤
│ [competitor keyword]                │ [SV]   │ SP Product   │
└─────────────────────────────────────┴────────┴──────────────┘

═══════════════════════════════════════
✅ 9-POINT VALIDATION:
═══════════════════════════════════════
☑/☐ 1. Нет дублей слов между Title + Bullets + Backend
☑/☐ 2. Backend ≤249 байт ([X])
☑/☐ 3. Title ≤200 chars ([X])
☑/☐ 4. Нет брендов конкурентов в полях листинга
☑/☐ 5. Нет compliance-risk слов в Title/Bullets/Backend
☑/☐ 6. British English во всех front-facing keywords
☑/☐ 7. "food supplement" (не "dietary supplement")
☑/☐ 8. Title читается естественно (не keyword-stuffing)
☑/☐ 9. Tier 2 keywords распределены по буллетам

VALIDATION: ✅ ALL PASSED  |  ⚠️ ISSUES FOUND (see above)
═══════════════════════════════════════

📌 OPPORTUNITY GAPS (keywords с низкой Title Density, недоиспользованные):
- [keyword] — Title Density [X]% — высокая возможность ranking advantage
- [keyword] — Title Density [X]%

📌 COMPETITOR INSIGHTS:
[Top competing ASINs, цены, BSR, ratings, отзывы]
```

---

## Conventions

- **Эмодзи в output:** используются только в этих шаблонах (📌, ✅, ⚠️, 🟢, 🎯). В остальном тексте/комментариях — без emoji, если пользователь явно не попросил.
- **Box-drawing characters** (┌─┐│└┘) — обязательны для таблиц, форматирование терминала ASCII-art стиль.
- **Числа** — точные. Не "примерно", не "около". `[X]/200 chars` где X — реальный count.
- **Verdict** — финальная строка, **только** `SAFE TO PUBLISH` или `NEEDS FIXES`. Никаких промежуточных вариантов типа "Mostly ok".
- **Russian для объяснений, English для контента листинга / claims / label text.**
