#!/usr/bin/env python3
"""
amazon-uk-vitamin-listing — validators

Hard-limit validators for Amazon UK food supplement listings.
Usage:
    python3 validators.py title "Your title text here"
    python3 validators.py bullets bullet1.txt bullet2.txt ... bullet5.txt
    python3 validators.py backend "your backend search terms text"
    python3 validators.py dedup title.txt bullets.txt backend.txt
    python3 validators.py full listing.json

Exit codes: 0 = PASS, 1 = FAIL, 2 = usage error.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path
from typing import Iterable

# Hard limits from Amazon UK Selling Policy
TITLE_MAX_CHARS = 200
BULLET_MAX_CHARS = 500
BULLETS_TOTAL_MAX_BYTES = 1000
BACKEND_MAX_BYTES = 249
DESCRIPTION_MAX_CHARS = 2000

# Forbidden characters in title
TITLE_FORBIDDEN_CHARS = set("!$?^~")

# Red-flag words (subset — full list in references/compliance-rules.md)
RED_FLAG_WORDS = {
    "cures", "cure", "treats", "treat", "prevents", "prevent",
    "heals", "heal", "diagnoses", "diagnose",
    "alzheimer", "cancer", "depression", "diabetes", "anxiety",
    "arthritis", "insomnia", "adhd", "ibs", "dementia",
    "antibacterial", "antiviral", "anti-inflammatory", "antimicrobial",
    "antibiotic", "analgesic",
    "fat-burning", "fat burner", "appetite suppressant", "slimming",
    "clinically proven", "doctor recommended", "doctor approved",
    "fda approved", "mhra approved", "scientifically proven",
    "guaranteed results", "100% effective", "miracle",
    "melatonin",  # MHRA POM
    "yohimbe", "yohimbine", "dmaa", "ephedra", "ephedrine", "kratom", "dhea",
    "best", "#1", "most effective", "strongest on the market", "leading",
    "nootropic", "adaptogen", "detox", "detoxifies", "cleanses", "superfood",
    "boosts", "immune booster", "immunity booster",
}

# American spelling that should be British
US_TO_UK_SPELLING = {
    "fiber": "fibre",
    "color": "colour", "colors": "colours",
    "flavor": "flavour", "flavors": "flavours",
    "personalized": "personalised",
    "organized": "organised", "organize": "organise",
    "defense": "defence",
    "catalog": "catalogue",
    "aluminum": "aluminium",
    "pediatric": "paediatric",
    "estrogen": "oestrogen",
    "dietary supplement": "food supplement",  # critical UK term
}

OK = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"
WARN = "\033[93mWARN\033[0m"


def _byte_len(s: str) -> int:
    return len(s.encode("utf-8"))


def _print_result(label: str, ok: bool, msg: str) -> None:
    status = OK if ok else FAIL
    print(f"{status}  {label}: {msg}")


def check_title(title: str) -> bool:
    title = title.strip()
    ok = True

    char_count = len(title)
    if char_count <= TITLE_MAX_CHARS:
        _print_result("title.chars", True, f"{char_count}/{TITLE_MAX_CHARS}")
    else:
        _print_result(
            "title.chars", False,
            f"{char_count}/{TITLE_MAX_CHARS} — over by {char_count - TITLE_MAX_CHARS} chars"
        )
        ok = False

    forbidden_present = [c for c in TITLE_FORBIDDEN_CHARS if c in title]
    if not forbidden_present:
        _print_result("title.forbidden_chars", True, "no ! $ ? ^ ~ in title")
    else:
        _print_result("title.forbidden_chars", False, f"contains: {forbidden_present}")
        ok = False

    word_counts: dict[str, int] = {}
    for word in re.findall(r"\b[A-Za-z]+\b", title.lower()):
        word_counts[word] = word_counts.get(word, 0) + 1
    repeats = {w: c for w, c in word_counts.items() if c > 2 and len(w) > 2}
    if not repeats:
        _print_result("title.word_repeats", True, "no word used >2 times")
    else:
        _print_result("title.word_repeats", False, f"words used >2 times: {repeats}")
        ok = False

    first_80 = title[:80]
    print(f"  INFO  title.first_80 ({len(first_80)} chars): {first_80!r}")

    return ok


def check_bullet(bullet: str, idx: int) -> bool:
    bullet = bullet.strip()
    char_count = len(bullet)
    if char_count <= BULLET_MAX_CHARS:
        _print_result(f"bullet[{idx}].chars", True, f"{char_count}/{BULLET_MAX_CHARS}")
        return True
    _print_result(
        f"bullet[{idx}].chars", False,
        f"{char_count}/{BULLET_MAX_CHARS} — over by {char_count - BULLET_MAX_CHARS}"
    )
    return False


def check_bullets(bullets: list[str]) -> bool:
    ok = True
    if len(bullets) != 5:
        _print_result("bullets.count", False, f"got {len(bullets)}, expected 5")
        ok = False
    else:
        _print_result("bullets.count", True, "5 bullets")

    for i, b in enumerate(bullets, start=1):
        if not check_bullet(b, i):
            ok = False

    total_bytes = sum(_byte_len(b) for b in bullets)
    if total_bytes <= BULLETS_TOTAL_MAX_BYTES:
        _print_result("bullets.total_bytes", True, f"{total_bytes}/{BULLETS_TOTAL_MAX_BYTES}")
    else:
        _print_result(
            "bullets.total_bytes", False,
            f"{total_bytes}/{BULLETS_TOTAL_MAX_BYTES} — Amazon indexation threshold exceeded"
        )
        ok = False

    for i, b in enumerate(bullets, start=1):
        head = b.lstrip().split("—", 1)
        if len(head) == 2 and re.match(r"^[A-Z0-9 &-]{2,40}$", head[0].strip()):
            _print_result(f"bullet[{i}].caps_label", True, f"{head[0].strip()!r}")
        else:
            _print_result(
                f"bullet[{i}].caps_label", False,
                "must start with CAPS LABEL (2-4 words) + ' — '"
            )
            ok = False

    return ok


def check_backend(backend: str) -> bool:
    backend = backend.strip()
    ok = True

    byte_count = _byte_len(backend)
    if byte_count <= BACKEND_MAX_BYTES:
        _print_result("backend.bytes", True, f"{byte_count}/{BACKEND_MAX_BYTES}")
    else:
        _print_result(
            "backend.bytes", False,
            f"{byte_count}/{BACKEND_MAX_BYTES} — FULL DEINDEXATION RISK!"
        )
        ok = False

    if backend != backend.lower():
        _print_result("backend.lowercase", False, "not all lowercase")
        ok = False
    else:
        _print_result("backend.lowercase", True, "all lowercase")

    bad_seps = [c for c in [",", ";", "'", '"'] if c in backend]
    if bad_seps:
        _print_result("backend.separators", False, f"contains forbidden: {bad_seps}")
        ok = False
    else:
        _print_result("backend.separators", True, "only spaces as separators")

    return ok


def check_red_flags(text: str, zone: str) -> list[str]:
    """Return list of red-flag words found in text."""
    text_lower = text.lower()
    hits = []
    for word in RED_FLAG_WORDS:
        # word-boundary match
        if re.search(r"\b" + re.escape(word) + r"\b", text_lower):
            hits.append(word)
    if hits:
        _print_result(f"redflags.{zone}", False, f"found: {sorted(set(hits))}")
    else:
        _print_result(f"redflags.{zone}", True, "no red-flag words")
    return hits


def check_british_english(text: str, zone: str) -> list[tuple[str, str]]:
    text_lower = text.lower()
    hits = []
    for us, uk in US_TO_UK_SPELLING.items():
        if re.search(r"\b" + re.escape(us) + r"\b", text_lower):
            hits.append((us, uk))
    if hits:
        _print_result(
            f"british_english.{zone}", False,
            "found US spellings: " + ", ".join(f"{u}→{uk}" for u, uk in hits)
        )
    else:
        _print_result(f"british_english.{zone}", True, "no US spellings detected")
    return hits


def check_dedup(title: str, bullets: list[str], backend: str) -> bool:
    """Check no word repeats across Title / Bullets / Backend (Amazon SEO efficiency)."""
    def words(s: str) -> set[str]:
        return {w for w in re.findall(r"\b[a-z]{3,}\b", s.lower())}

    # Stop words / connectors that are OK to repeat
    stop = {
        "the", "and", "for", "with", "from", "your", "you", "are", "this",
        "that", "our", "all", "can", "may", "use", "uses",
    }

    t_words = words(title) - stop
    b_words = words(" ".join(bullets)) - stop
    be_words = words(backend) - stop

    t_be = t_words & be_words
    b_be = b_words & be_words

    ok = True
    if t_be:
        _print_result(
            "dedup.title_vs_backend", False,
            f"words in BOTH title and backend (wasted bytes): {sorted(t_be)}"
        )
        ok = False
    else:
        _print_result("dedup.title_vs_backend", True, "no duplicates")

    if b_be:
        _print_result(
            "dedup.bullets_vs_backend", False,
            f"words in BOTH bullets and backend (wasted bytes): {sorted(b_be)}"
        )
        ok = False
    else:
        _print_result("dedup.bullets_vs_backend", True, "no duplicates")

    return ok


def check_full(listing: dict) -> bool:
    """Check a full listing object loaded from JSON."""
    title = listing.get("title", "")
    bullets = listing.get("bullets", [])
    backend = listing.get("backend", "")
    description = listing.get("description", "")

    print("=" * 60)
    print("TITLE")
    print("=" * 60)
    t_ok = check_title(title)
    check_red_flags(title, "title")
    check_british_english(title, "title")

    print()
    print("=" * 60)
    print("BULLETS")
    print("=" * 60)
    b_ok = check_bullets(bullets)
    for i, b in enumerate(bullets, start=1):
        check_red_flags(b, f"bullet[{i}]")
    check_british_english(" ".join(bullets), "bullets")

    print()
    print("=" * 60)
    print("BACKEND")
    print("=" * 60)
    be_ok = check_backend(backend)
    check_red_flags(backend, "backend")

    print()
    print("=" * 60)
    print("DESCRIPTION")
    print("=" * 60)
    desc_chars = len(description)
    if desc_chars <= DESCRIPTION_MAX_CHARS:
        _print_result("description.chars", True, f"{desc_chars}/{DESCRIPTION_MAX_CHARS}")
        d_ok = True
    else:
        _print_result(
            "description.chars", False,
            f"{desc_chars}/{DESCRIPTION_MAX_CHARS} — over by {desc_chars - DESCRIPTION_MAX_CHARS}"
        )
        d_ok = False
    check_red_flags(description, "description")

    print()
    print("=" * 60)
    print("CROSS-ZONE DEDUP")
    print("=" * 60)
    dedup_ok = check_dedup(title, bullets, backend)

    print()
    print("=" * 60)
    overall = t_ok and b_ok and be_ok and d_ok and dedup_ok
    print(f"VERDICT: {'SAFE TO PUBLISH' if overall else 'NEEDS FIXES'}")
    print("=" * 60)
    return overall


def _read_file(path: str) -> str:
    return Path(path).read_text(encoding="utf-8").strip()


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2

    cmd = argv[1]

    if cmd == "title":
        if len(argv) < 3:
            print("usage: validators.py title <text>")
            return 2
        ok = check_title(argv[2])
        return 0 if ok else 1

    if cmd == "bullets":
        if len(argv) < 3:
            print("usage: validators.py bullets <bullet1.txt> [bullet2.txt ...]")
            return 2
        bullets = [_read_file(p) for p in argv[2:]]
        ok = check_bullets(bullets)
        return 0 if ok else 1

    if cmd == "backend":
        if len(argv) < 3:
            print("usage: validators.py backend <text>")
            return 2
        ok = check_backend(argv[2])
        return 0 if ok else 1

    if cmd == "dedup":
        if len(argv) < 5:
            print("usage: validators.py dedup <title.txt> <bullets.txt> <backend.txt>")
            return 2
        title = _read_file(argv[2])
        bullets = [b.strip() for b in _read_file(argv[3]).split("\n\n") if b.strip()]
        backend = _read_file(argv[4])
        ok = check_dedup(title, bullets, backend)
        return 0 if ok else 1

    if cmd == "full":
        if len(argv) < 3:
            print("usage: validators.py full <listing.json>")
            print('  JSON shape: {"title": str, "bullets": [str x 5], "backend": str, "description": str}')
            return 2
        listing = json.loads(_read_file(argv[2]))
        ok = check_full(listing)
        return 0 if ok else 1

    print(f"unknown command: {cmd}")
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
