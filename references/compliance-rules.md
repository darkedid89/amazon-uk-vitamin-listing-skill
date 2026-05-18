# UK Food Supplement Compliance — Red/Yellow/Green Flags

> **Last verified:** 2026-05
> **Источники (для верификации):**
> - [UK Food Supplements (England) Regulations 2003](https://www.legislation.gov.uk/uksi/2003/1387/contents/made) (transposes Directive 2002/46/EC)
> - [Food Information Regulations 2014](https://www.legislation.gov.uk/uksi/2014/1855/contents/made) (retained Reg. 1169/2011)
> - [GB Nutrition and Health Claims Register](https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register)
> - [ASA Rulings database](https://www.asa.org.uk/codes-and-rulings/rulings.html) — search by company name / sector
> - [MHRA herbal medicines guidance](https://www.gov.uk/government/collections/herbal-medicines-regulation-in-the-uk)
> - [Amazon UK Selling Policies — Food Supplements](https://sellercentral.amazon.co.uk/help/hub/reference/G201833410)
>
> **Disclaimer:** Регуляции и ASA enforcement меняются. Перед production launch — verify актуальный текст regulations через legislation.gov.uk.

---

## RED FLAGS — Листинг будет удалён / Этикетка не пройдёт

### Запрещённые слова (немедленное удаление Amazon + ASA action)

Нигде в листинге или на этикетке:

**Медицинские глаголы:**
`cures`, `prevents`, `treats`, `eliminates`, `heals`, `diagnoses`, `fights`, `combats`, `destroys`, `kills`, `relieves` (когда применено к disease)

**Названия болезней / медицинских состояний:**
`Alzheimer's`, `cancer`, `depression`, `diabetes`, `anxiety`, `arthritis`, `insomnia`, `ADHD`, `IBS`, `dementia`, `Parkinson's`, `heart disease`, `hypertension`, `epilepsy`, `migraine`, `asthma`, `eczema`, `psoriasis`, `osteoporosis`, `menopause` (когда применено к лечению)

**Медицинские термины:**
`antibacterial`, `antiviral`, `anti-inflammatory`, `antimicrobial`, `antifungal`, `antibiotic`, `analgesic`

**Weight loss claims:**
`fat-burning`, `fat burner`, `appetite suppressant`, `weight loss supplement`, `slimming`, `diet pills`, `metabolism booster`

**Авторитетные claims без доказательств:**
`clinically proven`, `doctor recommended`, `doctor approved`, `FDA approved`, `MHRA approved`, `scientifically proven`, `medically proven`, `hospital tested`, `endorsed by [authority]`

**Гарантии результата:**
`guaranteed results`, `100% effective`, `works immediately`, `instant results`, `proven to work`, `miracle`, `magic`, `revolutionary breakthrough`

**MHRA POM / regulated substances:**
- `melatonin` — POM в UK, ЗАПРЕЩЕНО упоминать в листинге Amazon UK (но можно в PPC Broad match)
- `CBD` / `cannabidiol` — novel food, отдельная регуляция FSA, не использовать без FSA approval
- `5-HTP`, `tryptophan` — серая зона, требуют caution
- `yohimbe`, `DMAA`, `ephedra` — banned ingredients UK
- `kratom` — banned

### Запрещённые паттерны

- `[Ingredient] + treats/prevents/cures [condition]` — ВСЕГДА
- `[Product] + for [disease/condition]` — например, "gummies for insomnia"
- `Before/after` health claims
- Testimonials с медицинскими claims
- Сравнения с лекарствами: "works like sleeping pills", "natural alternative to medication", "Rx-strength"
- Implying drug equivalence: `prescription strength`, `Rx-grade`, `pharmaceutical grade` (последнее допустимо только если действительно соответствует USP/Ph.Eur)

---

## YELLOW FLAGS — Рискованно, требует переформулирования

### Слова, требующие осторожности

| Запрещено / Рискованно | Заменить на |
|---|---|
| `boosts` | `contributes to` / `supports` |
| `improves` | `contributes to the maintenance of` |
| `enhances` | `supports` |
| `increases` (без NHC верификации) | `contributes to` |
| `optimises` | `supports` |
| `prevents` | УДАЛИТЬ или `helps maintain` |
| `strengthens` | `contributes to the maintenance of` |
| `detox` / `detoxifies` / `cleanses` | УДАЛИТЬ (нет авторизованных claims) |
| `superfood` | УДАЛИТЬ (нет definition в UK law) |
| `nootropic` | УДАЛИТЬ (нет авторизованного claim) |
| `adaptogen` | УДАЛИТЬ (botanical claims on hold) |
| `immune booster` / `immunity booster` | `contributes to the normal function of the immune system` (только с авторизованным ингредиентом: Vit C/D, Zinc, etc.) |
| `anti-ageing` | УДАЛИТЬ |
| `mood booster` | `contributes to normal psychological function` (с B6/B12/Folate/Magnesium только) |

### Сертификационные claims

- **"100% organic"** — ЗАПРЕЩЕНО без сертификации Soil Association / Organic Farmers & Growers (OF&G) / EU Organic
- **"certified gluten-free"** — только с документированной AOECS / Coeliac UK certification
- **"certified vegan"** — только с Vegan Society или V-Label certification
- **"halal certified"** — только с HFA / HMC certification
- **"lab tested"** / `third-party tested` — допустимо, если тестирование реально проводится; иметь готовый Certificate of Analysis
- **"GMP certified"** — допустимо, если facility имеет GMP сертификат (UK, EU, NSF, USP)

### Сравнения (ASA enforcement)

- `best`, `most effective`, `#1`, `leading`, `top-rated` → **ЗАПРЕЩЕНО** без подтверждения (ASA: Novomins £50K fine 2024)
- `better than [competitor]` → ЗАПРЕЩЕНО
- `strongest on the market` → ЗАПРЕЩЕНО
- `the only [X] that does Y` → ЗАПРЕЩЕНО без verifiable evidence
- `premium` → допустимо как субъективная характеристика
- `high strength` → допустимо при указании конкретной дозировки и сравнении с аналогами
- `most potent` → ЗАПРЕЩЕНО

### Critical ASA precedent — "contributes to"

ASA enforcement pattern: пропуск "contributes to" (или equivalent approved adaptation) перед NHC claim делает claim **misleading и subject to ASA action**. Это long-standing principle, подтверждён множеством рулингов против supplement брендов в UK.
- ❌ "Vitamin B6 for tiredness and fatigue" — пропущен `contributes to the reduction of`
- ✅ "Vitamin B6 contributes to the reduction of tiredness and fatigue"

> **Verify:** конкретные precedent кейсы — [ASA Rulings database](https://www.asa.org.uk/codes-and-rulings/rulings.html), search "vitamin", "supplement", "food supplement".

**Допустимые адаптации** (ASA-approved):
- `contributes to` — стандарт NHC
- `supports` — ASA-approved adaptation
- `helps maintain` — для maintenance claims
- `helps keep` — допустимая альтернатива
- `plays a role in` — допустимая альтернатива
- `to support` — допустимая альтернатива

---

## GREEN — Разрешённые формулировки

### Lifestyle claims (не требуют GB NHC авторизации)

- `Supports ketogenic lifestyle`
- `Designed for active people`
- `Part of your daily wellness routine`
- `Complement to a balanced diet`
- `Convenient way to [take ingredient]`
- `Easy-to-take format`
- `For your evening routine`
- `Designed for adults`
- `A tasty way to include [ingredient] in your day`
- `Crafted for [target audience]`

### Описательные формулировки (всегда безопасны)

- Описание состава: `contains 1000mg of...`
- Описание формата: `easy-to-take gummy form`, `chewable`, `pectin-based`
- Описание вкуса: `delicious raspberry flavour`, `natural mango flavour`
- Описание supply: `30-day supply`, `2-month supply at 2 gummies per day`
- Производство: `made in the UK`, `produced in the UK`, `manufactured in a GMP-certified facility`
- Сертификаты при наличии: `vegan`, `sugar-free`, `gluten-free`, `non-GMO`, `palm-oil free`

---

## Технические требования Amazon UK

### Title

- **≤200 символов** (включая пробелы) — жёсткий лимит с 21 января 2025
- Recommended: ≤80 chars для мобильной оптимизации (67%+ трафика — мобильные)
- Одно слово не более 2 раз
- Запрещённые символы: `! $ ? ^ ~`
- ЗАПРЕЩЕНО ALL CAPS для слов (кроме бренда и аббревиатур типа ACV, GMP, NRV, MCT, EFA)
- Первое слово title = бренд
- Не начинать с цифр

### Bullet Points

- 5 буллетов (для third-party sellers)
- ≤500 символов на каждый bullet
- Оптимально 200-250 chars для читаемости
- **Indexation threshold ~1000 байт суммарно** — превышение приводит к усечению при indexation
- Начинать с CAPS LABEL (2-4 слова), затем `—`
- Не начинать с цифры
- Не использовать HTML

### Description

- ≤2000 символов включая HTML
- Допустимые теги: `<p>`, `<b>`, `<br/>` (большинство других тегов будут strip'нуты)
- Optimal: 1500-1900 chars
- Содержит: hook → ingredients → quality → FAQ → disclaimer

### Backend Search Terms

- **Строго ≤249 байт** — превышение даже на 1 байт = **ПОЛНАЯ деиндексация всех backend keywords**!
- Только lowercase
- Слова через **пробелы** (не запятые, не точки с запятой)
- НЕ повторять слова из Title/Bullets/Description (Amazon индексирует весь листинг)
- НЕ включать: бренд, ASIN конкурентов, brand names competitors, медицинские/запрещённые термины
- НЕ включать спецсимволы
- Проверять байты ОБЯЗАТЕЛЬНО через bash: `echo -n "your terms" | wc -c`

### Обязательная UK терминология

- **"food supplement"** — UK FIC term. НЕ "dietary supplement" (US).
- **British English** обязателен:
  - `fibre` (не fiber)
  - `colour` / `colours` (не color/colors)
  - `flavour` / `flavours` (не flavor/flavors)
  - `personalised` (не personalized)
  - `organise` / `organised` (не organize/organized)
  - `defence` (не defense)
  - `catalogue` (не catalog)
  - `licence` (noun) / `license` (verb)
  - `aluminium` (не aluminum)
  - `paediatric` (не pediatric)
  - `oestrogen` (не estrogen)
- **NRV** (Nutrient Reference Value) — НЕ "%DV" (US), НЕ "%RDA" (устаревший)
- **mg / µg / IU** для дозировок
- **kJ** + ккал для energy (не только kcal)

### Обязательные disclaimer (UK law)

3 обязательных предупреждения на каждом продукте (Food Supplements Directive 2002/46/EC Art. 6):
1. "Do not exceed the stated recommended daily dose."
2. "Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle."
3. "Keep out of the reach of young children."

Дополнительные предупреждения (по необходимости):
- "If you are pregnant, breastfeeding, taking medication, or have a medical condition, consult your healthcare professional before use."
- "Not suitable for children under [age]."
- "Contains caffeine. Not recommended for children or pregnant women." (если >150mg caffeine/serving)

---

## "When in doubt" — Decision Tree

Используй когда **не уверен** допустим ли claim или формулировка.

```
Q1: Это health claim (упоминание о пользе для здоровья)?
    NO  → описательно / lifestyle → SAFE (продолжить)
    YES → Q2

Q2: Claim verbatim из GB NHC Register или с approved adaptation (supports/helps maintain)?
    NO  → STOP. Не использовать. Заменить на lifestyle phrase или удалить.
    YES → Q3

Q3: Привязан к конкретному ингредиенту с достаточной дозой?
    (Например, "Vitamin C contributes to immune function" требует Vit C минимум 12mg = 15% NRV per serving)
    NO  → STOP. Не использовать.
    YES → Q4

Q4: "contributes to" присутствует?
    NO  → ADD "contributes to" / "supports" / "helps maintain" обязательно.
    YES → Q5

Q5: Есть ли в формулировке RED FLAG слова (cure, treat, prevent, disease names)?
    YES → STOP. Rewrite без них.
    NO  → Q6

Q6: Это сравнение (best / #1 / most / leading / strongest)?
    YES → STOP. Удалить или заменить на subjective (premium, high-strength).
    NO  → Q7

Q7: British English? (flavour не flavor, food supplement не dietary supplement)
    NO  → Fix spelling.
    YES → ✅ SAFE — claim допустим.
```

### Когда верить скилу vs верить юристу

| Сценарий | Доверять только скилу | Дополнительный review |
|---|---|---|
| Базовый витамин (D3, B12, magnesium) с NHC claim | Да | — |
| Composite product с 3+ ингредиентами без NHC | Скил даёт baseline | Желательно legal review перед launch |
| Botanical extract с claim "on hold" | Нет — скил отказывает | Не запускать |
| Sex / men's vitality / mood / cognition | Скил даёт baseline | **Обязательно** legal review |
| Probiotics со здоровьем кишечника | Нет — скил отказывает | Не использовать health claims вообще |
| Mass-production print run | Скил для draft | **Обязательно** Trading Standards / regulatory consultancy |
| Novel food (CBD, новый ботаник) | Нет | FSA novel food authorisation |

---

## Final 15-point Compliance Checklist

Использовать на финальном этапе LISTING_CREATE:

| # | Проверка | Источник правил |
|---|---|---|
| 1 | Нет RED FLAG слов (cure, treat, prevent, heal, disease names) | UK Food Supp. Dir. + ASA |
| 2 | Все health claims из GB NHC Register (exact wording или ASA-approved adaptation) | GB NHC Register |
| 3 | "contributes to" НЕ пропущено ни в одном health claim | ASA enforcement (consistent rulings) |
| 4 | British English везде (flavour, colours, fibre, organise) | UK FIC + style |
| 5 | Title ≤200 символов (точный count через `len()`) | Amazon UK 2025 limit |
| 6 | Каждый bullet ≤500 символов | Amazon UK limit |
| 7 | Суммарно bullets ≤1000 байт по UTF-8 (`wc -c`) | Indexation threshold |
| 8 | Backend ≤249 байт (`echo -n "..." | wc -c`) | Amazon strict |
| 9 | Нет повторов слов между Title / Bullets / Backend | SEO efficiency |
| 10 | "Food supplement" (НЕ "dietary supplement") где упоминается категория | UK FIC Reg. |
| 11 | Нет сравнений без подтверждения (best, #1, most, leading, strongest) | ASA enforcement |
| 12 | Дозировки консистентны во всех секциях (Title, Bullets, Description, label) | Compliance basic |
| 13 | Disclaimer содержит 3 обязательных UK предупреждения + pregnancy + storage | UK Food Supp. Dir. Art. 6 |
| 14 | Нет melatonin / CBD / yohimbe / 5-HTP / DMAA / ephedra / kratom | MHRA + FSA |
| 15 | Botanicals без NHC claims описаны ТОЛЬКО как ингредиенты (no health claims) | GB NHC Register on-hold list |

**VERDICT:** `SAFE TO PUBLISH` только при 15/15 ☑. Иначе `NEEDS FIXES` с конкретными номерами пунктов.
