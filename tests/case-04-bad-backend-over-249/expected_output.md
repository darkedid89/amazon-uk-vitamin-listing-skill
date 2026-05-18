# Expected output — case 04: Backend over 249 bytes

## Input backend (267 bytes)

```
magnesium tablets capsules pills drops relax tranquil peaceful soothe slumber snooze stress relief energy pyridoxine valerian theanine passionflower women men non habit forming calming nightly strength berry raspberry adult doze meltatonin alternative
```

## Verdict

```
VERDICT: ⚠️ NEEDS FIXES (backend deindexation risk)
```

## Ожидаемые findings

### Section 8 (Backend ≤249 bytes) — FAIL

```
backend.bytes: 267/249 — FULL DEINDEXATION RISK!
```

### Section 1 (RED FLAGS) — FAIL

- `meltatonin` (typo for "melatonin") — Amazon UK блокирует даже опечатки. Должно быть удалено.

## Почему этот case критичен

**Single most dangerous bug** в листинге — превышение backend ≥250 bytes приводит к **полной деиндексации всех backend keywords** (не только лишних — всех). Скил должен флагать это с максимальным приоритетом и предлагать конкретные слова к удалению.

## Прогон

```bash
python3 ../validators.py backend "$(jq -r .backend input.json)"
# Ожидаемое: FAIL on backend.bytes (267/249)
```

## Fix strategy

Удалить из backend:
- `meltatonin alternative` (-22 bytes) → backend = 245 bytes ✅
- ИЛИ `passionflower` (-14 bytes) + `meltatonin alternative` если можно
