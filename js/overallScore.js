// Overall Score Module - Handles overall score and rating calculation

const OverallScore = (function() {
    'use strict';

    // Private constants - Rating thresholds
    const RATING_THRESHOLDS = [
        { min: 19200, rating: 'SS+', next: null },
        { min: 17500, rating: 'SS', next: 'SS+' },
        { min: 15900, rating: 'S+', next: 'SS' },
        { min: 14500, rating: 'S', next: 'S+' },
        { min: 12100, rating: 'A+', next: 'S' },
        { min: 10000, rating: 'A', next: 'A+' },
        { min: 8200, rating: 'B+', next: 'A' },
        { min: 6500, rating: 'B', next: 'B+' },
        { min: 4900, rating: 'C+', next: 'B' },
        { min: 3500, rating: 'C', next: 'C+' },
        { min: 2900, rating: 'D+', next: 'C' },
        { min: 2300, rating: 'D', next: 'D+' },
        { min: 1800, rating: 'E+', next: 'D' },
        { min: 1300, rating: 'E', next: 'E+' },
        { min: 900, rating: 'F+', next: 'E' },
        { min: 600, rating: 'F', next: 'F+' },
        { min: 300, rating: 'G+', next: 'F' },
        { min: 0, rating: 'G', next: 'G+' }
    ];

    // Public API
    return {
        /**
         * Update overall score calculation
         * @returns {number} - The calculated overall score
         */
        updateOverallScore() {
            console.log('=== UPDATING OVERALL SCORE ===');
            
            // Get Total Stats Score from div2
            const totalStatsElement = document.getElementById('total-stats-score');
            const totalStatsScore = totalStatsElement ? 
                parseInt(totalStatsElement.textContent) || 0 : 0;
            
            // Get Skill Score from div3
            const skillScoreElement = document.getElementById('total-score');
            const skillScore = skillScoreElement ? 
                parseInt(skillScoreElement.value) || 0 : 0;
            
            // Get Unique Skill Score from div6
            const uniqueSkillElement = document.getElementById('unique-skill-score');
            const uniqueSkillScore = uniqueSkillElement ? 
                parseInt(uniqueSkillElement.textContent) || 0 : 0;
            
            // Calculate Overall Score
            const overallScore = totalStatsScore + skillScore + uniqueSkillScore;
            
            console.log(`Total Stats Score: ${totalStatsScore}`);
            console.log(`Skill Score: ${skillScore}`);
            console.log(`Unique Skill Score: ${uniqueSkillScore}`);
            console.log(`Overall Score: ${overallScore}`);
            
            // Update Overall Score display in div8
            const overallElement = document.querySelector('.div8 .summary-container .summary-row .total-value');
            if (overallElement) {
                overallElement.textContent = overallScore.toString();
                console.log(`Updated Overall Score display to: ${overallElement.textContent}`);
            } else {
                console.error('Overall score element not found in div8!');
            }
            
            // Calculate and update rating based on overall score
            this.updateOverallRating(overallScore);
            
            return overallScore;
        },

        /**
         * Calculate and update rating based on overall score
         * @param {number} overallScore - The overall score
         */
        updateOverallRating(overallScore) {
            let rating = 'G';
            let nextRating = '';
            let nextThreshold = 0;
            
            // Find current rating and next threshold
            for (const threshold of RATING_THRESHOLDS) {
                if (overallScore >= threshold.min) {
                    rating = threshold.rating;
                    nextRating = threshold.next;
                    // Find next threshold value
                    if (nextRating) {
                        const nextThresholdData = RATING_THRESHOLDS.find(t => t.rating === nextRating);
                        if (nextThresholdData) {
                            nextThreshold = nextThresholdData.min;
                        }
                    }
                    break;
                }
            }
            
            // Update rating display in div8
            const ratingElement = document.querySelector('.div8 .summary-container .summary-row .rating-value');
            if (ratingElement) {
                ratingElement.textContent = rating;
                console.log(`Updated Overall Rating to: ${rating}`);
            } else {
                console.error('Rating element not found in div8!');
            }
            
            // Update next rank display
            const nextElement = document.querySelector('.div8 .summary-container .summary-row .next-value');
            if (nextElement) {
                if (rating === 'SS+') {
                    nextElement.textContent = 'MAX';
                } else {
                    const pointsNeeded = nextThreshold - overallScore;
                    nextElement.textContent = pointsNeeded > 0 ? pointsNeeded.toString() : '0';
                }
                console.log(`Updated Next to: ${nextElement.textContent}`);
            } else {
                console.error('Next element not found in div8!');
            }
        }
    };
})();

// Make available globally
window.OverallScore = OverallScore;
