import { units } from './units.js';

// State management
const state = {
    levels: {}
};

// Define Max Levels based on Tiers
const getMaxLevel = (id) => {
    if (id <= 10) return 100;
    if ((id >= 11 && id <= 20) || (id >= 29 && id <= 37)) return 200;
    if ((id >= 21 && id <= 25) || (id >= 38 && id <= 45)) return 400;
    return 800; // 4성, 5성
};

// --- Material Cost Calculation ---
const unitMap = {};
units.forEach(u => unitMap[u.id] = u);

const memoCost = {};
const getMaterialCost = (unitId) => {
    if (memoCost[unitId]) return memoCost[unitId];
    
    const unit = unitMap[unitId];
    const recipe = unit.recipe || {};
    const ingredientIds = Object.keys(recipe);
    
    if (ingredientIds.length === 0) {
        // Base units (Tier 1) have a cost of 1
        return memoCost[unitId] = 1;
    }
    
    let total = 0;
    for (const [id, count] of Object.entries(recipe)) {
        total += getMaterialCost(parseInt(id)) * count;
    }
    return memoCost[unitId] = total;
};

// Initialize state with level 1 for all units
units.forEach(unit => {
    state.levels[unit.id] = 1; 
});

const FORMULAS = {
    // Upgrade Cost = Material Cost (Sum of all ingredients)
    // We assume each level-up step requires the "combination" effort.
    getCost: (unit) => {
        return getMaterialCost(unit.id);
    },
    
    // Damage = BaseDamage * (Growth ^ (Level - 1))
    getCurrentDamage: (unit, level) => {
        if (level <= 0) return 0;
        return unit.baseDamage * Math.pow(unit.growth, level - 1);
    },

    // Trait = BaseValue * (TraitGrowth ^ Math.floor((Level - 1) / 5))
    getTraitValue: (trait, level) => {
        if (level <= 0) return 0;
        const growthCount = Math.floor((level - 1) / 5);
        return trait.base * Math.pow(trait.growth, growthCount);
    },

    getDps: (unit, level) => {
        const dmg = FORMULAS.getCurrentDamage(unit, level);
        if (dmg === 0) return 0;
        return dmg / unit.period;
    }
};

function render() {
    const listContainer = document.getElementById('unit-list');
    listContainer.innerHTML = '';

    let totalDps = 0;
    let bestUnit = null;
    let bestEfficiency = -1;

    units.forEach(unit => {
        const level = state.levels[unit.id];
        const materialCost = FORMULAS.getCost(unit);
        const maxLevel = getMaxLevel(unit.id);
        
        let efficiency = 0;
        if (level < maxLevel) {
            const currentDps = FORMULAS.getDps(unit, level);
            const nextDps = FORMULAS.getDps(unit, level + 1);
            // Efficiency = DPS Gain per ingredient unit
            efficiency = materialCost > 0 ? (nextDps - currentDps) / materialCost : 0;
            
            if (efficiency > bestEfficiency) {
                bestEfficiency = efficiency;
                bestUnit = unit;
            }
        }

        const dps = FORMULAS.getDps(unit, level);
        totalDps += dps;

        const row = document.createElement('div');
        row.className = 'unit-row';
        
        const traitInfo = unit.traits.map(t => {
            const val = FORMULAS.getTraitValue(t, level);
            return `<div class="trait-small">${t.name}: ${val.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>`;
        }).join('');

        row.innerHTML = `
            <div class="unit-info">
                <div class="unit-name">${unit.name}</div>
                <div class="unit-traits">${traitInfo}</div>
            </div>
            <div class="unit-input">
                <input type="number" value="${level}" min="0" max="${maxLevel}" data-id="${unit.id}">
                <span class="max-level">/ ${maxLevel}</span>
            </div>
            <div class="unit-cost">${materialCost.toLocaleString()} (재료)</div>
            <div class="unit-efficiency">${dps.toLocaleString(undefined, {maximumFractionDigits: 1})}</div>
        `;
        listContainer.appendChild(row);
    });

    document.getElementById('total-dps').textContent = totalDps.toLocaleString(undefined, {maximumFractionDigits: 0});
    
    // Update Recommendation Board
    const recommendEl = document.getElementById('recommended-upgrade');
    if (bestUnit) {
        recommendEl.textContent = `${bestUnit.name} (LV.${state.levels[bestUnit.id]} -> ${state.levels[bestUnit.id] + 1})`;
    } else {
        recommendEl.textContent = "모두 만렙입니다!";
    }
}

// Event Listeners
document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
        const id = parseInt(e.target.dataset.id);
        const maxLevel = getMaxLevel(id);
        let val = parseInt(e.target.value);
        
        if (!isNaN(val)) {
            if (val > maxLevel) val = maxLevel;
            if (val < 0) val = 0;
            e.target.value = val;
            state.levels[id] = val;
            render();
        }
    }
});

render();
