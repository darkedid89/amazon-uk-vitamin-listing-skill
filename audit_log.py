#!/usr/bin/env python3
"""
audit_log.py — Append-only JSONL audit log for verdicts.

Logs every LABEL_CHECK / LISTING_CREATE verdict to a JSONL file for retrospective analysis.
PII-scrubbed: brand names and FBO addresses are hashed, listing content is truncated to N chars.

Default log path: $LAMBA_AUDIT_LOG (env var) or ~/.amazon-uk-vitamin-listing-audit.jsonl

Usage as CLI:
    # Append verdict
    python3 audit_log.py append --mode LISTING_CREATE --verdict "SAFE TO PUBLISH" \\
        --brand "Meleva" --product "Night-Time Gummies" --score 15

    # Summarise last 30 days
    python3 audit_log.py summary --days 30

    # Query by mode
    python3 audit_log.py query --mode LABEL_CHECK --limit 10

    # Tail the log
    python3 audit_log.py tail --n 20

Usage as library:
    from audit_log import log_verdict, query_log, summarise_log
    log_verdict(mode="LISTING_CREATE", verdict="SAFE TO PUBLISH", brand="Meleva", ...)
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

DEFAULT_LOG_PATH = Path.home() / ".amazon-uk-vitamin-listing-audit.jsonl"


def _log_path() -> Path:
    env_path = os.environ.get("LAMBA_AUDIT_LOG")
    return Path(env_path).expanduser() if env_path else DEFAULT_LOG_PATH


def _hash_pii(value: str | None) -> str | None:
    """Hash PII (brand name, FBO address) for audit purposes."""
    if not value:
        return None
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def _truncate(text: str | None, max_chars: int = 200) -> str | None:
    if not text:
        return None
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "...[truncated]"


def log_verdict(
    mode: str,
    verdict: str,
    brand: str | None = None,
    product: str | None = None,
    score: int | None = None,
    score_max: int | None = None,
    issues: list[str] | None = None,
    title_excerpt: str | None = None,
    asin: str | None = None,
    log_path: Path | None = None,
) -> dict:
    """Append a verdict entry to the audit log. Returns the entry as written."""
    path = log_path or _log_path()
    path.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        "ts": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(timespec="seconds") + "Z",
        "mode": mode,
        "verdict": verdict,
        "brand_hash": _hash_pii(brand),
        "product": product,  # product type is not PII (e.g. "Sleep Gummies")
        "score": score,
        "score_max": score_max,
        "issues": issues or [],
        "title_excerpt": _truncate(title_excerpt, 200),
        "asin": asin,
    }

    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return entry


def read_log(log_path: Path | None = None) -> list[dict]:
    """Read entire log as list of dicts."""
    path = log_path or _log_path()
    if not path.exists():
        return []
    entries = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return entries


def query_log(
    mode: str | None = None,
    verdict: str | None = None,
    since_days: int | None = None,
    limit: int = 100,
    log_path: Path | None = None,
) -> list[dict]:
    """Query log with filters."""
    entries = read_log(log_path)

    if since_days is not None:
        cutoff = (datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=since_days)).isoformat() + "Z"
        entries = [e for e in entries if e.get("ts", "") >= cutoff]

    if mode:
        entries = [e for e in entries if e.get("mode") == mode]

    if verdict:
        entries = [e for e in entries if e.get("verdict") == verdict]

    # Most recent first
    entries.sort(key=lambda e: e.get("ts", ""), reverse=True)
    return entries[:limit]


def summarise_log(since_days: int = 30, log_path: Path | None = None) -> dict:
    """Aggregate stats over last N days."""
    entries = query_log(since_days=since_days, limit=10**6, log_path=log_path)

    if not entries:
        return {"period_days": since_days, "total_verdicts": 0, "message": "No entries in this period"}

    mode_counts = Counter(e.get("mode") for e in entries)
    verdict_counts = Counter(e.get("verdict") for e in entries)

    # Verdicts per mode
    per_mode_verdict = defaultdict(Counter)
    for e in entries:
        per_mode_verdict[e.get("mode")][e.get("verdict")] += 1

    # Pass rate per mode
    pass_rate = {}
    for mode, vc in per_mode_verdict.items():
        total = sum(vc.values())
        passed = vc.get("SAFE TO PUBLISH", 0) + vc.get("PASS", 0)
        pass_rate[mode] = {
            "pass": passed,
            "total": total,
            "pass_rate": round(passed / total, 3) if total else 0.0,
        }

    # Top recurring issues
    all_issues = []
    for e in entries:
        all_issues.extend(e.get("issues", []))
    top_issues = Counter(all_issues).most_common(10)

    # Unique brands (hashed) and products
    unique_brand_hashes = len({e.get("brand_hash") for e in entries if e.get("brand_hash")})
    unique_products = len({e.get("product") for e in entries if e.get("product")})

    return {
        "period_days": since_days,
        "total_verdicts": len(entries),
        "modes": dict(mode_counts),
        "verdicts": dict(verdict_counts),
        "pass_rate_by_mode": pass_rate,
        "top_recurring_issues": top_issues,
        "unique_brands": unique_brand_hashes,
        "unique_products": unique_products,
        "first_ts": entries[-1].get("ts") if entries else None,
        "last_ts": entries[0].get("ts") if entries else None,
    }


def tail_log(n: int = 20, log_path: Path | None = None) -> list[dict]:
    """Last N entries (most recent first)."""
    entries = read_log(log_path)
    entries.sort(key=lambda e: e.get("ts", ""), reverse=True)
    return entries[:n]


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_append = sub.add_parser("append", help="Append a verdict entry")
    p_append.add_argument("--mode", required=True, choices=["LABEL_CHECK", "LISTING_CREATE", "KEYWORD_MAP", "BRAND_SWAP"])
    p_append.add_argument("--verdict", required=True)
    p_append.add_argument("--brand")
    p_append.add_argument("--product")
    p_append.add_argument("--score", type=int)
    p_append.add_argument("--score-max", type=int)
    p_append.add_argument("--issues", nargs="*")
    p_append.add_argument("--title-excerpt")
    p_append.add_argument("--asin")
    p_append.add_argument("--log-path", type=Path)

    p_summary = sub.add_parser("summary", help="Aggregate stats")
    p_summary.add_argument("--days", type=int, default=30)
    p_summary.add_argument("--log-path", type=Path)
    p_summary.add_argument("--json", action="store_true")

    p_query = sub.add_parser("query", help="Filter entries")
    p_query.add_argument("--mode")
    p_query.add_argument("--verdict")
    p_query.add_argument("--days", type=int)
    p_query.add_argument("--limit", type=int, default=20)
    p_query.add_argument("--log-path", type=Path)

    p_tail = sub.add_parser("tail", help="Last N entries")
    p_tail.add_argument("--n", type=int, default=20)
    p_tail.add_argument("--log-path", type=Path)

    args = parser.parse_args()

    if args.cmd == "append":
        entry = log_verdict(
            mode=args.mode,
            verdict=args.verdict,
            brand=args.brand,
            product=args.product,
            score=args.score,
            score_max=args.score_max,
            issues=args.issues,
            title_excerpt=args.title_excerpt,
            asin=args.asin,
            log_path=args.log_path,
        )
        print(f"Logged to {args.log_path or _log_path()}:")
        print(json.dumps(entry, indent=2))

    elif args.cmd == "summary":
        s = summarise_log(since_days=args.days, log_path=args.log_path)
        if args.json:
            print(json.dumps(s, indent=2))
        else:
            print(f"=== Audit summary (last {s['period_days']} days) ===")
            print(f"Total verdicts: {s['total_verdicts']}")
            if s["total_verdicts"] == 0:
                return 0
            print(f"Time range: {s.get('first_ts')} → {s.get('last_ts')}")
            print(f"Unique brands: {s['unique_brands']}, unique products: {s['unique_products']}")
            print()
            print("Modes:")
            for m, count in s["modes"].items():
                print(f"  {m}: {count}")
            print()
            print("Pass rate by mode:")
            for m, pr in s["pass_rate_by_mode"].items():
                print(f"  {m}: {pr['pass']}/{pr['total']} = {pr['pass_rate']*100:.1f}%")
            print()
            print("Top recurring issues:")
            for issue, count in s["top_recurring_issues"]:
                print(f"  {issue}: {count}")

    elif args.cmd == "query":
        results = query_log(
            mode=args.mode,
            verdict=args.verdict,
            since_days=args.days,
            limit=args.limit,
            log_path=args.log_path,
        )
        for r in results:
            print(json.dumps(r, ensure_ascii=False))

    elif args.cmd == "tail":
        for entry in tail_log(args.n, args.log_path):
            print(json.dumps(entry, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    sys.exit(main())
