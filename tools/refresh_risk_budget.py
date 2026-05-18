#!/usr/bin/env python3
"""
refresh_risk_budget.py — Empirical risk-budget computation from competitor corpus.

Reads a JSON corpus of surviving Amazon UK competitor listings, extracts n-grams (1-3 words),
computes frequency distribution, and outputs:
- "Safe vocabulary" (phrases used by 30%+ of survivors)
- "Common vocabulary" (phrases used by 10-30% of survivors)
- "Rare vocabulary" (phrases used by 5-10%)
- Per-phrase frequency for the risk-scoring model

Output format: Markdown reference file at references/empirical-risk-budget-<category>.md

Usage:
    python3 tools/refresh_risk_budget.py \\
        --corpus data/menopause-corpus-2026-05-17/competitors.json \\
        --category menopause

Methodology:
  Survivors = listings still live on Amazon UK as of snapshot date.
  Survivor frequency = % of surviving listings that use this phrase.
  Higher frequency in survivors = lower risk (Amazon tolerates it).
  This is NOT a guarantee of safety — high-frequency phrases can still trigger ASA action.
  Always cross-reference with references/compliance-rules.md hard limits.

Limitations (be honest):
  - Small n (typically 10-50 competitors per category) → wide confidence intervals
  - Snapshot bias: only captures listings live at time of scrape, not failed launches
  - Selection bias: high-sales survivors are over-represented
  - Tolerance ≠ approval: Amazon may not have scanned listing yet
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# Stop-words that don't carry meaning (ignored in n-gram extraction)
STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "if", "in", "on", "at", "to",
    "for", "of", "with", "by", "from", "as", "is", "it", "this", "that",
    "these", "those", "be", "been", "being", "are", "was", "were", "has",
    "have", "had", "do", "does", "did", "will", "would", "should", "could",
    "may", "might", "must", "can", "your", "you", "our", "we", "us", "they",
    "them", "their", "his", "her", "its", "my", "me",
}

# Common but uninformative product-language words
GENERIC_PRODUCT_WORDS = {
    "pack", "bottle", "bottles", "month", "months", "day", "days", "supply",
    "size", "made", "uk", "containing", "comes", "each", "every", "all",
    "natural", "vegan", "vegetarian",  # so common they don't differentiate
}

# Hard-coded "risky" phrases that should NEVER appear regardless of frequency
# (mirrors references/compliance-rules.md — kept here for self-contained operation)
HARD_VETO_PHRASES = {
    "cure", "cures", "treats", "treat", "prevents", "prevent", "heals",
    "diagnoses", "diagnose", "alzheimer", "cancer", "depression", "diabetes",
    "insomnia", "anxiety", "arthritis", "dementia",
    "antibacterial", "antiviral", "anti-inflammatory", "antimicrobial",
    "fat burning", "fat burner", "appetite suppressant", "weight loss supplement",
    "clinically proven", "doctor recommended", "doctor approved",
    "fda approved", "mhra approved", "scientifically proven",
    "guaranteed results", "miracle",
    "melatonin", "yohimbe", "yohimbine", "dmaa", "ephedra", "kratom",
}


def normalise(text: str) -> str:
    """Lowercase + collapse whitespace + strip non-alphanumeric except hyphens."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9 \-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_ngrams(text: str, n_range: tuple[int, int] = (1, 3)) -> list[str]:
    """Extract n-grams of sizes in n_range from normalised text."""
    text = normalise(text)
    words = [w for w in text.split() if w not in STOP_WORDS and len(w) > 1]
    ngrams = []
    for n in range(n_range[0], n_range[1] + 1):
        for i in range(len(words) - n + 1):
            ng = " ".join(words[i:i + n])
            ngrams.append(ng)
    return ngrams


def listing_text_corpus(competitor: dict) -> str:
    """Concatenate title + bullets into one searchable text blob per competitor."""
    parts = [competitor.get("title", "")]
    parts.extend(competitor.get("bullets", []))
    return " ".join(p for p in parts if p)


def compute_phrase_frequency(competitors: list[dict]) -> dict[str, dict]:
    """For each phrase, compute:
       - count: number of competitors that use it
       - frequency: count / total_competitors
       - listings: list of ASINs that use it
    """
    n_listings = len(competitors)
    phrase_to_asins: dict[str, set[str]] = defaultdict(set)

    for c in competitors:
        text = listing_text_corpus(c)
        asin = c.get("asin", "unknown")
        seen_in_this_listing = set()
        for ng in extract_ngrams(text):
            if ng in seen_in_this_listing:
                continue
            seen_in_this_listing.add(ng)
            phrase_to_asins[ng].add(asin)

    return {
        phrase: {
            "count": len(asins),
            "frequency": round(len(asins) / n_listings, 3),
            "listings": sorted(asins),
        }
        for phrase, asins in phrase_to_asins.items()
    }


def categorise(phrase_freq: dict[str, dict]) -> dict[str, list]:
    """Bucket phrases by frequency into safe/common/rare/unique/risky."""
    buckets = {
        "safe": [],       # ≥30% (used by most survivors → tolerated by Amazon)
        "common": [],     # 10-30%
        "rare": [],       # 5-10%
        "unique": [],     # <5% (differentiation opportunity OR untested risk)
        "risky": [],      # contains hard-veto words
    }

    for phrase, stats in phrase_freq.items():
        # Hard veto check
        if any(veto in phrase for veto in HARD_VETO_PHRASES):
            buckets["risky"].append((phrase, stats))
            continue

        # Skip overly generic words
        if phrase in GENERIC_PRODUCT_WORDS:
            continue

        freq = stats["frequency"]
        if freq >= 0.30:
            buckets["safe"].append((phrase, stats))
        elif freq >= 0.10:
            buckets["common"].append((phrase, stats))
        elif freq >= 0.05:
            buckets["rare"].append((phrase, stats))
        else:
            buckets["unique"].append((phrase, stats))

    # Sort each bucket by frequency descending
    for bucket in buckets.values():
        bucket.sort(key=lambda x: (-x[1]["frequency"], x[0]))

    return buckets


def emit_markdown(
    buckets: dict[str, list],
    category: str,
    n_competitors: int,
    snapshot_date: str,
    output_path: Path,
) -> None:
    """Generate the empirical-risk-budget-<category>.md reference file."""
    today = datetime.now().strftime("%Y-%m-%d")
    lines = []

    lines.append(f"# Empirical Risk Budget — {category.title()} (auto-generated)")
    lines.append("")
    lines.append(f"> **Snapshot date:** {snapshot_date}")
    lines.append(f"> **Generated:** {today}")
    lines.append(f"> **Competitor sample:** n={n_competitors} surviving Amazon UK listings")
    lines.append(f"> **Method:** N-gram frequency analysis (1-3 grams) across all surviving listings.")
    lines.append("")
    lines.append("## Methodology")
    lines.append("")
    lines.append("- **Survivor frequency** = % of surviving competitor listings that contain this phrase.")
    lines.append("- Higher frequency in survivors = Amazon UK has historically TOLERATED this phrase.")
    lines.append("- **Tolerance ≠ approval.** Amazon may not have scanned every listing. ASA may still act on widely-used claims (e.g. Novomins 2024 case re missing 'contributes to').")
    lines.append("- Always cross-check against `references/compliance-rules.md` HARD VETO list before use.")
    lines.append("")
    lines.append("## Caveats")
    lines.append("")
    lines.append(f"- **Small n (n={n_competitors}).** Bootstrap confidence intervals are wide. P95 estimate ≠ failure boundary.")
    lines.append("- **Snapshot bias.** Only captures listings live as of snapshot date. Suspended/failed listings are NOT in this corpus.")
    lines.append("- **Selection bias.** High-sales survivors dominate the sample.")
    lines.append("- **Refresh cadence.** Re-run this every 30 days. Old snapshots drift fast.")
    lines.append("")

    # Bucket sections
    section_headers = {
        "safe": ("SAFE vocabulary (≥30% survivor usage)", "Used by majority of survivors. Lowest-risk phrases to include."),
        "common": ("COMMON vocabulary (10-30%)", "Frequently used. Acceptable but not differentiating."),
        "rare": ("RARE vocabulary (5-10%)", "Used by a few survivors. Use only if relevant + compliant."),
        "unique": ("UNIQUE / UNTESTED (<5%)", "Either differentiation opportunity OR untested by Amazon. Use with caution."),
        "risky": ("RISKY — HARD VETO words present", "These phrases contain words from the HARD VETO list. DO NOT USE regardless of frequency."),
    }

    for bucket_key in ["safe", "common", "rare", "unique", "risky"]:
        header, blurb = section_headers[bucket_key]
        items = buckets[bucket_key]
        lines.append(f"## {header}")
        lines.append("")
        lines.append(blurb)
        lines.append("")
        lines.append(f"**Total phrases in bucket:** {len(items)}")
        lines.append("")

        # Cap to top 100 per bucket for readability
        capped = items[:100]
        if len(items) > 100:
            lines.append(f"*(showing top 100 of {len(items)} — sorted by frequency descending)*")
            lines.append("")

        lines.append("| Phrase | Survivor count | Frequency | Sample ASINs |")
        lines.append("|---|---|---|---|")
        for phrase, stats in capped:
            sample_asins = ", ".join(stats["listings"][:3])
            extra = f" (+{len(stats['listings'])-3})" if len(stats['listings']) > 3 else ""
            lines.append(f"| `{phrase}` | {stats['count']}/{n_competitors} | {stats['frequency']*100:.0f}% | {sample_asins}{extra} |")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## How to use this file")
    lines.append("")
    lines.append("1. **When writing a new listing:** check that your title/bullets contain ≥3 phrases from the SAFE bucket.")
    lines.append("2. **When auditing a draft:** if you find phrases from the RISKY bucket — STOP, rewrite. If you find phrases from UNIQUE — verify they're not from hard-veto categories.")
    lines.append("3. **When refining a too-risky draft:** swap phrases from UNIQUE/RARE buckets with SAFE bucket equivalents.")
    lines.append("4. **Re-run** `python3 tools/refresh_risk_budget.py` every 30 days to refresh.")
    output_path.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--corpus", type=Path, required=True, help="Path to competitors.json")
    parser.add_argument("--category", required=True, help="Category slug (e.g. menopause, sleep, immune)")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output markdown path (default: references/empirical-risk-budget-<category>.md)",
    )
    args = parser.parse_args()

    if not args.corpus.exists():
        print(f"ERROR: corpus file not found: {args.corpus}", file=sys.stderr)
        return 1

    corpus = json.loads(args.corpus.read_text(encoding="utf-8"))
    competitors = corpus.get("competitors", [])
    snapshot_date = corpus.get("snapshot_date", "unknown")

    if not competitors:
        print("ERROR: no competitors in corpus", file=sys.stderr)
        return 1

    # Include title-only competitors in n-count but they only contribute titles
    title_only = corpus.get("title_only_competitors", [])
    for t in title_only:
        competitors.append({"asin": t["asin"], "brand": t["brand"], "title": t["title"], "bullets": []})

    print(f"Processing {len(competitors)} competitors from snapshot {snapshot_date}...")

    phrase_freq = compute_phrase_frequency(competitors)
    print(f"Extracted {len(phrase_freq)} unique n-grams (1-3 words)")

    buckets = categorise(phrase_freq)
    for k, v in buckets.items():
        print(f"  {k}: {len(v)} phrases")

    output_path = args.output or (
        args.corpus.parent.parent.parent / "references" / f"empirical-risk-budget-{args.category}.md"
    )

    emit_markdown(
        buckets=buckets,
        category=args.category,
        n_competitors=len(competitors),
        snapshot_date=snapshot_date,
        output_path=output_path,
    )

    print(f"\nWrote: {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
