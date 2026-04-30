# Som Sai Jai Excel Schema Reference

## Sheet Names
- `Jan26`, `Feb26`, `Mar26`, etc. (Monthly Sheets)
- `Dashboard` (Optional summary sheet)

## Sheet Layout (Starting Row 3)
| Col | Field | Note |
|---|---|---|
| A | Date | Format: DD/MM/YYYY |
| B | Day | Short form (e.g., Thu) |
| C | Revenue (฿) | Total Gross |
| D | Cash (฿) | Cash portion |
| E | Expenses (฿) | Daily operational costs |
| F | Cash-Exp (฿) | Formula: D - E |
| G | Scan/Transfer (฿) | Transfer portion |
| H | Orange | Cups |
| I | Watermelon | Cups |
| J | Mango | Cups |
| K | Coconut | Cups |
| L | Apple | Cups |
| M | Total Cups | Formula/Sum H:L |
| N | Bot Big | Bottle inventory |
| O | Bot Small | Bottle inventory |
| P | Used Orange (basket) | Raw material consumption |
| Q | Used Watermelon (pcs) | Raw material consumption |

## Bottom Stats Rows
- `TOTAL`: Sum of all daily entries for the month.
- `AVG/DAY`: Average of daily entries based on the number of days recorded.
