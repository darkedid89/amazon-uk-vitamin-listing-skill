# amazon-uk-vitamin-listing

Claude Code skill для end-to-end workflow создания и валидации Amazon UK food supplement листингов.

## Что умеет

Три режима в одном навыке:

| Режим | Что делает | Триггеры |
|---|---|---|
| **LABEL_CHECK** | Проверяет JPG/PNG/PDF этикетки против UK FIC + 2002/46/EC + GB NHC Register. Выдаёт правки для дизайнера. | "проверь этикетку", "правки для дизайнера", "label check" |
| **LISTING_CREATE** | Пишет полный compliant Amazon UK listing (Title ≤200 / 5 Bullets ≤1000B / Description ≤2000 / Backend ≤249B) с 15-point compliance check. | "создай листинг", "напиши листинг", "Amazon UK listing" |
| **KEYWORD_MAP** | Анализирует CSV из Helium 10 / ZonGuru / Brand Analytics, строит keyword placement map по тирам Title/Bullets/Backend/PPC. | "проанализируй ключевики", "keyword map" |

## Установка

Клонировать в директорию пользовательских скилов Claude Code:

```bash
git clone https://github.com/darkedid89/amazon-uk-vitamin-listing-skill.git \
  ~/.claude/skills/amazon-uk-vitamin-listing
```

После этого Claude Code автоматически обнаружит навык — он активируется по триггерам в `description` файла `SKILL.md`.

## Структура

```
amazon-uk-vitamin-listing/
├── SKILL.md                          # Главный файл с mode dispatcher
└── references/
    ├── compliance-rules.md           # UK red/yellow/green flags + Amazon limits + 15-point checklist
    ├── claims-database.md            # GB NHC Register (25 ингредиентов) + safe claims по 9 категориям
    ├── label-requirements.md         # UK FIC + 2002/46/EC + 12-point label audit
    ├── listing-templates.md          # Title/Bullets/Description/Backend formulas
    ├── keyword-analysis.md           # CSV schemas + scoring formula + tier allocation
    └── output-templates.md           # Точные форматы output для трёх режимов
```

## Покрытие compliance

- **Регуляции:** UK Food Supplements Directive 2002/46/EC (retained), UK Food Information Regulations 2014 (FIC, retained Reg. 1169/2011), GB Nutrition and Health Claims Register, ASA enforcement rulings (включая Novomins £50K case), MHRA POM list, FSA novel food list.
- **Категории продуктов:** sleep gummies, multivitamins, omega-3, probiotics, ACV/keto, creatine/sports, hair-skin-nails (biotin), iron+B12 fatigue, magnesium, immune (Vit C/D/Zinc), men's vitality, pregnancy/fertility.
- **NHC Register:** 25 ингредиентов с verbatim claims (Vitamins A-K, минералы, omega-3 EPA/DHA, creatine, caffeine, glucomannan, plant sterols) + 40+ ингредиентов с on-hold/no-claim статусом (ashwagandha, valerian, ACV, berberine, etc.) + banned UK list (melatonin POM, CBD novel food, yohimbe, DMAA, kratom, etc.)
- **Label requirements:** функциональные классы (Sweetener/Humectant/Glazing Agent/etc.), 14 allergens, NRV table, "Made in UK" rules, sweetener declaration (FIC Art. 10), FBO requirements.

## Жёсткие правила

- Title строго ≤200 chars (Amazon UK 2025 limit)
- Backend строго ≤249 bytes (превышение = полная деиндексация всех backend keywords)
- Bullets суммарно ≤1000 bytes (Amazon indexation threshold)
- "Food supplement" (не "dietary supplement") — UK FIC требование
- British English обязателен (flavour/colours/fibre/organise)
- Все health claims — verbatim из GB NHC Register с "contributes to"
- Botanicals без NHC claims — описывать только как ингредиенты

## Язык

- Объяснения / чек-листы / вердикты — **на русском**
- Текст листинга / claims / label-text / backend terms — **на British English**

## Источники / Acknowledgments

Навык построен на основе реального проекта запуска бренда Meleva Night-Time Gummies на Amazon UK (2026), включая:
- Опыт review этикетки от Opalbond (UK manufacturer)
- Анализ конкурентов через Helium 10 Cerebro, ZonGuru KoF, Amazon Brand Analytics SQP
- Compliance review против ASA enforcement рулингов

## License

MIT
