// Calculator Module - Handles all stat calculations

const Calculator = (function() {
    'use strict';

    // Private constants
    const BLOCK_SIZE = 50;
    const MULTIPLIERS = [
        0.5, 0.8, 1, 1.3, 1.6, 1.8, 2.1, 2.4, 2.6, 2.8, 2.9, 3, 3.1, 3.3, 3.4,
        3.5, 3.9, 4.1, 4.2, 4.3, 5.2, 5.5, 6.6, 6.8, 6.9
    ];

    // Public API
    return {
        /**
         * Calculate stat score based on stat value
         * @param {number} statValue - The stat value to calculate score for
         * @returns {number} - The calculated score
         */
        calculateStatScore(statValue) {
            // Validate input
            if (typeof statValue !== 'number' || isNaN(statValue) || statValue < 0) {
                console.warn(`Invalid stat value: ${statValue}, returning 0`);
                return 0;
            }
            
            statValue = Math.max(0, statValue);

            // Calculate number of full blocks
            const blocks = Math.floor(statValue / BLOCK_SIZE);

            // Calculate total score for full blocks
            let block_sum = 0;
            for (let i = 0; i < blocks && i < MULTIPLIERS.length; i++) {
                block_sum += MULTIPLIERS[i] * BLOCK_SIZE;
            }

            // Calculate remainder points
            const remainder = statValue % BLOCK_SIZE;

            // Calculate score for remainder
            let nextMultiplier;
            if (blocks < MULTIPLIERS.length) {
                nextMultiplier = MULTIPLIERS[blocks];
            } else {
                nextMultiplier = MULTIPLIERS[MULTIPLIERS.length - 1];
            }
            
            const remainder_sum = nextMultiplier * (remainder + 1);
            
            // Calculate total and round down
            const totalScore = Math.floor(block_sum + remainder_sum);

            // Debug logging for high values
            if (statValue > 1200) {
                console.log(`Debug - Stat: ${statValue}, Blocks: ${blocks}, Block Sum: ${block_sum}, Remainder: ${remainder}, Next Multiplier: ${nextMultiplier}, Remainder Sum: ${remainder_sum}, Total: ${totalScore}`);
            }

            return totalScore;
        },

        /**
         * Calculate stat rating based on value
         * @param {number} statValue - The stat value to calculate rating for
         * @returns {string} - The rating (G to SS+, or UG1 to US9)
         */
        calculateStatRating(statValue) {
            // Validate input
            if (typeof statValue !== 'number' || statValue < 1) {
                console.error("Stat must be a number greater than 0");
                return 'G'; 
            }

            // Round down to handle decimals
            statValue = Math.floor(statValue);

            // Handle rank from 1201 to 2000 (UG ~ US9)
            if (statValue >= 1201 && statValue <= 2000) {
                const prefixes = ['UG', 'UF', 'UE', 'UD', 'UC', 'UB', 'UA', 'US'];
                
                const prefixIndex = Math.floor((statValue - 1201) / 100);
                const prefix = prefixes[prefixIndex];

                const lastTwoDigits = statValue % 100 || 100;
                const suffix = Math.min(9, Math.ceil(lastTwoDigits / 10));

                return `${prefix}${suffix}`;
            }

            // Handle rank from 1 to 1200 (G ~ SS+)
            if (statValue >= 1 && statValue <= 1200) {
                if (statValue >= 1150) return 'SS⁺';
                if (statValue >= 1100) return 'SS';
                if (statValue >= 1050) return 'S⁺';
                if (statValue >= 1000) return 'S';
                if (statValue >= 900) return 'A⁺';
                if (statValue >= 800) return 'A';
                if (statValue >= 700) return 'B⁺';
                if (statValue >= 600) return 'B';
                if (statValue >= 500) return 'C⁺';
                if (statValue >= 400) return 'C';
                if (statValue >= 350) return 'D⁺';
                if (statValue >= 300) return 'D';
                if (statValue >= 250) return 'E⁺';
                if (statValue >= 200) return 'E';
                if (statValue >= 150) return 'F⁺';
                if (statValue >= 100) return 'F';
                if (statValue >= 51) return 'G⁺';
                if (statValue >= 1) return 'G';
            }

            return 'G';
        }
    };
})();

// Make available globally
window.Calculator = Calculator;
