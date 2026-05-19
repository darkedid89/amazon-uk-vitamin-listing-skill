# Amazon UK Seller Central Structured Attributes — Food Supplement Schema

> **Last verified:** 2026-05-19 (reverse-engineered from 6 top gummy competitors via `scrape_asin_v2.js`)
>
> Беспрецедентно важный layer листинга, который **большинство брендов недозаполняют**. Эти ~20 полей —
> отдельные form fields в Seller Central, НЕ часть Title/Bullets/Description.
>
> **Effects:** освобождает 600-800 chars description от boilerplate, открывает левый sidebar "Refine by"
> филтр (Diet=Vegan, Item Form=Gummy) → invisible-to-filter buyers становятся видны, улучшает A10 ranking
> через completeness signal.

---

## ⛔ ЖЁСТКОЕ ПРАВИЛО

**LISTING_CREATE без заполнения этих полей = INCOMPLETE.** Структурные атрибуты ОБЯЗАТЕЛЬНЫ в финальном output `═══ AMAZON UK LISTING ═══` блоке (новая секция `📋 STRUCTURED ATTRIBUTES`).

---

## 📊 Field Coverage (на основе scrape 6 top gummy competitors 2026-05-19)

X/6 = сколько из 6 топ-конкурентов заполняют это поле в Amazon UK product detail page.

### 🟢 Универсальные (4-6/6) — заполнить ВСЕГДА

| Field name (Amazon UK exact label) | Type | Example values | Vitgem default |
|---|---|---|---|
| **Brand Name** | text | `Vitgem`, `novomins`, `Health & Her` | Brand verbatim |
| **Manufacturer** | text | `Vitgem Ltd`, `Novomins`, `Essity` | Legal manufacturer entity |
| **Item Form** | enum | `Gummy`, `Tablet`, `Capsule`, `Liquid`, `Powder` | `Gummy` |
| **Container Type** | enum | `Bottle`, `Tub`, `Pouch`, `Blister` | `Bottle` |
| **Diet Type** | multi | `Vegan`, `Gluten Free`, `Sugar Free`, `Halal`, `Kosher`, `Keto`, `Vegetarian` | по формуле |
| **Number of Items** | int | `1`, `2`, `3` (количество единиц упаковки в SKU) | `1` (single bottle) |
| **Unit Count** | text | `60 count`, `120 count`, `30 servings` | `60 count` |
| **Primary Supplement Type** | text (comma list) | `Vitamin D, K2, Zinc, Sage Leaf, Ashwagandha, Maca Root` | comma-separated actives |
| **Flavour** | text | `Raspberry`, `Strawberry`, `Citrus`, `Tutti Frutti`, `Unflavoured` | по формуле |
| **Product Dimensions** | text | `12 x 6.5 x 6.5 cm; 180 g` | физ. размеры бутылки |
| **Ingredients** (Important Info) | longform | full INCI list | verbatim из label |

### 🟡 Распространённые (3/6) — заполнить если данные есть

| Field name | Type | Example |
|---|---|---|
| **Age Range Description** | enum | `Adult`, `Child`, `Teen`, `Senior`, `All Ages` |
| **Allergen Information** | text | `Contains: None of 14 UK majors` или per-allergen list |
| **Dosage Form** | enum | `Gummy`, `Tablet` (дубль Item Form — заполняй оба, Amazon индексирует отдельно) |
| **Manufacturer Part Number** | text | `VTM-MEN-60-RB` (internal SKU code) |
| **Material Features** | multi | `Cruelty Free`, `No Artificial Colours`, `GMO Free`, `No Artificial Flavours`, `Sugar Free`, `Vegan` |
| **Item Dimensions** | text | дубль Product Dimensions (заполняй оба) |

### 🟠 Опциональные (1-2/6) — bonus density для A10

| Field name | Type | Example |
|---|---|---|
| **Special Ingredients** | text | `KSM-66® Ashwagandha, Affron® Saffron` (branded actives — differentiator) |
| **Supplement Formulation** | enum | `Multi-Supplement`, `Single Ingredient` |
| **Total Servings Per Container** | int | `30`, `60`, `90` |
| **Item Weight** | text | `180 Grams`, `260 Grams` |
| **Model Number** | text | дубль MPN (заполняй оба для индексации) |
| **Country of Origin** | enum | `United Kingdom`, `China`, `India`, `USA` |
| **Specific Uses For Product** | multi | `Menopause Support`, `Hormonal Activity`, `Bone Health`, `Thyroid Function` |
| **Recommended Uses For Product** | text | freeform: `Daily wellness routine for women in midlife` |

---

## 📋 Important Information sections (long-form, ОТДЕЛЬНЫЕ поля)

Эти поля отображаются Amazon ПОД description в блоке "Important information". **Их использование освобождает description от boilerplate.** Конкуренты в основном НЕ используют их — это наш differentiator.

| Field | Coverage | What goes in |
|---|---|---|
| **Ingredients** | 6/6 (always) | Полный INCI list verbatim из label (700-1000 chars typical). Latin names + standardisation ratios. |
| **Directions** | 2/6 | Краткая инструкция приёма (50-150 chars). Пример: `Chew 2 gummies daily for adults. Can be taken with or without food.` |
| **Safety Information** | 2/6 | Полные UK warnings (300-500 chars): "Food supplements should not be used as a substitute... Do not exceed... Contains [allergens]... Not for pregnancy or breastfeeding..." |
| **Storage** | optional | `Store below 25°C in a cool, dry place, away from direct sunlight. Keep cap tightly closed.` |
| **Legal Disclaimer** | optional | UK FBO address + "Food supplement — not intended to diagnose, treat, cure or prevent any disease. Always read the label." |
| **Indications** | rare | `For women navigating perimenopause and menopause as part of a daily wellness routine.` |

**Эффект освобождения description:**
- Old description: ~1900 chars (включая warnings + ingredients + directions)
- New description: ~1900 chars (без них) — освобождено ~600-800 chars для dose-comparison, FAQ, persuasion copy

---

## ⛔ Что НЕ делать

1. **НЕ переписывать ingredients в Title/Bullets/Description** если они уже в Ingredients поле — двойная индексация = wasted bytes
2. **НЕ дублировать warnings в Description** если они в Safety Information — освобождай место
3. **НЕ оставлять пустыми** Diet Type / Item Form / Brand Name — это убивает filter-discoverability
4. **НЕ выбирать неточный Container Type** (если bottle — не пиши "Tub", иначе filter filter "Bottle" не покажет)
5. **НЕ выдумывать Halal/Kosher** без сертификата — Amazon может потребовать proof + Trading Standards риск

---

## 🎯 Pre-publish checklist (структурные атрибуты)

После LISTING_CREATE финального output обязательно убедиться:

- [ ] **Identity** (5 fields): Brand Name, Manufacturer, MPN, Model Number, Item model number
- [ ] **Format** (5 fields): Item Form, Dosage Form, Container Type, Number of Items, Unit Count
- [ ] **Diet** (3 fields): Diet Type (multi), Age Range Description, Allergen Information
- [ ] **Composition** (4 fields): Primary Supplement Type, Special Ingredients, Material Features, Supplement Formulation
- [ ] **Details** (3 fields): Flavour, Product Dimensions, Item Weight
- [ ] **Origin** (3 fields): Country of Origin, Specific Uses For Product, Recommended Uses For Product
- [ ] **Important Information** (5 fields): Ingredients, Directions, Safety Information, Storage, Legal Disclaimer

**Total: 25-28 fields** для full-best-practice fill. Минимум 12 — universal coverage.

---

## 🔍 Откуда получить data per field

| Field | Data source |
|---|---|
| Brand Name / Manufacturer | Memory `project_<brand>_*.md` |
| Item Form / Container Type / Flavour | Memory `product_<sku>_*.md` или formula audit |
| Diet Type | Memory `compliance_<sku>_*.md` + formula audit |
| Primary Supplement Type | Memory `product_<sku>_formula_final.md` |
| Ingredients | Final label INCI list (verbatim) |
| Directions / Safety / Storage | Memory `reference_uk_supplement_label_standards.md` + label |
| Product Dimensions / Item Weight | Memory `project_<sku>_factory_confirmed.md` |
| Country of Origin | Memory `project_<sku>_*_production.md` |

---

## 📜 Reference: Vitgem Menopause v4 (full filled example)

См. [Vitgem_Menopause_AmazonUK_Listing_v4.md](file:///Users/igor/Downloads/NEW%20PRODUCTS/Menopause%20Support%20Gummies/08_LISTING/Vitgem_Menopause_AmazonUK_Listing_v4.md) — секция `🗂 STRUCTURED ATTRIBUTE FIELDS`.

---

## Источники

- Reverse-engineered via `scrape_asin_v2.js` на 6 top-gummy ASINs (Novomins ×2, Directpurity, Issviva, Nutrigums, Known) 2026-05-19
- Memory: [[reference_amazon_uk_seller_central_attrs]] [[project_vitgem_listing_v4]]
- Amazon Seller Central live form schema (UK Health & Personal Care → Dietary Supplements category, 2026-05)
