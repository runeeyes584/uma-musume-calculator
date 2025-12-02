// Star Rating Module - Handles star rating functionality

const StarRating = (function() {
    'use strict';

    // Private variables
    let currentRating = 3; // Default rating

    // Public API
    return {
        /**
         * Initialize star rating functionality
         */
        initialize() {
            const stars = document.querySelectorAll('.star');
            const starContainer = document.querySelector('.star-rating');
            
            // Set initial rating
            this.updateStarDisplay(currentRating);
            
            stars.forEach((star, index) => {
                const rating = index + 1;
                
                // Hover effect
                star.addEventListener('mouseenter', () => {
                    this.updateStarDisplay(rating, true);
                });
                
                // Click to set rating
                star.addEventListener('click', () => {
                    this.handleStarRatingChange(rating);
                    
                    // Force immediate update of unique skill score
                    setTimeout(() => {
                        if (window.UniqueSkill && window.UniqueSkill.updateUniqueSkillScore) {
                            window.UniqueSkill.updateUniqueSkillScore();
                        }
                    }, 10);
                    
                    // Add click animation
                    star.classList.add('star-clicked');
                    setTimeout(() => {
                        star.classList.remove('star-clicked');
                    }, 200);
                });
            });
            
            // Reset to current rating when mouse leaves container
            if (starContainer) {
                starContainer.addEventListener('mouseleave', () => {
                    this.updateStarDisplay(currentRating);
                });
            }
        },

        /**
         * Update star display
         * @param {number} rating - Rating to display
         * @param {boolean} isHover - Whether this is a hover state
         */
        updateStarDisplay(rating, isHover = false) {
            const stars = document.querySelectorAll('.star');
            stars.forEach((star, index) => {
                const starRating = index + 1;
                star.classList.remove('active', 'hover');
                
                if (starRating <= rating) {
                    if (isHover) {
                        star.classList.add('hover');
                    } else {
                        star.classList.add('active');
                    }
                }
            });
        },

        /**
         * Set star rating programmatically
         * @param {number} rating - Rating to set
         */
        setStarRating(rating) {
            currentRating = rating;
            this.updateStarDisplay(currentRating);
            
            // Trigger skill update when star rating changes
            const currentCharacter = window.DataManager.getCurrentCharacter();
            if (currentCharacter && window.UniqueSkill) {
                window.UniqueSkill.updateUniqueSkillFromCharacter();
            }
            
            // Update unique skill score when star rating changes programmatically
            if (window.UniqueSkill && window.UniqueSkill.updateUniqueSkillScore) {
                window.UniqueSkill.updateUniqueSkillScore();
            }
        },

        /**
         * Handle manual star rating changes
         * @param {number} newRating - New rating
         */
        handleStarRatingChange(newRating) {
            currentRating = newRating;
            this.updateStarDisplay(currentRating);
            
            // Update skill info based on new star rating
            const currentCharacter = window.DataManager.getCurrentCharacter();
            if (currentCharacter && window.UniqueSkill) {
                window.UniqueSkill.updateUniqueSkillFromCharacter();
            }
            
            // Update unique skill score when star rating changes
            if (window.UniqueSkill && window.UniqueSkill.updateUniqueSkillScore) {
                window.UniqueSkill.updateUniqueSkillScore();
            }
        },

        /**
         * Get current star rating
         * @returns {number} - Current rating
         */
        getCurrentStarRating() {
            return currentRating;
        },

        /**
         * Update star rating from character data
         */
        updateStarRatingFromCharacter() {
            const currentCharacter = window.DataManager.getCurrentCharacter();
            if (!currentCharacter) return;
            
            const defaultStar = currentCharacter.default_star || 1;
            console.log(`Setting star rating to: ${defaultStar}`);
            
            this.setStarRating(defaultStar);
        }
    };
})();

// Make available globally
window.StarRating = StarRating;
