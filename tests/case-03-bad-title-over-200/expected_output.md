# Expected output — case 03: Title over 200 chars

## Input title (211 chars)

```
Meleva Night-Time Sleep Gummies for Adults — Ashwagandha, Vitamin B6, Lemon Balm, Chamomile, Lavender — Tiredness & Fatigue — 60 Sugar Free Sleeping Gummies — Natural Mango Flavour, Vegan — Made in the United Kingdom
```

Замена `Made in UK` → `Made in the United Kingdom` добавила 11 chars, толкнув title с 200 на 211.

## Verdict

```
VERDICT: ⚠️ NEEDS FIXES (title hard limit exceeded)
```

## Ожидаемые findings

### Section 5 (Title ≤200 chars) — FAIL

```
title.chars: 211/200 — over by 11 chars
```

**Fix:** заменить `Made in the United Kingdom` обратно на `Made in UK`, или укоротить другие части.

## Прогон

```bash
python3 ../validators.py title "$(jq -r .title input.json)"
# Ожидаемое: FAIL on title.chars
```

## Почему этот case критичен

Регрессия #1 при работе с title — переделка под "звучит лучше" толкает за 200. Скил должен **категорически** сообщать о превышении даже на 1 символ, не давать "почти". Amazon UK с 21 января 2025 действительно отклоняет title >200 chars.
