// Aptitude System Module - Handles Uma aptitude loading and auto-adjustment

const AptitudeSystem = (function() {
    'use strict';

    // Private variables
    let aptitudesData = {};
    
    // Aptitude fields mapping
    const APTITUDE_FIELDS = {
        'Turf': 'turf',
        'Dirt': 'dirt',
        'Sprint': 'sprint',
        'Mile': 'mile',
        'Medium': 'medium',
        'Long': 'long',
        'Front': 'front',
        'Pace': 'pace',
        'Late': 'late',
        'End': 'end'
    };

    // Public API
    return {
        /**
         * Initialize aptitude system
         */
        async initialize() {
            await this.loadAptitudesData();
            this.setupAptitudeListeners();
        },

        /**
         * Load aptitudes data from JSON file
         */
        async loadAptitudesData() {
            try {
                console.log('Loading aptitudes data...');
                const response = await fetch('assets/data/aptitudes.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                aptitudesData = data.aptitudes;
                console.log('✅ Aptitudes data loaded:', Object.keys(aptitudesData).length, 'Uma Musume');
                
            } catch (error) {
                console.error('❌ Error loading aptitudes data:', error);
                aptitudesData = {};
            }
        },

        /**
         * Get aptitudes data
         */
        getAptitudesData() {
            return aptitudesData;
        },

        /**
         * Get aptitudes for specific Uma by name
         * @param {string} umaName - Name of Uma Musume
         * @returns {Object|null} - Aptitudes object or null
         */
        getAptitudesForUma(umaName) {
            if (!umaName) return null;
            
            // Direct match
            if (aptitudesData[umaName]) {
                return aptitudesData[umaName];
            }
            
            // Try to match base name (without variants like "(Wedding)", "(Summer)", etc.)
            const baseName = umaName.replace(/\s*\([^)]+\)\s*$/, '').trim();
            if (aptitudesData[baseName]) {
                console.log(`Using base name aptitudes: ${baseName} for ${umaName}`);
                return aptitudesData[baseName];
            }
            
            console.warn(`No aptitudes found for: ${umaName}`);
            return null;
        },

        /**
         * Apply Uma's aptitudes to the UI selects
         * @param {string} umaName - Name of Uma Musume
         */
        applyAptitudesToUI(umaName) {
            const aptitudes = this.getAptitudesForUma(umaName);
            
            if (!aptitudes) {
                console.log('No aptitudes to apply');
                return;
            }
            
            console.log(`Applying aptitudes for ${umaName}:`, aptitudes);
            
            // Apply each aptitude to corresponding select
            for (const [key, fieldId] of Object.entries(APTITUDE_FIELDS)) {
                const value = aptitudes[key];
                const selectElement = document.getElementById(fieldId);
                
                if (selectElement && value) {
                    selectElement.value = value;
                    console.log(`  ${key}: ${value}`);
                }
            }
            
            // Trigger skill score update after aptitude changes
            if (window.SkillSystem && window.SkillSystem.updateAllSkillScores) {
                setTimeout(() => {
                    window.SkillSystem.updateAllSkillScores();
                    window.SkillSystem.updateTotalScore();
                }, 100);
            }
        },

        /**
         * Setup listeners for aptitude dropdowns
         */
        setupAptitudeListeners() {
            // Listen to all aptitude selects for manual changes
            for (const fieldId of Object.values(APTITUDE_FIELDS)) {
                const selectElement = document.getElementById(fieldId);
                if (selectElement) {
                    selectElement.addEventListener('change', () => {
                        console.log(`Aptitude changed: ${fieldId} = ${selectElement.value}`);
                        
                        // Update skill scores when aptitude changes
                        if (window.SkillSystem) {
                            if (window.SkillSystem.updateAllSkillScores) {
                                window.SkillSystem.updateAllSkillScores();
                            }
                            if (window.SkillSystem.updateTotalScore) {
                                window.SkillSystem.updateTotalScore();
                            }
                        }
                    });
                }
            }
        },

        /**
         * Get aptitude score multiplier
         * @param {string} aptitudeValue - Aptitude value (S-A, B-C, D-E-F, G)
         * @returns {number} - Score multiplier
         */
        getAptitudeMultiplier(aptitudeValue) {
            const multipliers = {
                'S-A': 1.0,      // Full score
                'B-C': 0.8,      // 80% score
                'D-E-F': 0.6,    // 60% score
                'G': 0.5         // 50% score
            };
            
            return multipliers[aptitudeValue] || 1.0;
        },

        /**
         * Check if a skill matches current aptitude configuration
         * @param {string} checkType - Skill check type
         * @returns {number} - Multiplier based on matching aptitude
         */
        getSkillAptitudeMultiplier(checkType) {
            if (!checkType) return 1.0;
            
            const checkTypeLower = checkType.toLowerCase();
            
            // Map check types to aptitude fields
            const aptitudeMap = {
                'turf': 'turf',
                'dirt': 'dirt',
                'sprint': 'sprint',
                'mile': 'mile',
                'medium': 'medium',
                'long': 'long',
                'front': 'front',
                'pace': 'pace',
                'late': 'late',
                'end': 'end'
            };
            
            // Find matching aptitude
            for (const [key, fieldId] of Object.entries(aptitudeMap)) {
                if (checkTypeLower.includes(key)) {
                    const selectElement = document.getElementById(fieldId);
                    if (selectElement) {
                        return this.getAptitudeMultiplier(selectElement.value);
                    }
                }
            }
            
            return 1.0; // Default multiplier if no match
        }
    };
})();

// Make available globally
window.AptitudeSystem = AptitudeSystem;
