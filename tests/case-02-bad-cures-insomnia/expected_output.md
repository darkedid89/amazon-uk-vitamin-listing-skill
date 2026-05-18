# Expected output — case 02: Bad listing with multiple RED FLAGS

## Verdict

```
VERDICT: ⚠️ NEEDS FIXES (multiple critical issues)
```

## Ожидаемые findings

### Red flag words (Section 1 of checklist) — FAIL

- `cures` (title, bullet 1, description)
- `insomnia` (disease name — title, bullet 1, description)
- `treats` (bullet 1, description)
- `prevents` (bullet 1)
- `anxiety` (disease name — bullet 1)
- `melatonin` (POM in UK — bullet 2, backend)
- `clinically proven` (bullet 2, description)
- `doctor recommended` (bullet 1, description)
- `FDA approved` (description — and irrelevant for UK)
- `guaranteed results` (bullet 5)
- `100% effective` (bullet 5)
- `best`, `#1` (bullet 5, backend)
- `better than sleeping pills` (bullet 5 — drug comparison)
- `5-HTP` (bullet 2 — likely Amazon UK block + ASA risk on health claim)

### "Dietary supplement" instead of "food supplement" (Section 10) — FAIL

- Description: "dietary supplement" must be "food supplement"

### American spelling (Section 4) — FAIL

- `flavor` (bullet 4) → must be `flavour`
- `color` (bullet 4) → must be `colour`

### Comparison without proof (Section 11) — FAIL

- `best natural sleep aid` (title)
- `#1 sleep supplement on the market` (bullet 5)
- `better than sleeping pills` (bullet 5)
- `most effective` implied by `best` and `#1`

### Disclaimer missing (Section 13) — FAIL

- Description has none of: "Do not exceed", "Food supplements should not be used as a substitute", "Keep out of the reach"

### Predicted final score

**0-3/15** depending on how strict the auditor is. This listing must be **completely rewritten**.

## Почему этот case критичен

Adversarial example: содержит почти все возможные нарушения сразу. Если скил пропускает хотя бы 5 из этих красных флагов — он сломан.

## Прогон

```bash
python3 ../validators.py full input.json
# Ожидаемое: множественные FAIL, особенно redflags.* и british_english.*
```
