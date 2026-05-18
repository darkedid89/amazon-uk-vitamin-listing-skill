# Amazon UK Product Image Specifications — 7 Standard Slots

> **Source:** Amazon UK Style Guide for Health & Personal Care, supplemented with conversion-optimisation patterns observed in top-ranked competitor listings.
> **Last verified:** 2026-05

## Slot 1: Main Image (mandatory white background)

| Property | Requirement |
|---|---|
| Background | Pure white **#FFFFFF** (mandatory) |
| Format | JPEG, TIFF, or PNG |
| Min dimensions | 1600×1600 px (Amazon minimum) |
| **Recommended dimensions** | **2000×2000 px** (enables zoom) |
| Colour space | RGB |
| Product fill | **85%+ of frame** |
| Text overlay | **NONE permitted on main image** (Amazon ToS — listing may be suppressed) |
| Props | None — single bottle/box only |
| Scale objects | None |
| Borders / frames | None |
| Hands / models | None |
| Multipack | Show single unit, not bundle |

**Common reasons for Amazon main image rejection:**
- Text overlays ("Sugar-Free", "New!", marketing copy)
- Coloured backgrounds
- Multiple products
- Lifestyle elements (hands, props)
- Product fills < 85% of frame

---

## Slot 2-7: Secondary Images

Amazon allows up to 6 secondary images + optionally video. Best practice for food supplement listings (based on top-performing UK menopause/sleep competitors):

| Slot | Type | Purpose | Notes |
|---|---|---|---|
| 2 | Infographic — Ingredients | 4 hero ingredients with doses | Use icons + text labels |
| 3 | Infographic — Benefits | Authorised NHC claims + lifestyle benefits | **Use ONLY verbatim NHC claims** with "contributes to" |
| 4 | Lifestyle | Target customer in use context | Bottle visible but not staged |
| 5 | Infographic — Quality | Trust badges (Made in UK, GMP, Vegan, etc.) | Premium badge styling |
| 6 | Infographic — How to Use | 3-step usage flow | Clear timing + dosage |
| 7 | Size/Scale | Bottle vs everyday object | Helps purchase decision |

---

## Per-slot Optimisation Patterns

### Slot 2 (Ingredients infographic)

**What works** (observed in top-3 menopause listings):
- 4-cell or 2x2 grid (don't overcrowd with 6+ ingredients)
- Each cell: icon + ingredient name + dose + 1-line role
- **DOSE-LED**: Show milligrams prominently — most competitors hide doses

**Common mistake:** listing 10+ ingredients in tiny text = visual overload, no differentiation

### Slot 3 (Benefits infographic)

**What works:**
- 3-4 benefit boxes max
- Each: icon + headline + 1-sentence explanation
- **STRICTLY** authorised NHC wording (e.g. "Vitamin B6 contributes to normal psychological function")

**Compliance hard rules:**
- ❌ "Cures hot flushes" / "Treats menopause symptoms" / "Prevents fatigue"
- ❌ "Best menopause supplement" / "#1 rated"
- ❌ Botanicals attributed health claims (ashwagandha = "adaptogen" is NOT allowed)
- ✅ "Vitamin B6 contributes to the reduction of tiredness and fatigue"
- ✅ "Made with sage and red clover" (descriptive only)

### Slot 4 (Lifestyle)

**Category-specific scene templates:**

| Category | Scene |
|---|---|
| Sleep | Bedroom, evening lamplight, person reading/relaxing before bed |
| Menopause | Midlife woman (45-55) in bright space, confident expression |
| Energy/Sports | Active person mid-workout or post-exercise |
| Immune | Active outdoor (autumn/winter), bottle visible |
| Beauty | Skincare routine, clean bathroom, woman applying serum |
| Multivitamin | Kitchen morning routine, bottle on counter with coffee/breakfast |

**Avoid:**
- Generic stock photo feel (use authentic-looking models)
- Studio bottle photography (that's main image already)
- Text overlays describing benefits (those go in infographics)

### Slot 5 (Quality badges)

**Recommended badge sequence for UK consumer trust:**
1. **Made in UK** (most important for UK consumers)
2. **GMP Certified** (manufacturing standard)
3. **Third-Party Tested** (independent verification)
4. **Sugar-Free** (if applicable)
5. **Vegan** / Halal (segment-specific)

Premium styling: gold/silver accent rings, shield/circle shapes.

### Slot 6 (How to Use)

3-step format:
- Step 1: **Take** [X gummies/tablets/capsules]
- Step 2: **When** [timing — e.g. "30 minutes before bed", "with breakfast"]
- Step 3: **Daily** [consistency note — e.g. "Daily for best results, allow 2-4 weeks"]

**Compliance:** never promise specific timeframes ("feel better in 7 days") — use lifestyle phrasing.

### Slot 7 (Size/Scale)

**Scale-reference objects** in order of effectiveness:
1. Adult hand holding bottle (most relatable)
2. Coffee mug next to bottle (universal scale)
3. Smartphone next to bottle (millennial-friendly)
4. Ruler/measuring tape (most informative but feels clinical)

---

## Integration with image generation skills

### Via `/blog image` skill (Gemini)

```bash
# Inside Claude Code:
/blog image
# When prompted, paste output from:
python3 image_brief.py --brand "Meleva" --product-name "Night-Time Gummies" --category sleep
```

### Via `/fal-ai-media` skill

For high-volume generation, fal.ai supports batch image generation through Nano Banana (text-to-image). Use briefs from `image_brief.py` as direct prompts.

### Manual designer handover

For Fiverr / freelance designer:
1. Run `python3 image_brief.py --product-spec spec.json --output briefs/`
2. Each `briefs/brief_<slot>.json` becomes a separate brief document
3. Include: subject + composition + lighting + style + text overlay requirements

---

## Cost & quality benchmarks

| Method | Cost per image | Quality | When to use |
|---|---|---|---|
| Gemini (via /blog image) | ~$0.01 | High for infographics, OK for lifestyle | Iterate fast on infographics |
| fal.ai Nano Banana | ~$0.02 | Very high for product/lifestyle | Final product images |
| Designer (Fiverr) | $20-50/image | Hand-crafted, on-brand | Final main image, premium brand assets |
| Photoshop / in-house | $0 (time) | Total control | When you need pixel-perfect compliance |

---

## Pre-publish image checklist

Before uploading to Seller Central, verify each image:

- [ ] Main image: pure white background (use eyedropper in Photoshop on #FFFFFF)
- [ ] Main image: no text overlays, no badges
- [ ] Main image: single product fills 85%+ of frame
- [ ] All images: 2000×2000 px minimum
- [ ] All images: RGB colour space (not CMYK)
- [ ] All images: JPEG with compression quality ≥ 80%
- [ ] Infographic text: only authorised GB NHC wording (no medical verbs, no disease names)
- [ ] Infographic claims attribute to specific ingredients (not generic "our blend")
- [ ] Lifestyle: model release on file (for legal use)
- [ ] Quality badges: only certifications you actually hold (don't fake GMP if you can't show certificate)
- [ ] Doses on infographics match etiquette (Nutritional Information table)
