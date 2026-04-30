# Som Sai Jai Cold Press Bar - February 2026 Sales Report Extraction Guide

## Project Overview
- **Store Name**: Som Sai Jai Cold Press Bar
- **Report Period**: February 2026
- **Total Daily Reports**: 28 images
- **Image Location**: `/Users/metasithjumpatip/Desktop/Blessme/Somsaijai/Sale report/Feb26/`

## Image Index and Filenames

All 28 images are named sequentially:
1. LINE_ALBUM_ยอดขายกุมภา_260324_1.jpg
2. LINE_ALBUM_ยอดขายกุมภา_260324_2.jpg
3. LINE_ALBUM_ยอดขายกุมภา_260324_3.jpg
4. LINE_ALBUM_ยอดขายกุมภา_260324_4.jpg
5. LINE_ALBUM_ยอดขายกุมภา_260324_5.jpg
6. LINE_ALBUM_ยอดขายกุมภา_260324_6.jpg
7. LINE_ALBUM_ยอดขายกุมภา_260324_7.jpg
8. LINE_ALBUM_ยอดขายกุมภา_260324_8.jpg
9. LINE_ALBUM_ยอดขายกุมภา_260324_9.jpg
10. LINE_ALBUM_ยอดขายกุมภา_260324_10.jpg
11. LINE_ALBUM_ยอดขายกุมภา_260324_11.jpg
12. LINE_ALBUM_ยอดขายกุมภา_260324_12.jpg
13. LINE_ALBUM_ยอดขายกุมภา_260324_13.jpg
14. LINE_ALBUM_ยอดขายกุมภา_260324_14.jpg
15. LINE_ALBUM_ยอดขายกุมภา_260324_15.jpg
16. LINE_ALBUM_ยอดขายกุมภา_260324_16.jpg
17. LINE_ALBUM_ยอดขายกุมภา_260324_17.jpg
18. LINE_ALBUM_ยอดขายกุมภา_260324_18.jpg
19. LINE_ALBUM_ยอดขายกุมภา_260324_19.jpg
20. LINE_ALBUM_ยอดขายกุมภา_260324_20.jpg
21. LINE_ALBUM_ยอดขายกุมภา_260324_21.jpg
22. LINE_ALBUM_ยอดขายกุมภา_260324_22.jpg
23. LINE_ALBUM_ยอดขายกุมภา_260324_23.jpg
24. LINE_ALBUM_ยอดขายกุมภา_260324_24.jpg
25. LINE_ALBUM_ยอดขายกุมภา_260324_25.jpg
26. LINE_ALBUM_ยอดขายกุมภา_260324_26.jpg
27. LINE_ALBUM_ยอดขายกุมภา_260324_27.jpg
28. LINE_ALBUM_ยอดขายกุมภา_260324_28.jpg

## Data Structure for Each Daily Report

### Header Information
- **Date**: Format appears to be DD.MM.YYYY (e.g., 1.2.2026 Sunday)
- **Day of Week**: Sunday through Saturday

### Product Line Data (Each with Cash and Scan/Transfer amounts)

Products tracked in daily reports:
1. Cup(80) - 80 baht orange juice cups
2. Cup(60) - 60 baht orange juice cups
3. Bot(40) - 40 baht small bottles
4. Bot(200) - 200 baht big bottles
5. Cup(100) - 100 baht cups
6. Watermelon(50) - 50 baht watermelon cups
7. Watermelon(60) - 60 baht watermelon cups
8. Cup(50) - 50 baht cups
9. Mango(60) - 60 baht mango cups (may not appear every day)
10. Coconut(60) - 60 baht coconut cups (may not appear every day)

For each product: **Cash amount** and **Scan/Transfer amount**

### Summary Section (Bottom of Each Page)

#### Revenue
- **All →**: Total revenue (sum of all product sales)

#### Cash Collection
- **Cash →**: Total cash received

#### Expenses
- **Ice/expenses →**: Ice and other operating expenses

#### Net Cash
- **Total cash after expenses**: Cash collected minus expenses

#### Electronic Payments
- **Scan →**: Total scan/transfer/digital payments

#### Inventory Summary
- **Cup count**: 
  - Orange → X (number of orange juice cups sold)
  - Watermelon → Y (number of watermelon cups sold)
  - May include Mango → Z
  - **Total cups combined**

- **Bot count**: Number of bottles sold (combined 40 and 200 baht)

#### Materials Used (Bottom Left Corner)
- **Orange →** X (baskets used)
- **Watermelon →** Y (pieces used)
- Other items as listed

## Extraction Requirements

For EACH of the 28 images, extract:

1. ✓ Date (DD.MM.YYYY format)
2. ✓ Day of week (Thai day names may appear - map to Sun/Mon/Tue/Wed/Thu/Fri/Sat)
3. ✓ Each product line: Cash amount + Scan amount
4. ✓ Total revenue (All →)
5. ✓ Total cash
6. ✓ Expenses (ice/other)
7. ✓ Cash after expenses
8. ✓ Total scan/transfer
9. ✓ Cup counts (orange, watermelon, mango separately + total)
10. ✓ Bot counts
11. ✓ Materials used (orange baskets, watermelon pieces)

## Important Notes

- Image numbers (1-28) may NOT correspond to calendar dates
- ALWAYS check the actual date written on each image
- Some products (Mango, Coconut) may not appear on every daily report
- Handwritten amounts need careful reading
- Numbers should be in Thai script or Arabic numerals
- Currency is Thai Baht (฿)

## Status

- ✓ All 28 images located and catalogued
- ✓ File paths confirmed
- ✓ Images ready for analysis
- ⏳ Awaiting detailed OCR/vision analysis of each image
