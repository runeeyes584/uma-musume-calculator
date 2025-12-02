// UI Updater Module - Handles all UI updates for avatar, character details, and displays

const UIUpdater = (function() {
    'use strict';

    // Public API
    return {
        /**
         * Populate the Uma select dropdown
         */
        populateUmaSelect() {
            const umaSelect = document.getElementById('uma-select');
            
            if (!umaSelect) {
                console.error('Uma select element not found');
                return;
            }
            
            // Clear existing options except the default one
            while (umaSelect.children.length > 1) {
                umaSelect.removeChild(umaSelect.lastChild);
            }
            
            const umaMusumeData = window.DataManager.getUmaMusumeData();
            
            // Add Uma Musume options from JSON data
            if (umaMusumeData.uma_musume && Array.isArray(umaMusumeData.uma_musume)) {
                umaMusumeData.uma_musume.forEach(uma => {
                    const option = document.createElement('option');
                    option.value = uma.id;
                    option.textContent = uma.name;
                    option.setAttribute('data-image', uma.image);
                    umaSelect.appendChild(option);
                });
                
                console.log(`Uma Musume data loaded: ${umaMusumeData.uma_musume.length} options populated`);
            } else {
                console.error('Uma Musume data is not in expected format');
            }
        },

        /**
         * Update avatar image
         */
        updateAvatar() {
            const currentUma = window.DataManager.getCurrentUma();
            const currentCharacter = window.DataManager.getCurrentCharacter();
            
            // Priority 1: Use Uma Musume data if available
            if (currentUma) {
                const avatarImg = document.querySelector('.avatar-image');
                if (avatarImg) {
                    avatarImg.src = currentUma.image;
                    avatarImg.alt = `${currentUma.name} avatar`;
                    
                    avatarImg.onerror = function() {
                        console.log(`Could not load Uma Musume avatar: ${currentUma.image}`);
                        this.src = 'assets/avatars/agnes_tachyon.png';
                    };
                }
                return;
            }
            
            // Priority 2: Use old character data as fallback
            if (!currentCharacter) return;
            
            const avatarImg = document.querySelector('.avatar-image');
            if (avatarImg) {
                const imagePath = `assets/${currentCharacter.id}/${currentCharacter.id}.png`;
                avatarImg.src = imagePath;
                avatarImg.alt = `${currentCharacter.name} avatar`;
                
                avatarImg.onerror = function() {
                    console.log(`Could not load avatar image: ${imagePath}`);
                    this.src = 'assets/avatars/agnes_tachyon.png';
                };
            }
        },

        /**
         * Update Uma display (avatar and name)
         */
        updateUmaDisplay(uma) {
            // Update avatar image
            const avatarImg = document.getElementById('uma-avatar');
            const nameDisplay = document.getElementById('uma-name-display');
            
            if (avatarImg) {
                avatarImg.src = uma.image;
                avatarImg.alt = `${uma.name} avatar`;
                console.log('Updated avatar:', uma.image);
                
                avatarImg.onerror = function() {
                    console.log(`Could not load avatar image: ${uma.image}`);
                    this.src = 'assets/avatars/agnes_tachyon.png';
                };
            }
            
            if (nameDisplay) {
                nameDisplay.textContent = uma.name;
                console.log('Updated name display:', uma.name);
            }
            
            // Also update the old system's avatar if it exists (for compatibility)
            const legacyAvatarImg = document.querySelector('.avatar-image');
            if (legacyAvatarImg && legacyAvatarImg !== avatarImg) {
                legacyAvatarImg.src = uma.image;
                legacyAvatarImg.alt = `${uma.name} avatar`;
                legacyAvatarImg.onerror = function() {
                    this.src = 'assets/avatars/agnes_tachyon.png';
                };
            }
        },

        /**
         * Reset Uma display to default
         */
        resetUmaDisplay() {
            const avatarImg = document.getElementById('uma-avatar');
            const nameDisplay = document.getElementById('uma-name-display');
            const legacyAvatarImg = document.querySelector('.avatar-image');
            
            if (avatarImg) {
                avatarImg.src = 'assets/avatars/agnes_tachyon.png';
                avatarImg.alt = 'Uma character avatar';
            }
            
            if (nameDisplay) {
                nameDisplay.textContent = 'Select an Uma';
            }
            
            if (legacyAvatarImg && legacyAvatarImg !== avatarImg) {
                legacyAvatarImg.src = 'assets/avatars/agnes_tachyon.png';
                legacyAvatarImg.alt = 'Uma character avatar';
            }
            
            window.DataManager.setCurrentUma(null);
        },

        /**
         * Update character details in stats section
         */
        updateCharacterDetails() {
            const currentCharacter = window.DataManager.getCurrentCharacter();
            if (!currentCharacter) return;
            
            // Update Japanese name
            const japaneseNameEl = document.getElementById('japanese-name');
            if (japaneseNameEl) {
                japaneseNameEl.textContent = currentCharacter.japanese_name || '-';
            }
            
            // Update voice actor
            const voiceActorEl = document.getElementById('voice-actor');
            if (voiceActorEl) {
                voiceActorEl.textContent = currentCharacter.voice_actor || '-';
            }
            
            // Update birthday
            const birthdayEl = document.getElementById('birthday');
            if (birthdayEl && currentCharacter.character_details) {
                birthdayEl.textContent = currentCharacter.character_details.birthday || '-';
            }
            
            // Update height
            const heightEl = document.getElementById('height');
            if (heightEl && currentCharacter.character_details) {
                heightEl.textContent = currentCharacter.character_details.height || '-';
            }
            
            // Update release date
            const releaseDateEl = document.getElementById('release-date');
            if (releaseDateEl) {
                releaseDateEl.textContent = currentCharacter.release_date || '-';
            }
            
            // Update measurements
            if (currentCharacter.character_details && currentCharacter.character_details.three_sizes) {
                const measurements = currentCharacter.character_details.three_sizes;
                const measurementsEl = document.getElementById('measurements');
                
                if (measurementsEl) {
                    const bust = measurements.bust || 0;
                    const waist = measurements.waist || 0;
                    const hip = measurements.hip || 0;
                    
                    if (bust && waist && hip) {
                        measurementsEl.textContent = `${bust} - ${waist} - ${hip}`;
                    } else {
                        measurementsEl.textContent = '-';
                    }
                }
            } else {
                const measurementsEl = document.getElementById('measurements');
                if (measurementsEl) {
                    measurementsEl.textContent = '-';
                }
            }
            
            // Update unique skill score when character changes
            setTimeout(() => {
                if (window.UniqueSkill && window.UniqueSkill.updateUniqueSkillScore) {
                    window.UniqueSkill.updateUniqueSkillScore();
                }
                // Also update overall score
                if (window.OverallScore && window.OverallScore.updateOverallScore) {
                    window.OverallScore.updateOverallScore();
                }
            }, 50);
        }
    };
})();

// Make available globally
window.UIUpdater = UIUpdater;
