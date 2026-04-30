const XLSX = require('xlsx');
const path = require('path');

const EXCEL_FILE = 'SomSaiJai_Dashboard_2026.xlsx';
const wb = XLSX.readFile(EXCEL_FILE);
const sheetName = 'Apr26';
const ws = wb.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Headers are at data[1]
// [..., 'Used Orange (basket)', 'Used Watermelon (pcs)', 'Used Mango', 'Used Coconut', 'Used Apple']
// Indices: 15, 16, 17, 18, 19

const headers = data[1];
if (headers[18] === 'Used Coconut') {
    headers.splice(18, 1, 'Used Coco (Meat)', 'Used Coco (Water)', 'Used Coco (Conden)', 'Used Coco (Raw)');
    console.log('Updated headers for Apr26');
}

// Update rows to accommodate new columns
for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 10 || ['TOTAL', 'AVG/DAY'].includes(row[0])) continue;
    
    // Move 'Used Apple' from index 19 to index 22
    const uap = row[19] || 0;
    const uco = row[18] || 0; // Old single value
    
    row[18] = 0; // Meat
    row[19] = 0; // Water
    row[20] = 0; // Conden
    row[21] = 0; // Raw
    row[22] = uap; // Apple
}

wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
XLSX.writeFile(wb, EXCEL_FILE);
console.log('Successfully updated Excel structure for Apr26');
