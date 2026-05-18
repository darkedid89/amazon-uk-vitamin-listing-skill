#!/usr/bin/env python3
"""
image_brief.py — Image brief generator for Amazon UK food supplement product listings.

Generates structured image briefs for 7 standard product image slots (Main, Infographic 1-4,
Lifestyle, Size/Scale). Output briefs are designed to be passed to:
  - /blog image skill (Gemini via MCP) → fal-ai-media → other image generators
  - Designer / Fiverr handover
  - Internal Photoshop / Figma workflow

Each brief contains: subject + action + context + composition + lighting + style
(the 6-component prompt structure recommended by /blog image).

Usage as CLI:
    python3 image_brief.py --product-spec spec.json --output briefs/

Usage as library:
    from image_brief import generate_brief_set
    briefs = generate_brief_set(
        brand="Meleva",
        product_name="Night-Time Gummies",
        category="sleep",
        bottle_colour="amber",
        flavour="Natural Mango",
        ingredients_top4=["Ashwagandha", "Vitamin B6", "Lemon Balm", "Chamomile"],
        certifications=["sugar_free", "vegan", "made_in_uk"],
    )

JSON spec format:
{
  "brand": "Meleva",
  "product_name": "Night-Time Gummies",
  "category": "sleep",                    // sleep / immune / energy / beauty / menopause / sports / etc.
  "bottle_colour": "amber",
  "flavour": "Natural Mango",
  "ingredients_top4": ["Ashwagandha", "Vitamin B6", "Lemon Balm", "Chamomile"],
  "certifications": ["sugar_free", "vegan", "made_in_uk", "non_gmo", "gluten_free"],
  "format": "gummies",                    // gummies / tablets / capsules / drops
  "serving_info": "2 gummies, 30 mins before bed",
  "target_audience": "adults seeking restful sleep"
}
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Standard Amazon UK product image slots (main + 6 secondary)
IMAGE_SLOTS = [
    "main",                 # White background hero
    "infographic_ingredients",
    "infographic_benefits",
    "lifestyle",
    "infographic_quality",
    "infographic_how_to_use",
    "size_scale",
]

# Category-specific lifestyle context defaults
CATEGORY_CONTEXTS = {
    "sleep": {
        "lifestyle_scene": "warm bedroom with soft lamplight, woman in cosy pyjamas reading book before bed",
        "mood": "calm, soothing, evening wind-down",
        "palette": "warm amber, deep navy, soft cream",
    },
    "menopause": {
        "lifestyle_scene": "midlife woman (45-55) in bright kitchen, holding glass of water and bottle, confident relaxed expression",
        "mood": "empowered, supportive, midlife wellness",
        "palette": "soft pink, sage green, warm beige",
    },
    "immune": {
        "lifestyle_scene": "active woman outdoors in autumn, holding bottle with bright background",
        "mood": "energetic, protective, vibrant",
        "palette": "bright orange, warm yellow, soft white",
    },
    "energy": {
        "lifestyle_scene": "active person at sunrise, gym or run setting, holding bottle",
        "mood": "dynamic, motivated, alert",
        "palette": "vibrant red, bright orange, energetic yellow",
    },
    "beauty": {
        "lifestyle_scene": "woman applying serum or doing skincare routine in clean bathroom, bottle visible",
        "mood": "fresh, radiant, self-care",
        "palette": "soft pink, rose gold, cream white",
    },
    "sports": {
        "lifestyle_scene": "athlete mid-workout, gym setting, water bottle and supplement bottle",
        "mood": "powerful, performance, focused",
        "palette": "bold black, electric blue, performance red",
    },
    "general": {
        "lifestyle_scene": "everyday person in kitchen, bottle on counter with morning coffee",
        "mood": "wellness routine, daily ritual",
        "palette": "natural beige, soft green, warm white",
    },
}

CERT_BADGE_NAMES = {
    "sugar_free": "Sugar Free",
    "vegan": "Vegan",
    "gluten_free": "Gluten Free",
    "non_gmo": "Non-GMO",
    "made_in_uk": "Made in UK",
    "gmp": "GMP Certified",
    "halal": "Halal",
    "kosher": "Kosher",
    "third_party_tested": "Third-Party Tested",
    "no_artificial": "No Artificial Colours",
    "no_gelatin": "No Gelatin",
}


def make_brief(slot: str, spec: dict) -> dict:
    """Generate a single image brief for the given slot."""
    brand = spec.get("brand", "[Brand]")
    product = spec.get("product_name", "[Product]")
    category = spec.get("category", "general")
    bottle_colour = spec.get("bottle_colour", "amber")
    flavour = spec.get("flavour", "natural")
    ingredients = spec.get("ingredients_top4", [])
    certs = spec.get("certifications", [])
    fmt = spec.get("format", "gummies")
    serving = spec.get("serving_info", "as directed")
    audience = spec.get("target_audience", "adults")
    ctx = CATEGORY_CONTEXTS.get(category, CATEGORY_CONTEXTS["general"])

    cert_badges = [CERT_BADGE_NAMES.get(c, c) for c in certs]

    if slot == "main":
        return {
            "slot": "main",
            "amazon_requirement": "White background #FFFFFF, product fills 85%+ of frame, 2000x2000px min, RGB",
            "subject": f"{brand} {product} bottle ({fmt} format, {bottle_colour} bottle)",
            "action": "stationary, centered, label clearly readable",
            "context": "pure white seamless background, no shadows or props",
            "composition": "single bottle, dead-centre, slight upward angle for shelf presence, product fills 85%+ of frame",
            "lighting": "soft even studio lighting, no harsh shadows, slight rim light for product separation",
            "style": "clean e-commerce hero, photorealistic, 4K render quality",
            "prompt_template": (
                f"Professional Amazon product photography. {brand} {product}, {bottle_colour} bottle of {fmt} "
                f"with clearly readable label. Pure white seamless background #FFFFFF. "
                f"Product fills 85% of square frame, slight upward camera angle. "
                f"Soft even studio lighting, subtle rim light. Photorealistic, 4K, no shadows on background."
            ),
        }

    if slot == "infographic_ingredients":
        ingred_str = ", ".join(ingredients) if ingredients else "[ingredients]"
        return {
            "slot": "infographic_ingredients",
            "subject": f"4 key ingredients: {ingred_str}",
            "action": "displayed as icon grid with names and doses",
            "context": f"{brand} brand colours, against textured pastel background",
            "composition": "2x2 grid of ingredient icons with text labels below each; product bottle in lower-right corner",
            "lighting": "flat infographic-style colour blocks, no photorealistic lighting",
            "style": "modern infographic, sans-serif typography, clean lines, brand-consistent palette",
            "text_overlay": "INGREDIENTS PER SERVING + ingredient names + doses (e.g. '300mg Ashwagandha equiv.')",
            "prompt_template": (
                f"Modern e-commerce infographic for {brand} {product}. 2x2 grid showing {ingred_str} as flat-colour "
                f"ingredient icons with labels and doses below. Bottle in lower-right corner. "
                f"Pastel background, sans-serif typography, brand-consistent palette. Clean lines."
            ),
        }

    if slot == "infographic_benefits":
        return {
            "slot": "infographic_benefits",
            "subject": "Authorised health benefits + product positioning",
            "action": "displayed as 3-4 benefit boxes with icons",
            "context": "brand colour gradient background",
            "composition": "horizontal row of 3-4 benefit boxes, each with icon + headline + 1-sentence explanation",
            "lighting": "flat infographic colour blocks",
            "style": "modern infographic with clear icon hierarchy",
            "text_overlay_constraints": (
                "USE ONLY GB NHC Register-authorised wording (e.g. 'Vitamin B6 contributes to normal psychological function'). "
                "Avoid: cure, treat, prevent, disease names, comparison superlatives."
            ),
            "prompt_template": (
                f"E-commerce benefit infographic for {brand} {product}. 3-4 horizontal benefit boxes "
                f"each with icon + headline + 1-sentence explanation. Brand colour palette. "
                f"Text overlays use only authorised GB NHC claims (no medical verbs)."
            ),
        }

    if slot == "lifestyle":
        return {
            "slot": "lifestyle",
            "subject": f"Target customer ({audience})",
            "action": ctx["lifestyle_scene"],
            "context": f"natural setting, {ctx['mood']}",
            "composition": "person in foreground (focus), {brand} bottle visible in scene (not staged), candid feeling",
            "lighting": "natural diffused light, warm tones, slight bokeh",
            "style": f"lifestyle photography, {ctx['mood']}, palette: {ctx['palette']}",
            "prompt_template": (
                f"Lifestyle photography for {brand} {product}. {ctx['lifestyle_scene']}. "
                f"Product bottle visible in scene but not staged. Natural diffused lighting, warm tones. "
                f"Palette: {ctx['palette']}. Mood: {ctx['mood']}. Candid, authentic feel. 4K."
            ),
        }

    if slot == "infographic_quality":
        cert_list = " · ".join(cert_badges) if cert_badges else "Quality badges"
        return {
            "slot": "infographic_quality",
            "subject": "Trust signals and certifications",
            "action": f"badges displayed in row: {cert_list}",
            "context": "clean light background with subtle texture",
            "composition": "horizontal row of certification badges, each in own circle/shield shape with icon + text",
            "lighting": "flat infographic colour blocks",
            "style": "premium quality emphasis, gold/silver accent on key badges (Made in UK, GMP)",
            "text_overlay": f"UK QUALITY YOU CAN TRUST + badges: {cert_list}",
            "prompt_template": (
                f"Quality trust infographic for {brand} {product}. Horizontal row of certification badges: "
                f"{cert_list}. Each badge in circle/shield with icon and text. "
                f"Gold/silver accents on Made in UK and GMP. Clean light background."
            ),
        }

    if slot == "infographic_how_to_use":
        return {
            "slot": "infographic_how_to_use",
            "subject": "Usage instructions",
            "action": f"3-step illustration: take {serving}",
            "context": "clean white or pale background",
            "composition": "3 numbered steps in horizontal row: Step 1 (take), Step 2 (when), Step 3 (consistency)",
            "lighting": "flat illustration style",
            "style": "friendly instructional graphic, line illustrations + numbers",
            "text_overlay": f"HOW TO USE: {serving}. Daily for best results.",
            "prompt_template": (
                f"How-to-use infographic for {brand} {product}. 3 numbered steps in horizontal row: "
                f"Step 1 take ({serving}), Step 2 timing, Step 3 consistency. Friendly line illustrations. "
                f"Clean white or pale background. Numbered circles for each step."
            ),
        }

    if slot == "size_scale":
        return {
            "slot": "size_scale",
            "subject": f"{brand} bottle next to everyday object for scale",
            "action": "side-by-side comparison with hand or common object (e.g. coffee mug, ruler, smartphone)",
            "context": "neutral light background",
            "composition": "bottle and scale-reference object at same depth, eye-level shot",
            "lighting": "soft natural light, slight shadow for depth perception",
            "style": "informational product photography, photo-realistic",
            "prompt_template": (
                f"Scale-reference product photo for {brand} {product}. {bottle_colour} bottle of {fmt} "
                f"next to common scale object (hand, coffee mug, ruler) at same depth. "
                f"Eye-level shot, soft natural light, neutral background. Photorealistic."
            ),
        }

    return {"slot": slot, "error": f"unknown slot: {slot}"}


def generate_brief_set(
    brand: str,
    product_name: str,
    category: str = "general",
    bottle_colour: str = "amber",
    flavour: str = "natural",
    ingredients_top4: list[str] | None = None,
    certifications: list[str] | None = None,
    format: str = "gummies",
    serving_info: str = "as directed",
    target_audience: str = "adults",
) -> dict:
    """Generate the full 7-slot brief set."""
    spec = {
        "brand": brand,
        "product_name": product_name,
        "category": category,
        "bottle_colour": bottle_colour,
        "flavour": flavour,
        "ingredients_top4": ingredients_top4 or [],
        "certifications": certifications or [],
        "format": format,
        "serving_info": serving_info,
        "target_audience": target_audience,
    }
    briefs = [make_brief(slot, spec) for slot in IMAGE_SLOTS]
    return {
        "spec": spec,
        "briefs": briefs,
        "amazon_uk_main_image_requirements": {
            "background": "Pure white #FFFFFF (mandatory)",
            "format": "JPEG, TIFF, or PNG",
            "min_dimensions": "2000x2000 pixels (recommended; 1600x1600 minimum)",
            "product_fill": "85%+ of frame",
            "no_text_overlay": "Main image must NOT have text overlays, badges, or marketing copy",
            "no_props": "Main image must NOT have other products, hands, or scale objects",
            "single_unit": "Show single bottle/box, not multipack",
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--product-spec", type=Path, help="Path to JSON spec file")
    parser.add_argument("--output", type=Path, help="Output directory for briefs (default: stdout)")
    parser.add_argument("--brand")
    parser.add_argument("--product-name")
    parser.add_argument("--category", default="general")
    args = parser.parse_args()

    if args.product_spec:
        spec = json.loads(args.product_spec.read_text(encoding="utf-8"))
    elif args.brand and args.product_name:
        spec = {
            "brand": args.brand,
            "product_name": args.product_name,
            "category": args.category,
        }
    else:
        print("ERROR: provide --product-spec FILE or --brand + --product-name", file=sys.stderr)
        return 2

    result = generate_brief_set(**spec)

    if args.output:
        args.output.mkdir(parents=True, exist_ok=True)
        for brief in result["briefs"]:
            slot = brief["slot"]
            out_path = args.output / f"brief_{slot}.json"
            out_path.write_text(json.dumps(brief, indent=2), encoding="utf-8")
        summary_path = args.output / "_summary.json"
        summary_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(f"Wrote {len(result['briefs'])} briefs to {args.output}/")
    else:
        print(json.dumps(result, indent=2))

    return 0


if __name__ == "__main__":
    sys.exit(main())
