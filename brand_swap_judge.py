#!/usr/bin/env python3
"""
brand_swap_judge.py — Programmatic brand-swap test via Claude Haiku API.

Strips brand name from a draft listing (title + bullets), sends to Claude Haiku,
asks: "Is this a legitimate food supplement listing, or does it semantically mimic
a drug/medical product?"

Cost: ~$0.0001 per verify (Haiku is cheap).

Verdict mapping:
  category=drug-mimic + confidence ≥ 0.7  → NO-GO (hard veto)
  category=drug-mimic + confidence 0.5-0.7 → REVIEW_REQUIRED
  category=legitimate-supplement (any conf) → PASS
  API error / no key → ADVISORY (returns "API_UNAVAILABLE", not blocking)

Usage:
    python3 brand_swap_judge.py --title "..." --bullets bullet1.txt bullet2.txt ...

Or as a library:
    from brand_swap_judge import llm_judge_brand_swap, verdict_from_judge
    result = llm_judge_brand_swap(title, bullets)
    verdict = verdict_from_judge(result)

Environment:
    ANTHROPIC_API_KEY        — required for live API calls
    LAMBA_LLM_JUDGE_DISABLED — set to "1" to skip API and return ADVISORY

Reference corpora: references/brand-swap-corpora.json (labelled examples for few-shot).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

MODEL = "claude-haiku-4-5-20251001"
SYSTEM_PROMPT = """You are a regulatory compliance classifier for Amazon UK food supplement listings.

You will receive an anonymised product listing (title + bullets) with the brand name removed.
Your job: classify whether the listing semantically presents as:

  A) drug-mimic — mimics medical/pharmaceutical language; uses disease names; promises cures/treatments;
     suggests prescription-strength effect; uses drug-comparison phrasing ("works like sleeping pills",
     "natural Viagra alternative"); promises guaranteed medical outcomes.

  B) legitimate-supplement — describes ingredients, formats, and benefits via authorised GB NHC Register
     claims (e.g. "contributes to normal psychological function"); describes lifestyle support
     ("for your evening routine"); avoids medical promises.

Return JSON only (no prose):
{
  "category": "drug-mimic" | "legitimate-supplement",
  "confidence": <float 0.0 - 1.0>,
  "reasoning": "<one sentence — what tipped the classification>"
}
"""


def strip_brand(text: str, brand_names: list[str]) -> str:
    """Replace brand names with [BRAND] placeholder in text."""
    cleaned = text
    for brand in brand_names:
        if not brand:
            continue
        pattern = re.compile(re.escape(brand), re.IGNORECASE)
        cleaned = pattern.sub("[BRAND]", cleaned)
    return cleaned


def build_user_message(title: str, bullets: list[str], brand: str | None) -> str:
    """Format the listing for the judge."""
    brand_names = [brand] if brand else []
    title_clean = strip_brand(title, brand_names)
    bullets_clean = [strip_brand(b, brand_names) for b in bullets]
    parts = [
        "Classify the following anonymised Amazon UK food supplement listing.",
        "",
        f"TITLE: {title_clean}",
        "",
        "BULLETS:",
    ]
    for i, b in enumerate(bullets_clean, start=1):
        parts.append(f"{i}. {b}")
    parts.extend([
        "",
        "Return JSON only with keys: category, confidence, reasoning.",
    ])
    return "\n".join(parts)


def llm_judge_brand_swap(
    title: str,
    bullets: list[str],
    brand: str | None = None,
    model: str = MODEL,
) -> dict:
    """Call Claude Haiku API. Returns dict with category/confidence/reasoning,
    or {'status': 'API_UNAVAILABLE', 'reason': '...'} on failure."""

    if os.environ.get("LAMBA_LLM_JUDGE_DISABLED") == "1":
        return {"status": "API_UNAVAILABLE", "reason": "LAMBA_LLM_JUDGE_DISABLED=1"}

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return {"status": "API_UNAVAILABLE", "reason": "ANTHROPIC_API_KEY not set"}

    try:
        from anthropic import Anthropic
    except ImportError:
        return {"status": "API_UNAVAILABLE", "reason": "anthropic SDK not installed (pip install anthropic)"}

    client = Anthropic(api_key=api_key)
    user_message = build_user_message(title, bullets, brand)

    try:
        response = client.messages.create(
            model=model,
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
    except Exception as exc:
        return {"status": "API_UNAVAILABLE", "reason": f"API call failed: {exc}"}

    raw_text = "".join(
        block.text for block in response.content if hasattr(block, "text")
    ).strip()

    # Strip code fences if model wrapped JSON in ```
    raw_text = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()

    try:
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "status": "API_UNAVAILABLE",
            "reason": f"could not parse JSON from model: {raw_text[:200]}",
        }

    return {
        "status": "OK",
        "category": parsed.get("category", "unknown"),
        "confidence": float(parsed.get("confidence", 0.0)),
        "reasoning": parsed.get("reasoning", ""),
        "model": model,
    }


def verdict_from_judge(judge_result: dict) -> dict:
    """Map judge output to {NO-GO, REVIEW_REQUIRED, PASS, ADVISORY}."""

    if judge_result.get("status") == "API_UNAVAILABLE":
        return {
            "verdict": "ADVISORY",
            "reason": f"Brand-swap judge unavailable: {judge_result.get('reason', 'unknown')}",
            "details": judge_result,
        }

    category = judge_result.get("category", "unknown")
    confidence = float(judge_result.get("confidence", 0.0))
    reasoning = judge_result.get("reasoning", "")

    if category == "drug-mimic":
        if confidence >= 0.7:
            verdict = "NO-GO"
        elif confidence >= 0.5:
            verdict = "REVIEW_REQUIRED"
        else:
            verdict = "PASS"
    elif category == "legitimate-supplement":
        verdict = "PASS"
    else:
        verdict = "REVIEW_REQUIRED"

    return {
        "verdict": verdict,
        "reason": f"Classified as {category} (confidence {confidence:.2f}): {reasoning}",
        "details": judge_result,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--title", required=True, help="Listing title")
    parser.add_argument("--bullets", nargs="+", help="Paths to bullet text files OR raw bullets")
    parser.add_argument("--brand", help="Brand name to strip (improves classification accuracy)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    bullets = []
    for b in args.bullets or []:
        p = Path(b)
        bullets.append(p.read_text(encoding="utf-8").strip() if p.exists() else b)

    judge_result = llm_judge_brand_swap(args.title, bullets, brand=args.brand)
    verdict = verdict_from_judge(judge_result)

    if args.json:
        print(json.dumps({"judge": judge_result, "verdict": verdict}, indent=2))
    else:
        print(f"VERDICT: {verdict['verdict']}")
        print(f"  reason: {verdict['reason']}")
        if judge_result.get("status") == "OK":
            print(f"  model:  {judge_result.get('model')}")
            cost_estimate = "~$0.0001"
            print(f"  cost:   {cost_estimate} (Haiku)")

    return 0 if verdict["verdict"] in {"PASS", "ADVISORY"} else 1


if __name__ == "__main__":
    sys.exit(main())
