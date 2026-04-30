const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, '..', '..');
const DATA_JSON = path.join(DASHBOARD_DIR, 'data.json');
const LEDGER_JSON = path.join(DASHBOARD_DIR, 'stock_ledger.json');
const PARAMS_JSON = path.join(__dirname, '..', 'config', 'audit_params.json');

function runAudit() {
  if (!fs.existsSync(DATA_JSON) || !fs.existsSync(LEDGER_JSON) || !fs.existsSync(PARAMS_JSON)) {
    console.error('Missing required files for audit.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_JSON, 'utf8'));
  const ledger = JSON.parse(fs.readFileSync(LEDGER_JSON, 'utf8'));
  const params = JSON.parse(fs.readFileSync(PARAMS_JSON, 'utf8'));

  const allSales = [];
  Object.keys(data.sales).forEach(m => {
    data.sales[m].forEach(r => {
      if (r.d !== 'Date') allSales.push(r);
    });
  });

  // Calculate Theoretical Stock Remaining
  const items = ['orange', 'watermelon', 'apple', 'mango'];
  const stockSummary = {};

  items.forEach(item => {
    const totalIn = ledger.purchases
      .filter(p => p.item === item)
      .reduce((s, p) => s + (p.qty || 0), 0);
    
    let field = '';
    if (item === 'orange') field = 'uo';
    if (item === 'watermelon') field = 'uw';
    if (item === 'apple') field = 'uap';
    if (item === 'mango') field = 'umg';

    const totalUsed = allSales.reduce((s, r) => s + (r[field] || 0), 0);
    const theoreticalRemaining = totalIn - totalUsed;

    // Check last physical check
    const lastCheck = ledger.physical_checks
      .filter(c => c.item === item)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    stockSummary[item] = {
      total_in: totalIn,
      total_used: totalUsed,
      theoretical_remaining: theoreticalRemaining,
      last_physical: lastCheck ? lastCheck.qty : null,
      discrepancy: lastCheck ? (lastCheck.qty - theoreticalRemaining) : 0
    };
  });

  // Daily Revenue Audit
  allSales.forEach(r => {
    const or_100 = r.or_100 || 0;
    const or_60 = Math.max(0, (r.or || 0) - or_100);

    const theoreticalRev = 
      or_60 * params.prices.orange +
      or_100 * params.prices.orange_premium +
      (r.wm || 0) * params.prices.watermelon +
      (r.mg || 0) * params.prices.mango +
      (r.ap || 0) * params.prices.apple +
      (r.co || 0) * params.prices.coconut +
      (r.yco || 0) * params.prices.young;

    const diff = r.rev - theoreticalRev;
    r.audit = {
      theoretical_rev: theoreticalRev,
      rev_diff: diff,
      is_flagged: Math.abs(diff) > params.thresholds.revenue_abs || 
                   (theoreticalRev > 0 && Math.abs(diff/theoreticalRev) > params.thresholds.revenue_pct)
    };
  });

  // Update data.json with audit results
  fs.writeFileSync(DATA_JSON, JSON.stringify(data, null, 2));
  console.log('✅ Audit complete. data.json updated with discrepancies.');
  console.table(stockSummary);
}

runAudit();
