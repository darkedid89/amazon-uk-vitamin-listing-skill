# Empirical Risk Budget — Keto (auto-generated)

> **Snapshot date:** 2026-05-26
> **Generated:** 2026-05-26
> **Competitor sample:** n=15 surviving Amazon UK listings
> **Method:** N-gram frequency analysis (1-3 grams) across all surviving listings.

## Methodology

- **Survivor frequency** = % of surviving competitor listings that contain this phrase.
- Higher frequency in survivors = Amazon UK has historically TOLERATED this phrase.
- **Tolerance ≠ approval.** Amazon may not have scanned every listing. ASA may still act on widely-used claims (e.g. Novomins 2024 case re missing 'contributes to').
- Always cross-check against `references/compliance-rules.md` HARD VETO list before use.

## Caveats

- **Small n (n=15).** Bootstrap confidence intervals are wide. P95 estimate ≠ failure boundary.
- **Snapshot bias.** Only captures listings live as of snapshot date. Suspended/failed listings are NOT in this corpus.
- **Selection bias.** High-sales survivors dominate the sample.
- **Refresh cadence.** Re-run this every 30 days. Old snapshots drift fast.

## SAFE vocabulary (≥30% survivor usage)

Used by majority of survivors. Lowest-risk phrases to include.

**Total phrases in bucket:** 94

| Phrase | Survivor count | Frequency | Sample ASINs |
|---|---|---|---|
| `gummies` | 14/15 | 93% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+11) |
| `delicious` | 13/15 | 87% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+10) |
| `contains` | 11/15 | 73% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+8) |
| `flavour` | 10/15 | 67% | B086T13DD6, B08BWSTJBR, B09J8LZN89 (+7) |
| `enjoy` | 9/15 | 60% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+6) |
| `function` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+6) |
| `gummy` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+6) |
| `more` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+6) |
| `per` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+6) |
| `suitable` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+6) |
| `supplements` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+6) |
| `vitamin` | 9/15 | 60% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+6) |
| `60` | 8/15 | 53% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+5) |
| `artificial` | 8/15 | 53% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+5) |
| `chewable` | 8/15 | 53% | B086T13DD6, B09J8LZN89, B0BF5L2Y3T (+5) |
| `daily` | 8/15 | 53% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+5) |
| `energy` | 8/15 | 53% | B09J8LZN89, B0BF5L2Y3T, B0C574ZW4K (+5) |
| `fatigue` | 8/15 | 53% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+5) |
| `free` | 8/15 | 53% | B08GQHPM4R, B08WPFV3VC, B0B8SWNKD7 (+5) |
| `ingredients` | 8/15 | 53% | B086T13DD6, B08WPFV3VC, B09J8LZN89 (+5) |
| `normal` | 8/15 | 53% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+5) |
| `support` | 8/15 | 53% | B09J8LZN89, B0BF5L2Y3T, B0CKY3KF4K (+5) |
| `b12` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+4) |
| `b6` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+4) |
| `benefits` | 7/15 | 47% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+4) |
| `capsules` | 7/15 | 47% | B08WPFV3VC, B0BF5L2Y3T, B0C3RXPTJ1 (+4) |
| `easy` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `formulated` | 7/15 | 47% | B08GQHPM4R, B08WPFV3VC, B0C3RXPTJ1 (+4) |
| `gluten-free` | 7/15 | 47% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+4) |
| `metabolism` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `products` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `reduction` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `reduction tiredness` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `reduction tiredness fatigue` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `supplement` | 7/15 | 47% | B08BWSTJBR, B0B8SWNKD7, B0BF5L2Y3T (+4) |
| `system` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `tiredness` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `tiredness fatigue` | 7/15 | 47% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+4) |
| `without` | 7/15 | 47% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+4) |
| `1000mg` | 6/15 | 40% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+3) |
| `apple` | 6/15 | 40% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+3) |
| `both` | 6/15 | 40% | B08BWSTJBR, B08WPFV3VC, B09J8LZN89 (+3) |
| `colours` | 6/15 | 40% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+3) |
| `contributes` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `formula` | 6/15 | 40% | B08GQHPM4R, B09J8LZN89, B0C574ZW4K (+3) |
| `function immune` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `function immune system` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `immune` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `immune system` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `just` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `making` | 6/15 | 40% | B086T13DD6, B0B8SWNKD7, B0C574ZW4K (+3) |
| `men` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+3) |
| `normal function` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `normal function immune` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `one` | 6/15 | 40% | B08GQHPM4R, B08WPFV3VC, B0BF5L2Y3T (+3) |
| `serving` | 6/15 | 40% | B08BWSTJBR, B08GQHPM4R, B0B8SWNKD7 (+3) |
| `standards` | 6/15 | 40% | B08WPFV3VC, B0B8SWNKD7, B0BF5L2Y3T (+3) |
| `strength` | 6/15 | 40% | B08GQHPM4R, B08WPFV3VC, B0BF5L2Y3T (+3) |
| `tablets` | 6/15 | 40% | B0BF5L2Y3T, B0C3RXPTJ1, B0CKY3KF4K (+3) |
| `take` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `vitamin b12` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+3) |
| `which` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+3) |
| `women` | 6/15 | 40% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+3) |
| `acid` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+2) |
| `apple cider` | 5/15 | 33% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+2) |
| `apple cider vinegar` | 5/15 | 33% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+2) |
| `cider` | 5/15 | 33% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+2) |
| `cider vinegar` | 5/15 | 33% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+2) |
| `contributes normal` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+2) |
| `contributes normal function` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+2) |
| `convenient` | 5/15 | 33% | B08BWSTJBR, B0B8SWNKD7, B0C574ZW4K (+2) |
| `designed` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+2) |
| `each bottle` | 5/15 | 33% | B086T13DD6, B08GQHPM4R, B09J8LZN89 (+2) |
| `experience` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+2) |
| `folic` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+2) |
| `folic acid` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+2) |
| `gluten` | 5/15 | 33% | B08GQHPM4R, B08WPFV3VC, B0BF5L2Y3T (+2) |
| `help` | 5/15 | 33% | B0CKY3KF4K, B0D63KGMFR, B0DDHPT96H (+2) |
| `high` | 5/15 | 33% | B08GQHPM4R, B08WPFV3VC, B0BF5L2Y3T (+2) |
| `including` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+2) |
| `levels` | 5/15 | 33% | B08GQHPM4R, B0C3RXPTJ1, B0DCVYNH4K (+2) |
| `men women` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+2) |
| `muscle` | 5/15 | 33% | B086T13DD6, B0C574ZW4K, B0D63KGMFR (+2) |
| `needs` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+2) |
| `non-gmo` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+2) |
| `offer` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+2) |
| `preservatives` | 5/15 | 33% | B08WPFV3VC, B0BF5L2Y3T, B0CKY3KF4K (+2) |
| `quality` | 5/15 | 33% | B08GQHPM4R, B09J8LZN89, B0CKY3KF4K (+2) |
| `routine` | 5/15 | 33% | B086T13DD6, B08GQHPM4R, B0B8SWNKD7 (+2) |
| `strawberry` | 5/15 | 33% | B086T13DD6, B0B8SWNKD7, B0C3RXPTJ1 (+2) |
| `supports` | 5/15 | 33% | B08WPFV3VC, B09J8LZN89, B0C574ZW4K (+2) |
| `vinegar` | 5/15 | 33% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+2) |
| `vitamin b6` | 5/15 | 33% | B08BWSTJBR, B09J8LZN89, B0BF5L2Y3T (+2) |
| `while` | 5/15 | 33% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+2) |

## COMMON vocabulary (10-30%)

Frequently used. Acceptable but not differentiating.

**Total phrases in bucket:** 635

*(showing top 100 of 635 — sorted by frequency descending)*

| Phrase | Survivor count | Frequency | Sample ASINs |
|---|---|---|---|
| `90` | 4/15 | 27% | B08BWSTJBR, B0B8SWNKD7, B0C574ZW4K (+1) |
| `active` | 4/15 | 27% | B086T13DD6, B0B8SWNKD7, B0D63KGMFR (+1) |
| `acv` | 4/15 | 27% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+1) |
| `all benefits` | 4/15 | 27% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+1) |
| `also` | 4/15 | 27% | B086T13DD6, B0BF5L2Y3T, B0C3RXPTJ1 (+1) |
| `body` | 4/15 | 27% | B086T13DD6, B09J8LZN89, B0CKY3KF4K (+1) |
| `brand` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `carefully` | 4/15 | 27% | B086T13DD6, B0B8SWNKD7, B0CKY3KF4K (+1) |
| `cider vinegar gummies` | 4/15 | 27% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+1) |
| `consume` | 4/15 | 27% | B0C3RXPTJ1, B0CKY3KF4K, B0D63KGMFR (+1) |
| `efsa` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0BF5L2Y3T (+1) |
| `enhanced` | 4/15 | 27% | B08WPFV3VC, B0C574ZW4K, B0D63KGMFR (+1) |
| `enjoyable` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0CKY3KF4K (+1) |
| `essential` | 4/15 | 27% | B0BF5L2Y3T, B0C3RXPTJ1, B0C574ZW4K (+1) |
| `everyday` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `focus` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `food` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `gummies delicious` | 4/15 | 27% | B08WPFV3VC, B0BF5L2Y3T, B0C3RXPTJ1 (+1) |
| `gummies offer` | 4/15 | 27% | B08BWSTJBR, B0B8SWNKD7, B0CKY3KF4K (+1) |
| `gummies per` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08WPFV3VC (+1) |
| `healthy` | 4/15 | 27% | B09J8LZN89, B0D63KGMFR, B0DCVYNH4K (+1) |
| `high strength` | 4/15 | 27% | B08GQHPM4R, B08WPFV3VC, B0BF5L2Y3T (+1) |
| `highest` | 4/15 | 27% | B08WPFV3VC, B0BF5L2Y3T, B0C3RXPTJ1 (+1) |
| `ideal` | 4/15 | 27% | B086T13DD6, B0CKY3KF4K, B0D63KGMFR (+1) |
| `into` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `into daily` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `journey` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `like` | 4/15 | 27% | B086T13DD6, B08WPFV3VC, B0DCVYNH4K (+1) |
| `magnesium` | 4/15 | 27% | B086T13DD6, B0B8SWNKD7, B0CKY3KF4K (+1) |
| `makes` | 4/15 | 27% | B08GQHPM4R, B0B8SWNKD7, B0CKY3KF4K (+1) |
| `manufactured` | 4/15 | 27% | B09J8LZN89, B0BF5L2Y3T, B0CKY3KF4K (+1) |
| `minerals` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `month supply` | 4/15 | 27% | B08GQHPM4R, B0BF5L2Y3T, B0C574ZW4K (+1) |
| `mother` | 4/15 | 27% | B08BWSTJBR, B08WPFV3VC, B09J8LZN89 (+1) |
| `mother 1000mg` | 4/15 | 27% | B08BWSTJBR, B08WPFV3VC, B09J8LZN89 (+1) |
| `multiple` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B09J8LZN89 (+1) |
| `natural strawberry` | 4/15 | 27% | B086T13DD6, B0B8SWNKD7, B0C3RXPTJ1 (+1) |
| `not` | 4/15 | 27% | B08GQHPM4R, B0B8SWNKD7, B0C3RXPTJ1 (+1) |
| `now` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `nutrients` | 4/15 | 27% | B086T13DD6, B09J8LZN89, B0BF5L2Y3T (+1) |
| `perfect` | 4/15 | 27% | B0CKY3KF4K, B0D63KGMFR, B0DCVYNH4K (+1) |
| `plant-based` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 (+1) |
| `powders` | 4/15 | 27% | B0BF5L2Y3T, B0C3RXPTJ1, B0DPJ5Y72Z (+1) |
| `products including` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `providing` | 4/15 | 27% | B086T13DD6, B09J8LZN89, B0B8SWNKD7 (+1) |
| `re` | 4/15 | 27% | B086T13DD6, B09J8LZN89, B0DDHPT96H (+1) |
| `recovery` | 4/15 | 27% | B0C574ZW4K, B0D63KGMFR, B0DPJ5Y72Z (+1) |
| `so` | 4/15 | 27% | B08GQHPM4R, B08WPFV3VC, B0C3RXPTJ1 (+1) |
| `tablets capsules` | 4/15 | 27% | B0BF5L2Y3T, B0C3RXPTJ1, B0CKY3KF4K (+1) |
| `tasty` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B09J8LZN89 (+1) |
| `two` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `vegan gummies` | 4/15 | 27% | B09J8LZN89, B0B8SWNKD7, B0BF5L2Y3T (+1) |
| `vegan-friendly` | 4/15 | 27% | B08BWSTJBR, B0B8SWNKD7, B0C574ZW4K (+1) |
| `vegans` | 4/15 | 27% | B08GQHPM4R, B08WPFV3VC, B09J8LZN89 (+1) |
| `vinegar gummies` | 4/15 | 27% | B08BWSTJBR, B08GQHPM4R, B08WPFV3VC (+1) |
| `vitamins` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B09J8LZN89 (+1) |
| `way` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B08GQHPM4R (+1) |
| `who` | 4/15 | 27% | B086T13DD6, B08BWSTJBR, B0CKY3KF4K (+1) |
| `2006` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `2006 nearly` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `2006 nearly two` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `90 gummies` | 3/15 | 20% | B08BWSTJBR, B0B8SWNKD7, B0C574ZW4K |
| `added` | 3/15 | 20% | B08BWSTJBR, B0BF5L2Y3T, B0DCVYNH4K |
| `any` | 3/15 | 20% | B08GQHPM4R, B0C3RXPTJ1, B0DX21WWBF |
| `anytime` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0DPJ5Y72Z |
| `apple flavour` | 3/15 | 20% | B08BWSTJBR, B09J8LZN89, B0BF5L2Y3T |
| `artificial colours` | 3/15 | 20% | B08GQHPM4R, B0BF5L2Y3T, B0CKY3KF4K |
| `artificial sweeteners` | 3/15 | 20% | B08GQHPM4R, B08WPFV3VC, B0DCVYNH4K |
| `b12 folic` | 3/15 | 20% | B08WPFV3VC, B09J8LZN89, B0DCVYNH4K |
| `b12 folic acid` | 3/15 | 20% | B08WPFV3VC, B09J8LZN89, B0DCVYNH4K |
| `b12 vitamin` | 3/15 | 20% | B08BWSTJBR, B0CKY3KF4K, B0DPJ5Y72Z |
| `b6 b12` | 3/15 | 20% | B08BWSTJBR, B09J8LZN89, B0DCVYNH4K |
| `balanced` | 3/15 | 20% | B0CKY3KF4K, B0D63KGMFR, B0DDHPT96H |
| `beetroot` | 3/15 | 20% | B08BWSTJBR, B08WPFV3VC, B09J8LZN89 |
| `benefits apple` | 3/15 | 20% | B08GQHPM4R, B09J8LZN89, B0DCVYNH4K |
| `best` | 3/15 | 20% | B08GQHPM4R, B09J8LZN89, B0C3RXPTJ1 |
| `blend` | 3/15 | 20% | B086T13DD6, B0B8SWNKD7, B0DPJ5Y72Z |
| `boost` | 3/15 | 20% | B0C574ZW4K, B0D63KGMFR, B0DPJ5Y72Z |
| `born` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `born passion` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `born passion food` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `brand offers` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `brand offers wide` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `carefully selected` | 3/15 | 20% | B086T13DD6, B0B8SWNKD7, B0DDHPT96H |
| `changing` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `changing needs` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `changing needs while` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `chewable gummies` | 3/15 | 20% | B09J8LZN89, B0C574ZW4K, B0DPJ5Y72Z |
| `chewable texture` | 3/15 | 20% | B086T13DD6, B0CKY3KF4K, B0DPJ5Y72Z |
| `cider vinegar mother` | 3/15 | 20% | B08BWSTJBR, B09J8LZN89, B0DCVYNH4K |
| `colours preservatives` | 3/15 | 20% | B08WPFV3VC, B0CKY3KF4K, B0DCVYNH4K |
| `complex` | 3/15 | 20% | B09J8LZN89, B0CKY3KF4K, B0DPJ5Y72Z |
| `contain` | 3/15 | 20% | B0BF5L2Y3T, B0C3RXPTJ1, B0CKY3KF4K |
| `contributes reduction` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0CKY3KF4K |
| `contributes reduction tiredness` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0CKY3KF4K |
| `countries` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `countries focus` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `countries focus remains` | 3/15 | 20% | B086T13DD6, B08BWSTJBR, B0B8SWNKD7 |
| `customers` | 3/15 | 20% | B08WPFV3VC, B09J8LZN89, B0C3RXPTJ1 |
| `days supply` | 3/15 | 20% | B08BWSTJBR, B0B8SWNKD7, B0D63KGMFR |

## RARE vocabulary (5-10%)

Used by a few survivors. Use only if relevant + compliant.

**Total phrases in bucket:** 4643

*(showing top 100 of 4643 — sorted by frequency descending)*

| Phrase | Survivor count | Frequency | Sample ASINs |
|---|---|---|---|
| `1-2` | 1/15 | 7% | B09J8LZN89 |
| `1-2 chewable` | 1/15 | 7% | B09J8LZN89 |
| `1-2 chewable gummies` | 1/15 | 7% | B09J8LZN89 |
| `100 prebiotic` | 1/15 | 7% | B0B8SWNKD7 |
| `100 prebiotic inulin` | 1/15 | 7% | B0B8SWNKD7 |
| `100 risk` | 1/15 | 7% | B08GQHPM4R |
| `100 risk free` | 1/15 | 7% | B08GQHPM4R |
| `100 vegan` | 1/15 | 7% | B08GQHPM4R |
| `100 vegan non-gmo` | 1/15 | 7% | B08GQHPM4R |
| `1000mg 90` | 1/15 | 7% | B08BWSTJBR |
| `1000mg 90 gummies` | 1/15 | 7% | B08BWSTJBR |
| `1000mg acv goodness` | 1/15 | 7% | B08BWSTJBR |
| `1000mg acv gummies` | 1/15 | 7% | B08GQHPM4R |
| `1000mg apple` | 1/15 | 7% | B08GQHPM4R |
| `1000mg apple cider` | 1/15 | 7% | B08GQHPM4R |
| `1000mg carbs` | 1/15 | 7% | B0DCVYNH4K |
| `1000mg carbs calories` | 1/15 | 7% | B0DCVYNH4K |
| `1000mg collagen` | 1/15 | 7% | B0DX21WWBF |
| `1000mg collagen clinically` | 1/15 | 7% | B0DX21WWBF |
| `1000mg collagen month` | 1/15 | 7% | B0DX21WWBF |
| `1000mg enhanced` | 1/15 | 7% | B08WPFV3VC |
| `1000mg enhanced vitamin` | 1/15 | 7% | B08WPFV3VC |
| `1000mg gummy` | 1/15 | 7% | B09J8LZN89 |
| `1000mg gummy vitamins` | 1/15 | 7% | B09J8LZN89 |
| `1000mg premium` | 1/15 | 7% | B08GQHPM4R |
| `1000mg premium grade` | 1/15 | 7% | B08GQHPM4R |
| `10ml` | 1/15 | 7% | B08WPFV3VC |
| `10ml suitable` | 1/15 | 7% | B08WPFV3VC |
| `10ml suitable both` | 1/15 | 7% | B08WPFV3VC |
| `12` | 1/15 | 7% | B09J8LZN89 |
| `12 years` | 1/15 | 7% | B09J8LZN89 |
| `12 years age` | 1/15 | 7% | B09J8LZN89 |
| `120 gummies enhanced` | 1/15 | 7% | B0D63KGMFR |
| `120 gummies months` | 1/15 | 7% | B086T13DD6 |
| `120 multi` | 1/15 | 7% | B086T13DD6 |
| `120 multi vitamin` | 1/15 | 7% | B086T13DD6 |
| `13` | 1/15 | 7% | B086T13DD6 |
| `13 active` | 1/15 | 7% | B086T13DD6 |
| `13 active ingredients` | 1/15 | 7% | B086T13DD6 |
| `13 carefully` | 1/15 | 7% | B086T13DD6 |
| `13 carefully selected` | 1/15 | 7% | B086T13DD6 |
| `13 ingredients` | 1/15 | 7% | B086T13DD6 |
| `13 ingredients 120` | 1/15 | 7% | B086T13DD6 |
| `15` | 1/15 | 7% | B0DX21WWBF |
| `15 reducing` | 1/15 | 7% | B0DX21WWBF |
| `15 reducing fatigue` | 1/15 | 7% | B0DX21WWBF |
| `1500mcg` | 1/15 | 7% | B0DPJ5Y72Z |
| `1500mcg b12` | 1/15 | 7% | B0DPJ5Y72Z |
| `1500mcg b12 vitamin` | 1/15 | 7% | B0DPJ5Y72Z |
| `1500mcg soft` | 1/15 | 7% | B0DPJ5Y72Z |
| `1500mcg soft chewable` | 1/15 | 7% | B0DPJ5Y72Z |
| `2-month` | 1/15 | 7% | B086T13DD6 |
| `2-month supply` | 1/15 | 7% | B086T13DD6 |
| `2-month supply gummies` | 1/15 | 7% | B086T13DD6 |
| `20` | 1/15 | 7% | B0D63KGMFR |
| `20 62mg` | 1/15 | 7% | B0D63KGMFR |
| `20 62mg electrolytes` | 1/15 | 7% | B0D63KGMFR |
| `2000mg` | 1/15 | 7% | B0DPJ5Y72Z |
| `2000mg b12` | 1/15 | 7% | B0DPJ5Y72Z |
| `2000mg b12 vitamin` | 1/15 | 7% | B0DPJ5Y72Z |
| `2g` | 1/15 | 7% | B0BF5L2Y3T |
| `2g sugar` | 1/15 | 7% | B0BF5L2Y3T |
| `2g sugar average` | 1/15 | 7% | B0BF5L2Y3T |
| `30 gummies` | 1/15 | 7% | B0CKY3KF4K |
| `30 gummies magnesium` | 1/15 | 7% | B0CKY3KF4K |
| `30 mins` | 1/15 | 7% | B0DX21WWBF |
| `30 mins pre-training` | 1/15 | 7% | B0DX21WWBF |
| `30-day` | 1/15 | 7% | B09J8LZN89 |
| `30-day supply` | 1/15 | 7% | B09J8LZN89 |
| `30-day supply long-lasting` | 1/15 | 7% | B09J8LZN89 |
| `3000mg` | 1/15 | 7% | B0BF5L2Y3T |
| `3000mg ashwagandha` | 1/15 | 7% | B0BF5L2Y3T |
| `3000mg ashwagandha added` | 1/15 | 7% | B0BF5L2Y3T |
| `3000mg ashwagandha ashwagandha` | 1/15 | 7% | B0BF5L2Y3T |
| `3000mg high` | 1/15 | 7% | B0BF5L2Y3T |
| `3000mg high strength` | 1/15 | 7% | B0BF5L2Y3T |
| `365` | 1/15 | 7% | B0DDHPT96H |
| `365 day` | 1/15 | 7% | B0DDHPT96H |
| `365 day guarantee` | 1/15 | 7% | B0DDHPT96H |
| `365 days` | 1/15 | 7% | B0DDHPT96H |
| `365 days questions` | 1/15 | 7% | B0DDHPT96H |
| `45-day supply gummies` | 1/15 | 7% | B0B8SWNKD7 |
| `45-day supply gummy` | 1/15 | 7% | B08BWSTJBR |
| `5000mg high-purity` | 1/15 | 7% | B0DX21WWBF |
| `5000mg high-purity creatine` | 1/15 | 7% | B0DX21WWBF |
| `60 acv` | 1/15 | 7% | B0DCVYNH4K |
| `60 acv keto` | 1/15 | 7% | B0DCVYNH4K |
| `60 count` | 1/15 | 7% | B0DX21WWBF |
| `60 count dual-action` | 1/15 | 7% | B0DX21WWBF |
| `60 days` | 1/15 | 7% | B0D63KGMFR |
| `60 days supply` | 1/15 | 7% | B0D63KGMFR |
| `60 gummies collagen` | 1/15 | 7% | B0C3RXPTJ1 |
| `60 gummies providing` | 1/15 | 7% | B09J8LZN89 |
| `60 vegan acv` | 1/15 | 7% | B08WPFV3VC |
| `60 vegan gummies` | 1/15 | 7% | B09J8LZN89 |
| `60-count` | 1/15 | 7% | B0DPJ5Y72Z |
| `60-count keto` | 1/15 | 7% | B0DPJ5Y72Z |
| `60-count keto electrolyte` | 1/15 | 7% | B0DPJ5Y72Z |
| `600mg` | 1/15 | 7% | B0C574ZW4K |
| `600mg bcaas` | 1/15 | 7% | B0C574ZW4K |

## UNIQUE / UNTESTED (<5%)

Either differentiation opportunity OR untested by Amazon. Use with caution.

**Total phrases in bucket:** 0

| Phrase | Survivor count | Frequency | Sample ASINs |
|---|---|---|---|

## RISKY — HARD VETO words present

These phrases contain words from the HARD VETO list. DO NOT USE regardless of frequency.

**Total phrases in bucket:** 15

| Phrase | Survivor count | Frequency | Sample ASINs |
|---|---|---|---|
| `bite-sized treats` | 1/15 | 7% | B0DPJ5Y72Z |
| `bite-sized treats soft` | 1/15 | 7% | B0DPJ5Y72Z |
| `brn fat burner` | 1/15 | 7% | B0DDHPT96H |
| `delicious bite-sized treats` | 1/15 | 7% | B0DPJ5Y72Z |
| `fat burner` | 1/15 | 7% | B0DDHPT96H |
| `fat burner 90` | 1/15 | 7% | B0DDHPT96H |
| `feel like treat` | 1/15 | 7% | B0DX21WWBF |
| `like treat` | 1/15 | 7% | B0DX21WWBF |
| `like treat no` | 1/15 | 7% | B0DX21WWBF |
| `treat` | 1/15 | 7% | B0DX21WWBF |
| `treat no` | 1/15 | 7% | B0DX21WWBF |
| `treat no more` | 1/15 | 7% | B0DX21WWBF |
| `treats` | 1/15 | 7% | B0DPJ5Y72Z |
| `treats soft` | 1/15 | 7% | B0DPJ5Y72Z |
| `treats soft chewable` | 1/15 | 7% | B0DPJ5Y72Z |

---

## How to use this file

1. **When writing a new listing:** check that your title/bullets contain ≥3 phrases from the SAFE bucket.
2. **When auditing a draft:** if you find phrases from the RISKY bucket — STOP, rewrite. If you find phrases from UNIQUE — verify they're not from hard-veto categories.
3. **When refining a too-risky draft:** swap phrases from UNIQUE/RARE buckets with SAFE bucket equivalents.
4. **Re-run** `python3 tools/refresh_risk_budget.py` every 30 days to refresh.