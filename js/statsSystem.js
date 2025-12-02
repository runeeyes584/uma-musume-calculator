// Stats System Module - Handles stats input and total stats calculation

const StatsSystem = (function() {
    'use strict';

    // Public API
    return {
        /**
         * Initialize stats system
         */
        initialize() {
            const statInputs = document.querySelectorAll('.stat-input');
            
            statInputs.forEach(input => {
                // Add event listener for real-time calculation
                input.addEventListener('input', () => {
                    this.updateStatDisplay(input);
                });
                
                // Initialize with current values
                this.updateStatDisplay(input);
            });
            
            // Wait for all individual updates to complete, then calculate total
            setTimeout(() => {
                this.updateTotalStatsScore();
            }, 50);
            
            // Force initial calculation of total stats score
            setTimeout(() => {
                console.log('=== FORCE UPDATE TOTAL STATS ===');
                this.updateTotalStatsScore();
            }, 100);
            
            // Also force update when all stats are initialized
            setTimeout(() => {
                console.log('=== SECOND FORCE UPDATE TOTAL STATS ===');
                this.updateTotalStatsScore();
            }, 500);
        },

        /**
         * Update stat display (rating and score)
         * @param {HTMLElement} input - The stat input element
         */
        updateStatDisplay(input) {
            const statRow = input.closest('.stat-row');
            const ratingElement = statRow.querySelector('.rating');
            const scoreElement = statRow.querySelector('.score');
            
            const statValue = parseInt(input.value) || 0;
            
            // Calculate and update rating
            const rating = window.Calculator.calculateStatRating(statValue);
            ratingElement.textContent = rating;
            
            // Calculate and update score
            const score = window.Calculator.calculateStatScore(statValue);
            scoreElement.textContent = score;
            
            // Update total stats score
            this.updateTotalStatsScore();
        },

        /**
         * Update total stats score
         */
        updateTotalStatsScore() {
            // Ensure we select all 5 stat row score elements from div2 only
            const scoreElements = document.querySelectorAll('.div2 .stats-container .stat-row .score');
            const totalStatsElement = document.getElementById('total-stats-score');
            let totalStatsScore = 0;
            
            console.log('=== DEBUG: updateTotalStatsScore ===');
            console.log('Found score elements:', scoreElements.length);
            
            // Calculate total of all 5 stat scores
            scoreElements.forEach((scoreElement, index) => {
                const scoreText = scoreElement.textContent.trim();
                const scoreValue = parseInt(scoreText.replace(/,/g, '')) || 0;
                console.log(`Stat ${index + 1}: "${scoreText}" → ${scoreValue}`);
                totalStatsScore += scoreValue;
            });
            
            console.log('Total Stats Score calculated:', totalStatsScore);
            
            // Update the display element
            if (totalStatsElement) {
                totalStatsElement.textContent = totalStatsScore.toString();
                console.log('Updated Total Stats Score display to:', totalStatsElement.textContent);
            } else {
                console.error('Total stats score element not found!');
            }
            
            // Update overall score when stats change
            if (window.OverallScore && window.OverallScore.updateOverallScore) {
                window.OverallScore.updateOverallScore();
            }
        }
    };
})();

// Make available globally
window.StatsSystem = StatsSystem;
