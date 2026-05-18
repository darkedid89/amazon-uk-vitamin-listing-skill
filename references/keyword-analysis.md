# Keyword Analysis — CSV Schemas + Scoring + Tier Allocation

## Поддерживаемые источники

### 1. ZonGuru Keywords on Fire (KoF)

**Идентификатор:** колонки `ZG Score`, `KW $`, `Top 25 Comp`

| CSV Column | Использование | Маппинг |
|---|---|---|
| Keyword | Ключевая фраза | — |
| ZG Score | Комплексная оценка ZonGuru (1-100) | Бонусный множитель |
| KW $ | Оценочная выручка по keyword (£) | Контекст |
| Currency | Валюта (GBP) | — |
| Search Volume | Месячный объём поиска | SV Weight |
| Top 25 Comp | Уровень конкуренции (1-10) | Competition (инверсный) |
| ZG Launch | Units for launch | Контекст PPC |
| Est. Units Sold | Оценка units/мес | Sales Signal |
| Avg. Ratings | Среднее количество reviews | Контекст |
| Avg. Price | Средняя цена (£) | Контекст рынка |
| KW Title Broad | % конкурентов с keyword в title (broad) | Title prioritisation |
| KW Title Exact | % конкурентов с keyword в title (exact) | Title prioritisation |
| PPC Bid | Рекомендуемая PPC ставка (£) | PPC Priority |
| Top 3 KW $ | Выручка Top 3 (£) | Контекст |
| Top 3 Click Share | Доля кликов Top 3 (%) | Контекст |
| Top 3 Conversion Share | Доля конверсий Top 3 (%) | Sales Signal (alt) |

**Особенности:**
- ZG Score ≥90 = высокоприоритетный keyword
- Top 25 Comp шкала 1-10 (1 = мало конкуренции, 10 = сильная)
- KW Title Broad/Exact < 20% → keyword недоиспользован (opportunity)

### 2. Helium 10 Cerebro

**Идентификатор:** колонки `Cerebro IQ Score`, `Keyword Phrase`, `Competing Products`

| CSV Column | Использование | Маппинг |
|---|---|---|
| Keyword Phrase | Ключевая фраза | — |
| Search Volume | Месячный SV | SV Weight |
| Cerebro IQ Score | Комплексная оценка H10 | Бонусный множитель |
| Keyword Sales | Продажи по keyword/мес ($) | Sales Signal |
| Organic Rank / Position | Текущий органический ранг | Opportunity Gap |
| Competing Products | Количество competing items | Competition Score |
| Sponsored ASINs | Количество спонсируемых ASIN | PPC контекст |
| Title Density | % листингов с keyword в title | Title prioritisation |
| ABA Total Click Share | Click share из BA | Контекст |
| ABA Total Conv. Share | Conv. share из BA | Sales Signal (alt) |
| Amazon Recommended | Yes/No | Relevance bonus |
| Search Volume Trend | Числовое или Up/Down/Flat | Trend Signal |
| Relative Rank | Относительная позиция | Контекст |

**Особенности:**
- Cerebro IQ Score = комплексная оценка
- CIQ ≥ 100,000 = высокий приоритет
- Position 0 = не ранжируется (opportunity gap)
- Title Density > 80% = keyword обязателен в title (стандарт ниши)

### 3. Amazon Brand Analytics — Search Query Performance (SQP)

**Идентификатор:** `Search Query`, `Impressions Share`

| CSV Column | Использование | Маппинг |
|---|---|---|
| Search Query | Фраза | — |
| Search Query Volume | Точный объём поиска Amazon | **SV Weight (приоритет!)** |
| Impressions Share | Доля показов (%) | Контекст видимости |
| Clicks Share | Доля кликов (%) | Контекст CTR |
| Conversion Share | Доля конверсий (%) | Sales Signal (highest accuracy) |

**Особенности:**
- **Search Query Volume = самый точный SV** (first-party Amazon data)
- Если есть SQP — ВСЕГДА использовать вместо Cerebro/ZonGuru
- Conv. Share из SQP точнее Cerebro Keyword Sales

### 4. Amazon Brand Analytics — Top Search Terms

**Идентификатор:** `Search Frequency Rank`, `Search Term`

| CSV Column | Использование | Маппинг |
|---|---|---|
| Search Frequency Rank | Ранг частоты (1 = популярнее всего) | Прокси для SV |
| Search Term | Фраза | — |
| Top Clicked Product ASINs | ASIN с most clicks | Конкурентный анализ |
| Click Share | Доля кликов (%) | Контекст |
| Conversion Share | Доля конверсий (%) | Sales Signal |

**Особенности:**
- Search Frequency Rank — без абсолютного SV, только ранг
- Ранг < 50,000 = высокий объём поиска

### Приоритет источников

Если один keyword в нескольких источниках:

| Данные | Приоритет |
|---|---|
| Search Volume | BA SQP > Cerebro > ZonGuru |
| Sales / Conv. | BA Conv. Share > Cerebro KW Sales > ZonGuru Est. Units |
| Competition | Cerebro Competing Products > ZonGuru Top 25 Comp |
| Composite Score | Cerebro IQ > ZonGuru ZG Score |

### Автоопределение формата

При получении CSV:
1. Прочитать заголовки (первая строка)
2. Искать уникальные идентификаторы:
   - `ZG Score` → ZonGuru KoF
   - `Cerebro IQ Score` → Cerebro
   - `Impressions Share` → BA SQP
   - `Search Frequency Rank` → BA Top Search Terms
3. Если нет совпадений — перечислить найденные колонки и запросить подтверждение

Загрузка через Python:
```python
import csv
with open(file, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    headers = reader.fieldnames
    rows = list(reader)
```

---

## Scoring Formula

### Основная формула

```
Priority Score = (SV_Weight × 0.30) 
               + (Sales_Signal × 0.25) 
               + (Competition_inv × 0.20) 
               + (Relevance × 0.15) 
               + (Trend × 0.10)
```

Итоговый Score умножается на бонусный множитель (CIQ или ZG Score).

### Компоненты

#### 1. Search Volume Weight (вес 0.30)

| Search Volume | Баллы |
|---|---|
| ≥ 10,000 | 10 |
| 5,000 – 9,999 | 8 |
| 2,000 – 4,999 | 6 |
| 1,000 – 1,999 | 4 |
| 500 – 999 | 2 |
| 200 – 499 | 1 |

#### 2. Sales Signal (вес 0.25)

| Keyword Sales / Est. Units | Conv. Share | Баллы |
|---|---|---|
| ≥ 1,000 | ≥ 10% | 10 |
| 500 – 999 | 5% – 10% | 7 |
| 200 – 499 | 2% – 5% | 4 |
| < 200 | < 2% | 1 |

#### 3. Competition Score — инверсный (вес 0.20)

Cerebro (Competing Products):

| Competing | Баллы |
|---|---|
| < 100 | 10 |
| 100 – 300 | 7 |
| 300 – 500 | 4 |
| > 500 | 2 |

ZonGuru (Top 25 Comp 1-10):

| Top 25 Comp | Баллы |
|---|---|
| 1 – 3 | 10 |
| 4 – 5 | 7 |
| 6 – 7 | 4 |
| 8 – 10 | 2 |

#### 4. Relevance — экспертная (вес 0.15)

| Релевантность | Баллы |
|---|---|
| Точное совпадение с типом продукта (e.g. "sleep gummies" для Sleep Gummies) | 10 |
| Близкий вариант / keyword ингредиента (e.g. "magnesium gummies", "melatonin supplement") | 7 |
| Смежная категория (e.g. "relaxation supplement", "night time aid") | 4 |
| Косвенная связь (e.g. "wellness gummies", "vitamin gummies") | 1 |

#### 5. Trend Signal (вес 0.10)

| Тренд | Баллы |
|---|---|
| Рост (positive) | 10 |
| Стабильный (0) | 5 |
| Падение (negative) | 2 |

Если данных нет — использовать 5 (нейтрально).

### Бонусный множитель

**Cerebro IQ:**

| CIQ | Множитель |
|---|---|
| ≥ 100,000 | × 1.2 |
| 50,000 – 99,999 | × 1.1 |
| < 50,000 | × 1.0 |

**ZG Score:**

| ZG Score | Множитель |
|---|---|
| ≥ 90 | × 1.2 |
| 70 – 89 | × 1.1 |
| < 70 | × 1.0 |

### Пример расчёта

Keyword: "sleep gummies"
- SV: 14,800 → 10
- KW Sales: 3,200 → 10
- Competing Products: 85 → 10
- Exact match: 10
- Trend: stable → 5
- CIQ: 85,000 → ×1.1

```
Raw = (10×0.30) + (10×0.25) + (10×0.20) + (10×0.15) + (5×0.10)
    = 3.0 + 2.5 + 2.0 + 1.5 + 0.5
    = 9.5

Final = 9.5 × 1.1 = 10.45
```

---

## Tier Allocation

После сортировки по Priority Score (descending):

### TIER 1 — TITLE (топ 5-8 keywords)

- Обязательно в title (особенно топ-3 в первых 80 символах)
- Суммарно title ≤ 200 chars
- Предложить конкретную структуру title

### TIER 2 — BULLETS (следующие 15-25 keywords)

- Распределить по 5 буллетам (3-5 unique keywords на буллет)
- НЕ повторять keywords из Title
- Bullet 1 = самые приоритетные оставшиеся

### TIER 3 — BACKEND (следующие 30-50 keywords)

- Только слова, которых НЕТ в Title и Bullets
- Включить: синонимы, British/American variants, опечатки, long-tail fragments
- Lowercase, через пробелы, ≤ 249 байт

### TIER 4 — SUPPLEMENTARY

- Description / FAQ / A+ alt-text / PPC
- Keywords не поместившиеся в backend
- Long-tail фразы для FAQ (Rufus AI optimization)

### PPC PRIORITY LIST — топ 20

3 типа:
1. **Core** (Exact + Broad): high SV + конвертирующие, можно в листинге
2. **Compliance** (Broad/Phrase only): drug-mimic phrases (`melatonin gummies`, `sleeping tablets`) — НЕЛЬЗЯ в листинге, МОЖНО в PPC
3. **Competitor** (SP product targeting): бренды конкурентов

### Пороги тиров — динамические

Не использовать фиксированные числовые пороги. Использовать **natural breaks** в распределении Priority Scores. Если в датасете 200 keywords:
- Tier 1 ≈ top 5-8 (топ 4%)
- Tier 2 ≈ next 15-25 (8-12%)
- Tier 3 ≈ next 30-50 (15-25%)
- Tier 4 ≈ остальные

---

## Filtering — 3 фильтра последовательно

### Фильтр 1: Нерелевантные

- SV < 200 → удалить (шум)
- Однословные → удалить (слишком широкие), КРОМЕ определяющих продукт (creatine, melatonin, berberine, ashwagandha, magnesium, biotin)
- Явно нерелевантные категории → удалить (экспертная оценка по контексту продукта)

### Фильтр 2: Бренды конкурентов

- Выделить keywords с названиями брендов конкурентов
- Список UK supplement брендов (часто встречаются):
  - Sleep: Dozybears, Novomins, Rescue, Bach, Kalms, Nytol, Lemme, Lullabites, Sleep Oracles, SuperSelf, GummyUP+, Hybrid Health, Calmify, Trip, K.O. Gummies
  - General: Vitabiotics, Holland & Barrett, Healthspan, Solgar, Higher Nature, Bio-Synergy, Myprotein
- Вынести в отдельный список **"Competitor Keywords — PPC targeting only"**
- НЕЛЬЗЯ использовать в листинге (Amazon ToS violation)

### Фильтр 3: Compliance-риски

- Пометить keywords со словами: `cure`, `treat`, `prevent`, `heal`, названия болезней, медицинские условия
- Пометить keywords типа: `sleeping tablets`, `insomnia cure`, `anxiety medication`, `sleep aid`
- Спец. список:
  - `melatonin` family (POM) — PPC Broad only
  - `cbd` family (novel food) — PPC requires care
  - `5htp`, `tryptophan` — PPC only
- Статус: **"COMPLIANCE RISK — PPC only with caution"**

Отчитаться: "Отфильтровано с [X] до [Y] рабочих keywords. Удалено: [Z] нерелевантных, [N] competitor brands, [M] compliance-рисков."

---

## Validation — 9-point check

Перед финальным выводом:

1. ✅ Нет дублей слов между Title + Bullets + Backend
2. ✅ Backend ≤249 байт (bash `wc -c`)
3. ✅ Title ≤200 chars (`len()`)
4. ✅ Нет brands конкурентов в полях листинга
5. ✅ Нет compliance-risk слов в Title/Bullets/Backend
6. ✅ British English во всех front-facing keywords
7. ✅ "food supplement" (не "dietary supplement")
8. ✅ Title читается естественно (не keyword-stuffing)
9. ✅ Tier 2 keywords распределены по буллетам (не все в одном)

---

## Edge cases

| Сценарий | Действие |
|---|---|
| CSV с неожиданными колонками | Перечислить колонки, запросить подтверждение источника |
| Нет SV данных | Использовать ZG Score или CIQ как прокси |
| Нет BA данных | Указать: "Анализ на основе Cerebro/ZonGuru estimates (точность 76-80%)" |
| Менее 50 keywords после фильтрации | Предупредить: ниша узкая, рекомендовать H10 Magnet |
| Backend > 249 байт | Удалить keywords с наименьшим Score, показать что вырезано |
| Несколько CSV файлов | Мержить + cross-reference. BA SV > Cerebro SV (выше точность) |
