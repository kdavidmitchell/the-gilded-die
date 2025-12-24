// src/utils.js
const logger = require('./logger');

function rollDice(numDice = 5, sides = 6) {
    return Array.from({ length: numDice }, () => Math.floor(Math.random() * sides) + 1);
}

function calculateRollScore(dice, sides = 6) {
    // 1. Calculate Tribute (Sum of Dice)
    const tribute = dice.reduce((a, b) => a + b, 0);

    // 2. Analyze Matches & Crits
    const counts = {};
    let maxDieCount = 0; // "Crit" tracker

    dice.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
        if (val === sides) maxDieCount++;
    });

    // 3. Calculate Favor
    let favor = 0;
    
    // A. "Crit" Bonus: 1 Favor per Max Value rolled
    favor += maxDieCount;

    // B. Match Bonus
    // Award favor for Pairs (2), Triples (3), Quads (4), Yahtzees (5)
    // Add a FLAT BONUS based on die size to compensate for lower match probability.
    Object.values(counts).forEach(count => {
        if (count >= 2) {
            // Base Match Value
            let matchValue = 0;
            if (count === 2) matchValue = 1;
            else if (count === 3) matchValue = 3;
            else if (count === 4) matchValue = 6;
            else if (count === 5) matchValue = 10;

            // Tier Scaling
            // d6 = +0
            // d8 = +1
            // d10 = +2
            // d12+ = +3
            let tierBonus = 0;
            if (sides >= 8) tierBonus = 1;
            if (sides >= 10) tierBonus = 2;
            if (sides >= 12) tierBonus = 3;

            favor += (matchValue + tierBonus);
        }
    });

    // 4. Bust Check
    const hasMatch = Object.values(counts).some(c => c >= 2);
    const isBust = !hasMatch;

    return {
        score: tribute,
        favor: favor,
        isBust: isBust,
        matchCount: hasMatch ? 1 : 0 
    };
}

function displayBanner(text) {
    const bannerWidth = text.length + 4;
    const border = '#'.repeat(bannerWidth);
    logger.log(`\n${border}`);
    logger.log(`| ${text} |`);
    logger.log(`${border}`);
}

function selectCorruptedPrize(prizeList) {
    const weightedPool = [];

    // Add every prize to the pool once.
    prizeList.forEach(prize => {
        weightedPool.push(prize);
        // If it's a favorite, add it to the pool a SECOND time, doubling its chance.
        if (prize.isFiendsFavorite) {
            weightedPool.push(prize);
        }
    });

    // Select a random item from the new, weighted pool.
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
}

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    rollDice,
    calculateRollScore,
    displayBanner,
    selectCorruptedPrize,
    pause
};