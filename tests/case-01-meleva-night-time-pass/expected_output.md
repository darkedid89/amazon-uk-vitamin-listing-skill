# Expected output — case 01: Meleva Night-Time (PASS)

## Verdict

```
VERDICT: ✅ SAFE TO PUBLISH (15/15)
```

## Все 15 проверок должны быть ☑

1. ☑ Нет RED FLAG слов
2. ☑ Все health claims из GB NHC Register (Vit B6 verbatim)
3. ☑ "contributes to" не пропущено
4. ☑ British English (flavour, colours)
5. ☑ Title 200/200 chars
6. ☑ Bullets все ≤500 chars (max 206)
7. ☑ Bullets суммарно ≤1000 bytes (944)
8. ☑ Backend ≤249 bytes (243)
9. ☑ Нет повторов между Title/Bullets/Backend
10. ☑ "food supplement" в description
11. ☑ Нет сравнений (best, #1, most)
12. ☑ Дозировки консистентны
13. ☑ Disclaimer = 3 mandatory + pregnancy
14. ☑ Нет melatonin / CBD / yohimbe / DMAA / kratom
15. ☑ Botanicals только как ингредиенты (no health claims)

## Почему этот case критичен

Это **реальный продакшен листинг Meleva Night-Time**, который прошёл compliance review. Это baseline — если в будущем что-то меняется в compliance-rules.md или claims-database.md и этот case начинает FAIL'ить, это **regression bug**.

## Прогон

```bash
python3 ../validators.py full input.json
# Ожидаемое: VERDICT: SAFE TO PUBLISH
```
