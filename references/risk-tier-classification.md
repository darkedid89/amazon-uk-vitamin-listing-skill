# Risk-Tier Classification — Amazon UK Supplement Listings

> **Last verified:** 2026-05-19
>
> Систематический метод классификации compliance-риска любого листинга (нашего или конкурентов) на пяти уровнях.
> Основан на word-boundary regex matching по двум словарям (RED / AMBER) — даёт быструю и воспроизводимую оценку.

---

## 🎯 5 Risk Tiers

| Tier | Threshold | Описание | Что это значит |
|---|---|---|---|
| 🔴 **HIGH** | ≥2 red flags | Многократные ASA-нарушения. `HRT relief estrogen boosts best` | ASA enforcement target. Suppression risk. |
| 🟠 **MED-HIGH** | 1 red flag | Одно нарушение. Часто `best` или `HRT` | Borderline. Brand authority может защищать (Menopace), но новый бренд = риск |
| 🟡 **MEDIUM** | ≥4 amber flags, 0 red | Чисто amber-density. `support wellbeing natural balance fatigue` | Acceptable industry-standard. Большинство Health & Her, Novomins не-flagrant SKU |
| 🟢 **LOW-MED** | 1-3 amber flags, 0 red | Минимальная amber, без red | Top-25% safest. Хороший compliance edge. |
| ✅ **LOW** | 0 amber, 0 red | Pure NHC-only language | Top-5% safest. Очень редко достижимо без потери conversion. |

---

## 📚 Words Dictionaries (verbatim regex patterns)

### 🔴 RED FLAGS — Triggers ASA action

```python
RED_FLAGS = [
    # Direct disease claims
    r"\brelief\b", r"\brelieves?\b", r"\bcures?\b", r"\btreats?\b",
    r"\bprevents?\b", r"\balleviates?\b",
    # Performance enhancers
    r"\bboosts?\b", r"increases? energy", r"boosts? energy",
    # Comparative (banned in Amazon ToS + ASA)
    r"\bbest\b", r"#1", r"no\.?\s?1\b", r"\bstrongest\b", r"most effective", r"\bleading\b",
    r"\buk'?s?\s?no\.?\s?1\b",
    # Unsubstantiated guarantees
    r"\bmiracle\b", r"\bguaranteed\b", r"100% effective",
    r"clinically proven", r"doctor recommended", r"scientifically proven",
    r"fda approved", r"mhra approved",
    # Weight/body composition
    r"\bfat[ -]burner\b", r"\bslimming\b", r"weight loss",
    # Drug comparison
    r"\bestrogens?\b", r"\boestrogens?\b", r"\bhrt\b", r"hormone replacement",
    r"alternative to hrt",
    # Mental health
    r"\banxiety\b", r"\bdepression\b", r"\binsomnia\b",
    # Drug-mimicking
    r"\bhot flush(?:es)? relief\b", r"night sweats relief", r"mood relief",
    # Detox/cleansing
    r"\bdetox\b", r"\bcleanses?\b", r"\bpurif(?:y|ies|ying)\b",
    # Specific menopause traps
    r"\bmenopause symptoms\b", r"\bperimenopause symptoms\b",
    # Sleep claims
    r"improves sleep", r"better sleep", r"helps sleep",
]
```

### 🟡 AMBER FLAGS — Soft amplifiers, mild risk

```python
AMBER_FLAGS = [
    # Generic support language (used by H&H, Vitabiotics widely)
    r"\bsupports?\b", r"\bhelps?\b", r"\bhelping\b", r"\bpromotes?\b",
    # Marketing intensifiers
    r"\bnatural\b", r"\bpremium\b", r"\bultra\b",
    r"max strength", r"high strength", r"\badvanced\b",
    r"\bexpertly\b", r"\bexpert\b", r"developed by", r"formulated by",
    # Symptom descriptors (factual, not claims)
    r"\bsymptoms\b",
    r"\bhot flushes?\b", r"night sweats?", r"\bmood swings?\b",
    r"\bbloating\b", r"\btiredness\b", r"\bfatigue\b",
    # Wellness language
    r"\bwellbeing\b", r"hormone balance", r"hormonal balance",
    # Phytoestrogen positioning
    r"\bphytoestrogens?\b",
    # Generic balance / energy
    r"\bbalance\b", r"\benergy\b",
]
```

### Why "phytoestrogens" amber not red:
Это descriptive (chemistry of red clover isoflavones), не therapy claim. ASA precedent: H&H использует `phytoestrogens` без enforcement. Compare to `estrogen` = drug name → RED.

### Why "supports" amber not red:
ASA-allowed качестве framing для NHC claims. `Vitamin B6 contributes to hormonal activity → supports hormone balance` — second-degree paraphrase still OK if first part verbatim.

---

## 🛠 Implementation: Python classifier

```python
import re
from collections import Counter

def classify_risk(text: str):
    """Classify Amazon listing text into 5 tiers based on word-boundary regex matches.
    
    Args:
        text: combined Title + Bullets (+ optionally Description). Backend usually NOT included.
    
    Returns:
        (tier, red_matches, amber_matches)
    """
    t = (text or "").lower()
    red_matches = sorted({m for p in RED_FLAGS for m in re.findall(p, t) if m})
    amber_matches = sorted({m for p in AMBER_FLAGS for m in re.findall(p, t) if m})
    
    if len(red_matches) >= 2: return "🔴 HIGH", red_matches, amber_matches
    if len(red_matches) == 1: return "🟠 MED-HIGH", red_matches, amber_matches
    if len(amber_matches) >= 4: return "🟡 MEDIUM", red_matches, amber_matches
    if len(amber_matches) >= 1: return "🟢 LOW-MED", red_matches, amber_matches
    return "✅ LOW", red_matches, amber_matches
```

---

## 📊 Empirical распределение (38 menopause-niche ASINs, 2026-05-19)

| Tier | Кол-во | % | Топ representatives |
|---|---|---|---|
| 🔴 HIGH | 9 | 24% | A.Vogel (HRT), Wellwoman (boost+leading), Menopace (No.1) |
| 🟠 MED-HIGH | 10 | 26% | One-flag listings (HRT or No.1 only) |
| 🟡 MEDIUM | 14 | 37% | Health & Her, Horbäach (support+wellbeing-heavy) |
| 🟢 LOW-MED | 3 | 8% | Free Soul, Vitgem v3 |
| ✅ LOW | 2 | 5% | Niche clean листинги |

**Insight:** **50% top-niche гогда в HIGH/MED-HIGH** — Vitgem дифференцируется compliance edge.

---

## 🎯 Use cases для классификации

### 1. Аудит конкурентов (KEYWORD_MAP mode)
После scrape всех топ-ASIN в нише — pass each title+bullets через `classify_risk`. Создать risk-distribution таблицу. Идентифицировать HIGH-risk targets для Sponsored Display ASIN-targeting с compliance-positioning copy.

### 2. Self-assessment Vitgem листинга (LISTING_CREATE post-validation)
Pass v3/v4/etc через classifier до publish. Output: `Risk tier: 🟡 MEDIUM (0 red / 8 amber). Top-25% safest in category.`

### 3. SV vs Risk tradeoff (Path A/B/C)
Когда user хочет максимум SV — показать paths:
- **Path A (стабильный MEDIUM):** добавить 3-5 amber → +8-14K effective SV
- **Path B (агрессивный MEDIUM):** добавить 7-10 amber → +12-18K SV, но borderline MED-HIGH
- **Path C (защитный LOW-MED):** не добавлять amber → keep ~55K SV ceiling, top-13% safest

### 4. Pre-launch risk check
Перед публикацией убедиться: `red == 0`. Если ≥1 red — STOP, переписать.

---

## ⚖️ Trade-off: Risk vs SV

Эмпирически из Cerebro analysis (2,423 menopause keywords, May 2026):

| Если добавить в bullets | SV uplift | Risk delta |
|---|---|---|
| `hormone balance` | +1.4K direct + cluster | +1 amber |
| `mood swings` | +45 SV direct + 2K long-tail | +1 amber |
| `hot flushes` | +288 SV + 1K cluster | +1 amber |
| `night sweats` | +200 SV + 800 cluster | +1 amber |
| `phytoestrogens` | +138 SV + 1.5K long-tail | +1 amber |
| `natural` | +500-1K SV | +1 amber |
| `wellbeing` | +200 SV | +1 amber |
| `relief` | +2K SV | **+1 red — STOP** |
| `menopause symptoms` | +288 SV | **+1 red — STOP** |
| `estrogen` | +2.1K SV | **+1 red — STOP** |
| `weight loss` | +201 SV | **+1 red — STOP** |

**Marginal SV per amber word:** 1-3K SV, diminishing returns after 5 amber. Pure SV uplift пропорционально keyword frequency у конкурентов.

---

## Источники

- Memory: [[project_vitgem_listing_v4]] — Path A MEDIUM-stable example
- Memory: [[reference_amazon_uk_seller_central_attrs]]
- Empirical scrape data: `/Users/igor/Downloads/NEW PRODUCTS/Menopause Support Gummies/05_COMPETITOR_DATA/helium_17_may/scraped_*.ndjson` (38 ASIN, May 17 2026)
- ASA precedents: Novomins £50K fine 2024 (Trading Standards re: comparative claims)
