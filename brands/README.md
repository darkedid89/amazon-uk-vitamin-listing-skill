# Brand Profiles

Каждый файл в этой папке — профиль одного бренда. Скил подгружает соответствующий профиль когда пользователь упоминает бренд по имени.

## Зачем

Brand profile позволяет зафиксировать **бренд-специфические правила**, которые не должны жить в общих references:

- `account_type` — `fresh` (новый, без enforcement scrutiny) vs `burned` (под Amazon enforcement, требует ultra-conservative compliance)
- `forbidden_combos` — комбинации слов, которых этот конкретный бренд избегает (из past суspensions / legal)
- `default_voice` — tone of voice (premium / mass-market / scientific / lifestyle)
- `mandatory_certifications` — что должно быть в каждом листинге (e.g. Meleva всегда указывает sugar-free + vegan)
- `competitor_brands_to_avoid` — конкуренты которых нельзя упоминать
- `claim_strategy` — через какие ингредиенты бренд предпочитает строить health claims

## Использование

```
Пользователь: "создай листинг для Meleva Sleep Gummies"

Скил: → читает SKILL.md → видит бренд Meleva → загружает brands/meleva.md
       → применяет brand-specific правила поверх общих compliance rules
       → output листинг
```

Если бренд не найден — скил предлагает скопировать `_template.md`, заполнить, и сохранить как новый файл.

## Файлы

- [_template.md](_template.md) — шаблон для нового бренда
- [meleva.md](meleva.md) — Meleva British Wellness (sleep / wellness gummies)
