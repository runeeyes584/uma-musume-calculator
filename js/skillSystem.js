// Skill System Module - Handles skill list management and score calculation

const SkillSystem = (function() {
    'use strict';

    // Private variables
    let skillsData = {};

    // Public API
    return {
        /**
         * Initialize skill system
         */
        async initialize() {
            const addSkillBtn = document.querySelector('.add-skill-btn');
            const skillsList = document.querySelector('.skills-list');
            
            // Load skills data from JSON file
            await this.loadSkillsData();

            // Add event listener to Add Skill button
            if (addSkillBtn) {
                addSkillBtn.addEventListener('click', () => this.addNewSkillRow());
            }

            // Add remove buttons to existing skills
            const existingSkillRows = document.querySelectorAll('.skill-row');
            existingSkillRows.forEach(skillRow => {
                if (!skillRow.querySelector('.remove-skill-btn')) {
                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button';
                    removeBtn.className = 'remove-skill-btn';
                    removeBtn.textContent = '×';
                    removeBtn.setAttribute('aria-label', 'Remove skill');
                    
                    skillRow.appendChild(removeBtn);
                    
                    removeBtn.addEventListener('click', () => {
                        skillRow.remove();
                        this.updateTotalScore();
                    });
                }
                
                this.setupSkillRowListeners(skillRow);
            });
            
            // Add listeners to div7 rating selects to update skill scores when ratings change
            this.setupRatingListeners();
            
            // Initial calculation of all skill scores
            this.updateAllSkillScores();
            this.updateTotalScore();
        },

        /**
         * Load skills data from new modular JSON structure
         */
        async loadSkillsData() {
            try {
                // Load index file to get color file paths
                const indexResponse = await fetch('./libs/skills_index.json');
                if (!indexResponse.ok) {
                    throw new Error('Failed to load skills_index.json');
                }
                
                const indexData = await indexResponse.json();
                console.log(`Loading skills v${indexData.version} (${indexData.updated})`);
                
                // Load each color file
                const loadPromises = indexData.colors.map(async (color) => {
                    try {
                        const fileInfo = indexData.files[color];
                        const filePath = `./libs/${fileInfo.file}`;
                        const response = await fetch(filePath);
                        if (response.ok) {
                            const skills = await response.json();
                            skillsData[color] = skills;
                            console.log(`✓ Loaded ${skills.length} ${color} skills`);
                        } else {
                            console.warn(`⚠️  Could not load ${color} skills from ${filePath}`);
                        }
                    } catch (err) {
                        console.warn(`⚠️  Error loading ${color} skills:`, err);
                    }
                });
                
                await Promise.all(loadPromises);
                console.log('✅ All skills data loaded successfully');
                
            } catch (error) {
                console.warn('Could not load modular skills, trying legacy format:', error);
                
                // Fallback to old skills_lib.json format
                try {
                    const response = await fetch('./libs/skills_lib.json');
                    if (response.ok) {
                        const skillsLib = await response.json();
                        for (const [color, skills] of Object.entries(skillsLib)) {
                            skillsData[color] = skills;
                        }
                        console.log('✓ Skills data loaded from legacy skills_lib.json');
                        return;
                    }
                } catch (legacyError) {
                    console.warn('Could not load legacy skills_lib.json:', legacyError);
                }
                // Fallback skills data
                skillsData = {
                    golden: [
                        {name: 'Swinging Maestro', score: {base: 508, good: 508, average: 415, bad: 369, terrible: 323}, 'check-type': 'Late'}, 
                        {name: 'Professor of Curvature', score: {base: 508, good: 508, average: 415, bad: 369, terrible: 323}, 'check-type': 'Medium'}, 
                        {name: 'Concentration', score: {base: 508, good: 508, average: 415, bad: 369, terrible: 323}, 'check-type': 'End'}
                    ],
                    yellow: [
                        {name: 'Groundwork', score: {base: 217, good: 217, average: 177, bad: 158, terrible: 138}, 'check-type': 'Front'}, 
                        {name: 'Pace Chaser Straightaways', score: {base: 432, good: 432, average: 354, bad: 314, terrible: 275}, 'check-type': 'Pace'}, 
                        {name: 'Corner Recovery', score: {base: 217, good: 217, average: 177, bad: 158, terrible: 138}, 'check-type': 'Late'}
                    ],
                    red: [
                        {name: 'Tether', score: {base: 79, good: 79, average: 65, bad: 58, terrible: 50}, 'check-type': 'Late'}, 
                        {name: 'Escape', score: {base: 183, good: 183, average: 150, bad: 133, terrible: 116}, 'check-type': 'Pace'}, 
                        {name: 'Last Spurt', score: {base: 217, good: 217, average: 177, bad: 158, terrible: 138}, 'check-type': 'End'}
                    ],
                    green: [
                        {name: 'Summer Runner', score: {base: 320, good: 320, average: 262, bad: 233, terrible: 204}, 'check-type': 'Turf'}, 
                        {name: 'Winter Runner', score: {base: 174, good: 174, average: 142, bad: 127, terrible: 111}, 'check-type': 'Dirt'}, 
                        {name: 'Corner Specialist', score: {base: 174, good: 174, average: 142, bad: 127, terrible: 111}, 'check-type': 'Late'}
                    ],
                    blue: [
                        {name: 'Lay Low', score: {base: 217, good: 217, average: 177, bad: 158, terrible: 138}, 'check-type': 'Front'}, 
                        {name: 'Hide and Seek', score: {base: 217, good: 217, average: 177, bad: 158, terrible: 138}, 'check-type': 'Pace'}, 
                        {name: 'Stealth Mode', score: {base: 195, good: 195, average: 159, bad: 142, terrible: 124}, 'check-type': 'Late'}
                    ],
                    purple: [
                        {name: 'Mental Power', score: {base: -129, good: -129, average: -105, bad: -94, terrible: -82}, 'check-type': 'End'}, 
                        {name: 'Focus Training', score: {base: -262, good: -262, average: -214, bad: -190, terrible: -167}, 'check-type': 'Late'}, 
                        {name: 'Mind Control', score: {base: -129, good: -129, average: -105, bad: -94, terrible: -82}, 'check-type': 'Front'}
                    ],
                    ius: [
                        {name: 'IUS Speed Boost', score: {base: 600, good: 600, average: 491, bad: 436, terrible: 382}, 'check-type': 'Pace'}, 
                        {name: 'IUS Stamina', score: {base: 620, good: 620, average: 507, bad: 451, terrible: 395}, 'check-type': 'End'}, 
                        {name: 'IUS Intelligence', score: {base: 580, good: 580, average: 474, bad: 422, terrible: 369}, 'check-type': 'Late'}
                    ]
                };
            }
        },

        /**
         * Add a new skill row
         */
        addNewSkillRow() {
            const skillsList = document.querySelector('.skills-list');
            const skillRow = document.createElement('div');
            skillRow.className = 'skill-row';
            
            skillRow.innerHTML = `
                <select class="color-select" aria-label="Skill color">
                    <option value="golden">Golden</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="ius">IUS</option>
                </select>
                <select class="skill-select" aria-label="Skill name">
                    <option value="">Select a skill...</option>
                </select>
                <input type="number" class="skill-score" value="0" readonly aria-label="Skill score">
                <button type="button" class="remove-skill-btn" aria-label="Remove skill">×</button>
            `;
            
            skillsList.appendChild(skillRow);
            this.setupSkillRowListeners(skillRow);
        },

        /**
         * Setup event listeners for a skill row
         * @param {HTMLElement} skillRow - The skill row element
         */
        setupSkillRowListeners(skillRow) {
            const colorSelect = skillRow.querySelector('.color-select');
            const skillSelect = skillRow.querySelector('.skill-select');
            const removeBtn = skillRow.querySelector('.remove-skill-btn');
            const scoreInput = skillRow.querySelector('.skill-score');
            
            colorSelect.addEventListener('change', () => {
                this.updateSkillOptions(skillSelect, colorSelect.value);
                this.updateSkillScore(skillSelect, scoreInput);
            });
            
            skillSelect.addEventListener('change', () => {
                this.updateSkillScore(skillSelect, scoreInput);
            });
            
            removeBtn.addEventListener('click', () => {
                skillRow.remove();
                this.updateTotalScore();
            });
            
            this.updateSkillOptions(skillSelect, colorSelect.value);
        },

        /**
         * Update skill options based on color
         * @param {HTMLElement} skillSelect - The skill select element
         * @param {string} color - The skill color
         */
        updateSkillOptions(skillSelect, color) {
            skillSelect.innerHTML = '<option value="">Select a skill...</option>';
            
            if (skillsData[color]) {
                // Sort skills alphabetically by name
                const sortedSkills = [...skillsData[color]].sort((a, b) => {
                    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
                });
                
                sortedSkills.forEach(skill => {
                    const option = document.createElement('option');
                    option.value = skill.name.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = skill.name;
                    option.setAttribute('data-score', JSON.stringify(skill.score));
                    // Support both new format (check_type) and old format (check-type)
                    const checkType = skill.check_type || skill['check-type'] || '';
                    option.setAttribute('data-check-type', checkType);
                    // Add skill ID as data attribute for easier reference
                    if (skill.id) {
                        option.setAttribute('data-skill-id', skill.id);
                    }
                    skillSelect.appendChild(option);
                });
            }
        },

        /**
         * Update skill score
         * @param {HTMLElement} skillSelect - The skill select element
         * @param {HTMLElement} scoreInput - The score input element
         */
        updateSkillScore(skillSelect, scoreInput) {
            if (skillSelect.value === '') {
                scoreInput.value = 0;
            } else {
                const selectedOption = skillSelect.options[skillSelect.selectedIndex];
                const scoreData = selectedOption.getAttribute('data-score');
                const checkType = selectedOption.getAttribute('data-check-type');
                
                let finalScore = 0;
                
                if (scoreData) {
                    try {
                        const scores = JSON.parse(scoreData);
                        
                        if (typeof scores === 'object' && checkType) {
                            // Get rating from div7 based on check-type
                            const ratingLevel = this.getRatingLevelFromDiv7(checkType);
                            finalScore = scores[ratingLevel] || scores.base || scores.good || 0;
                            
                            // Apply aptitude multiplier if available
                            if (window.AptitudeSystem && window.AptitudeSystem.getSkillAptitudeMultiplier) {
                                const multiplier = window.AptitudeSystem.getSkillAptitudeMultiplier(checkType);
                                if (multiplier !== 1.0) {
                                    finalScore = Math.round(finalScore * multiplier);
                                    console.log(`Skill aptitude adjustment: ${checkType} x${multiplier} = ${finalScore}`);
                                }
                            }
                            
                            // Debug logging
                            console.log(`Skill: ${skillSelect.options[skillSelect.selectedIndex].textContent}, Check-Type: ${checkType}, Rating Level: ${ratingLevel}, Score: ${finalScore}`);
                        } else if (typeof scores === 'number') {
                            // Fallback for simple number scores
                            finalScore = scores;
                        } else if (typeof scores === 'object') {
                            // Object without check-type, use base or good
                            finalScore = scores.base || scores.good || 0;
                        }
                    } catch (e) {
                        console.warn('Error parsing skill score data:', e);
                        finalScore = parseInt(scoreData) || 0;
                    }
                }
                
                scoreInput.value = finalScore;
            }
            this.updateTotalScore();
        },

        /**
         * Get rating level from div7 based on check-type
         * @param {string} checkType - The check type
         * @returns {string} - The rating level (good, average, bad, terrible)
         */
        getRatingLevelFromDiv7(checkType) {
            // Map check-type to div7 select element IDs
            const typeMapping = {
                'Turf': 'turf',
                'Dirt': 'dirt', 
                'Front': 'front',
                'Pace': 'pace',
                'Late': 'late',
                'End': 'end',
                'Sprint': 'sprint',
                'Mile': 'mile',
                'Medium': 'medium', 
                'Long': 'long'
            };
            
            const selectId = typeMapping[checkType];
            if (!selectId) {
                console.warn(`Unknown check-type: ${checkType}`);
                return 'good'; // default
            }
            
            const selectElement = document.getElementById(selectId);
            if (!selectElement) {
                console.warn(`Element not found: ${selectId}`);
                return 'good'; // default
            }
            
            const rating = selectElement.value;
            
            // Convert new aptitude format to score level
            // S-A = good, B-C = average, D-E-F = bad, G = terrible
            if (rating === 'S-A') return 'good';
            if (rating === 'B-C') return 'average';
            if (rating === 'D-E-F') return 'bad';
            if (rating === 'G') return 'terrible';
            
            // Legacy support for old single-letter format
            if (['A', 'S'].includes(rating)) return 'good';
            if (['B', 'C'].includes(rating)) return 'average';
            if (['D', 'E', 'F'].includes(rating)) return 'bad';
            
            return 'good'; // default
        },

        /**
         * Update all skill scores
         */
        updateAllSkillScores() {
            const skillSelects = document.querySelectorAll('.skill-select');
            skillSelects.forEach(skillSelect => {
                if (skillSelect.value) { // Only update if skill is selected
                    const scoreInput = skillSelect.closest('.skill-row').querySelector('.skill-score');
                    this.updateSkillScore(skillSelect, scoreInput);
                }
            });
        },

        /**
         * Update total score
         */
        updateTotalScore() {
            const skillScores = document.querySelectorAll('.skill-score');
            let total = 0;
            
            skillScores.forEach(scoreInput => {
                total += parseInt(scoreInput.value) || 0;
            });
            
            const totalScoreInput = document.querySelector('#total-score');
            if (totalScoreInput) {
                totalScoreInput.value = total;
            }
            
            // Update overall score when skills change
            if (window.OverallScore && window.OverallScore.updateOverallScore) {
                window.OverallScore.updateOverallScore();
            }
        },

        /**
         * Setup rating listeners in div7
         */
        setupRatingListeners() {
            const div7Selects = ['turf', 'dirt', 'sprint', 'mile', 'medium', 'long', 'front', 'pace', 'late', 'end'];
            
            // Validate all div7 elements exist
            console.log('Checking div7 elements:');
            div7Selects.forEach(selectId => {
                const element = document.getElementById(selectId);
                console.log(`${selectId}: ${element ? 'Found' : 'NOT FOUND'}`);
            });
            
            div7Selects.forEach(selectId => {
                const selectElement = document.getElementById(selectId);
                if (selectElement) {
                    selectElement.addEventListener('change', () => {
                        console.log(`Rating changed: ${selectId} = ${selectElement.value}`);
                        // Update all skill scores when rating changes
                        this.updateAllSkillScores();
                    });
                } else {
                    console.warn(`Div7 element not found: ${selectId}`);
                }
            });
        }
    };
})();

// Make available globally
window.SkillSystem = SkillSystem;
