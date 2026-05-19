# Scraping Playbook — что, чем и когда скрапить

> **Last verified:** 2026-05-19
> Practical scraping workflow для запуска нового supplement SKU на Amazon UK. Покрывает competitor research, own brand DNA, keyword data, label compliance reference.

---

## ⛔ HARD RULE — Amazon UK скрейпер

**Для любого scrape Amazon UK product detail page использовать ТОЛЬКО:**

> **[https://github.com/darkedid89/Amazon-listing-scraber](https://github.com/darkedid89/Amazon-listing-scraber)** (`scrape_asin_v2.js`)

**Запрещено:** WebFetch (HTTP 500 от Amazon), Playwright snapshot (token-heavy), Firecrawl без UK proxy, manual fetch other tools.

**Почему:**
- WebFetch/Firecrawl возвращают HTTP 500 на amazon.co.uk без UK residential IP
- agent-browser scraper использует Chrome for Testing с persistent UK cookies (`SW1A 1AA` postcode) → unlocks GBP prices + BSR
- scrape_asin_v2.js token cost ~500-800 tokens per ASIN vs Playwright snapshot ~36,000 — 50-70× cheaper
- Reproducible single-eval extraction — не subject к Amazon HTML drift

**Локальная копия:** `/Users/igor/Downloads/NEW PRODUCTS/Amazon-listing-scraber/`

**scrape_asin_v2.js** — расширенная версия с **productDetails** + **importantInformation** extractors (добавлено 2026-05-19 для structured attribute reverse-engineering).

---

## 🎯 Когда скрапить (триггеры)

| Триггер | Что скрапить | Глубина |
|---|---|---|
| **Новый SKU brief (R1-R2 stage)** | Top-30 niche keywords + top-30 ASIN snapshots | Light: title + price + rating + BSR |
| **Formula validation (R3 stage)** | Top-10 direct competitors deep | Full: bullets + A+ presence + ingredients photo |
| **Color/Design decision** | Top-20 competitor images (main + lifestyle) | Full image download |
| **Label TZ creation** | 10-15 competitor labels + own SKU lineup | Full A+ content + back-of-pack OCR |
| **Listing creation** | Top-5 listings deep dive + 2-3 heritage benchmarks | Full A+ модули + variations |
| **Re-launch / refresh** | Текущая позиция + new competitors появившиеся за 90 дней | Light delta scrape |

---

## 🛠 Инструменты — выбор по задаче

### 1. `scrape_asin_v2.js` (Amazon-listing-scraber + agent-browser + Chrome) — **MANDATORY**

**Когда:** structured data per ASIN — title, bullets, BSR, A+ presence, price, rating, **productDetails (20+ structured fields), importantInformation (Ingredients/Directions/Safety/Storage)**, images.
**Скорость:** ~10-30 сек на ASIN.
**Token cost:** ~500-800 tokens per ASIN (vs Playwright ~36,000).

**Setup (one-time, если ещё не сделано):**
```bash
git clone https://github.com/darkedid89/Amazon-listing-scraber.git
cd Amazon-listing-scraber && npm install
# UK delivery one-time:
npx agent-browser open https://www.amazon.co.uk
npx agent-browser click "#nav-global-location-popover-link"
npx agent-browser fill "#GLUXZipUpdateInput" "SW1A 1AA"
npx agent-browser click "#GLUXZipUpdate input"
npx agent-browser cookies set i18n-prefs GBP
```

**Usage:**
```bash
cd "/Users/igor/Downloads/NEW PRODUCTS/Amazon-listing-scraber"
# Single ASIN
node scrape_asin_v2.js B0G3MQRWDJ > out/scan.ndjson 2> out/scrape.log

# Batch (6-10 ASINs typical)
node scrape_asin_v2.js \
  B0G3MQRWDJ B09BRGHK6M B0DPQLJN1G B0D6Z9H6D5 B0FPB7LC6L B0F3B4M5Z8 \
  > out/competitor_attributes_$(date +%Y-%m-%d).ndjson
```

**Fields returned per ASIN (NDJSON):**
- **Identity:** `asin`, `parentAsin`, `browseNodeId`, `url`, `title`, `brand`, `manufacturer`, `fromBrand`
- **Pricing/Commercial:** `price`, `currency`, `rating`, `reviewCount`, `bsrMain`, `bsrSub`, `seller`, `fulfillment`, `availability`, `deliverTo`, `geoBlocked`
- **Content:** `bullets[]`, `bulletCount`
- **Images:** `mainImage`, `imageThumbs[]`, `aplusPresent`, `aplusModules`, `aplusModuleUrls[]` (up to 24)
- **Structured (v2):** `productDetails{}` — ~15-25 key-value attributes (Brand Name, Item Form, Container Type, Diet Type, Age Range, Primary Supplement Type, Special Ingredients, Flavour, Material Features, Allergen Information, Country of Origin, Item Weight, Product Dimensions, ...)
- **Important Info (v2):** `importantInformation{}` — Ingredients (always), Directions, Safety Information, Storage, Legal Disclaimer
- **Identifiers:** `dateFirstAvailable`, `packageDimensions`
- **Meta:** `scrapedAt`

**Quick analyze:**
```bash
python3 -c "
import json
for line in open('out/scan.ndjson'):
    d = json.loads(line)
    pd = d.get('productDetails',{}) or {}
    ii = d.get('importantInformation',{}) or {}
    print(d['asin'], 'fields:', len(pd), 'imp_info:', list(ii.keys()))
"
```

### 2. Helium 10 (Xray + Cerebro + Magnet)
**Когда:** keyword research, niche sizing, competitor BSR/sales trends.
**Manual export → CSV** в local folder, parse через [keyword-analysis.md](keyword-analysis.md) schemas.

### 3. ZonGuru Keywords on Fire
**Когда:** alternative keyword source с ZG Score метрикой.
**Manual export → CSV** в local folder.

### 4. Brand Analytics (SQP / Top Search Terms)
**Когда:** есть Brand Registry — first-party Amazon data (**приоритет vs Cerebro/ZonGuru**).

### 5. ⛔ WebFetch / Firecrawl / Playwright snapshot — **NOT ALLOWED** для amazon.co.uk

Amazon UK блокирует все эти методы (HTTP 500 для non-residential IPs). **Использовать только scrape_asin_v2.js.**

Если scrape_asin_v2.js не возвращает нужное поле — расширить EXTRACTOR_JS в scraper repo (one-time mod), а не switching к WebFetch.

### 6. Manual screenshot (last resort)
**Когда:** back-of-pack ingredients/nutrition panel — текст на product images. Скачать main image из NDJSON + OCR (Gemini/Claude vision).

---

## 📋 Что скрапить — обязательные таргеты

### A. Top-3 direct competitors (premium tier)
ASINs в same niche, similar pricing tier, 1000+ reviews. **Цель:** premium positioning benchmark.
- Title structure
- Bullets style (length, prefix, EFSA wording)
- A+ content modules (visual storytelling)
- Hero image composition

### B. Top-3 direct competitors (budget tier)
ASINs в same niche, lower price (£8-15). **Цель:** floor benchmark + anti-patterns.

### C. Top-3 same format (gummies if launching gummies)
ASINs same format даже если разные actives. **Цель:** category-specific conventions.

### D. Top-3 heritage UK brands
Vitabiotics / Menopace / A.Vogel / Holland & Barrett private label. **Цель:** UK compliance gold standard (EFSA wording verbatim, warnings format).

### E. Own brand SKUs (если бренд существует)
Все active ASINs бренда. **Цель:** brand DNA consistency (title pattern, bullet style, sub-tagline format, logo placement).

### F. Anti-pattern targets (1-3)
Конкуренты со СПЕЦИФИЧЕСКИМИ красными флагами (emoji-heavy / "candy" positioning / medicinal claims). **Цель:** documented what NOT to do.

**Total minimum:** 15-20 ASINs для нового SKU launch.

---

## 🔍 Что extract из каждого ASIN — checklist

### Title intelligence
- [ ] Полный title (verbatim, считая chars — Amazon UK limit 80-200 depending on category)
- [ ] Brand position (start / middle / end)
- [ ] Hero ingredient mentions + doses
- [ ] Strength claims (mg, billion CFU, IU)
- [ ] Quantity descriptor (60 gummies / 30-day supply / 2-month)
- [ ] Suffix (Vegan / Sugar-Free / etc.)
- [ ] **Banned word check:** cure, treat, heal, relief, clinically proven

### Bullets intelligence (5-7 bullets typical)
- [ ] Категории каждого bullet: BENEFIT / INGREDIENT / FORMAT / TRUST / USAGE
- [ ] Prefix style: ALL CAPS COLON / **Bold:** / Emoji / Unicode BOLD (Vitgem style)
- [ ] Length per bullet (chars)
- [ ] EFSA verbatim usage (sample 2-3 claims per competitor)
- [ ] Trust signals (UK Made / GMP / 3rd party tested / family business)
- [ ] Warnings mentioned

### Visual intelligence (от main image + thumbs)
- [ ] Background color (white/lifestyle)
- [ ] Bottle/pack format (HDPE / dropper / pouch / blister)
- [ ] Label colour palette (primary + accent)
- [ ] Sub-tagline format
- [ ] Hero text size & treatment
- [ ] Feature icons (4-6 circle icons typical)
- [ ] Sugar-Free / Vegan / GF badges
- [ ] Country flag / "Made in UK" badge

### A+ content intelligence (если `aplusPresent: true`)
- [ ] Module count (`aplusModules`)
- [ ] Hero banner copy
- [ ] Ingredient deep-dive blocks
- [ ] Lifestyle image positioning
- [ ] Comparison chart presence
- [ ] FAQ block
- [ ] Brand story
- [ ] Note: image URLs из NDJSON часто = `grey-pixel.gif` placeholders (lazy load) — для real images используй WebFetch с user agent или playwright

### Compliance intelligence
- [ ] Country of Origin claim
- [ ] FBO address style
- [ ] Allergen statement format
- [ ] Warning text patterns (особенно для botanicals с drug interactions)
- [ ] EAN-13 code (для GS1 lookup verification)

---

## 🗂 Куда сохранять scraped данные

**Standard project structure:**
```
[Product folder]/
├── 05_COMPETITOR_DATA/
│   ├── helium_17_may/           ← H10 CSVs + Cerebro
│   ├── scraped_competitors.ndjson
│   ├── scraped_round2.ndjson
│   └── analysis_summary.md      ← human synthesis
├── 06_OWN_SCRAPED/
│   └── vitgem_4_asins/         ← own brand ASINs
└── 04_RESEARCH_APR/             ← initial CSVs (Helium 10 first pass)
```

**Naming convention:**
- `scraped_[batch_name]_[YYYY-MM-DD].ndjson`
- `[ASIN].ndjson` для отдельных deep scrapes
- `competitor_images/[ASIN].jpg` для main images

---

## 🚦 Workflow для new SKU launch (concrete sequence)

### Stage 1 — Initial sizing (10 min)
1. Helium 10 Xray → top-30 ASINs в niche → CSV export
2. Filter: 30-day sales, BSR sub-category, reviews, format
3. Output: `helium_xray_[niche]_[date].csv` → 04_RESEARCH_APR

### Stage 2 — Keyword landscape (15 min)
1. Helium 10 Cerebro на topscoring ASIN → top-100 keywords CSV
2. ZonGuru KoF cross-reference (optional)
3. Brand Analytics SQP если есть BR access
4. Output: → 04_RESEARCH_APR

### Stage 3 — Competitor deep-dive (20-30 min)
1. Identify 15-20 priority ASINs (см. categories A-F выше)
2. Batch run `scrape_asin.js` на все ASIN
3. Output: `scraped/[ASIN].ndjson` per file ИЛИ single `scraped_competitors_[date].ndjson`
4. Параллельно: download main images через `mainImage` URLs

### Stage 4 — Image analysis (15 min)
1. Download top-20 main images
2. Если custom analysis: Gemini Vision / Claude Vision на images → output color palette / icon patterns / hero text positioning
3. Output: `competitor_images/` folder + `image_analysis.json`

### Stage 5 — A+ content extraction (если нужно)
1. WebFetch / Firecrawl на top-5 listings
2. Если Amazon блокирует — manual screenshot подход
3. Output: A+ модули text + screenshots

### Stage 6 — Own brand inventory (если есть бренд)
1. Scrape all own ASINs
2. Compare back-of-pack labels (если есть PDF brand book)
3. Extract brand DNA patterns
4. Output: → 06_OWN_SCRAPED

### Stage 7 — Synthesis
1. Aggregate всё в `analysis_summary.md`
2. Build таблицу: title patterns / bullets style / EFSA wording frequency / trust signals / anti-patterns
3. Output: ready для listing creation + label TZ

---

## ⚠ Известные проблемы и workarounds

### Amazon UK geo-block для не-UK IPs
**Симптом:** HTTP 500 на WebFetch, "We couldn't show you the prices" error
**Workaround:** scrape_asin.js использует Chrome session с UK postcode — работает. WebFetch — НЕ работает напрямую, нужен proxy или Firecrawl.

### A+ content image URLs = placeholders
**Симптом:** `aplusModuleUrls` возвращает `grey-pixel.gif` для большинства модулей
**Причина:** lazy loading — реальные images подгружаются JS после viewport intersection
**Workaround:** scroll page через playwright, или extract real URLs из script tags (`data-a-image-source-density`)

### Price = `None`
**Симптом:** `price: null` даже после UK postcode setup
**Причина:** non-residential IP / Amazon AB testing
**Workaround:** Cookie refresh (`npx agent-browser cookies set ...`), или use Helium 10 price data вместо scrape

### Bullets cut off
**Симптом:** `bullets[i]` обрезан на 200-300 chars
**Причина:** Amazon UI truncation при сложенном "See more"
**Workaround:** scrape_asin.js должен expand "See more" before extraction — verify in script

### Variations (parent/child)
**Симптом:** scraped одну вариацию, не понятно есть ли другие counts/flavours
**Workaround:** check `parentAsin` field, scrape parent ASIN отдельно для variation tree

### Review velocity tracking
**Симптом:** review count = snapshot, не growth rate
**Workaround:** scrape тот же ASIN с интервалом 30 дней → delta = review velocity

---

## 📊 Output deliverable templates

### Single ASIN scrape report
```markdown
# [ASIN] — [Brand Product Name]
- **Scraped:** YYYY-MM-DD
- **Rating:** X.X / Y reviews
- **Price:** £XX.XX | **BSR:** #N in [category]

## Title
[verbatim]

## Bullets
[5 verbatim bullets]

## Visual cues
- Main image: [URL or path]
- Pack: [HDPE/dropper/etc.]
- Colour: [#hex from analysis]
- Hero text: [observation]

## A+ content
- Modules: N
- Notable claims: [list]

## Compliance flags
[any red flags]
```

### Aggregated competitor analysis
```markdown
# [Niche] Competitor Intelligence — [Date]

## Sales-weighted leader
[Top ASIN by revenue]

## Title patterns
- Common length: X chars
- Format: `[Brand] [Type] [Hero] [Dose] [Count]`
- Frequent words: [...]

## EFSA claims frequency
- "Vitamin B6 contributes..." — N/X competitors
- ...

## Trust signals frequency
- "UK Made" — N/X
- "GMP certified" — N/X
- "3rd party tested" — N/X

## Anti-patterns observed
- [List]

## White-space opportunities
- [Where 0/X competitors do something we could]
```

---

## 🔗 Reference scripts & code

| Tool | Repo |
|---|---|
| `scrape_asin.js` | https://github.com/darkedid89/Amazon-listing-scraber |
| `filter_xray.py` | (in scraper repo) |
| `analyze_gemini.py` | (in scraper repo) — image analysis via Gemini Vision |
| keyword merger | См. [keyword-analysis.md](keyword-analysis.md) for CSV schemas |

---

## ✓ Pre-launch scraping completeness checklist

Перед finalising listing / label TZ:
- [ ] Scraped ≥15 ASINs covering categories A-F
- [ ] Все 3 tools опрошены (H10 + scrape_asin + ZonGuru OR SQP)
- [ ] A+ content reviewed для top-5
- [ ] Main images downloaded для colour/visual analysis
- [ ] EFSA claim frequency map составлена
- [ ] Trust signal frequency map составлена
- [ ] 2-3 anti-pattern competitors documented
- [ ] Own brand DNA extracted (если есть)
- [ ] Aggregate `analysis_summary.md` написан
- [ ] Output stored в правильной project folder structure (04 / 05 / 06)

---

## Источники

- Amazon-listing-scraber repo: https://github.com/darkedid89/Amazon-listing-scraber
- Helium 10 export docs: helium10.com/help
- ZonGuru KoF: zonguru.com/keywords-on-fire
- Brand Analytics SQP: sellercentral.amazon.co.uk → Brands → Brand Analytics
- Last verified: 2026-05-18
