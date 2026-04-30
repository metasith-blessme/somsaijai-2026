const fs = require('fs');
const path = require('path');

const LEDGER_JSON = path.join(__dirname, '..', '..', 'stock_ledger.json');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node stock_in.js [item] [qty]');
  console.log('Items: orange, watermelon, apple, mango, cups');
  process.exit(1);
}

const item = args[0];
const qty = parseFloat(args[1]);

if (!fs.existsSync(LEDGER_JSON)) {
  fs.writeFileSync(LEDGER_JSON, JSON.stringify({ purchases: [], physical_checks: [] }, null, 2));
}

const ledger = JSON.parse(fs.readFileSync(LEDGER_JSON, 'utf8'));
ledger.purchases.push({
  date: new Date().toISOString().split('T')[0],
  item,
  qty
});

fs.writeFileSync(LEDGER_JSON, JSON.stringify(ledger, null, 2));
console.log(`✅ Recorded purchase: ${qty} ${item}`);
