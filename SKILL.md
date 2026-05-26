---
name: amazon-uk-vitamin-listing
description: Use when working on Amazon UK food supplement listings — validating packaging labels (vision/text) against UK FIC + 2002/46/EC + GB NHC Register compliance, creating SEO-optimised compliant listings (title/bullets/description/backend/structured attributes/Important Information), or analysing keyword CSVs from Helium 10/ZonGuru/Brand Analytics. Covers vitamins, sleep botanicals, ACV, keto, probiotics, multivitamin, omega-3, weight management, sports, men's vitality. Triggers include "проверь этикетку", "label check", "правки для дизайнера", "создай листинг", "напиши листинг", "Amazon UK listing", "vitamin/supplement listing", "проанализируй ключевики", "keyword map", "UK FIC compliance", "food supplement label".
version: "1.5.0"
last_updated: "2026-05-26"
---

# Amazon UK Vitamin & Supplement Listing

End-to-end workflow для Amazon UK food supplements в трёх режимах:

1. **LABEL_CHECK** — валидирует этикетку (JPG/PNG/PDF/text-spec) против UK FIC + 2002/46/EC + GB NHC Register. Output: `LABEL_CORRECTIONS_for_designer.md`.
2. **LISTING_CREATE** — пишет compliant Amazon UK listing (Title ≤200c, 5 Bullets ≤1000b, Description ≤2000c, Backend ≤249b, + 20+ Seller Central structured attrs, + 5 Important Information fields, + risk-tier classification, + addressable SV analysis). Output: блок `═══ AMAZON UK LISTING ═══`.
3. **KEYWORD_MAP** — анализирует CSV (Helium 10 Cerebro/Xray, ZonGuru KoF, Brand Analytics SQP/Top Search Terms) и строит keyword placement map (Title/Bullets/Backend/PPC tiers).

**Language:** Объяснения/чек-листы/verdicts — на **русском**. Текст листинга, claims, label-elements, backend terms — на **British English**.

## Version history (concise)

- **v1.5.0** (2026-05-26) — slim SKILL.md (654→<300 lines), per-mode reference files, "Use when…" frontmatter, lazy-load convention, brand profile auto-load codified, decision tree consolidated, auto test runner, CAPS regex relaxed (`+ , /` now allowed)
- **v1.3.0** (2026-05-19) — structured Seller Central attrs (20+ fields), 5-tier risk classifier, SV uplift (Cerebro intersection), listing mechanisms runbook, mandatory scraper, 2026 backend doctrine, Path A/B/C
- **v1.2.0** (2026-05-18) — empirical risk-budget (n-gram), brand-swap judge, JSONL audit log, image briefs, menopause corpus + Vitgem profile
- **v1.1.0** (2026-05-18) — validators.py, golden tests, brand profiles, decision tree

**Data freshness:** compliance data snapshot 2026-05. Перед production launch — verify live `legislation.gov.uk` + GB NHC Register на `gov.uk`. См. footer "Источники".

## ⚠️ Hard rules

```
⛔ ЗАПРЕЩЕНО действовать в обход скила.
- Если скил говорит "≤249 байт" — значит 249. Не 250. Не "примерно".
- Проверка лимитов через bash (wc -c) — обязательна.
- Никаких "на глаз".
- Если claim не из GB NHC Register — НЕ ПИСАТЬ его.
- Если этикетка без FBO + UK address — БЛОКЕР.
- Если scrape amazon.co.uk — ТОЛЬКО Amazon-listing-scraber/scrape_asin_v2.js.
- Если LISTING_CREATE без 20+ structured attribute fields — INCOMPLETE.
```

## ⛔ Amazon UK scraping — единственный инструмент

**Любой scrape amazon.co.uk = `scrape_asin_v2.js` из [darkedid89/Amazon-listing-scraber](https://github.com/darkedid89/Amazon-listing-scraber).**

**Запрещено:** WebFetch (HTTP 500), Playwright snapshot (token-heavy), Firecrawl без UK residential proxy.

Возвращает: title · bullets · brand · price · rating · BSR · A+ content · mainImage · productDetails (20+ fields) · importantInformation (Ingredients/Directions/Safety/Storage). См. `references/scraping-playbook.md`.

## Регуляторный контекст (краткий)

- **UK Food Supplements Directive 2002/46/EC** (retained) — "food supplement" legal name, mandatory warnings
- **UK FIC 2014 (retained Reg. 1169/2011)** — Art. 9-10: mandatory label info, sweetener/allergen declaration
- **GB Nutrition & Health Claims Register** — единственный источник authorised health claims (verbatim or ASA `supports`/`helps maintain`)
- **MHRA** — melatonin = POM (UK). CBD = novel food. Yohimbe = banned
- **ASA** — comparative (`best`, `#1`), unverified guarantees → enforcement (Novomins £50K fine, 2024)
- **Trading Standards** — FBO, allergens, net weight, BBE, batch number

Detail: `references/compliance-rules.md` + `references/label-requirements.md`.

---

## Mode dispatcher

| Сигнал | Mode | Reference |
|---|---|---|
| "проверь этикетку", "label check", "правки для дизайнера", JPG/PNG/PDF этикетки | **LABEL_CHECK** | `references/mode-label-check.md` |
| "создай листинг", "напиши листинг", "Amazon UK listing", "оптимизируй листинг", product spec | **LISTING_CREATE** | `references/mode-listing-create.md` |
| "проанализируй ключевики", "keyword map", CSV из H10/ZonGuru/BA | **KEYWORD_MAP** | `references/mode-keyword-map.md` |
| Запрос неоднозначный | Спросить через `AskUserQuestion` | — |
| "полный workflow" (этикетка → ключи → листинг) | LABEL_CHECK → KEYWORD_MAP → LISTING_CREATE последовательно | все три |

---

## Reference loading rules

### Pre-flight (always load)

- `references/compliance-rules.md` — UK red/yellow/green flags + ASA enforcement
- `references/claims-database.md` — GB NHC Register по 25 ингредиентам
- `references/decision-tree.md` — 10 "when in doubt" scenarios
- `references/brand-profiles-convention.md` — brand profile auto-load rules

### Mode-specific (lazy load when mode triggers)

| Mode | Files to load |
|---|---|
| **LABEL_CHECK** | `mode-label-check.md` + `label-requirements.md` |
| **LISTING_CREATE** | `mode-listing-create.md` + `listing-templates.md` + `structured-attributes.md` + `risk-tier-classification.md` + `sv-uplift-analysis.md` + `listing-mechanisms.md` + `output-templates.md` + `scraping-playbook.md` |
| **KEYWORD_MAP** | `mode-keyword-map.md` + `keyword-analysis.md` + `output-templates.md` |

**Brand profile auto-load** (cross-mode): если в запросе упомянут бренд match'ащий `brands/*.md` → load `brands/<brand>.md` как pre-flight enrichment. Detail: `references/brand-profiles-convention.md`.

---

## When in doubt

См. `references/decision-tree.md` — 10 scenarios:
1. Label photo unclear → request better source
2. Ingredient not in GB NHC → lifestyle claim only
3. FBO non-UK → blocker until resolved
4. Claim not verbatim NHC → use ASA softening (`supports`/`helps maintain`)
5. Multiple SKU variants → one ASIN per formulation
6. Brand Registry inactive → SP-only, defer A+ / SB
7. "With mother" status unclear → don't claim
8. Country of Origin TBD → leave empty + "Manufactured for [FBO]"
9. Competitor risky claim → do not mirror without same basis
10. Validators.py false-positive → stop, debug, no Seller Central push

---

## Modes

### Mode 1: LABEL_CHECK

Проверяет этикетку food supplement против UK regulations. 12-point compliance audit + правки для дизайнера. Полный workflow → **`references/mode-label-check.md`**.

### Mode 2: LISTING_CREATE

Создаёт полный compliant Amazon UK listing (7-step workflow: claims mapping → title → bullets → description → backend → 20+ structured attrs → 17-point compliance + risk tier + addressable SV). Output template "═══ AMAZON UK LISTING ═══". Полный workflow → **`references/mode-listing-create.md`**.

### Mode 3: KEYWORD_MAP

Анализирует CSV → 3-filter pipeline → priority scoring → Tier 1-4 allocation (Title/Bullets/Backend/PPC). Cerebro intersection для gap analysis. Полный workflow → **`references/mode-keyword-map.md`**.

---

## Error handling

| Сценарий | Действие |
|---|---|
| Этикетка нечитаемая | Запросить лучшее изображение или manufacturer spec |
| Ингредиент отсутствует в claims-database | Lifestyle claims only. См. `decision-tree.md` §2 |
| Backend превысил 249 байт | Удалить keywords с наименьшим Priority Score |
| CSV с неожиданными колонками | Перечислить найденные колонки, запросить подтверждение |
| Нет SQP данных | Cerebro/ZonGuru с пометкой "estimates (76-80%)" |
| Менее 50 keywords после фильтрации | Ниша узкая, рекомендовать H10 Magnet |
| Конкурентный бренд в title запроса | СТОП. Amazon ToS violation |
| Validators.py false-positive | См. `decision-tree.md` §10 |

---

## Файловая структура

```
~/.claude/skills/amazon-uk-vitamin-listing/
├── SKILL.md                          ← dispatcher + reference loading rules
├── README.md                         ← install + overview
├── validators.py                     ← hard-limit validators (CAPS regex [A-Z0-9 &,+/-])
├── brand_swap_judge.py               ← Claude Haiku brand-swap test
├── audit_log.py                      ← JSONL append-only audit log
├── image_brief.py                    ← 7-slot image brief generator
├── references/
│   ├── compliance-rules.md
│   ├── claims-database.md
│   ├── decision-tree.md              ← ★ 10 "when in doubt" scenarios (v1.5.0)
│   ├── brand-profiles-convention.md  ← ★ auto-load rules (v1.5.0)
│   ├── mode-label-check.md           ← ★ Mode 1 detailed workflow (v1.5.0)
│   ├── mode-listing-create.md        ← ★ Mode 2 detailed workflow (v1.5.0)
│   ├── mode-keyword-map.md           ← ★ Mode 3 detailed workflow (v1.5.0)
│   ├── label-requirements.md
│   ├── listing-templates.md
│   ├── keyword-analysis.md
│   ├── scraping-playbook.md
│   ├── output-templates.md
│   ├── structured-attributes.md
│   ├── risk-tier-classification.md
│   ├── sv-uplift-analysis.md
│   ├── listing-mechanisms.md
│   ├── image-specifications.md
│   ├── brand-swap-corpora.json
│   └── empirical-risk-budget-*.md    ← per category, auto-generated
├── tools/
│   ├── refresh_risk_budget.py
│   └── run_tests.sh                  ← ★ auto golden test runner (v1.5.0)
├── data/
│   ├── menopause-corpus-2026-05-17/
│   └── keto-corpus-2026-05-26/
├── brands/
│   ├── README.md
│   ├── _template.md
│   ├── meleva.md
│   ├── vitgem-menopause.md
│   └── intense-wellness.md
└── tests/
    └── case-01..05/                  ← golden tests (run via tools/run_tests.sh)
```

## Use cases модулей

### Empirical risk-budget (n-gram analysis)

Считает frequency 1-3-грамм в surviving competitor listings → buckets SAFE/COMMON/RARE/UNIQUE/RISKY. Использовать **перед launch в новой категории** или **перед refresh listing** для drift-check.

```bash
python3 tools/refresh_risk_budget.py --corpus data/menopause-corpus-2026-05-17/competitors.json --category menopause
# Output: references/empirical-risk-budget-menopause.md
```

### Brand-swap judge (Claude Haiku, $0.0001/verify)

Классифицирует draft listing как `drug-mimic` или `legitimate-supplement` после удаления бренда. Требует `ANTHROPIC_API_KEY`.

```bash
python3 brand_swap_judge.py --brand "Vitgem" --title "..." --bullets b1..b5 --json
# Output: {"category": "legitimate-supplement", "confidence": 0.92}
```

### Audit log (JSONL)

Append-only verdict log, PII-scrubbed (brand → hash). Для retrospective analysis.

```bash
python3 audit_log.py append --mode LISTING_CREATE --verdict "SAFE TO PUBLISH" --brand "X" --product "Y" --score 97 --score-max 100
python3 audit_log.py summary --days 30
```

Лог: `~/.amazon-uk-vitamin-listing-audit.jsonl`.

### Image brief generator

7 image briefs (Main + Infographic + Benefits + Lifestyle + Quality + How-to-use + Size/Scale).

```bash
python3 image_brief.py --brand "Vitgem" --product-name "Menopause Gummies" --category menopause
```

## Использование validators.py

Детерминированная проверка hard limits.

```bash
# JSON shape: {"title": str, "bullets": [str x 5], "backend": str, "description": str}
python3 validators.py full listing.json
# Exit 0 = SAFE TO PUBLISH; 1 = NEEDS FIXES; 2 = usage error
```

CAPS label regex (v1.5.0): `^[A-Z0-9 &,+/-]{2,40}$` — допускает `, + /` для labels типа `60 GUMMIES & 30-DAY SUPPLY`.

## Brand profiles

Auto-load convention (v1.5.0): см. `references/brand-profiles-convention.md`.

Существующие profiles в `brands/`: meleva (sleep), vitgem-menopause (menopause clinical), intense-wellness (daily wellness, multi-SKU).

Новый бренд → копировать `brands/_template.md` → заполнить → сохранить как `brands/<brand>.md`.

## Golden tests

```bash
bash tools/run_tests.sh           # summary
bash tools/run_tests.sh --verbose # full validator output
```

Ожидается: case-01 → SAFE (exit 0), case-02..05 → FIXES (exit 1). Exit 0 если все expected outcomes matched.

## Источники / Verification

Все compliance data имеют `last verified date` + URL в reference-файлах. Перед production:

- [GB Nutrition and Health Claims Register](https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register)
- [Food Information Regulations 2014](https://www.legislation.gov.uk/uksi/2014/1855/contents/made)
- [Food Supplements Regulations 2003](https://www.legislation.gov.uk/uksi/2003/1387/contents/made)
- [ASA Rulings](https://www.asa.org.uk/codes-and-rulings/rulings.html)
- [MHRA Herbal Medicines](https://www.gov.uk/government/collections/herbal-medicines-regulation-in-the-uk)
- [Amazon UK Selling Policies](https://sellercentral.amazon.co.uk/help/hub/reference/G201833410)
