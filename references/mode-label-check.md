# MODE 1: LABEL_CHECK — Detailed Workflow

> **Loaded by skill when:** "проверь этикетку", "label check", "правки для дизайнера", JPG/PNG/PDF этикетки приложен.
>
> **Prerequisites:** `references/compliance-rules.md` + `references/claims-database.md` + `references/decision-tree.md` (pre-flight). Additionally load `references/label-requirements.md` when this mode triggers.

Проверяет этикетку food supplement против UK regulations. Работает с JPG/PNG/PDF (через vision) или текстовой спецификации.

## Входные данные

Запросить через `AskUserQuestion`, если не указано явно:

1. **Файл этикетки** (JPG/PNG/PDF) или текстовая спецификация — обязательно
2. **Спецификация от производителя** (если есть) — формула, ингредиенты, FBO, манипуляции
3. **Название продукта и бренд**
4. **Категория** (vitamins / sleep gummies / probiotics / omega-3 / sports / multivitamin / men's vitality / keto-ACV)
5. **Место производства** (UK / EU / non-EU) — критично для "Made in UK" / "Produced for"

## Workflow

### Шаг 1: OCR / Извлечение содержимого этикетки

Если приложен JPG/PNG/PDF — открыть через `Read`. Если качество фото плохое — сразу запросить лучшее изображение или manufacturer spec в текстовом виде (см. `decision-tree.md` §1).

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
- "Made in UK" / "Produced in UK" — соответствует ли реальному месту производства? (Если manufacturer в Китае — нельзя писать "Made in UK".) См. `decision-tree.md` §3 и §8.
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
