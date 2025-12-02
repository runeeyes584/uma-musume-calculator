// Unique Skill Module - Handles unique skill functionality and score calculation

const UniqueSkill = (function() {
    'use strict';

    // Public API
    return {
        /**
         * Calculate unique skill score based on star level and skill level
         * @param {number} starLevel - Star level (1-5)
         * @param {number} skillLevel - Skill level (1-6)
         * @returns {number} - Calculated score
         */
        getUniqueSkillScore(starLevel, skillLevel) {
            if (starLevel <= 2) {
                return skillLevel * 120;
            } else { // starLevel >= 3
                return skillLevel * 170;
            }
        },

        /**
         * Initialize unique skill dropdown
         */
        initialize() {
            const uniqueLevelSelect = document.getElementById('unique-level');
            
            if (uniqueLevelSelect) {
                uniqueLevelSelect.addEventListener('change', () => {
                    console.log('Unique skill level changed to:', uniqueLevelSelect.value);
                    // Force immediate update
                    setTimeout(() => {
                        this.updateUniqueSkillScore();
                    }, 1);
                });
            }
            
            // Initial calculation with delay to ensure star rating is initialized
            setTimeout(() => {
                this.updateUniqueSkillScore();
            }, 100);
        },

        /**
         * Update unique skill score display
         * @returns {number} - The calculated score
         */
        updateUniqueSkillScore() {
            const uniqueLevelSelect = document.getElementById('unique-level');
            const uniqueScoreDisplay = document.getElementById('unique-skill-score');
            
            const skillLevel = parseInt(uniqueLevelSelect?.value) || 1;
            
            // Get current star rating safely
            let starLevel = 3; // default
            if (window.StarRating) {
                starLevel = window.StarRating.getCurrentStarRating();
            } else {
                // Try to get from DOM if StarRating not available
                const activeStars = document.querySelectorAll('.star.active');
                if (activeStars.length > 0) {
                    starLevel = activeStars.length;
                }
            }
            
            const score = this.getUniqueSkillScore(starLevel, skillLevel);
            
            if (uniqueScoreDisplay) {
                uniqueScoreDisplay.textContent = score;
            }
            
            console.log(`Unique Skill - Stars: ${starLevel}, Level: ${skillLevel}, Score: ${score} [Updated at ${new Date().toLocaleTimeString()}]`);
            
            // Update overall score when unique skill changes
            if (window.OverallScore && window.OverallScore.updateOverallScore) {
                window.OverallScore.updateOverallScore();
            }
            
            return score;
        },

        /**
         * Update unique skill info based on character
         */
        updateUniqueSkillFromCharacter() {
            const currentUma = window.DataManager.getCurrentUma();
            if (!currentUma) {
                this.clearSkillDisplay();
                this.clearConditionEffectDisplay();
                return;
            }
            
            console.log(`Current Uma:`, currentUma);
            
            // Get unique skills from uma_musume.json
            const uniqueSkills = currentUma.unique_skills || [];
            const description = currentUma.description || '';
            const condition = currentUma.condition || '';
            const effect = currentUma.effect || '';
            const imgSkill = currentUma.img_skill || '';
            
            if (uniqueSkills.length > 0) {
                // Show first unique skill (or could cycle based on star rating)
                const skillName = uniqueSkills[0];
                console.log(`Displaying unique skill: ${skillName}`);
                this.updateSkillDisplay({
                    name: skillName,
                    description: description,
                    imgSkill: imgSkill
                });
                
                // Update condition and effect display
                this.updateConditionEffectDisplay({
                    condition: condition,
                    effect: effect
                });
            } else {
                console.log(`No unique skills found for ${currentUma.name}`);
                this.clearSkillDisplay();
                this.clearConditionEffectDisplay();
            }
        },

        /**
         * Find skill by star rating
         * @param {number} starRating - Star rating
         * @returns {Object|null} - Skill object or null
         */
        findSkillByStarRating(starRating) {
            const currentCharacter = window.DataManager.getCurrentCharacter();
            if (!currentCharacter || !currentCharacter.skills) return null;
            
            // Define rarity mapping
            const rarityMap = {
                1: "1-2 star",
                2: "1-2 star", 
                3: "3 star",
                4: "3 star",
                5: "3 star"
            };
            
            const targetRarity = rarityMap[starRating];
            
            // Find skill with matching rarity
            return currentCharacter.skills.find(skill => 
                skill.rarity === targetRarity || 
                skill.rarity === `${starRating} star` ||
                skill.rarity === `${starRating}-star`
            );
        },

        /**
         * Update skill display
         * @param {Object} skill - Skill object with name, description, and imgSkill
         */
        updateSkillDisplay(skill) {
            // Update skill name
            const skillName = document.querySelector('.skill-name');
            if (skillName) {
                skillName.textContent = skill.name;
            }
            
            // Update skill description
            const skillDesc = document.querySelector('.skill-desc-text');
            if (skillDesc) {
                skillDesc.textContent = skill.description;
            }
            
            // Update skill icon image
            const skillIcon = document.getElementById('unique-skill-img');
            if (skillIcon && skill.imgSkill) {
                skillIcon.src = skill.imgSkill;
                skillIcon.alt = skill.name || 'Unique Skill';
            }
        },

        /**
         * Clear skill display
         */
        clearSkillDisplay() {
            const skillName = document.querySelector('.skill-name');
            if (skillName) {
                skillName.textContent = 'No skill available';
            }
            
            const skillDesc = document.querySelector('.skill-desc-text');
            if (skillDesc) {
                skillDesc.textContent = 'No skill description available for this star level';
            }
            
            const formula = document.querySelector('.formula');
            if (formula) {
                formula.textContent = '---';
            }
        },

        /**
         * Update condition and effect display in Character Details section
         * @param {Object} data - Object with condition and effect
         */
        updateConditionEffectDisplay(data) {
            // Update condition
            const conditionElement = document.getElementById('unique-condition');
            if (conditionElement) {
                if (Array.isArray(data.condition) && data.condition.length > 0) {
                    // Create line breaks for each condition item
                    conditionElement.innerHTML = data.condition.map(item => item.trim()).join('<br>');
                } else if (typeof data.condition === 'string' && data.condition) {
                    conditionElement.textContent = data.condition;
                } else {
                    conditionElement.textContent = '-';
                }
            }
            
            // Update effect
            const effectElement = document.getElementById('unique-effect');
            if (effectElement) {
                if (Array.isArray(data.effect) && data.effect.length > 0) {
                    // Create line breaks for each effect item
                    effectElement.innerHTML = data.effect.map(item => item.trim()).join('<br>');
                } else if (typeof data.effect === 'string' && data.effect) {
                    effectElement.textContent = data.effect;
                } else {
                    effectElement.textContent = '-';
                }
            }
        },

        /**
         * Clear condition and effect display
         */
        clearConditionEffectDisplay() {
            const conditionElement = document.getElementById('unique-condition');
            if (conditionElement) {
                conditionElement.textContent = '-';
            }
            
            const effectElement = document.getElementById('unique-effect');
            if (effectElement) {
                effectElement.textContent = '-';
            }
        }
    };
})();

// Make available globally
window.UniqueSkill = UniqueSkill;
