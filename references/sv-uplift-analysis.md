# SV Uplift Analysis — Cerebro keyword intersection + bullet placement weight

> **Last verified:** 2026-05-19
>
> Метод количественной оценки addressable monthly search volume для нашего листинга на основе Cerebro reverse-ASIN
> data + ranking-weight по placement (Title/Bullets/Backend/Description).

---

## 🎯 Что такое "addressable SV"

**Addressable SV** = сумма monthly search volume для всех keywords, ВСЕ слова которых присутствуют в нашем
indexed text (Title + Bullets + Backend). Это **theoretical ceiling** — keywords которые Amazon может проиндексировать.

**Realistic capture** ≠ addressable. Realistic зависит от ранкинга (page 1 = 100% CTR, page 3 = 5%):

| Launch period | Rank state | Captured |
|---|---|---|
| Month 1-2 | Page 5-15 (pos 50-150) | 5-10% addressable |
| Month 3-6 (PPC + reviews) | Top 30-50 | 15-25% |
| Month 7-12 (organic momentum) | Top 15-30 | 25-35% |
| Year 2 mature | Top 5-15 | 35-50% |

---

## 🛠 Implementation

### Step 1: Load Cerebro CSVs

```python
import csv

def load_cerebro(files: list[str]) -> dict[str, int]:
    """Returns {keyword: max_search_volume} merging multiple Cerebro CSVs."""
    keywords = {}
    for fpath in files:
        with open(fpath, encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            header = next(reader)
            sv_idx = header.index("Search Volume")
            for row in reader:
                if len(row) <= sv_idx: continue
                kw = row[0].strip().strip('"').lower()
                try: sv = int(row[sv_idx])
                except: sv = 0
                if kw not in keywords or sv > keywords[kw]:
                    keywords[kw] = sv
    return keywords
```

### Step 2: Build token set from listing

```python
import re

STOP = set("a an and the of for to in with on by at as is be from your you we our their or any all not".split())

def expand_tokens(tokens: set[str]) -> set[str]:
    """Singular/plural variants."""
    out = set()
    for t in tokens:
        if t in STOP or len(t)<2: continue
        out.add(t)
        if t.endswith("s") and len(t)>3: out.add(t[:-1])
        if t.endswith("es") and len(t)>4: out.add(t[:-2])
        out.add(t+"s"); out.add(t+"es")
    return out

def listing_tokens(title: str, bullets: str, backend: str) -> set[str]:
    text = f"{title} {bullets} {backend}".lower()
    raw = set(re.findall(r"[a-z0-9]+", text))
    return expand_tokens(raw)
```

### Step 3: Compute addressable

```python
def addressable_sv(keywords: dict, listing_tokens: set) -> tuple[int, list]:
    """Returns (total_SV, list of (keyword, sv) tuples that are addressable)."""
    addressable = []
    for kw, sv in keywords.items():
        kw_tokens = set(re.findall(r"[a-z0-9]+", kw)) - STOP
        kw_tokens = {t for t in kw_tokens if len(t)>=2}
        if kw_tokens and kw_tokens.issubset(listing_tokens):
            addressable.append((kw, sv))
    return sum(sv for _, sv in addressable), addressable
```

### Step 4: Filter to category-relevant (avoid inflation from off-niche cross-traffic)

```python
def filter_relevant(addressable: list, category_pattern: str, off_pattern: str) -> int:
    """E.g. category_pattern=r'\\b(menopaus|perimenopaus|hot flush|ashwagandha|...)\\b'
            off_pattern=r'\\b(test kit|bracelet|patch|magnet|gel|cream)\\b'
    """
    relevant_re = re.compile(category_pattern, re.I)
    off_re = re.compile(off_pattern, re.I)
    filtered = [(kw, sv) for kw, sv in addressable
                if relevant_re.search(kw) and not off_re.search(kw)]
    return sum(sv for _, sv in filtered), filtered
```

---

## 📊 Vitgem v3 → v4 Empirical Result (2026-05-19)

```
v3 listing addressable (all keywords, raw):       227,591 SV / 309 kw
v3 menopause-relevant (filtered):                 147,659 SV / 181 kw
v3 ex-ashwagandha (without 91K outlier):           ~55,000 SV  ← honest ceiling
```

v4 (Path A — добавили 5 amber: `hormone balance`, `mood swings`, `hot flushes`, `night sweats`, `phytoestrogens`):

```
v4 addressable (pure intersection):               227,591 SV  ← same set! 
v4 effective uplift via placement:                +8-14K SV   ← because bullet weight > backend weight
v4 realistic addressable:                          ~63-68K SV menopause-relevant
```

**Critical insight:** добавление amber слов к bullets когда они УЖЕ были в backend
**не меняет** addressable token set. Что меняется — **placement weight**.

---

## ⚖️ Placement Weight Multipliers

Amazon A10 ranking algorithm даёт разный weight по placement:

| Placement | Approx weight | Notes |
|---|---|---|
| **Title** | 1.5× | Highest. Position-sensitive (first 80 chars max). |
| **Bullet 1** | 1.3× | Top-of-bullets premium. |
| **Bullets 2-5** | 1.2× | Equal weight. Order matters less than presence. |
| **Backend** | 1.0× | Indexed but no front-end visibility. |
| **Description** | 0.8× | Weakest. Rufus AI scrapes this for FAQ. |

**Implication:** перенос keyword из Backend в Bullet = эффективный +30% ranking signal для этого keyword,
даже если addressable set остаётся тем же.

---

## 🎯 Effective SV uplift breakdown

Когда переносим N amber-keywords из Backend → Bullets:

```
effective_uplift ≈ Σ(SV_kw × 0.3)  # +30% placement weight gain
                + symptom_longtail_cluster   # ~3-5K SV cluster bonus
                + structured_attr_filter_discovery  # +500-1.5K via Amazon "Refine by" sidebar
                + s_and_s_eligibility_boost  # +2-4K если subscribe & save enabled
```

Real-world Vitgem v3 → v4:
- 5 amber moved: `hormone balance`, `mood swings`, `hot flushes`, `night sweats`, `phytoestrogens`
- Direct SV of those 5 (sum): ~1,621 SV
- Placement uplift: ~486 effective SV (+30% × 1,621)
- Symptom long-tail cluster: ~3-5K SV
- Structured attr filter discovery (Diet=Vegan, Item Form=Gummy): ~500-1.5K SV
- S&S badge: ~2-4K SV
- **Total: +8-14K effective SV**

---

## 🆚 Compare to competitors (Cerebro Top30 indexed)

| Brand / ASIN | SV Top30 indexed |
|---|---:|
| Health & Her Perimenopause (capsule) #1 | 44,819 |
| Horbäach Perimenopause (capsule) | 28,189 |
| Novomins Menopause (gummy) | 25,205 |
| Novomins Perimenopause (gummy) | 20,364 |
| Directpurity Menopause (gummy) | 19,924 |
| Issviva Sleep | 15,379 |
| H&H Peri Multi gummy (new entry) | 11,483 |
| Known Menopause | 10,265 |
| Nutrigums | 9,925 |
| **Vitgem v4 (Y1 Q2 realistic Top30)** | **20-30,000** |
| **Vitgem v4 (Y2 mature)** | **50-60,000** |

Vitgem v4 целится в **#3 в gummy-сегменте** к Y1 Q3 (после Novomins x2). Y2 cap = match H&H position (~45K SV indexed).

---

## 🧠 SV-driven decisions framework

Когда выбирать между двумя вариантами листинга:

```
SV_uplift / risk_delta = "marginal SV per risk unit"

Optimal threshold: marginal SV ≥ 500 SV per amber addition
                   marginal SV ≥ 5000 SV per red addition (но red обычно NEVER worth it)
```

Пример:
- Add `relief` to B5 → +2,000 SV direct, +1 red flag → ratio 2,000/1 → НО red flag = ASA enforcement → STOP
- Add `phytoestrogens` to B2 → +138 SV direct, +1.5K long-tail cluster, +1 amber → ratio ~1,600/1 → ADD ✓
- Add `wellbeing` to B5 → +200 SV, +1 amber → ratio 200/1 → marginal; ADD only if other amber slots already filled

---

## Источники

- Cerebro merged keyword DB: `helium_17_may/GB_AMAZON_cerebro_*.csv` (2 files) + `cerebro_priority2_2026-05-19/GB_AMAZON_cerebro_B0F3B4M5Z8_*.csv` — 2,423 unique keywords across 14 ASINs
- Memory: [[project_vitgem_listing_v4]] [[research_cerebro_menopause]]
- Amazon A10 placement weight: empirical industry consensus (Pacvue, Helium 10 Pro, Jungle Scout SEO docs)
