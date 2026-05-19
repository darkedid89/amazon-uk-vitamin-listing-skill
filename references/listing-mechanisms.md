# Listing Mechanisms — Mapping the full Vitgem v1→v4 toolkit

> **Last verified:** 2026-05-19
>
> Все механизмы, которые применялись при построении Vitgem Menopause Gummies listing v1→v4.
> Этот файл — runbook для воспроизведения процесса на любом новом SKU.

---

## 🔄 Workflow overview

```
┌──────────────────────────────────────────────────────────────────┐
│  Input: brand + product + formula + competitor ASINs             │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 1: Competitor scraping → scrape_asin_v2.js (6+ ASIN)        │
│         OUTPUTS: titles, bullets, productDetails, importantInfo   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 2: Keyword research → Cerebro reverse-ASIN CSVs             │
│         OUTPUTS: merged keyword DB (1-3K kw, SV per kw)           │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 3: Risk-tier audit on competitors                          │
│         OUTPUTS: risk distribution (X% HIGH, Y% MEDIUM...)        │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 4: Build draft v1 listing (title/bullets/description/backend)│
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 5: Audit v1 — duplicates, missed keywords, risk tier         │
│         OUTPUTS: improvement candidates                            │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 6: Iterate v2 → v3 → v4 with explicit version diff           │
│         At each: validators.py + addressable SV recompute          │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Step 7: Fill structured Seller Central attributes (20+ fields)     │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│  Output: SAFE TO PUBLISH (17/17 checks)                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Mechanism 1: Competitor scraping

**Tool:** [scrape_asin_v2.js](file:///Users/igor/Downloads/NEW%20PRODUCTS/Amazon-listing-scraber/scrape_asin_v2.js)
**See:** [scraping-playbook.md](scraping-playbook.md)

**Pick 6-10 top-niche ASINs** (top by reviews + sales velocity from Helium 10 Xray export).

```bash
cd "/Users/igor/Downloads/NEW PRODUCTS/Amazon-listing-scraber"
node scrape_asin_v2.js \
  ASIN1 ASIN2 ASIN3 ASIN4 ASIN5 ASIN6 \
  > out/competitor_attributes_DATE.ndjson 2> out/scrape.log
```

Output schema per ASIN:
- `title`, `brand`, `bullets[]`, `aplusPresent`, `mainImage`, `imageThumbs[]`
- `productDetails{}` — все ~15-25 структурных attribute полей
- `importantInformation{}` — Ingredients, Directions, Safety Info, Storage

---

## 🛠 Mechanism 2: Risk-tier classification

**See:** [risk-tier-classification.md](risk-tier-classification.md)

5 tiers по word-boundary regex:
- 🔴 HIGH (≥2 red), 🟠 MED-HIGH (1 red), 🟡 MEDIUM (≥4 amber), 🟢 LOW-MED (1-3 amber), ✅ LOW (clean)

**Audit competitors → identify HIGH-risk targets for Sponsored Display ASIN-targeting** with compliance-first
positioning copy ("No HRT, no claims — just verified NHC nutrients").

**Audit own listing → ensure 0 red, choose amber count by Path A/B/C tradeoff**.

---

## 🛠 Mechanism 3: Addressable SV computation

**See:** [sv-uplift-analysis.md](sv-uplift-analysis.md)

Cerebro keyword intersection: keywords where ALL words present in our Title+Bullets+Backend.

Filter to category-relevant (исключить cross-traffic outliers вроде `ashwagandha` 91K SV).

Compute realistic ramp:
- M1-2: 5-10% capture
- M3-6 PPC: 15-25%
- M7-12: 25-35%
- Y2: 35-50%

---

## 🛠 Mechanism 4: Duplicate detection (full token analysis)

Stop "Backend vs Title/Bullets only" check — implement **full token frequency analysis**:

```python
import re
from collections import Counter

def tokens(s):
    return [w.lower() for w in re.findall(r"[a-zA-Z0-9®-]+", s)]

t_toks = set(tokens(title))
b_toks_per = {f"B{i+1}": set(tokens(b)) for i, b in enumerate(bullets)}
backend_toks = set(tokens(backend))

STOP = set("a an and the of for to in with on by at as is be from your you we our their".split())

# Find duplicates Title <-> each Bullet (NOT just Title <-> Backend)
for bk, bset in b_toks_per.items():
    dups = (t_toks & bset) - STOP
    dups = {w for w in dups if len(w) > 1}
    if dups: print(f"Title ↔ {bk}: {sorted(dups)}")

# Frequency of each word across Title+Bullets
all_text = title + " " + " ".join(bullets)
ctr = Counter([w for w in tokens(all_text) if w not in STOP and len(w) > 2])
for w, c in ctr.most_common():
    if c >= 2: print(f"  {w}: {c}x")
```

**Acceptable duplicates:**
- Brand name (1-2x — Title + maybe Bullet 3)
- Ingredient names (Title + Bullet 2 dose detail) — necessary for transparency
- Flagship NHC claim words (Vitamin B6, hormonal activity) — Title + B1 amplification

**Wasteful duplicates:**
- Format identifier `gummies` >2x (saw Vitgem v2 used 5x — bad)
- Generic adjectives like `vegan`, `sugar free`, `60` in both Title and B4
- Stage descriptors `menopause`/`perimenopause` repeated in B1 + B5 when already in Title

---

## 🛠 Mechanism 5: Bullet placement weight uplift

**Move high-SV amber keywords from Backend → Bullets** (no addressable change, but +30% ranking weight).

Example v3 → v4 Path A:
- Remove from Backend: `mood swings`, `hot flushes`, `night sweats`, `hormone balance`, `phytoestrogens`
- Add to Bullets: B1 `hormone balance`, B2 `phytoestrogens`, B5 `mood swings, hot flushes, night sweats`
- Fill freed backend bytes with new variants: `irritability`, `sleeplessness`, `sweating`, `mature`, age range `45 55 60`

**Validators.py dedup check ensures no actual duplicates** between bullets and backend after move.

---

## 🛠 Mechanism 6: Description offload to structured attributes

**See:** [structured-attributes.md](structured-attributes.md)

Remove from Description prose:
- Full ingredients list (700+ chars) → **Ingredients** Important Info field
- Directions sentence → **Directions** field
- Warnings paragraph → **Safety Information** field
- Storage instructions → **Storage** field
- Legal disclaimer → **Legal Disclaimer** field

**Freed ~600-800 chars** in description used for:
- Dose-comparison paragraph (vs competitor doses — non-naming "standard menopause tablets")
- Extended FAQ (6-8 Q&As vs 4)
- Persuasion copy (user-centric hook, midlife wellness positioning)

---

## 🛠 Mechanism 7: Path A/B/C risk decision

**Document SV vs Risk tradeoff for user decision:**

| Path | Amber adds | Final amber | SV uplift | Risk |
|---|---|---:|---:|---|
| A — MEDIUM stable | 5 (hormone balance, mood swings, hot flushes, night sweats, phytoestrogens) | 8 | +8-14K | 🟡 MEDIUM (safe) |
| B — MEDIUM aggressive | A + natural + wellbeing (7) | 10 | +12-18K | 🟡 MEDIUM (borderline MED-HIGH) |
| C — LOW-MED defensive | 0 | 3 | 0 | 🟢 LOW-MED (top-13% safest) |

**Never red:** `relief`, `menopause symptoms`, `estrogen/oestrogen`, `weight loss`, `HRT`, `best`, `leading`, `boosts`.

---

## 🛠 Mechanism 8: Versioning + score tracking

Каждая итерация — **отдельный markdown file** + **scoring breakdown table**:

```markdown
| Категория | v1 | v2 | v3 | v4 |
|---|---|---|---|---|
| Compliance & Safety (UK regs)     | 24/25 | 24/25 | 24/25 | 24/25 |
| Keyword Coverage (TAM)            | 17/20 | 16/20 | 20/20 | 20/20 |
| Conversion Copywriting            | 15/20 | 16/20 | 18/20 | 19/20 |
| Differentiation vs Competitors    | 9/10  | 10/10 | 10/10 | 10/10 |
| Technical Execution               | 9/10  | 7/10  | 9/10  | 10/10 |
| Mobile UX (first 80 chars)        | 5/5   | 5/5   | 5/5   | 5/5  |
| Trust Signals                     | 4/5   | 5/5   | 5/5   | 5/5  |
| AI/Voice Search (Rufus)           | 5/5   | 5/5   | 5/5   | 5/5  |
| **TOTAL**                         | 88    | 88    | 96    | 97   |
```

**Каждая версия должна objectively improve >=1 категорию** иначе версия не нужна.

---

## 🛠 Mechanism 9: Validators.py mandatory + extended

`/Users/igor/.claude/skills/amazon-uk-vitamin-listing/validators.py` запускать на КАЖДОЙ итерации:

```bash
python3 validators.py title "Title..."
python3 validators.py bullets b1.txt b2.txt b3.txt b4.txt b5.txt
python3 validators.py backend "backend terms..."
python3 validators.py dedup title.txt bullets.txt backend.txt
```

**ALL must exit 0** перед SAFE TO PUBLISH verdict.

`bullets` validator also checks **CAPS LABEL** требование (2-4 word prefix без punctuation, then ` — `).

`dedup` validator checks:
- `title ↔ backend` (no overlapping tokens)
- `bullets ↔ backend` (no overlapping tokens)

**Important:** dedup НЕ проверяет title ↔ bullets — это нужно делать manually через `Mechanism 4`.

---

## 🛠 Mechanism 10: Final compliance ALL-fields check (17-point)

Beyond validators.py (which checks tech limits), also manually check:

1. ☑ Нет запрещённых слов (cure, treat, prevent, disease names, relief, boosts, best, leading)
2. ☑ Нет HRT/estrogen/oestrogen language
3. ☑ Все NHC claims verbatim из GB NHC Register
4. ☑ "contributes to" НЕ пропущено
5. ☑ British English (flushes, colours, flavoured)
6. ☑ Title ≤200 (verified bash)
7. ☑ Bullets total ≤1000 bytes
8. ☑ Backend ≤249 bytes
9. ☑ Description ≤2000 chars
10. ☑ Minimized dups across Title↔Bullets (full token audit)
11. ☑ "Food supplement" (НЕ "dietary supplement")
12. ☑ Нет comparative (best, #1, leading)
13. ☑ Дозировки консистентны с этикеткой
14. ☑ Disclaimer mandatory UK warnings (or moved to Safety Information field)
15. ☑ Нет melatonin/CBD/yohimbe/5-HTP/DMAA/kratom
16. ☑ Botanicals без NHC claims описаны как ингредиенты (НЕ therapy claims)
17. ☑ House style: без точки в конце bullets, no alt-format keywords in backend (gummy SKU)

---

## 📋 Output template additions

В финальном `═══ AMAZON UK LISTING ═══` блоке ОБЯЗАТЕЛЬНО включить:

1. **TITLE** (с char/byte count)
2. **BULLET POINTS** (5 шт, каждый с char/byte count)
3. **PRODUCT DESCRIPTION** (с char count)
4. **BACKEND SEARCH TERMS** (с byte count)
5. **📋 STRUCTURED ATTRIBUTES** — таблица из 20+ Seller Central form fields (NEW в v1.3.0)
6. **📋 IMPORTANT INFORMATION** — 5 long-form fields (Ingredients, Directions, Safety Info, Storage, Legal Disclaimer)
7. **🎯 RISK TIER CLASSIFICATION** — Vitgem tier + red flag count + amber flag count
8. **📊 SCORE BREAKDOWN** — 8-category table vs предыдущая версия

---

## Источники

- [scrape_asin_v2.js](file:///Users/igor/Downloads/NEW%20PRODUCTS/Amazon-listing-scraber/scrape_asin_v2.js) — extended scraper with productDetails + importantInformation
- Live Vitgem implementation: v1→v4 progression in `/Users/igor/Downloads/NEW PRODUCTS/Menopause Support Gummies/08_LISTING/`
- Memory: [[project_vitgem_listing_v4]] [[reference_amazon_uk_seller_central_attrs]]
- Companion refs: [structured-attributes.md], [risk-tier-classification.md], [sv-uplift-analysis.md], [scraping-playbook.md]
