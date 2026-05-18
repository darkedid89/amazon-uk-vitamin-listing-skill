# UK Food Supplement Label Requirements — Full Audit Reference

> **Источники:** UK Food Information Regulations 2014 (FIC, retained EU Reg. 1169/2011), UK Food Supplements Directive 2002/46/EC (retained), Trading Standards guidance, FSA Food Labelling Guide.

---

## Обязательные элементы на этикетке

| # | Элемент | Где должно быть | Регуляция |
|---|---|---|---|
| 1 | **"Food Supplement"** — legal name | Лицевая сторона, отдельная строка, заметный шрифт | 2002/46/EC Art. 6 |
| 2 | **Бренд + Product name** | Лицевая сторона | FIC Art. 9(1)(a) |
| 3 | **Net Weight / Quantity** | Лицевая или нижняя | FIC Art. 9(1)(e) |
| 4 | **Sweetener declaration** ("with Sweeteners") | Лицевая, рядом с name (если содержит подсластители) | FIC Art. 10 + Annex III |
| 5 | **List of ingredients** (по убыванию веса) | Любая сторона | FIC Art. 18 |
| 6 | **Allergen info** (жирный/CAPS/подчёркивание) | В ingredients или отдельно | FIC Art. 21 + Annex II |
| 7 | **Nutritional Information** (Supplement Facts) | Любая сторона | 2002/46/EC + Annex I |
| 8 | **Suggested Use / Recommended daily dose** | Любая | 2002/46/EC Art. 6(3)(b) |
| 9 | **Warnings: 3 mandatory** + pregnancy advisory | Любая | 2002/46/EC Art. 6 |
| 10 | **Storage instructions** | Любая | FIC Art. 25 |
| 11 | **"Best Before" + Batch/Lot Number** | Любая | FIC Art. 9(1)(f), Art. 25 |
| 12 | **FBO** (Food Business Operator) name + full UK address | Любая | FIC Art. 9(1)(h) |

---

## 12-Point Label Audit Checklist (LABEL_CHECK mode)

### 1. "Food Supplement" legal name

**Требование:** "Food Supplement" должно быть присутствовать как **отдельная читаемая строка**, легко обнаруживаемая. Это юридическое название продукта (legal name) per 2002/46/EC Art. 6.

**Часто нарушается:**
- Слово "supplement" интегрировано в маркетинговый текст ("Daily wellness supplement")
- Шрифт слишком мелкий или сливается с фоном
- Прячется на боковой панели вместо лицевой

**Должно быть:**
- Заметный шрифт (минимум 1.2mm x-height)
- На лицевой стороне (front-of-pack)
- Отдельной строкой
- Не сливается с маркетинговым текстом

**Пример правильного:**
```
[Brand Name]
[Product Name]
Food Supplement              ← отдельная строка, legal name
Natural Mango Flavour with Sweeteners
60 Gummies | Net Weight 180g
```

### 2. FBO — Food Business Operator

**Требование:** Имя FBO + **полный** UK почтовый адрес (включая postcode). FBO — лицо, ответственное за информацию о продукте.

**Формат:**
```
[Company Name] [Ltd/LLP/PLC]
[Building number] [Street name],
[City], [Postcode]
```

**Если manufacturer не FBO:**
```
Produced for [FBO Company]
[Address]
```

**Часто нарушается:**
- Только название компании без адреса
- Только город без улицы
- Email/телефон вместо адреса
- Foreign address без UK importer (для импорта — обязательно указывать UK importer как FBO)

### 3. Sweetener declaration

**Требование (FIC Art. 10 + Annex III):**

Если продукт содержит подсластители:
- ✅ "with sweeteners" — если только подсластители
- ✅ "with sugar and sweeteners" — если оба
- ✅ "contains a source of phenylalanine" — если содержит aspartame

**Должно быть:** на лицевой стороне, рядом с product name.

**Часто нарушается:**
- Декларация только на боковой панели
- Использование "no added sugar" вместо обязательного "with sweeteners"
- Aspartame без phenylalanine warning

**Пример правильного:**
```
[Product Name]
Food Supplement
Mango Flavoured with Sweeteners    ← обязательная декларация
```

### 4. Ingredients list — порядок убывания веса

**Требование (FIC Art. 18):**

Список ингредиентов начинается со слова "Ingredients:" (или "Ingredients"). Все ингредиенты перечислены в порядке **убывания веса** на момент изготовления.

**Часто нарушается:**
- Подсластители сгруппированы в начале независимо от их веса
- Active ingredients поставлены первыми для маркетинга (нарушение!)
- Отсутствие слова "Ingredients:"

### 5. Functional class у каждого ингредиента

**Требование (FIC Annex VII Part C):**

Для каждого добавки (additive) — указание функционального класса в скобках или после двоеточия.

**Полный список разрешённых классов:**
- (Sweetener) — Maltitol Syrup, Erythritol, Steviol Glycosides, Sucralose, Aspartame
- (Humectant) — Sorbitol Syrup, Glycerol, Propylene Glycol
- (Gelling Agent) — Pectin, Gelatin, Carrageenan, Agar
- (Glazing Agent) — Carnauba Wax, Beeswax, MCT Oil, Shellac
- (Acidity Regulator) — Citric Acid, Sodium Citrate, Trisodium Citrate, Malic Acid
- (Colour / Color) — Beta-Carotene, Curcumin, Anthocyanins
- (Antioxidant) — Ascorbic Acid (when used as antioxidant)
- (Preservative) — Potassium Sorbate, Sodium Benzoate
- (Emulsifier) — Sunflower Lecithin, Soy Lecithin
- (Bulking Agent) — Microcrystalline Cellulose
- (Anti-caking Agent) — Magnesium Stearate, Silicon Dioxide
- (Flavouring) — обязательно для "Natural ... Flavouring"

**Частые ошибки:**

| Неправильно | Правильно | Почему |
|---|---|---|
| Sorbitol Syrup (Sweetener) | Sorbitol Syrup **(Humectant)** | Sorbitol = sugar alcohol, классифицируется как humectant per FIC |
| Carnauba Wax | Carnauba Wax **(Glazing Agent)** | Любая добавка должна иметь functional class |
| MCT Oil | Medium Chain Triglyceride Oil **(Glazing Agent)** | Полное название, без аббревиатуры |
| Sweetener: Maltitol, Erythritol, Sorbitol | Maltitol Syrup (Sweetener), Erythritol (Sweetener), Sorbitol Syrup (Humectant) | Класс у каждого, не группой |
| Trisodium Citrate | Sodium Citrate (Acidity Regulator) | Trisodium Citrate ≡ Sodium Citrate (E331), но "Sodium Citrate" предпочтительнее |
| Natural Mango Flavouring | Natural Mango Flavour | Без "-ing" в современном UK FIC формате |

### 6. Allergen highlighting

**Требование (FIC Art. 21 + Annex II):**

14 обязательных allergens должны быть **визуально выделены** в ingredients list:
- Жирный шрифт (**bold**) — стандарт
- ЗАГЛАВНЫЕ (CAPS)
- Подчёркивание
- Контрастный цвет

**14 allergens:**
1. **Cereals containing gluten** (wheat, rye, barley, oats, spelt, kamut)
2. **Crustaceans** (shellfish)
3. **Eggs**
4. **Fish**
5. **Peanuts**
6. **Soybeans**
7. **Milk** (включая lactose)
8. **Nuts** (almonds, hazelnuts, walnuts, cashew, pecan, brazil, pistachio, macadamia)
9. **Celery**
10. **Mustard**
11. **Sesame seeds**
12. **Sulphur dioxide and sulphites** (> 10 mg/kg)
13. **Lupin**
14. **Molluscs**

**Допустимая формулировка:**

```
Allergen Information: Produced in a facility that may also handle 
MILK, SOY, NUTS, WHEAT.
```

### 7. Nutritional Information table

**Требование (2002/46/EC):**

Таблица "Nutritional Information" / "Supplement Facts" содержит:
- Serving size (e.g., "2 Gummies")
- Servings per container
- Активные ингредиенты per serving
- **% NRV** (Nutrient Reference Value) для каждого ингредиента с установленным NRV
- Сноска "† NRV not established" для ингредиентов без NRV

**NRV values (per day):**

| Витамин/минерал | NRV | Tolerable Upper Limit (UK) |
|---|---|---|
| Vitamin A | 800 µg | 3,000 µg |
| Vitamin D | 5 µg (200 IU) | 100 µg |
| Vitamin E | 12 mg | 300 mg |
| Vitamin K | 75 µg | — |
| Vitamin C | 80 mg | 2,000 mg |
| Vitamin B1 | 1.1 mg | — |
| Vitamin B2 | 1.4 mg | — |
| Niacin | 16 mg | 35 mg |
| Vitamin B6 | 1.4 mg | 25 mg (UK) |
| Folic Acid | 200 µg | 1,000 µg |
| Vitamin B12 | 2.5 µg | — |
| Biotin | 50 µg | — |
| Pantothenic Acid | 6 mg | — |
| Calcium | 800 mg | 2,500 mg |
| Magnesium | 375 mg | 250 mg (extra) |
| Iron | 14 mg | 17 mg |
| Zinc | 10 mg | 25 mg |
| Iodine | 150 µg | 600 µg |
| Selenium | 55 µg | 350 µg |
| Copper | 1 mg | 5 mg |
| Manganese | 2 mg | — |
| Chromium | 40 µg | — |
| Molybdenum | 50 µg | — |
| Fluoride | 3.5 mg | — |
| Chloride | 800 mg | — |
| Phosphorus | 700 mg | — |
| Potassium | 2,000 mg | — |

### 8. "equiv." formatting для extracts

**Требование:** при использовании стандартизированных экстрактов с ratio (e.g., 10:1, 4:1) указывать equivalent amount от raw herb.

**Правильный формат:**
```
Ashwagandha Root Extract (10:1)     30 mg
  equiv. 300 mg                              †
```

**Неправильный формат:**
```
Ashwagandha Root Extract (10:1)     30 mg
  equiv. to Ashwagandha Root Powder     300 mg     † ← не писать "powder"
```

Слово "powder" технически некорректно для экстракта с коэффициентом концентрации. Industry standard — только "equiv. [число] mg" без названия и без "powder".

### 9. Suggested Use

**Требование (2002/46/EC Art. 6(3)(b)):**

Чёткие инструкции по применению + обязательное предупреждение.

**Минимум:**
```
Suggested Use: Take [X] [units] daily, [timing if applicable].
Do not exceed the stated recommended daily dose.
```

**Расширенно (рекомендуется):**
```
Suggested Use: Take 2 gummies daily, approximately 30 minutes before bedtime.
Chew thoroughly before swallowing. Do not exceed the stated recommended daily dose.
```

### 10. Storage instructions

**Минимум:**
```
Store in a cool, dry place below 25°C. Protect from direct sunlight.
```

**Дополнительно (для probiotics, omega-3, refrigerated):**
```
Refrigerate after opening.
```

### 11. Best Before / Batch / Net Weight

**Best Before (BBE):**
- Формат: `Best Before End: MM/YYYY` или `BBE: MM/YYYY`
- Указывается на упаковке (обычно дно или нижняя панель)

**Batch / Lot number:**
- Формат: `Batch No: [XXXXX]` или `Lot: [XXXXX]`
- Может быть напечатан/выгравирован

**Net Weight:**
- Лицевая сторона
- `Net Weight: [X]g` или просто `[X]g e` (e = European mark, означает аппроксимация per Average Quantity System)

### 12. Health claims — verbatim из GB NHC Register

**Требование:** Любой health claim на этикетке должен:
- Быть verbatim из GB NHC Register (или ASA-approved adaptation)
- Включать "contributes to" (или approved variant)
- Быть привязан к конкретному ингредиенту с достаточной дозой
- Не использовать слова из RED FLAG списка

**Пример правильного на этикетке:**
```
Vitamin B6 contributes to normal functioning of the nervous system.
```

**Неправильно:**
```
Vitamin B6 for healthy nervous system.       ← пропущено "contributes to"
Vitamin B6 supports sleep.                    ← не из NHC Register
B6 — your nightly sleep support.             ← misleading
```

---

## Mandatory Warnings (3 + pregnancy)

**3 обязательных (2002/46/EC Art. 6):**

1. "Do not exceed the stated recommended daily dose."
2. "Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle."
3. "Keep out of the reach of young children."

**Pregnancy advisory (highly recommended, обязательно для некоторых ингредиентов):**

4. "If you are pregnant, breastfeeding, taking medication, or have a medical condition, consult your healthcare professional before use."

**Дополнительные при необходимости:**
- "Not suitable for children under [age]." — для caffeine, herbal extracts
- "Contains caffeine. Not recommended for children or pregnant women." — если >150mg caffeine/serving
- "May cause drowsiness." — если содержит valerian, hops
- "Contains a source of phenylalanine." — если содержит aspartame

---

## "Made in UK" / "Produced in UK" / Country of Origin

**Правила (UK Consumer Protection Regulations + FIC):**

| Заявление | Когда допустимо |
|---|---|
| "Made in UK" / "Produced in UK" | Только если **физическое производство** происходит в UK (не только packaging) |
| "Manufactured in the UK" | Аналогично |
| "Produced for [Company]" | Когда company UK FBO, но производство elsewhere (нейтрально, не утверждает страну производства) |
| "Formulated in UK, Produced for [Company]" | Когда формула разработана в UK, но производится за рубежом |
| "Quality Tested in UK" | Когда финальное QA testing в UK |

**КРИТИЧНО:** Если manufacturer в Китае/Индии/Турции/EU — НЕЛЬЗЯ писать "Made in UK" или "Produced in UK". Это нарушение Consumer Protection Regulations + Amazon может заблокировать листинг.

**Правильные альтернативы для импорта:**
- "Produced for [UK FBO Company], [UK Address]"
- "Quality Tested in the UK"
- "Distributed by [UK Company]" (без заявления о месте производства)

---

## Sertification claims — требования

| Claim | Требование |
|---|---|
| "Vegan" | Документированная сертификация Vegan Society / V-Label / EVU |
| "Vegetarian" | Может быть без формальной сертификации, но не должно содержать meat/fish/gelatin/rennet |
| "Gluten-Free" | Менее 20 ppm (mg/kg) — Codex Alimentarius standard. Сертификация AOECS / Coeliac UK ELS приветствуется |
| "Sugar-Free" | Менее 0.5g сахаров / 100g (Reg. 1924/2006). NB: подсластители — НЕ сахар. |
| "No Added Sugar" | Не содержит добавленных моно- или дисахаридов / других подслащивающих ингредиентов |
| "Organic" | Сертификация UK organic certifier (Soil Association, OF&G, etc.) — UK Organic Reg. |
| "Halal" | Сертификация HFA / HMC |
| "Kosher" | Сертификация London Beth Din / KLBD |
| "GMP Certified" | Facility должен иметь действующий GMP certificate |
| "Non-GMO" / "GMO Free" | Все ingredients подтверждены non-GMO (technically EU req., но не auto-certified) |
| "Third-Party Lab Tested" | Готовый Certificate of Analysis (CoA) от независимой лаборатории |

---

## Common label violations — частые ошибки (с примерами)

### Пример 1: Sorbitol misclassified

```
❌ Sweetener: Maltitol Syrup, Erythritol, Sorbitol Syrup
✅ Maltitol Syrup (Sweetener), Erythritol (Sweetener), Sorbitol Syrup (Humectant)
```

### Пример 2: Carnauba Wax без класса

```
❌ Glazing Agent: Medium Chain Triglycerides (MCT Oil), Carnauba Wax.
✅ Medium Chain Triglyceride Oil (Glazing Agent)  ← удалить Carnauba Wax если не используется
```

### Пример 3: "Food Supplement" слит с маркетингом

```
❌  Natural Mango Flavour Food Supplement 60 Gummies
✅  Food Supplement
     Mango Flavoured with Sweeteners
     60 Gummies | Net Weight 180g
```

### Пример 4: "Produced in UK" когда manufacturer в Китае

```
❌  Produced in the UK
     SADALSUUD LTD, 128 City Road, London EC1V 2NX
     
✅  Produced for SADALSUUD LTD
     128 City Road, London EC1V 2NX
```

### Пример 5: Health claim без "contributes to"

```
❌  Vitamin B6 — for healthy nervous system
✅  Vitamin B6 contributes to normal functioning of the nervous system
```

### Пример 6: "powder" в Nutritional Table для extract

```
❌  Ashwagandha Root Extract (10:1)   30 mg
     equiv. to Ashwagandha Root Powder     300 mg     †

✅  Ashwagandha Root Extract (10:1)   30 mg
     equiv. 300 mg                              †
```

### Пример 7: Missing sweetener declaration

```
❌  Sleep Gummies
     60 Gummies | Net Weight 180g
     
✅  Sleep Gummies
     Food Supplement
     Mango Flavoured with Sweeteners        ← обязательно
     60 Gummies | Net Weight 180g
```
