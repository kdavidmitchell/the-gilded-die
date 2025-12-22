const logger = require('./logger');

function rollDice(numDice = 5, sides = 6) {
    return Array.from({ length: numDice }, () => Math.floor(Math.random() * sides) + 1);
}

function calculateRollScore(dice, sides = 6) {
    const counts = {};
    dice.forEach(num => counts[num] = (counts[num] || 0) + 1);
    
    let score = 0;
    let hasScoringSet = false;
    const countValues = Object.values(counts);

    if (countValues.length === 2 && countValues.includes(3) && countValues.includes(2)) {
        score += 25;
    }

    let hasBonus = false;
    
    for (let i = sides; i >= 2; i--) {
        const count = counts[i] || 0;
        if (count >= 3 && !hasBonus) {
            hasBonus = true;
            if (count === 5) score += 200;
            else if (count === 4) score += 100;
            else if (count === 3) score += 50;
        }
        if (count >= 2) {
            score += count * i;
            hasScoringSet = true;
        }
    }

    if (!hasScoringSet) return { score: 0, isBust: true };
    
    const onesCount = counts[1] || 0;
    score -= onesCount;
    return { score: Math.max(0, score), isBust: false };
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