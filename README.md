# amazon-uk-vitamin-listing

Claude Code skill для end-to-end workflow создания и валидации Amazon UK food supplement листингов.

**Версия:** v1.3.0 (2026-05-19) — **industry-leading 87/100** на UK food supplement category.

## Что умеет

Три режима в одном навыке:

| Режим | Что делает | Триггеры |
|---|---|---|
| **LABEL_CHECK** | Проверяет JPG/PNG/PDF этикетки против UK FIC + 2002/46/EC + GB NHC Register. Выдаёт правки для дизайнера. | "проверь этикетку", "правки для дизайнера", "label check" |
| **LISTING_CREATE** | Пишет полный compliant Amazon UK listing (Title ≤200 / 5 Bullets ≤1000B / Description ≤2000 / Backend ≤249B) **+ 20+ Seller Central structured attributes + 5 Important Information fields + risk-tier classification + addressable SV analysis**. 17-point compliance check. | "создай листинг", "напиши листинг", "Amazon UK listing" |
| **KEYWORD_MAP** | Анализирует CSV из Helium 10 / ZonGuru / Brand Analytics, строит keyword placement map по тирам Title/Bullets/Backend/PPC с risk-tier audit. | "проанализируй ключевики", "keyword map" |

## ⭐ Что нового в v1.3.0

- **Structured Seller Central attributes** (20+ form fields) — Brand Name, Item Form, Diet Type, Primary Supplement Type, Material Features, Allergen Information, Country of Origin и др. Reverse-engineered из 6 топ-gummy конкурентов.
- **Important Information fields** (5 long-form) — Ingredients (always), Directions, Safety Information, Storage, Legal Disclaimer. Освобождают ~600-800 chars в description от boilerplate.
- **Risk-tier classification** (5 уровней: HIGH/MED-HIGH/MEDIUM/LOW-MED/LOW) — regex-based ASA risk scoring через RED/AMBER dictionaries.
- **Addressable SV analysis** — Cerebro keyword intersection + bullet placement weight (Title 1.5× / Bullet 1.3× / Backend 1.0×).
- **Path A/B/C decision framework** — SV uplift vs risk tier tradeoff (стабильный/агрессивный/защитный).
- **Listing mechanisms runbook** — 10 mechanisms из реального Vitgem v1→v4 build (88→97 score).
- **2026 backend doctrine** — relevance check через Amazon search; misspellings верифицируются через Cerebro SV; gummy SKU rule (no alt-format keywords).
- **Mandatory scraper** — только [Amazon-listing-scraber](https://github.com/darkedid89/Amazon-listing-scraber) (WebFetch / Playwright / Firecrawl — banned для amazon.co.uk).

Плюс модули (унаследовано от v1.1-1.2):

- **`validators.py`** — hard-limit validators (title/bullets/backend/dedup/full)
- **`brand_swap_judge.py`** — Claude Haiku тест "drug-mimic vs legit supplement" (~$0.0001/verify)
- **`audit_log.py`** — JSONL append-only audit log
- **`image_brief.py`** — 7-slot brief generator для product photography
- **`tools/refresh_risk_budget.py`** — n-gram analysis competitor corpus → SAFE/COMMON/RARE/UNIQUE/RISKY buckets

## Установка

```bash
git clone https://github.com/darkedid89/amazon-uk-vitamin-listing-skill.git \
  ~/.claude/skills/amazon-uk-vitamin-listing
```

После этого Claude Code автоматически обнаружит навык — он активируется по триггерам в `description` файла `SKILL.md`.

### Зависимости

```bash
# Для scraping Amazon UK product pages (MANDATORY):
git clone https://github.com/darkedid89/Amazon-listing-scraber.git
cd Amazon-listing-scraber && npm install
# UK delivery one-time setup — см. references/scraping-playbook.md
```

## Структура

```
amazon-uk-vitamin-listing/
├── SKILL.md                          # Главный файл с mode dispatcher
├── validators.py                     # Hard-limit validators
├── brand_swap_judge.py               # Claude Haiku-based brand-swap test
├── audit_log.py                      # JSONL audit log
├── image_brief.py                    # 7-slot image brief generator
├── references/
│   ├── compliance-rules.md           # UK red/yellow/green flags + 17-point checklist
│   ├── claims-database.md            # GB NHC Register (25 ингредиентов)
│   ├── label-requirements.md         # UK FIC + 2002/46/EC + 12-point label audit
│   ├── listing-templates.md          # Title/Bullets/Description/Backend formulas + 2026 backend doctrine
│   ├── keyword-analysis.md           # CSV schemas + scoring + tier allocation
│   ├── scraping-playbook.md          # ⛔ HARD RULE: только Amazon-listing-scraber/scrape_asin_v2.js
│   ├── output-templates.md           # Точные форматы output для трёх режимов
│   ├── image-specifications.md       # Amazon UK image требования + 7 slot patterns
│   ├── brand-swap-corpora.json       # Labelled examples для brand-swap judge
│   ├── empirical-risk-budget-*.md    # Auto-generated per category
│   ├── 🆕 structured-attributes.md   # ★ Seller Central 20+ form fields schema (v1.3.0)
│   ├── 🆕 risk-tier-classification.md # ★ 5-tier ASA risk classifier (RED/AMBER regex)
│   ├── 🆕 sv-uplift-analysis.md      # ★ Cerebro intersection + placement weight
│   └── 🆕 listing-mechanisms.md      # ★ Vitgem v1→v4 full workflow runbook (10 mechanisms)
├── tools/
│   └── refresh_risk_budget.py        # n-gram analysis competitor corpus
├── data/
│   └── menopause-corpus-2026-05-17/  # Seed corpus (13 menopause survivors)
├── brands/
│   ├── _template.md
│   ├── meleva.md                     # Meleva Night-Time Gummies (sleep)
│   └── vitgem-menopause.md           # Vitgem Menopause Gummies
└── tests/
    ├── case-01-meleva-night-time-pass/
    ├── case-02-bad-cures-insomnia/
    ├── case-03-bad-title-over-200/
    ├── case-04-bad-backend-over-249/
    └── case-05-bad-ashwagandha-claim/
```

## Жёсткие правила (HARD RULES)

```
⛔ Если скил говорит "≤249 байт" — значит 249. Не 250. Не "примерно".
⛔ Если claim не из GB NHC Register — НЕ ПИСАТЬ его.
⛔ Если этикетка не указывает FBO + UK address — БЛОКЕР для печати.
⛔ Если нужно scrape Amazon UK — ТОЛЬКО Amazon-listing-scraber/scrape_asin_v2.js.
⛔ Если LISTING_CREATE без 20+ structured attribute fields — INCOMPLETE.
⛔ Перед добавлением слова в backend — verify через Amazon search относительность.
```

### Технические лимиты

- Title ≤200 chars (Amazon UK 2025 limit)
- Backend ≤249 bytes (превышение = полная деиндексация)
- Bullets суммарно ≤1000 bytes (Amazon indexation threshold)
- Description ≤2000 chars
- 5 bullets (обязательно)
- "Food supplement" (не "dietary supplement") — UK FIC требование
- British English обязателен (flavour/colours/fibre/organise/flushes)
- Все health claims — verbatim из GB NHC Register с "contributes to"
- Botanicals без NHC claims — описывать только как ингредиенты

## LISTING_CREATE output (v1.3.0 expanded)

В финальном `═══ AMAZON UK LISTING ═══` блоке обязательно:

1. 📌 TITLE (char/byte count)
2. 📌 BULLET POINTS (5 шт с char/byte counts)
3. 📌 PRODUCT DESCRIPTION (char count)
4. 📌 BACKEND SEARCH TERMS (byte count)
5. 🆕 📋 STRUCTURED ATTRIBUTES — table of all 20+ Seller Central fields
6. 🆕 📋 IMPORTANT INFORMATION — 5 long-form fields (Ingredients/Directions/Safety/Storage/Legal)
7. ✅ COMPLIANCE CHECK (17-point)
8. 🆕 🎯 RISK TIER — red/amber count + tier (🔴/🟠/🟡/🟢/✅)
9. 🆕 📊 ADDRESSABLE SV — Cerebro intersection (if data available)
10. 📊 SCORE BREAKDOWN — 8 categories, total /100

## Покрытие compliance

- **Регуляции:** UK Food Supplements Directive 2002/46/EC (retained), UK Food Information Regulations 2014 (FIC, retained Reg. 1169/2011), GB Nutrition and Health Claims Register, ASA enforcement rulings (включая Novomins £50K case 2024), MHRA POM list, FSA novel food list.
- **Категории продуктов:** sleep gummies, multivitamins, omega-3, probiotics, ACV/keto, creatine/sports, hair-skin-nails (biotin), iron+B12 fatigue, magnesium, immune (Vit C/D/Zinc), men's vitality, **menopause/perimenopause**, pregnancy/fertility.
- **NHC Register:** 25 ингредиентов с verbatim claims (Vitamins A-K, минералы, omega-3 EPA/DHA, creatine, caffeine, glucomannan, plant sterols) + 40+ ингредиентов с on-hold/no-claim статусом (ashwagandha, valerian, ACV, berberine и др.) + banned UK list (melatonin POM, CBD novel food, yohimbe, DMAA, kratom).
- **Label requirements:** функциональные классы, 14 allergens, NRV table, "Made in UK" rules, sweetener declaration (FIC Art. 10), FBO requirements.

## Empirical performance

Реальный benchmark на Vitgem Menopause Gummies (UK 2026):

- **Vitgem v4 (skill output):** 97/100 (top-5% всех menopause-gummy listings)
- **Best competitor (Novomins Perimenopause):** 81/100
- **Competitor avg (6 top gummy):** 60.2/100
- **Vitgem advantage:** +16-37 points на competitor

Vitgem v4 — единственный listing в категории с:
- 0 RED flags (compliance edge vs 50% top-ниши с HRT/estrogen/relief/boosts)
- 20+ structured attribute fields filled
- 5 Important Information panels filled
- Branded actives (KSM-66® + Affron®) в Special Ingredients field
- UK Made + Vegan + Sugar Free + GMP-equivalent в Trust Signals

## Sister tools

- **[Amazon-listing-scraber](https://github.com/darkedid89/Amazon-listing-scraber)** — mandatory scraper для amazon.co.uk product pages. Token-efficient (~500-800 tokens/ASIN vs Playwright ~36K).
- **[supplements-gummies-color-choice-uk](https://github.com/darkedid89/supplements-gummies-color-choice-uk)** — color/design decision methodology для UK supplement SKUs.

## Язык

- Объяснения / чек-листы / вердикты — **на русском**
- Текст листинга / claims / label-text / backend terms — **на British English**

## Roadmap (v1.4-1.5)

5 priority improvements для достижения 95-97/100 industry-leading ceiling:

1. **A/B Testing Harness** (+10 pts) — post-publish CTR/CR comparison framework
2. **A+ Content Design Specs** (+5 pts) — 7-module template library
3. **Image SEO Scorer** (+5 pts) — published listing image analysis
4. **PPC Budget Optimizer** (+5 pts) — cost-per-keyword-acquisition calculator
5. **Brand Registry Workflow** (+3 pts) — IP Accelerator + A+ activation + SB campaigns playbook

## Источники / Acknowledgments

Навык построен на основе реальных проектов запуска брендов **Meleva Night-Time Gummies** (sleep, 2026) и **Vitgem Menopause Gummies** (menopause/perimenopause, 2026) на Amazon UK, включая:

- Опыт review этикетки от Opalbond / Chewables Ltd (UK manufacturers)
- Анализ ~40 конкурентов через Helium 10 Cerebro + Xray, Amazon Brand Analytics SQP
- Compliance review против ASA enforcement рулингов (Novomins £50K case 2024)
- Reverse-engineered Seller Central attribute schema через scrape_asin_v2.js

## Version history

- **v1.3.0** (2026-05-19) — structured Seller Central attributes (20+ form fields), risk-tier classification (5 tiers), SV uplift analysis (Cerebro intersection + bullet placement weight), listing mechanisms runbook (v1→v4 workflow), Amazon-listing-scraber as MANDATORY scraper, 2026 backend doctrine (relevance check), Path A/B/C risk decision framework
- **v1.2.0** (2026-05-18) — empirical risk-budget extractor (n-gram analysis), Claude Haiku brand-swap judge, JSONL audit log, image-brief generator, menopause category corpus + Vitgem brand profile
- **v1.1.0** (2026-05-18) — validators.py, golden tests, brand profiles, Vision prompting checklist, "When in doubt" decision tree
- **v1.0.0** (2026-05-17) — initial release: LABEL_CHECK / LISTING_CREATE / KEYWORD_MAP modes

## License

MIT
