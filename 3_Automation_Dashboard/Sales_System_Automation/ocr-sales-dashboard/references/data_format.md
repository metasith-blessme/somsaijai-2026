# Data Format Reference

## Daily record fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `date` | str | `DD/MM/YYYY` | Must parse as a valid date |
| `day` | str | 3-letter abbreviation (Mon/Tue/Wed/Thu/Fri/Sat/Sun) | |
| `rev` | int | Total revenue in baht | `rev = cash + scan` |
| `cash` | int | Total cash received | |
| `exp` | int | Total expenses (ice + staff + other) | Usually 60–600 |
| `scan` | int | Total scan/transfer = `rev - cash` | Never negative |
| `c_or` | int | Orange cups sold | ≥ 0 |
| `c_wm` | int | Watermelon cups sold | ≥ 0 |
| `c_mg` | int | Mango cups sold | ≥ 0 |
| `c_co` | int | Coconut cups sold | ≥ 0 |
| `c_ap` | int | Apple cups sold | ≥ 0 |
| `tot` | int | Total cups = sum of all `c_*` | Verified against circled total on page |
| `bb` | int | Big bottles sold | ≥ 0 |
| `bs` | int | Small bottles sold | ≥ 0 |
| `uo` | float | Orange used (baskets) | Usually 1.5–6.0 |
| `uw` | int | Watermelon used (pcs) | Usually 5–25 |

## Arithmetic verification

For every day:
- `cash + scan == rev` (±1 baht rounding tolerance)
- `c_or + c_wm + c_mg + c_co + c_ap == tot`
- `cash - exp == cash_after_exp` (if written on sheet)

## Typical ranges (Som Sai Jai reference)

| Metric | Low day | Typical day | High day |
|--------|---------|-------------|----------|
| Revenue | 5,000 | 10,000 | 17,000 |
| Total cups | 80 | 160 | 280 |
| Orange cups | 40 | 100 | 165 |
| Watermelon cups | 20 | 60 | 115 |
| Expenses | 60 | 120 | 570 |
| Used orange | 1.5 | 3.5 | 6.0 |
| Used watermelon | 5 | 15 | 25 |

Values far outside these ranges should be double-checked against the image.

## Common handwriting patterns

| Pattern | Meaning |
|---------|---------|
| `All → 12,790` | Total revenue = 12,790 |
| `cash → 7,200` | Cash = 7,200 |
| `ice@ → ⊕120` | Ice expense = 120 (⊕ means subtract/deduct) |
| `staff ① → ⊕400` | Staff cost = 400 (1 person) |
| `Scan → 5,590` | Scan/transfer = 5,590 |
| `Orange → ④` | 4 baskets of orange used |
| `Watermelon → (23)` | 23 pcs of watermelon used |
| Tally 正 or HHII | Each full group = 5 units |
| `(129)` circled | 129 orange cups sold this day |
| `Bot / Big → (3)` | 3 big bottles sold |

## Product line naming on handwritten sheets

Products are listed as:
- `Cup(60) cash` / `Cup(60) Scan` — regular cup at 60 baht (cash vs scan payment)
- `Cup(50) cash` / `Cup(50) Scan` — watermelon-style cup at 50 baht
- `Cup(100) cash` / `Cup(100) Scan` — premium/large cup at 100 baht
- `Bot(200) cash` / `Bot(200) Scan` — bottle at 200 baht
- `*Cup(60) cash` / `Mango(60)` — specialty product at 60 baht

To get orange cup count: sum all Cup(60) tally marks (both cash and scan lines for standard orange cups).
To get watermelon cup count: sum Cup(50) lines + any watermelon-specific lines.
Cross-check against the circled per-product totals in the lower section of the page.
