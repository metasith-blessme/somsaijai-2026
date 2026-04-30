const XLSX = require('xlsx');
const path = require('path');

const EXCEL_FILE = 'SomSaiJai_Dashboard_2026.xlsx';
const wb = XLSX.readFile(EXCEL_FILE);
const monthSheets = wb.SheetNames.filter(name => /^[A-Z][a-z][a-z]\d\d$/.test(name));

monthSheets.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Find header row (the one containing 'Date')
    const headerRowIdx = data.findIndex(row => row && row[0] === 'Date');
    if (headerRowIdx === -1) {
        console.log(`Could not find header row for ${sheetName}`);
        return;
    }

    const headers = data[headerRowIdx];
    if (headers && headers[18] === 'Used Coconut') {
        headers.splice(18, 1, 'Used Coco (Meat)', 'Used Coco (Water)', 'Used Coco (Conden)', 'Used Coco (Raw)');
        console.log(`Updated headers for ${sheetName} at row ${headerRowIdx + 1}`);
        
        // Update rows
        for (let i = headerRowIdx + 1; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 10 || ['TOTAL', 'AVG/DAY'].includes(String(row[0]))) continue;
            
            const uap = row[19] || 0;
            const uco = row[18] || 0;
            
            row[18] = uco; // Move old uco to Meat
            row[19] = 0;
            row[20] = 0;
            row[21] = 0;
            row[22] = uap;
        }
        wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);
    } else if (headers && headers[18] === 'Used Coco (Meat)') {
        console.log(`${sheetName} already updated.`);
    } else {
        console.log(`Header[18] for ${sheetName} is: ${headers ? headers[18] : 'undefined'}`);
    }
});

XLSX.writeFile(wb, EXCEL_FILE);
console.log('Successfully updated all Excel sheet structures for 2026');
