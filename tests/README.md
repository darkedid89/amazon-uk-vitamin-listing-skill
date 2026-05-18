# Golden Test Cases

Эта папка содержит **golden test cases** — fixed examples с ожидаемым output. Используются для:

1. **Regression testing** — после правки compliance-rules или claims-database прогнать тесты, убедиться что verdicts не съехали
2. **Onboarding** — новый user читает golden cases и понимает что именно скил умеет
3. **Few-shot learning** — Claude использует эти примеры как reference при первой работе со скилом

## Структура

Каждый case — папка с:
- `input.json` — входные данные (брэнд, ингредиенты, формат, опционально draft листинга)
- `expected_output.md` — ожидаемый verdict + ключевые findings
- `notes.md` — почему этот case важен (опционально)

## Cases

| # | Case | Тип | Ожидаемый verdict |
|---|---|---|---|
| 1 | [meleva-night-time-pass](case-01-meleva-night-time-pass/) | LISTING_CREATE | SAFE TO PUBLISH 15/15 |
| 2 | [bad-cures-insomnia](case-02-bad-cures-insomnia/) | LISTING_CREATE | NEEDS FIXES (red flag: "cures") |
| 3 | [bad-title-over-200](case-03-bad-title-over-200/) | LISTING_CREATE | NEEDS FIXES (title 201 chars) |
| 4 | [bad-backend-over-249](case-04-bad-backend-over-249/) | LISTING_CREATE | NEEDS FIXES (backend 251 bytes) |
| 5 | [bad-ashwagandha-claim](case-05-bad-ashwagandha-claim/) | LISTING_CREATE | NEEDS FIXES (botanical health claim) |
| 6 | [label-meleva-corrections](case-06-label-meleva-corrections/) | LABEL_CHECK | 6 corrections needed |

## Прогон через validators.py

```bash
# Smoke test одного case через JSON
python3 ../validators.py full case-01-meleva-night-time-pass/input.json

# Ожидаемое: VERDICT: SAFE TO PUBLISH (zero failures)
```

## Добавление нового case

1. Создать папку `case-NN-short-name/`
2. Положить `input.json` со схемой:
   ```json
   {
     "title": "string",
     "bullets": ["string", "string", "string", "string", "string"],
     "backend": "string",
     "description": "string"
   }
   ```
3. Создать `expected_output.md` с ожидаемым verdict и обоснованием
4. Обновить эту таблицу
