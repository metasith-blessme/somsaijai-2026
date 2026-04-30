/**
 * SomSaiJai Central Business Logic
 * Single source of truth for pricing, yields, and revenue calculations.
 */

const PRICES = {
    orange: 60,
    orange_premium: 100,
    watermelon: 50,
    apple: 60,
    mango: 90,
    coconut: 60,
    young: 90,
    guava: 60
};

const YIELDS = {
    orange: 29.3,
    watermelon: 3.5,
    apple: 0.5,
    mango: 0.5
};

// Costs per unit (baskets/pcs) for contribution calculation
const COSTS = {
    orange: 700,
    watermelon: 35,
    apple: 30,
    mango: 150,
    coconut: 35,
    young: 50,
    guava: 30
};

/**
 * Calculates theoretical revenue based on cup counts
 */
function calculateTheoreticalRevenue(r) {
    const or_100 = r.or_100 || 0;
    const or_60 = Math.max(0, (r.or || 0) - or_100);
    
    return (
        or_60 * PRICES.orange +
        or_100 * PRICES.orange_premium +
        (r.wm || 0) * PRICES.watermelon +
        (r.mg || 0) * PRICES.mango +
        (r.ap || 0) * PRICES.apple +
        (r.co || 0) * PRICES.coconut +
        (r.yco || 0) * PRICES.young +
        (r.guava || 0) * PRICES.guava
    );
}

/**
 * Calculates unit economics (contribution margin) for a record
 */
function calculateContribution(r) {
    const revenue = r.rev || 0;
    const variableCosts = 
        (r.uo || 0) * COSTS.orange +
        (r.uw || 0) * COSTS.watermelon +
        (r.uap || 0) * COSTS.apple +
        (r.umg || 0) * COSTS.mango +
        (r.exp || 0); // Include ice/staff as variable ops cost

    return {
        revenue,
        costs: variableCosts,
        margin: revenue - variableCosts,
        margin_pct: revenue > 0 ? ((revenue - variableCosts) / revenue) * 100 : 0
    };
}

module.exports = {
    PRICES,
    YIELDS,
    COSTS,
    calculateTheoreticalRevenue,
    calculateContribution
};
