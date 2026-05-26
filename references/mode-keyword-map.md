# MODE 3: KEYWORD_MAP — Detailed Workflow

> **Loaded by skill when:** "проанализируй ключевики", "keyword map", CSV from H10/ZonGuru/Brand Analytics attached.
>
> **Prerequisites:** `references/compliance-rules.md` + `references/claims-database.md` + `references/decision-tree.md` (pre-flight). Additionally load when this mode triggers:
> - `references/keyword-analysis.md` (CSV schemas + scoring formula + tier allocation)
> - `references/output-templates.md` (KEYWORD_MAP_OUTPUT block)
> - `references/scraping-playbook.md` (если данные нужно дополнить scraping)
> - `references/risk-tier-classification.md` (competitor audit)
> - `references/sv-uplift-analysis.md` (Cerebro intersection method)

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

1. **Нерелевантные**: SV<200 удалить; однословные удалить (кроме определяющих продукт: ashwagandha, melatonin, berberine, creatine, magnesium, keto, acv, gummies, vinegar)
2. **Бренды конкурентов**: вынести в отдельный список "Competitor Keywords — PPC only" (запрещено в листинге Amazon ToS)
3. **Compliance-риски**: пометить keywords с `cure/treat/prevent/heal`, disease names, drug-mimic phrases (`sleeping tablets`, `melatonin`, `anxiety`, `insomnia`, `weight loss`, `fat burner`) → статус "PPC only with caution" — см. `decision-tree.md` §9

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
- Compliance (`melatonin gummies`, `sleeping tablets`, `keto gummies for weight loss` — PPC only, Broad/Phrase match)
- Competitor brands (SP product targeting)

### Шаг 4b: Cerebro intersection (gap analysis, optional)

Если есть Cerebro данные с rank info — посчитать gap keywords:
```python
gap_kw = own_rank > 30 AND competitor_rank <= 30 AND SV >= 500
priority = SV × (1 / max(own_rank, 100))
```
Top 30 by priority → TIER 1/2 candidates (мы ranking weak там где конкурент сильный).

### Шаг 5: Output

Формат — см. `references/output-templates.md` → KEYWORD_MAP_OUTPUT.

### Шаг 6: 9-point validation

Перед финальным выводом:
1. ✅ Нет дублей слов между Title + Bullets + Backend (token-level, `[a-z0-9]+`)
2. ✅ Backend ≤249 байт (bash `wc -c`)
3. ✅ Title ≤200 chars
4. ✅ Нет брендов конкурентов в listing fields
5. ✅ Нет compliance-risk слов в Title/Bullets/Backend
6. ✅ British English во всех front-facing keywords
7. ✅ "food supplement" (не "dietary supplement")
8. ✅ Title читается естественно (не keyword-stuffing)
9. ✅ Tier 2 keywords распределены по буллетам (не все в одном)
