# Repository Guidelines

Sales data analysis and dashboard system for **Som Sai Jai** — a Thai cold-press juice bar. Data originates from handwritten daily sales report photos uploaded via LINE.

---

## Project Structure

```
1_Sale/<Month>/          — Handwritten sales report images (.jpg)
2_Expenses/<Month>/      — Expense receipt images + cost_<month>.md (monthly P&L)
3_Automation_Dashboard/
  ├── data.json           — Master sales data (source of truth)
  ├── index.html          — Live dashboard (fetches data.json at runtime)
  ├── SomSaiJai_Dashboard.html — Standalone backup (embedded BUILT_IN data)
  ├── Sales_System_Automation/ — Node.js OCR scripts
  └── pending_verification.json — Staging area before import
```

**Critical:** `index.html` is what visitors see at the live URL. `SomSaiJai_Dashboard.html` is a backup with hardcoded data — both must stay in sync when adding fields or changing render logic.

---

## Key Commands

```bash
# Deploy dashboard (must run from this exact directory)
cd 3_Automation_Dashboard
npx surge . somsaijai-2026.surge.sh

# Run OCR automation scripts (less accurate than visual reading)
cd 3_Automation_Dashboard
npm run process-sales Mar26
npm run verify-sales
```

---

## Data Update Workflow

**Preferred method is visual OCR**, not scripts. When new sales images arrive:

1. Read the image — extract `rev`, `cash`, `scan`, `exp`, cup counts, raw materials used.
2. Verify: `cash + scan = rev`. If mismatch, derive `scan = rev - cash`.
3. Present an audit table before writing anything.
4. Update `data.json` (add entry to correct month array, e.g. `sales.Apr26`).
5. Sync `const BUILT_IN` in `SomSaiJai_Dashboard.html` to match `data.json`.
6. Deploy to Surge.

---

## Data Conventions

- **Date format:** `DD/MM/YYYY`
- **Coconut used fields:** `uco_meat`, `uco_water`, `uco_conden`, `uco_raw` — never use the old single `uco` field.
- **Adding a new field:** backfill all existing entries with `0` so charts don't get `undefined`.
- **Image filenames:** `LINE_ALBUM_..._YYMMDD_seq.jpg` — upload date is typically +1 day from sales date.

---

## Coding Style

- All dashboard logic lives in `index.html` as a single-file app (vanilla JS + Chart.js).
- Match the existing inline style pattern — no build tools, no frameworks.
- When adding a new cup SKU or data field, update in order: `data.json` → `index.html` (renderLog hdr + renderInventory ingredients) → `SomSaiJai_Dashboard.html` (renderTable hdr + BUILT_IN).

---

## Agent-Specific Notes

- **Never reintroduce `uco`** — it has been split into 4 sub-fields as of Apr 2026.
- Fixed costs are hardcoded in `getFixedCosts(month)` in `index.html` — update when rent/salary changes.
- Live URL: **https://somsaijai-2026.surge.sh**
