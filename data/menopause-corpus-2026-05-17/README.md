# Menopause / Perimenopause Competitor Corpus — 2026-05-17

> **Snapshot date:** 2026-05-17
> **Marketplace:** amazon.co.uk
> **Source:** Helium 10 Xray + Cerebro (user-provided), supplemented by agent-browser full-bullet scrape
> **Category:** Food supplements — menopause / perimenopause (gummy + tablet + capsule formats)

## Inputs (raw user data)

| File | Type | Rows | Source |
|---|---|---|---|
| `competitors.json` | Structured corpus (titles + bullets + metadata) | ~60 ASINs | Composite of files below |
| `helium10_xray_menopause_gummies.csv` | Xray scrape — menopause gummies search | 48 rows | User-provided |
| `helium10_xray_menopause_supplements.csv` | Xray scrape — menopause supplements search | 48 rows | User-provided |
| `helium10_xray_perimenopause_supplements.csv` | Xray scrape — perimenopause supplements search | 48 rows | User-provided |
| `helium10_xray_perimenopause_gummies.csv` | Xray scrape — perimenopause gummies search | 48 rows | User-provided |
| `cerebro_keywords_B08H6KGPX3.csv` | Cerebro reverse-ASIN — Health & Her #1 in category | ~250 keywords | User-provided |
| `competitor_colors_v2.json` | Top-5 dominant packaging colours per ASIN | 50 ASINs | User-provided |
| `gemini_analysis.csv` | Gemini Vision API analysis of top 8 (ingredients + positioning) | 8 ASINs | User-provided |
| `chart-*.csv` | Search volume trend over time | 100+ weekly points each | User-provided |

## Usage

Risk-budget extractor reads `competitors.json` and computes percentile-based phrase frequency thresholds.

```bash
python3 tools/refresh_risk_budget.py --corpus data/menopause-corpus-2026-05-17/competitors.json --category menopause
```

Output → `references/empirical-risk-budget-menopause.md`

## What's in competitors.json

Structured record per ASIN:
```json
{
  "asin": "B08H6KGPX3",
  "brand": "Health and Her",
  "title": "...",
  "price_gbp": 21.99,
  "sales": 3828,
  "reviews": 3688,
  "rating": 4.4,
  "bsr_main": 682,
  "bsr_sub": 1,
  "category": "PERI",
  "format": "capsule",
  "is_meno_specific": true,
  "bullets": ["...", "..."],          // when scraped
  "ingredients": ["Red Clover", ...], // from Gemini analysis when available
  "positioning_keywords": ["expert-clinical", "9-in-1"],
  "dominant_colors": [[h,s,l], ...],  // from color analysis
  "status": "survivor"                // "survivor" = listing still live as of snapshot date
}
```
