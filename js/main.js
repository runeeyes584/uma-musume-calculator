// Main Application Module - Initializes and coordinates all modules

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Uma Musume Calculator initialized');
    
    // Initialize application
    initializeApp();
    
    async function initializeApp() {
        // Load data
        await DataManager.loadCharacterData();
        DataManager.addFallbackCharacter();
        
        // Load Uma Musume data and populate dropdown
        try {
            await DataManager.loadUmaMusumeData();
            UIUpdater.populateUmaSelect();
        } catch (error) {
            console.error('Failed to load Uma Musume data:', error);
        }
        
        // Initialize all systems
        initializeCharacterSelector();
        StarRating.initialize();
        UniqueSkill.initialize();
        StatsSystem.initialize();
        await SkillSystem.initialize();
        await AptitudeSystem.initialize();
        
        // Setup Uma select change listener
        setupUmaSelectListener();
        
        // Setup auto-save and restore state
        setTimeout(() => {
            StorageManager.setupAutoSave();
            StorageManager.restoreState();
        }, 1000);
        
        // Verify unique skill score is working
        setTimeout(() => {
            console.log('=== VERIFICATION: Unique Skill Score System ===');
            if (UniqueSkill.updateUniqueSkillScore) {
                const score = UniqueSkill.updateUniqueSkillScore();
                console.log(`✓ Unique skill score function available. Current score: ${score}`);
            } else {
                console.warn('✗ Unique skill score function not available');
            }
            
            console.log('✓ Total summary score initialization skipped');
            
            // Initialize Overall Score calculation
            setTimeout(() => {
                OverallScore.updateOverallScore();
            }, 200);
            
            // Expose test functions
            exposeTestFunctions();
        }, 200);
    }
    
    // Initialize character selector (Div 1)
    function initializeCharacterSelector() {
        const umaSelect = document.getElementById('uma-select');
        
        if (!umaSelect) {
            console.error('Uma select element not found');
            return;
        }
        
        // Check if Uma Musume data is already loaded and populated
        const umaMusumeData = DataManager.getUmaMusumeData();
        if (umaMusumeData.uma_musume && umaMusumeData.uma_musume.length > 0) {
            console.log('Uma Musume data already loaded, skipping character selector initialization');
            return;
        }
        
        // Only proceed if no Uma Musume data is available (fallback to old system)
        const charactersData = DataManager.getCharactersData();
        if (Object.keys(charactersData).length === 0) {
            console.log('No character or Uma Musume data available');
            return;
        }
        
        console.log('Using fallback character data for dropdown');
        
        // Clear existing options only if there are no Uma Musume options
        const existingOptions = umaSelect.querySelectorAll('option[value]:not([value=""])');
        if (existingOptions.length === 0) {
            umaSelect.innerHTML = '<option value="" disabled selected>Select your Uma...</option>';
            
            // Add characters to dropdown as fallback
            Object.values(charactersData).forEach(character => {
                const option = document.createElement('option');
                option.value = character.id;
                option.textContent = character.name;
                umaSelect.appendChild(option);
            });
            
            // Set default selection
            const firstCharacter = Object.keys(charactersData)[0];
            umaSelect.value = firstCharacter;
            loadCharacter(firstCharacter);
        }
    }
    
    // Setup Uma select change listener
    function setupUmaSelectListener() {
        const umaSelect = document.getElementById('uma-select');
        
        if (!umaSelect) {
            console.error('Uma select element not found');
            return;
        }
        
        // Only add event listener if not already added
        if (!umaSelect.hasAttribute('data-listener-added')) {
            umaSelect.addEventListener('change', handleUmaSelectionChange);
            umaSelect.setAttribute('data-listener-added', 'true');
        }
        
        // Fallback: Add event listener after a short delay if not already added
        setTimeout(() => {
            if (umaSelect && !umaSelect.hasAttribute('data-listener-added')) {
                console.log('Adding fallback event listener for Uma select');
                umaSelect.addEventListener('change', handleUmaSelectionChange);
                umaSelect.setAttribute('data-listener-added', 'true');
            }
            
            // Also ensure the display is properly initialized
            const currentUma = DataManager.getCurrentUma();
            if (currentUma) {
                console.log('Re-applying current Uma selection:', currentUma.name);
                const avatarImg = document.getElementById('uma-avatar');
                const nameDisplay = document.getElementById('uma-name-display');
                
                if (avatarImg) avatarImg.src = currentUma.image;
                if (nameDisplay) nameDisplay.textContent = currentUma.name;
            }
        }, 1000);
    }
    
    // Handle Uma selection change
    function handleUmaSelectionChange() {
        const umaSelect = document.getElementById('uma-select');
        const selectedId = parseInt(umaSelect.value);
        
        console.log('Uma selection changed:', selectedId);
        
        if (selectedId) {
            const umaMusumeData = DataManager.getUmaMusumeData();
            
            if (umaMusumeData.uma_musume) {
                const currentUma = DataManager.findUmaById(selectedId);
                
                if (currentUma) {
                    console.log('Selected Uma:', currentUma);
                    DataManager.setCurrentUma(currentUma);
                    UIUpdater.updateUmaDisplay(currentUma);
                    
                    // Update unique skill display
                    if (window.UniqueSkill && window.UniqueSkill.updateUniqueSkillFromCharacter) {
                        window.UniqueSkill.updateUniqueSkillFromCharacter();
                    }
                    
                    // Apply aptitudes to UI
                    if (window.AptitudeSystem && window.AptitudeSystem.applyAptitudesToUI) {
                        window.AptitudeSystem.applyAptitudesToUI(currentUma.name);
                    }
                }
            }
        } else if (!selectedId || selectedId === '') {
            // Reset to default when no selection
            UIUpdater.resetUmaDisplay();
        }
    }
    
    // Load character data into UI
    function loadCharacter(characterId) {
        console.log(`Loading character: ${characterId}`);
        
        // First check if this is an Uma Musume ID
        const umaMusumeData = DataManager.getUmaMusumeData();
        if (umaMusumeData.uma_musume) {
            const umaMatch = DataManager.findUmaById(parseInt(characterId));
            if (umaMatch) {
                console.log('Found Uma Musume match, delegating to handleUmaSelectionChange');
                DataManager.setCurrentUma(umaMatch);
                handleUmaSelectionChange();
                return;
            }
        }
        
        // Otherwise, use old character system
        const currentCharacter = DataManager.findCharacterById(characterId);
        
        if (!currentCharacter) {
            console.error(`Character data not found for: ${characterId}`);
            return;
        }
        
        console.log(`Loaded character data:`, currentCharacter);
        DataManager.setCurrentCharacter(currentCharacter);
        
        // Update UI
        UIUpdater.updateAvatar();
        StarRating.updateStarRatingFromCharacter();
        UniqueSkill.updateUniqueSkillFromCharacter();
        UIUpdater.updateCharacterDetails();
    }
    
    // Expose test functions
    function exposeTestFunctions() {
        // Expose manual test function for Total Stats Score
        window.testTotalStats = function() {
            console.log('=== MANUAL TEST TOTAL STATS ===');
            const scoreElements = document.querySelectorAll('.div2 .stats-container .stat-row .score');
            let total = 0;
            console.log(`Found ${scoreElements.length} stat score elements`);
            
            scoreElements.forEach((el, i) => {
                const rawText = el.textContent.trim();
                const value = parseInt(rawText.replace(/,/g, '')) || 0;
                console.log(`Manual Stat ${i + 1}: "${rawText}" → ${value}`);
                total += value;
            });
            console.log('Manual Total Stats:', total);
            
            const totalElement = document.getElementById('total-stats-score');
            if (totalElement) {
                console.log('Current Total Stats Score display:', totalElement.textContent);
                totalElement.textContent = total.toString();
                console.log('Updated Total Stats Score to:', totalElement.textContent);
            } else {
                console.error('Total stats score element not found!');
            }
        };
        
        // Expose test function for rating logic
        window.testRatingLogic = function() {
            console.log('=== TESTING RATING LOGIC ===');
            const testRatings = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
            testRatings.forEach(rating => {
                let level = 'good'; // default
                if (['A', 'S'].includes(rating)) level = 'good';
                else if (['B', 'C'].includes(rating)) level = 'average';
                else if (['D', 'E', 'F'].includes(rating)) level = 'bad';
                else if (rating === 'G') level = 'terrible';
                console.log(`Rating ${rating} → Level: ${level}`);
            });
        };
    }
    
    // Expose legacy functions for backward compatibility
    window.updateUniqueSkillScore = function() {
        return UniqueSkill.updateUniqueSkillScore();
    };
    
    window.updateOverallScore = function() {
        return OverallScore.updateOverallScore();
    };
    
    window.setStarRating = function(rating) {
        return StarRating.setStarRating(rating);
    };
});
