// Storage Manager Module - Handles saving and restoring calculator state

const StorageManager = (function() {
    'use strict';

    const STORAGE_KEY = 'umaCalculatorState';

    // Public API
    return {
        /**
         * Save current calculator state to localStorage
         */
        saveState() {
            try {
                const state = {
                    // Uma selection
                    selectedUmaId: document.getElementById('uma-select')?.value || '',
                    
                    // Stats
                    stats: Array.from(document.querySelectorAll('.stat-input')).map(input => input.value),
                    
                    // Star rating
                    starRating: document.querySelectorAll('.star.active').length,
                    
                    // Unique skill level
                    uniqueSkillLevel: document.getElementById('unique-level')?.value || '1',
                    
                    // Aptitudes
                    aptitudes: {
                        turf: document.getElementById('turf')?.value || 'S-A',
                        dirt: document.getElementById('dirt')?.value || 'G',
                        sprint: document.getElementById('sprint')?.value || 'B-C',
                        mile: document.getElementById('mile')?.value || 'B-C',
                        medium: document.getElementById('medium')?.value || 'S-A',
                        long: document.getElementById('long')?.value || 'S-A',
                        front: document.getElementById('front')?.value || 'S-A',
                        pace: document.getElementById('pace')?.value || 'S-A',
                        late: document.getElementById('late')?.value || 'D-E-F',
                        end: document.getElementById('end')?.value || 'G'
                    },
                    
                    // Skills
                    skills: this.collectSkills(),
                    
                    // Timestamp
                    timestamp: new Date().toISOString()
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                console.log('✓ State saved to localStorage', state);
            } catch (error) {
                console.error('Failed to save state:', error);
            }
        },

        /**
         * Restore calculator state from localStorage
         */
        async restoreState() {
            try {
                const savedState = localStorage.getItem(STORAGE_KEY);
                if (!savedState) {
                    console.log('No saved state found');
                    return false;
                }

                const state = JSON.parse(savedState);
                console.log('✓ Restoring state from localStorage', state);

                // Wait for DOM to be ready
                await this.waitForElements();

                // Restore Uma selection
                if (state.selectedUmaId) {
                    const umaSelect = document.getElementById('uma-select');
                    if (umaSelect) {
                        umaSelect.value = state.selectedUmaId;
                        // Trigger change event to update UI
                        umaSelect.dispatchEvent(new Event('change'));
                    }
                }

                // Restore stats
                if (state.stats && state.stats.length > 0) {
                    const statInputs = document.querySelectorAll('.stat-input');
                    statInputs.forEach((input, index) => {
                        if (state.stats[index] !== undefined) {
                            input.value = state.stats[index];
                            input.dispatchEvent(new Event('input'));
                        }
                    });
                }

                // Restore star rating
                if (state.starRating && window.StarRating) {
                    window.StarRating.setStarRating(state.starRating);
                }

                // Restore unique skill level
                if (state.uniqueSkillLevel) {
                    const uniqueLevel = document.getElementById('unique-level');
                    if (uniqueLevel) {
                        uniqueLevel.value = state.uniqueSkillLevel;
                        uniqueLevel.dispatchEvent(new Event('change'));
                    }
                }

                // Restore aptitudes
                if (state.aptitudes) {
                    Object.keys(state.aptitudes).forEach(aptitude => {
                        const element = document.getElementById(aptitude);
                        if (element) {
                            element.value = state.aptitudes[aptitude];
                        }
                    });
                }

                // Restore skills
                if (state.skills && state.skills.length > 0) {
                    setTimeout(() => {
                        this.restoreSkills(state.skills);
                    }, 500);
                }

                console.log('✓ State restored successfully');
                return true;
            } catch (error) {
                console.error('Failed to restore state:', error);
                return false;
            }
        },

        /**
         * Collect current skills data
         */
        collectSkills() {
            const skillRows = document.querySelectorAll('.skill-row');
            const skills = [];

            skillRows.forEach(row => {
                const skillSelect = row.querySelector('.skill-select');
                const levelSelect = row.querySelector('.skill-level-select');
                
                if (skillSelect && levelSelect) {
                    skills.push({
                        skillId: skillSelect.value,
                        level: levelSelect.value
                    });
                }
            });

            return skills;
        },

        /**
         * Restore skills from saved data
         */
        restoreSkills(skills) {
            if (!skills || skills.length === 0) return;

            // Clear existing skills first
            const existingRows = document.querySelectorAll('.skill-row');
            existingRows.forEach(row => row.remove());

            // Add each skill
            skills.forEach((skill, index) => {
                if (window.SkillSystem && window.SkillSystem.addSkillRow) {
                    setTimeout(() => {
                        window.SkillSystem.addSkillRow();
                        
                        // Set values after row is added
                        setTimeout(() => {
                            const rows = document.querySelectorAll('.skill-row');
                            const currentRow = rows[rows.length - 1];
                            
                            if (currentRow) {
                                const skillSelect = currentRow.querySelector('.skill-select');
                                const levelSelect = currentRow.querySelector('.skill-level-select');
                                
                                if (skillSelect && skill.skillId) {
                                    skillSelect.value = skill.skillId;
                                    skillSelect.dispatchEvent(new Event('change'));
                                }
                                
                                if (levelSelect && skill.level) {
                                    levelSelect.value = skill.level;
                                    levelSelect.dispatchEvent(new Event('change'));
                                }
                            }
                        }, 100);
                    }, index * 150);
                }
            });
        },

        /**
         * Wait for required DOM elements to be available
         */
        waitForElements() {
            return new Promise((resolve) => {
                const checkElements = () => {
                    const umaSelect = document.getElementById('uma-select');
                    const statInputs = document.querySelectorAll('.stat-input');
                    
                    if (umaSelect && statInputs.length > 0) {
                        resolve();
                    } else {
                        setTimeout(checkElements, 100);
                    }
                };
                checkElements();
            });
        },

        /**
         * Clear saved state
         */
        clearState() {
            try {
                localStorage.removeItem(STORAGE_KEY);
                console.log('✓ State cleared from localStorage');
            } catch (error) {
                console.error('Failed to clear state:', error);
            }
        },

        /**
         * Setup auto-save listeners
         */
        setupAutoSave() {
            // Save on Uma selection change
            const umaSelect = document.getElementById('uma-select');
            if (umaSelect) {
                umaSelect.addEventListener('change', () => {
                    setTimeout(() => this.saveState(), 500);
                });
            }

            // Save on stat changes
            document.querySelectorAll('.stat-input').forEach(input => {
                input.addEventListener('input', () => {
                    clearTimeout(this.saveTimeout);
                    this.saveTimeout = setTimeout(() => this.saveState(), 1000);
                });
            });

            // Save on star rating change
            document.querySelectorAll('.star').forEach(star => {
                star.addEventListener('click', () => {
                    setTimeout(() => this.saveState(), 300);
                });
            });

            // Save on unique skill level change
            const uniqueLevel = document.getElementById('unique-level');
            if (uniqueLevel) {
                uniqueLevel.addEventListener('change', () => this.saveState());
            }

            // Save on aptitude changes
            ['turf', 'dirt', 'sprint', 'mile', 'medium', 'long', 'front', 'pace', 'late', 'end'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', () => this.saveState());
                }
            });

            // Save on skill changes (delegate event for dynamic skill rows)
            document.addEventListener('change', (e) => {
                if (e.target.classList.contains('skill-select') || 
                    e.target.classList.contains('skill-level-select')) {
                    clearTimeout(this.saveTimeout);
                    this.saveTimeout = setTimeout(() => this.saveState(), 500);
                }
            });

            // Save before page unload
            window.addEventListener('beforeunload', () => {
                this.saveState();
            });

            console.log('✓ Auto-save listeners setup complete');
        }
    };
})();

// Make available globally
window.StorageManager = StorageManager;
