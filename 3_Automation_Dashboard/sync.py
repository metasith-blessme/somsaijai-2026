#!/usr/bin/env python3
"""
sync.py — Som Sai Jai data sync utility
Run from 3_Automation_Dashboard/

Tasks:
  1. Fix expenses: parse desc strings → populate amt fields in data.json
  2. Sync BUILT_IN: rewrite the BUILT_IN constant in SomSaiJai_Dashboard.html from data.json

Usage:
  python3 sync.py            # runs both tasks
  python3 sync.py --expenses # fix expenses only
  python3 sync.py --builtin  # sync BUILT_IN only
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
DATA_FILE = ROOT / "data.json"
DASHBOARD_FILE = ROOT / "SomSaiJai_Dashboard.html"


def fix_expenses(data: dict) -> int:
    """Parse desc strings and populate amt fields. Returns count of entries fixed."""
    fixed = 0
    for entry in data.get("expenses", []):
        desc = str(entry.get("desc", "0")).strip()
        try:
            amount = float(desc)
            if entry.get("amt", 0) != amount:
                entry["amt"] = amount
                fixed += 1
        except ValueError:
            # Extract first number found in desc
            match = re.search(r"[\d,]+\.?\d*", desc)
            if match:
                amount = float(match.group().replace(",", ""))
                if entry.get("amt", 0) != amount:
                    entry["amt"] = amount
                    fixed += 1
    return fixed


def sync_builtin(data: dict) -> None:
    """Replace the BUILT_IN constant in SomSaiJai_Dashboard.html with current data.json sales."""
    sales = data.get("sales", {})

    # Build compact JS representation of each month
    month_parts = []
    for month, records in sales.items():
        lines = []
        for record in records:
            lines.append(json.dumps(record, ensure_ascii=False, separators=(",", ":")))
        month_parts.append(f"{month}:[\n" + ",\n".join(lines) + "\n]")

    builtin_content = "const BUILT_IN = {\n" + ",\n".join(month_parts) + "\n};"

    html = DASHBOARD_FILE.read_text(encoding="utf-8")

    # Replace from 'const BUILT_IN = {' up to and including '};'
    pattern = r"const BUILT_IN = \{.*?\};"
    new_html = re.sub(pattern, builtin_content, html, count=1, flags=re.DOTALL)

    if new_html == html:
        print("  BUILT_IN: no changes detected.")
    else:
        DASHBOARD_FILE.write_text(new_html, encoding="utf-8")
        print("  BUILT_IN: SomSaiJai_Dashboard.html updated.")


def main():
    args = sys.argv[1:]
    run_expenses = "--builtin" not in args
    run_builtin = "--expenses" not in args

    print("Loading data.json...")
    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    if run_expenses:
        print("Task 1 — Fixing expense amt fields...")
        fixed = fix_expenses(data)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  Expenses: {fixed} entries updated.")

    if run_builtin:
        print("Task 2 — Syncing BUILT_IN to SomSaiJai_Dashboard.html...")
        sync_builtin(data)

    print("Done.")


if __name__ == "__main__":
    main()
