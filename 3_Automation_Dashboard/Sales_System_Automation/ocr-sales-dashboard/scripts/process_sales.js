const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- FUZZY MATCHING HELPERS ---
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}

function fuzzyMatch(text, target, threshold = 2) {
    const words = text.split(/[\s\n→=:-]+/);
    for (let word of words) {
        if (levenshtein(word.toLowerCase(), target.toLowerCase()) <= threshold) return true;
    }
    return false;
}

const MONTH = process.argv[2] || 'Apr26';
const BRANCH = process.argv[3] || 'B1'; // NEW: Branch parameter

const ROOT_DIR = path.join(__dirname, '..', '..', '..', '..');
const DASHBOARD_DIR = path.join(ROOT_DIR, '3_Automation_Dashboard');
const SALES_DIR = path.join(ROOT_DIR, BRANCH, '1_Sale', MONTH); // Updated path
const STAGING_FILE = path.join(DASHBOARD_DIR, 'pending_verification.json');
const OCR_BIN = path.join(DASHBOARD_DIR, 'ocr_bin');

function parseDate(text) {
    const match = text.match(/(\d{1,2})\.(\d{1,2})\.([0-2]\d{3})/);
    if (!match) return null;
    let year = match[3];
    if (year === '0026' || year === '20€6') year = '2026';
    return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${year}`;
}

function parseDay(text) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let d of days) {
        if (text.includes(d) || fuzzyMatch(text, d, 2)) return d.substring(0, 3);
    }
    return '';
}

function parseField(text, patterns, fuzzyTarget = null) {
    for (let p of patterns) {
        const matches = [...text.matchAll(p)];
        if (matches.length > 0) {
            return parseFloat(matches[matches.length - 1][1].replace(/,/g, ''));
        }
    }
    if (fuzzyTarget) {
        const lines = text.split('\n');
        for (let line of lines) {
            if (fuzzyMatch(line, fuzzyTarget, 2)) {
                const numMatch = line.match(/(\d+)/);
                if (numMatch) return parseFloat(numMatch[1]);
            }
        }
    }
    return 0;
}

function parseFraction(text) {
    if (!text) return 0;
    const parts = text.trim().split(/\s+/);
    let total = 0;
    for (let p of parts) {
        if (p.includes('/')) {
            const [num, den] = p.split('/');
            total += parseFloat(num) / parseFloat(den);
        } else {
            total += parseFloat(p);
        }
    }
    return total;
}

const allSales = [];
if (!fs.existsSync(SALES_DIR)) {
    console.error(`Directory not found: ${SALES_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(SALES_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
console.log(`🔍 Scanning ${files.length} images for ${BRANCH} in ${MONTH}...`);

files.forEach(file => {
    const filePath = path.join(SALES_DIR, file);
    try {
        const out = execSync(`"${OCR_BIN}" "${filePath}"`, { encoding: 'utf8' });
        const date = parseDate(out);
        const day = parseDay(out);
        
        const rev = parseField(out, [/All\s*[→=]\s*(\d+)/gi, /All\s*->\s*(\d+)/gi], 'All');
        const cash = parseField(out, [/cash\s*[→=]\s*(\d+)/gi, /cask\s*[→=]\s*(\d+)/gi], 'cash');
        const scan = parseField(out, [/Scan\s*[→=]\s*(\d+)/gi, /Soan\s*[→=]\s*(\d+)/gi], 'Scan');
        const exp = parseField(out, [/Staff\s*[→=]\s*(\d+)/gi, /Stalf\s*[→=]\s*(\d+)/gi], 'Staff');
        
        const parts = out.split(/Cup|Cap/i);
        const productText = parts.length > 1 ? parts[parts.length - 1] : out;

        const orMatch = productText.match(/Ora\w*[^\d\n]*\n?(\d+)/i) || (fuzzyMatch(productText, 'Orange') && productText.match(/(\d+)/));
        const or = orMatch ? parseInt(orMatch[1]) : 0;

        const wmMatch = productText.match(/Water\w*[^\d\n]*\n?(\d+)/i);
        const wm = wmMatch ? parseInt(wmMatch[1]) : 0;

        const mgMatch = productText.match(/Mango[^\d\n]*\n?(\d+)/i);
        const mg = mgMatch ? parseInt(mgMatch[1]) : 0;

        const coMatch = productText.match(/Coco\w*[^\d\n]*\n?(\d+)/i);
        const co = coMatch ? parseInt(coMatch[1]) : 0;

        const apMatch = productText.match(/Apple[^\d\n]*\n?(\d+)/i);
        const ap = apMatch ? parseInt(apMatch[1]) : 0;

        const totMatch = productText.match(/\((\d{2,3})\)/);
        const tot = totMatch ? parseInt(totMatch[1]) : (or + wm + mg + co + ap);

        const bottomParts = out.split(/Orange\s*[→=]/i);
        const fruitsText = bottomParts.length > 1 ? 'Orange →' + bottomParts[bottomParts.length - 1] : out;

        const uoMatch = fruitsText.match(/Orange\s*[→=]\s*(?:®\s*)?([\d\s./]+)/i) || fruitsText.match(/Orange\s*[→=]\s*\(?([\d\s./]+)\)?/i);
        const uo = uoMatch ? parseFraction(uoMatch[1]) : 0;
        
        const uwMatch = fruitsText.match(/Water\w*\s*[→=]\s*(\d+)/i) || fruitsText.match(/Water\w*\s*[→=]\s*\(?(\d+)\)?/i);
        const uw = uwMatch ? parseFloat(uwMatch[1]) : 0;

        const umgMatch = fruitsText.match(/Mang\w*\s*[→=]\s*(\d+)/i) || fruitsText.match(/Marg\w*\s*[→=]\s*(\d+)/i);
        const umg = umgMatch ? parseFloat(umgMatch[1]) : 0;

        const ucoMatch = fruitsText.match(/Coco\w*\s*[→=]\s*(\d+)/i) || fruitsText.match(/Cocon\w*\s*[→=]\s*(\d+)/i);
        const uco = ucoMatch ? parseFloat(ucoMatch[1]) : 0;

        const uapMatch = fruitsText.match(/Apple\s*[→=]\s*(\d+)/i) || fruitsText.match(/Ap\w*le\s*[→=]\s*(\d+)/i);
        const uap = uapMatch ? parseFloat(uapMatch[1]) : 0;

        if (date) {
            allSales.push({
                date, day, rev, cash, exp, scan,
                or, wm, mg, co, ap,
                tot, uo, uw, umg, uco, uap,
                branch: BRANCH, // Tag branch
                source: file,
                verified: false
            });
        }
    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

const uniqueMap = new Map();
allSales.forEach(s => {
    const key = `${BRANCH}_${s.date}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, s);
});
const finalSales = Array.from(uniqueMap.values()).sort((a, b) => {
    const da = a.date.split('/').reverse().join('');
    const db = b.date.split('/').reverse().join('');
    return da.localeCompare(db);
});

let stagingData = [];
if (fs.existsSync(STAGING_FILE)) {
    try { stagingData = JSON.parse(fs.readFileSync(STAGING_FILE, 'utf8')); } catch(e) {}
}

finalSales.forEach(newRec => {
    const idx = stagingData.findIndex(r => r.date === newRec.date && r.branch === newRec.branch);
    if (idx === -1) {
        stagingData.push(newRec);
    } else if (!stagingData[idx].verified) {
        stagingData[idx] = newRec;
    }
});

fs.writeFileSync(STAGING_FILE, JSON.stringify(stagingData, null, 2));

console.log(`\n✅ [${BRANCH}] Staging Layer Updated: ${STAGING_FILE}`);
console.log(`📊 Extracted ${finalSales.length} records. Please review them before running 'node verify_sales.js'.`);
