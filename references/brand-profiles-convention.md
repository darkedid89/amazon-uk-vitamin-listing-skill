# Brand Profiles — Auto-load Convention

> **Last verified:** 2026-05-26
>
> Codifies how skill `amazon-uk-vitamin-listing` discovers, loads, and applies brand profiles across all 3 modes (LABEL_CHECK, LISTING_CREATE, KEYWORD_MAP). Brand profile is pre-flight enrichment — loaded once at session start если brand mentioned, then applied throughout workflow.

---

## 5 Rules

### Rule 1 — Detection

Если в user request упомянут бренд, имя которого match'ится с filename в `brands/*.md` (case-insensitive, hyphens optional):

- `brands/meleva.md` matches: "Meleva", "meleva", "MELEVA"
- `brands/vitgem-menopause.md` matches: "Vitgem Menopause", "vitgem menopause", "Vitgem-Menopause", "Vitgem" (если контекст menopause)
- `brands/intense-wellness.md` matches: "INTENSE WELLNESS", "Intense Wellness", "intense-wellness", "Intense" (если контекст INTENSE category)

→ Load `brands/<brand>.md` as pre-flight enrichment.

### Rule 2 — Override defaults

Brand profile **overrides** workflow defaults для следующих fields:

- `forbidden_combos` (zero-tolerance phrases, brand-specific blacklist)
- `mandatory_cert` (Vegan / Sugar Free / Gluten Free / Non-GMO / GMP — должны быть в каждом листинге)
- `claim_strategy` (через какие ингредиенты строить health claims)
- `house_style` (no trailing periods, CAPS label conventions, etc.)
- `competitor_brand_blocklist` (бренды конкурентов — не упоминать в title/bullets)

Если brand profile отсутствует → use category-level defaults from `references/compliance-rules.md`.

### Rule 3 — New brand workflow

Если бренд упомянут в запросе, но `brands/<brand>.md` не существует:

1. Detect "new brand" signal в первом invocation
2. Suggest copy-and-fill workflow:
   ```
   cp ~/.claude/skills/amazon-uk-vitamin-listing/brands/_template.md \
      ~/.claude/skills/amazon-uk-vitamin-listing/brands/<new-brand>.md
   # edit fields: FBO, forbidden_combos, mandatory_cert, claim_strategy, etc.
   ```
3. Не блокировать workflow — продолжить с category defaults, отметить в output что brand profile рекомендуется создать
4. Если пользователь подтверждает new brand → создать профиль во время первого LABEL_CHECK или LISTING_CREATE (заполнить из user input + label extract + scrape evidence)

### Rule 4 — Cross-mode application

Brand profile cross-cuts все 3 modes:

| Mode | What brand profile influences |
|---|---|
| **LABEL_CHECK** | `forbidden_combos` для compliance audit, `mandatory_cert` для front-of-pack badge checklist |
| **LISTING_CREATE** | `claim_strategy` для NHC anchor selection, `house_style` для bullet labels / no trailing periods, `forbidden_combos` для title/bullets compliance, `competitor_brand_blocklist` для backend filter |
| **KEYWORD_MAP** | `competitor_brand_blocklist` для PPC-only segmentation, `forbidden_combos` для compliance-flag list |

### Rule 5 — Multi-brand sessions

Если в одной сессии работаем над несколькими брендами (e.g. Vitgem Menopause → Intense Wellness Keto в одном workflow):

1. Каждый brand profile loaded **на момент когда brand context активен**
2. **Не mixing** — claim_strategy одного бренда не применяется к другому
3. Если контекст меняется (новый ASIN, новый запрос) → reload appropriate brand profile
4. Document brand-profile usage в `audit_log.py` per session (brand_hash field)

---

## Existing brand profiles

| File | Brand | Category | Status |
|---|---|---|---|
| `brands/_template.md` | (empty template) | any | Copy to create new |
| `brands/meleva.md` | Meleva | Sleep / wellness | Active (Night-Time Gummies) |
| `brands/vitgem-menopause.md` | Vitgem | Menopause clinical | Active (Menopause Support Gummies v4) |
| `brands/intense-wellness.md` | INTENSE WELLNESS | Daily wellness multi-SKU | Active (Keto ACV Gummies B0FDL94N9P v2.1 + Feminine Probiotic in dev) |

---

## Brand profile schema (reference)

Каждый brand profile должен содержать секции (см. `brands/_template.md`):

1. **Bird's-eye view** — name, tagline, positioning, target audience, price tier
2. **FBO** — Food Business Operator legal entity + UK address + postcode
3. **Account history** — fresh / burned, past ASA actions, suspensions
4. **Compliance restrictions** — forbidden_combos (zero tolerance), mandatory_cert, mandatory disclaimers
5. **Claim strategy** — primary NHC anchor ingredients, secondary ingredients (no claims), default lifestyle phrases
6. **SEO / Keywords** — core kw (always in title), avoid in listing (PPC-only), competitor brand blocklist
7. **Visual / packaging** — colour palette, mandatory badges, "Made in UK" status
8. **Past listings reference** — link to gold-standard listings for the brand
9. **Active product line** — SKU table (product · form · count · ingredients · status)
10. **Notes** — brand bible URL, regulatory correspondence, supplier specifics

---

## Examples in production

- **Vitgem Menopause v4** listing: `brands/vitgem-menopause.md` defines `house_style.no_trailing_period_in_bullets`, `claim_strategy.primary = "B6 + KSM-66 Ashwagandha"`, `forbidden_combos.never_use = ["HRT", "estrogen", "hormone replacement", "anxiety", "depression"]`
- **Intense Wellness Keto v2.1** listing: `brands/intense-wellness.md` defines `mandatory_cert = ["Vegan", "Sugar Free", "Gluten Free", "Non-GMO", "GMP"]`, `forbidden_combos.never_use` includes `"Made in UK"` (manufacturing location TBD per `decision-tree.md` §8)
- **Meleva Night-Time** listing: `brands/meleva.md` defines `claim_strategy.primary = "Vitamin B6 (psychological function, hormonal activity)"`, fallback because lemon balm / chamomile / lavender lack NHC claims

---

## Источники

- Brand profile schema основан на industry best practices Amazon UK supplement brand operations
- Cross-mode application паттерн взят из real-world v1.3.0 → v1.5.0 workflow (Vitgem v4 + Intense Keto v2.1)
- Brand bible references (private GitHub repos) — внутренние ссылки в каждом profile
