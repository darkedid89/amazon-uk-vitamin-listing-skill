# Decision Tree — When in Doubt

> **Last verified:** 2026-05-26
>
> Quick reference для решения 10 типовых ambiguity scenarios в workflow skill `amazon-uk-vitamin-listing`. Применяется ко всем 3 modes (LABEL_CHECK, LISTING_CREATE, KEYWORD_MAP) — loaded as pre-flight reference.

---

## 1. Label photo unclear / OCR fails

**Trigger:** Image too low-res to read FBO/ingredients/NRV reliably. Text blurred, contrast poor, glare on glossy surface.

**Action:**
1. **Stop** — do not invent missing fields
2. Request from user: (a) higher-resolution image (300+ dpi if possible), OR (b) text spec from manufacturer (formula + FBO + warnings)
3. List specifically what's illegible (e.g. "% NRV column for B6", "FBO postcode")
4. **Do not proceed to listing creation** until label is fully readable

**Fallback:** If user cannot provide better source — flag listing as **DRAFT-ONLY**, do not output `SAFE TO PUBLISH` verdict.

---

## 2. Ingredient not in GB NHC Register

**Trigger:** Active ingredient (e.g. ashwagandha, ACV, monk fruit, cordyceps) has no authorised health claims in `references/claims-database.md`.

**Action:**
1. Treat as **ingredient only** — describe composition, not function
2. Use lifestyle claims: `"part of a balanced routine"`, `"supports your daily wellness"`, `"designed for adults seeking [lifestyle context]"`
3. Do **not** invent claims like `"supports immunity"` or `"boosts energy"` even if widely used by competitors — ASA enforcement risk
4. If other formula ingredients (e.g. B6, Folate, Iodine) have NHC claims — anchor health benefits through them instead

**Fallback:** If product has zero NHC-eligible ingredients → marketing copy is lifestyle-only, no health claims allowed.

---

## 3. FBO address incomplete or non-UK

**Trigger:** Label shows manufacturer address abroad (CN, EU, US) without UK Food Business Operator details, OR UK address missing postcode.

**Action:**
1. **Blocker** — UK FIC Reg 1169/2011 Art. 9(1)(h) requires full UK FBO with postcode for products sold in UK
2. Request FBO clarification from user (legal entity name + UK address + postcode)
3. **Do not** generate listing claiming "Made in UK" if manufacturing is abroad
4. Acceptable phrasing if EU/CN manufactured: `"Manufactured for [FBO Ltd], [UK address]"` (per Intense Wellness Keto pattern)

**Fallback:** If FBO truly non-UK — product likely cannot be sold compliantly in UK market without UK importer/FBO arrangement.

---

## 4. Claim sounds safe but not verbatim from GB NHC Register

**Trigger:** Wanted claim is intuitive (e.g. "B6 helps with mood") but exact GB NHC wording is different ("contributes to normal psychological function").

**Action:**
1. **Use verbatim NHC wording** in bullets/description — even if less catchy
2. ASA-approved softening: prefix with `"supports"` / `"helps maintain"` (no claim distortion). Examples:
   - ✅ `"Vitamin B6 contributes to normal psychological function"` (verbatim)
   - ✅ `"helps maintain normal psychological function"` (ASA-approved softening)
   - ❌ `"B6 boosts mood"` (claim distortion, ASA risk)
3. Source must be cited via `[GB NHC Register]` link in compliance footer
4. Cross-check against `references/claims-database.md` for exact authorised phrasing

**Fallback:** If verbatim form sounds clunky in marketing copy — move detailed claim to A+ Content infographic where it has more breathing room.

---

## 5. Multiple SKU variants (flavours, doses, count packs)

**Trigger:** User wants single listing for product line with multiple variants (mango + berry flavours, 60 + 120 ct, 5mg + 10mg dose).

**Action:**
1. **Separate listing per SKU** — one ASIN per formulation/format
2. Parent-child variation through Amazon Variation Wizard if same brand + same product family (different size/flavour OK; different formula = different ASIN)
3. Title must reference specific variant: `"Mango Flavour"`, `"60 Count"`
4. Reuse same bullets/description with variant-specific tweaks (don't duplicate entirely — Amazon penalises)

**Fallback:** If unsure variant qualifies as "same product different size/flavour" vs "different product" — check Amazon Variation Help docs; default to separate listings.

---

## 6. Brand Registry not active

**Trigger:** Want to create A+ Content / Sponsored Brand campaigns / counterfeit defence — но brand has no Brand Registry on Amazon UK.

**Action:**
1. **Stop** advanced features (A+ Content, SB campaigns, brand analytics, transparency)
2. Verify status: https://brandregistry.amazon.co.uk
3. If brand not registered:
   - Standard route: file UK trademark first (UKIPO ~£170, 4-6 months)
   - Fast route: Amazon **IP Accelerator** (4-6 weeks via partner law firms, ~£800-£1500) — brand can register in Amazon BR after IP Accelerator filing even before full UK TM grant
4. SP (Sponsored Products) campaigns still work without BR — start there
5. **Document BR status in brand profile** (`brands/<brand>.md` → section "3. Account history") so future sessions don't repeat the check

**Fallback:** Defer A+ Content / SB / SBV launches until BR active. Maximise SP performance in interim.

---

## 7. "With the mother" / "raw unfiltered" ACV status unclear

**Trigger:** Product is ACV-based but label doesn't explicitly say "with the mother" or "raw unfiltered". Top competitors (Free Soul, WeightWorld, Wellgard) all claim it as premium signal.

**Action:**
1. **Do not claim** "with mother" / "raw unfiltered" unless verifiable from manufacturer COA (Certificate of Analysis)
2. Default safe phrasing: `"organic apple cider vinegar"` + `"5% total acids"` (the standard spec)
3. If user wants premium positioning — request COA from factory specifically confirming mother content + filtration spec
4. **Document in brand profile** under "Notes" + Special Ingredients structured attr

**Fallback:** Position around other USPs (sugar free / vegan / sucrose-free / B-complex anchor) which we *can* verify from label.

---

## 8. Country of Origin (TBD)

**Trigger:** Listing requires structured attribute `Country of Origin` (manufacturing location), but neither label nor manufacturer disclosure clearly specifies.

**Action:**
1. **Do not guess** — Amazon attr field stays empty or marked "TBD" rather than guessed
2. Request from user: factory location confirmation (e.g. Jiabei CN for Intense Wellness products)
3. **Default safe in listing copy**: `"Manufactured for [FBO Ltd], [UK address]"` (matches label, doesn't claim country)
4. Avoid `"Made in UK"` / `"British Made"` unless verified manufacturing is UK-based
5. If user confirms CN/EU manufacturing — fill `Country of Origin: China` (or relevant); compliance-safe disclosure

**Fallback:** Leaving Country of Origin blank reduces filter match in search, but is safer than mislabelling. Fix in next listing iteration once factory confirms.

---

## 9. Competitor uses risky claim we want to mirror

**Trigger:** Top competitor uses claims like `"clinically proven"`, `"30% faster results"`, `"#1 in UK"` — and ranks well. Tempting to mirror.

**Action:**
1. **Do not mirror** without verifiable basis. Competitor may have:
   - Proprietary RCT we don't have access to (e.g. Free Soul, WeightWorld have funded clinical studies)
   - Existing ASA defence built on review volume + market history
   - Tolerated risk (suspension event hasn't happened *yet*)
2. **Check our basis**:
   - "Clinically proven" — do we have peer-reviewed RCT? No → don't claim
   - "#1 / Best / Most effective" — comparative banned by Amazon ToS regardless of validity
   - "30% faster results" — quantitative claim needs RCT citation in compliance footer
3. **Safe alternatives**:
   - `"Premium formula"` (subjective, defensible)
   - `"Made to GMP standards"` (factual, verifiable)
   - `"Trusted by UK customers"` (with sufficient review volume — defensible)

**Fallback:** Build to outperform organically over 6-12 months (review velocity + S&S subs + image gallery) rather than competing on risky claims.

---

## 10. Validators.py fails on field we control (unexpected regression)

**Trigger:** `bash tools/run_tests.sh` shows regression OR `validators.py full listing.json` returns `NEEDS FIXES` on listing that previously passed.

**Action:**
1. **Stop publishing** — do not push to Seller Central
2. Run `python3 validators.py full <listing>.json` with `--verbose` (if added) to see failing checks
3. Common false-positive causes:
   - CAPS label regex too strict — check if you used non-allowed char (`+ ,  /` allowed since v1.5.0; others not)
   - Bullet bytes over 1000 — trim verbose CAPS label or full text
   - Backend dupes with title/bullets — Amazon tokenises by `[a-z0-9]+`, watch substrings
   - Word repeats >2× in title — common pitfall with "gummies"/"vegan"/"sugar"
4. **If validator bug suspected** (false positive on valid pattern):
   - Reproduce in minimal test case in `tests/case-*/`
   - Open issue on skill repo before editing `validators.py` (avoid silent regex weakening)
5. **If real validator catch** (legitimate compliance issue):
   - Fix listing copy, re-run validators, retry

**Fallback:** Revert to last known-good listing version, investigate, file fix as separate commit/branch.

---

## Quick-reference cheatsheet

| Situation | Default action |
|---|---|
| Anything unclear about label/spec | **Request clarification, don't guess** |
| Claim not in GB NHC Register | Use lifestyle phrasing, no health claim |
| FBO non-UK or incomplete | **Blocker** until resolved |
| Validators.py fails | Stop, debug, no Seller Central push |
| Competitor risky claim mirroring | **Do not mirror** without same basis |
| Multiple variants | One ASIN per formulation |
| Brand Registry inactive | SP-only, defer A+ / SB / SBV |
| Country of Origin TBD | Leave empty + "Manufactured for [FBO]" |

---

## Источники

- UK Food Information Regulations 2014 (FIC, retained Reg. 1169/2011) — Art. 9, 10, 18, 21, 25
- UK Food Supplements Directive 2002/46/EC (retained)
- GB Nutrition and Health Claims Register: https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register
- ASA Rulings: https://www.asa.org.uk/codes-and-rulings/rulings.html
- Amazon UK Brand Registry: https://brandregistry.amazon.co.uk
- Amazon UK Selling Policies: https://sellercentral.amazon.co.uk/help/hub/reference/G201833410
