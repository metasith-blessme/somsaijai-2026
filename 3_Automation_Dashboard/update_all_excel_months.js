const XLSX = require('xlsx');
const path = require('path');

const EXCEL_FILE = 'SomSaiJai_Dashboard_2026.xlsx';
const wb = XLSX.readFile(EXCEL_FILE);
const monthSheets = ['Jan26', 'Feb26', 'Mar26', 'Apr26', 'May26', 'Jun26', 'Jul26', 'Aug26', 'Sep26', 'Oct26', 'Nov26', 'Dec26'];

monthSheets.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    if (!ws) return;
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Headers are at data[1]
    const headers = data[1];
    if (headers && headers[18] === 'Used Coconut') {
        headers.splice(18, 1, 'Used Coco (Meat)', 'Used Coco (Water)', 'Used Coco (Conden)', 'Used Coco (Raw)');
        console.log(`Updated headers for ${sheetName}`);
        
        // Update rows
        for (let i = 2; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 10 || ['TOTAL', 'AVG/DAY'].includes(row[0])) continue;
            
            const uap = row[19] || 0;
            const uco = row[18] || 0; // Old single value
            
            row[18] = uco; // For Jan-Mar, put the old value in the first field (Meat)
            row[19] = 0;
            row[20] = 0;
            row[21] = 0;
            row[22] = uap;
        }
        wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
    }
});

XLSX.writeFile(wb, EXCEL_FILE);
console.log('Successfully updated all Excel sheet structures for 2026');
