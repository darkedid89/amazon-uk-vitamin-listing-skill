# Expected output — case 05: Botanical health claim violations

## Verdict

```
VERDICT: ⚠️ NEEDS FIXES (botanicals without authorised claims)
```

## Ожидаемые findings

### Section 15 (Botanicals — only as ingredient) — FAIL

Ashwagandha и chamomile **не имеют** авторизованных claims в GB NHC Register (claims "on hold"). Использование их в health-positioning **нарушение**:

- Title: `Reduces Anxiety & Stress` — нет authorised claim, к тому же `anxiety` disease name
- Title: `Adaptogen Gummies` — `adaptogen` не имеет regulatory definition в UK
- Bullet 1: `is an adaptogen` / `supports stress relief` / `reduces cortisol levels` — все unauthorised health claims
- Bullet 1: `helps you manage anxiety` — disease name + claim
- Bullet 2: `for additional calming effects` — chamomile health claim
- Bullet 5: `nootropic support` / `enhances mood and cognitive function` — все нарушения

### Section 1 (RED FLAGS) — FAIL

- `anxiety` (disease name) — title, bullets, description
- `reduces` (когда применено к stress/anxiety/cortisol) — title, bullet 1, description
- `adaptogen` — title, bullets, description
- `nootropic` — bullet 5

### Section 2 (NHC Register) — FAIL

Никаких claims из NHC Register не использовано. Если в продукте действительно есть Vit B6 — должен быть использован NHC claim "Vitamin B6 contributes to normal psychological function", а не "ashwagandha reduces stress".

## Strategy fix

1. Убрать ashwagandha из health-positioning, оставить только как ингредиент: `60 Gummies with 300mg Ashwagandha Root Extract`
2. Добавить authorised ingredient (Vit B6, Magnesium) и построить claims через него
3. Заменить все `stress / anxiety / adaptogen / nootropic / cortisol / mood` lifestyle phrases на безопасные: `for your evening routine`, `helps you wind down`, `supports your daily wellness`
4. См. как Meleva Night-Time (case 01) делает это правильно: Vit B6 несёт NHC claim, ashwagandha упоминается только как ингредиент

## Почему этот case критичен

Самая частая ошибка ниши — botanical brands пытаются продавать "stress relief" / "anxiety relief" / "adaptogen" через ингредиенты с claims "on hold". Скил должен **отказывать** в таких формулировках с конкретным fix.
