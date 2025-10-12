// JavaScript for Umapyoi Calculator

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Uma Musume Calculator initialized');
    
    // Uma Musume data management
    let umaMusumeData = {};
    let currentUma = null;
    
    // Load Uma Musume data
    async function loadUmaMusumeData() {
        try {
            console.log('Loading Uma Musume data...');
            const response = await fetch('assets/data/uma_musume.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Uma Musume data loaded:', data);
            umaMusumeData = data;
            populateUmaSelect();
        } catch (error) {
            console.error('Error loading Uma Musume data:', error);
        }
    }
    
    // Populate the Uma select dropdown
    function populateUmaSelect() {
        const umaSelect = document.getElementById('uma-select');
        
        if (!umaSelect) {
            console.error('Uma select element not found');
            return;
        }
        
        // Clear existing options except the default one
        while (umaSelect.children.length > 1) {
            umaSelect.removeChild(umaSelect.lastChild);
        }
        
        // Add Uma Musume options from JSON data
        if (umaMusumeData.uma_musume && Array.isArray(umaMusumeData.uma_musume)) {
            umaMusumeData.uma_musume.forEach(uma => {
                const option = document.createElement('option');
                option.value = uma.id;
                option.textContent = uma.name;
                option.setAttribute('data-image', uma.image); // Store image path
                umaSelect.appendChild(option);
            });
            
            // Only add event listener if not already added
            if (!umaSelect.hasAttribute('data-listener-added')) {
                umaSelect.addEventListener('change', handleUmaSelectionChange);
                umaSelect.setAttribute('data-listener-added', 'true');
            }
            
            console.log(`Uma Musume data loaded: ${umaMusumeData.uma_musume.length} options populated`);
        } else {
            console.error('Uma Musume data is not in expected format');
        }
    }
    
    // Handle Uma selection change
    function handleUmaSelectionChange() {
        const umaSelect = document.getElementById('uma-select');
        const selectedId = parseInt(umaSelect.value);
        
        console.log('Uma selection changed:', selectedId);
        
        if (selectedId && umaMusumeData.uma_musume) {
            currentUma = umaMusumeData.uma_musume.find(uma => uma.id === selectedId);
            
            if (currentUma) {
                console.log('Selected Uma:', currentUma);
                
                // Update avatar image using the image path from JSON
                const avatarImg = document.getElementById('uma-avatar');
                const nameDisplay = document.getElementById('uma-name-display');
                
                if (avatarImg) {
                    avatarImg.src = currentUma.image;
                    avatarImg.alt = `${currentUma.name} avatar`;
                    console.log('Updated avatar:', currentUma.image);
                    
                    // Add error handling for missing images
                    avatarImg.onerror = function() {
                        console.log(`Could not load avatar image: ${currentUma.image}`);
                        this.src = 'assets/avatars/agnes_tachyon.png'; // Fallback
                    };
                }
                
                if (nameDisplay) {
                    nameDisplay.textContent = currentUma.name;
                    console.log('Updated name display:', currentUma.name);
                }
                
                // Also update the old system's avatar if it exists (for compatibility)
                const legacyAvatarImg = document.querySelector('.avatar-image');
                if (legacyAvatarImg && legacyAvatarImg !== avatarImg) {
                    legacyAvatarImg.src = currentUma.image;
                    legacyAvatarImg.alt = `${currentUma.name} avatar`;
                    legacyAvatarImg.onerror = function() {
                        this.src = 'assets/avatars/agnes_tachyon.png';
                    };
                }
            }
        } else if (!selectedId || selectedId === '') {
            // Reset to default when no selection
            resetUmaDisplay();
        }
    }
    
    // Helper function to reset Uma display
    function resetUmaDisplay() {
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
        
        // Also reset legacy avatar
        if (legacyAvatarImg && legacyAvatarImg !== avatarImg) {
            legacyAvatarImg.src = 'assets/avatars/agnes_tachyon.png';
            legacyAvatarImg.alt = 'Uma character avatar';
        }
        
        currentUma = null;
    }
    
    // Initialize Uma Musume data
    loadUmaMusumeData();
    
    // Fallback: Add event listener after a short delay if not already added
    setTimeout(() => {
        const umaSelect = document.getElementById('uma-select');
        if (umaSelect && !umaSelect.hasAttribute('data-listener-added')) {
            console.log('Adding fallback event listener for Uma select');
            umaSelect.addEventListener('change', handleUmaSelectionChange);
            umaSelect.setAttribute('data-listener-added', 'true');
        }
        
        // Also ensure the display is properly initialized
        if (currentUma) {
            console.log('Re-applying current Uma selection:', currentUma.name);
            const avatarImg = document.getElementById('uma-avatar');
            const nameDisplay = document.getElementById('uma-name-display');
            
            if (avatarImg) avatarImg.src = currentUma.image;
            if (nameDisplay) nameDisplay.textContent = currentUma.name;
        }
    }, 1000);
    
    // Character data management
    let charactersData = {};
    let currentCharacter = null;
    
    // Stat calculation function
    function calculateStatScore(statValue) {
        // --- Dữ liệu nền ---
        const blockSize = 50;
        const multipliers = [
            0.5, 0.8, 1, 1.3, 1.6, 1.8, 2.1, 2.4, 2.6, 2.8, 2.9, 3, 3.1, 3.3, 3.4,
            3.5, 3.9, 4.1, 4.2, 4.3, 5.2, 5.5, 6.6, 6.8, 6.9
        ];

        // Kiểm tra input hợp lệ
        if (typeof statValue !== 'number' || isNaN(statValue) || statValue < 0) {
            console.warn(`Invalid stat value: ${statValue}, returning 0`);
            return 0;
        }
        
        // Nếu stat = 0, vẫn tính theo công thức (sẽ return nextMultiplier * 1)
        statValue = Math.max(0, statValue);

        // --- Bắt đầu tính toán ---

        // 1. Tính số "khối" 50 điểm đầy đủ
        const blocks = Math.floor(statValue / blockSize);

        // 2. Tính tổng điểm của các khối đầy đủ đó
        let block_sum = 0;
        for (let i = 0; i < blocks && i < multipliers.length; i++) {
            block_sum += multipliers[i] * blockSize;
        }

        // 3. Tính số điểm "lẻ" còn lại
        const remainder = statValue % blockSize;

        // 4. Tính điểm cho phần "lẻ"
        // Lấy hệ số của khối tiếp theo (chỉ số `blocks` trong mảng)
        let nextMultiplier;
        if (blocks < multipliers.length) {
            nextMultiplier = multipliers[blocks];
        } else {
            // Nếu vượt quá array, dùng multiplier cuối cùng
            nextMultiplier = multipliers[multipliers.length - 1];
        }
        
        const remainder_sum = nextMultiplier * (remainder + 1);
        
        // 5. Cộng tất cả lại và làm tròn xuống
        const totalScore = Math.floor(block_sum + remainder_sum);

        // Debug logging cho giá trị cao
        if (statValue > 1200) {
            console.log(`Debug - Stat: ${statValue}, Blocks: ${blocks}, Block Sum: ${block_sum}, Remainder: ${remainder}, Next Multiplier: ${nextMultiplier}, Remainder Sum: ${remainder_sum}, Total: ${totalScore}`);
        }

        return totalScore;
    }
    
    // Calculate stat rating based on value
    function calculateStatRating(statValue) {
        // 1. Kiểm tra đầu vào xem có phải số hợp lệ không
        if (typeof statValue !== 'number' || statValue < 1) {
            console.error("Stat phải là một con số lớn hơn 0");
            return 'G'; 
        }

        // Làm tròn stat xuống để xử lý số thập phân nếu có
        statValue = Math.floor(statValue);

        // 2. Xử lý cho rank từ 1201 đến 2000 (UG ~ US9)
        if (statValue >= 1201 && statValue <= 2000) {
            // Mảng các ký tự rank, sắp xếp theo thứ tự
            const prefixes = ['UG', 'UF', 'UE', 'UD', 'UC', 'UB', 'UA', 'US'];
            
            // Tính index để lấy ký tự rank (cứ 100 stat là một bậc)
            const prefixIndex = Math.floor((statValue - 1201) / 100);
            const prefix = prefixes[prefixIndex];

            // Tính số hậu tố (từ 1 đến 9)
            const lastTwoDigits = statValue % 100 || 100;
            const suffix = Math.min(9, Math.ceil(lastTwoDigits / 10));

            return `${prefix}${suffix}`;
        }

        // 3. Xử lý cho rank từ 1 đến 1200 (G ~ SS+)
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

        // Default fallback
        return 'G';
    }
    
    // Initialize application
    initializeApp();
    
    async function initializeApp() {
        await loadCharacterData();
        
        // Add fallback data if no characters loaded
        if (Object.keys(charactersData).length === 0) {
            console.log('No character data loaded, using fallback data');
            charactersData['agnes_tachyon'] = {
                id: 'agnes_tachyon',
                name: 'Agnes Tachyon',
                japanese_name: 'アグネスタキオン',
                voice_actor: 'Sumire Uesaka',
                release_date: '2025-06-26',
                default_star: 1,
                character_details: {
                    birthday: 'April 13',
                    height: '159 cm',
                    three_sizes: {
                        bust: 83,
                        waist: 55,
                        hip: 81
                    }
                },
                skills: [
                    {
                        rarity: '1-2 star',
                        name: 'Introduction to Physiology',
                        description: 'Moderately recover endurance when conserving energy on a corner in the second half of the race.'
                    },
                    {
                        rarity: '3 star',
                        name: 'U=ma2',
                        description: 'Recover endurance when conserving energy on a corner in the second half of the race'
                    }
                ]
            };
        }
        
        initializeCharacterSelector();
        initializeStarRating();
        initializeUniqueSkill();
        initializeStatsSystem();
        await initializeSkillSystem();
        
        // Verify unique skill score is working
        setTimeout(() => {
            console.log('=== VERIFICATION: Unique Skill Score System ===');
            if (window.updateUniqueSkillScore) {
                const score = window.updateUniqueSkillScore();
                console.log(`✓ Unique skill score function available. Current score: ${score}`);
            } else {
                console.warn('✗ Unique skill score function not available');
            }
            
            // Initialize total summary score - REMOVED
            // window.updateTotalSummaryScore = updateTotalSummaryScore;
            setTimeout(() => {
                // updateTotalSummaryScore(); - REMOVED
                console.log('✓ Total summary score initialization skipped');
                
                // Debug stat elements
                console.log('=== DEBUG: Stat Elements ===');
                const statRows = document.querySelectorAll('.stat-row');
                const scoreElements = document.querySelectorAll('.stat-row .score');
                console.log(`Found ${statRows.length} stat rows`);
                console.log(`Found ${scoreElements.length} score elements`);
                scoreElements.forEach((el, i) => {
                    console.log(`Score ${i}: "${el.textContent}"`);
                });
                
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
                
                // Initialize Overall Score calculation function
                window.updateOverallScore = updateOverallScore;
                setTimeout(() => {
                    updateOverallScore();
                }, 200);
            }, 100);
        }, 200);
    }
    
    // Load all character data
    async function loadCharacterData() {
        const characterFolders = [
            'agnes_tachyon',
            'current_chan', 
            'daiwa_scarlet',
            'gold_ship',
            'smart_falcon',
            'tokai_teio'
        ];
        
        for (const folder of characterFolders) {
            try {
                // Fix: Use folder name with underscore for JSON file name
                const response = await fetch(`assets/${folder}/${folder}.json`);
                if (response.ok) {
                    const data = await response.json();
                    charactersData[data.id] = data;
                    console.log(`Loaded character: ${data.name}`);
                } else {
                    console.log(`Could not load ${folder}.json - file not found`);
                }
            } catch (error) {
                console.log(`Error loading ${folder} data:`, error);
            }
        }
        
        // Log loaded characters for debugging
        console.log('Loaded characters:', Object.keys(charactersData));
    }
    
    // Initialize character selector (Div 1) - MODIFIED to work with Uma Musume JSON
    function initializeCharacterSelector() {
        const umaSelect = document.getElementById('uma-select');
        
        if (!umaSelect) {
            console.error('Uma select element not found');
            return;
        }
        
        // Check if Uma Musume data is already loaded and populated
        if (umaMusumeData.uma_musume && umaMusumeData.uma_musume.length > 0) {
            console.log('Uma Musume data already loaded, skipping character selector initialization');
            return;
        }
        
        // Only proceed if no Uma Musume data is available (fallback to old system)
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
            
            // Add change event listener for old system
            umaSelect.addEventListener('change', function() {
                // Check if this is an Uma Musume selection or old character
                if (umaMusumeData.uma_musume && umaMusumeData.uma_musume.find(uma => uma.id == this.value)) {
                    // Handle as Uma Musume
                    handleUmaSelectionChange();
                } else {
                    // Handle as old character
                    loadCharacter(this.value);
                }
            });
        }
    }
    
    // Load character data into UI - MODIFIED for Uma Musume compatibility
    function loadCharacter(characterId) {
        console.log(`Loading character: ${characterId}`);
        
        // First check if this is an Uma Musume ID
        if (umaMusumeData.uma_musume) {
            const umaMatch = umaMusumeData.uma_musume.find(uma => uma.id == characterId);
            if (umaMatch) {
                console.log('Found Uma Musume match, delegating to handleUmaSelectionChange');
                currentUma = umaMatch;
                handleUmaSelectionChange();
                return;
            }
        }
        
        // Otherwise, use old character system
        currentCharacter = charactersData[characterId];
        
        if (!currentCharacter) {
            console.error(`Character data not found for: ${characterId}`);
            return;
        }
        
        console.log(`Loaded character data:`, currentCharacter);
        
        // Update avatar (Div 4)
        updateAvatar();
        
        // Update star rating (Div 5)
        updateStarRatingFromCharacter();
        
        // Update unique skill (Div 6)
        updateUniqueSkillFromCharacter();
        
        // Update character details in stats section (Div 2)
        updateCharacterDetails();
    }
    
    // Update avatar image (Div 4) - MODIFIED for Uma Musume compatibility
    function updateAvatar() {
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
            // Use character id for image path (old system)
            const imagePath = `assets/${currentCharacter.id}/${currentCharacter.id}.png`;
            avatarImg.src = imagePath;
            avatarImg.alt = `${currentCharacter.name} avatar`;
            
            // Add error handling for missing images
            avatarImg.onerror = function() {
                console.log(`Could not load avatar image: ${imagePath}`);
                this.src = 'assets/avatars/agnes_tachyon.png'; // Fallback to Uma Musume default
            };
        }
    }
    
    // Update star rating based on character (Div 5)
    function updateStarRatingFromCharacter() {
        if (!currentCharacter) return;
        
        const defaultStar = currentCharacter.default_star || 1;
        console.log(`Setting star rating to: ${defaultStar}`);
        
        if (window.setStarRating) {
            window.setStarRating(defaultStar);
        } else {
            console.warn('setStarRating function not available yet');
        }
    }
    
    // Update unique skill info (Div 6)
    function updateUniqueSkillFromCharacter() {
        if (!currentCharacter) return;
        
        console.log(`Character skills:`, currentCharacter.skills);
        
        // Get current star rating to determine which skill to show
        const currentStarRating = getCurrentStarRating();
        
        // Find skill based on star rating
        let selectedSkill = findSkillByStarRating(currentStarRating);
        
        if (selectedSkill) {
            console.log(`Found skill for ${currentStarRating} stars:`, selectedSkill);
            updateSkillDisplay(selectedSkill);
        } else {
            console.log(`No skill found for ${currentStarRating} stars`);
            clearSkillDisplay();
        }
    }
    
    // Helper function to get current star rating
    function getCurrentStarRating() {
        const activeStars = document.querySelectorAll('.star.active');
        return activeStars.length;
    }
    
        // Helper function to find skill by star rating
    function findSkillByStarRating(starRating) {
        if (!currentCharacter || !currentCharacter.skills) return null;
        
        // Define rarity mapping
        const rarityMap = {
            1: "1-2 star",
            2: "1-2 star", 
            3: "3 star",
            4: "3 star",  // 4 sao cũng dùng skill 3 sao
            5: "3 star"   // 5 sao cũng dùng skill 3 sao
        };
        
        const targetRarity = rarityMap[starRating];
        
        // Find skill with matching rarity
        return currentCharacter.skills.find(skill => 
            skill.rarity === targetRarity || 
            skill.rarity === `${starRating} star` ||
            skill.rarity === `${starRating}-star`
        );
    }
    
    // Helper function to update skill display
    function updateSkillDisplay(skill) {
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
        
        // Update formula display
        const formula = document.querySelector('.formula');
        if (formula) {
            formula.textContent = skill.name;
        }
    }
    
    // Helper function to clear skill display
    function clearSkillDisplay() {
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
    }
    
    // Update character details in stats section
    function updateCharacterDetails() {
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
            if (window.updateUniqueSkillScore) {
                window.updateUniqueSkillScore();
            }
            // Also update overall score
            if (window.updateOverallScore) {
                window.updateOverallScore();
            }
        }, 50);
    }
    
    // Initialize star rating functionality (Div 5)
    function initializeStarRating() {
        const stars = document.querySelectorAll('.star');
        const starContainer = document.querySelector('.star-rating');
        let currentRating = 3; // Default rating
        
        // Set initial rating
        updateStarDisplay(currentRating);
        
        stars.forEach((star, index) => {
            const rating = index + 1;
            
            // Hover effect
            star.addEventListener('mouseenter', function() {
                updateStarDisplay(rating, true);
            });
            
            // Click to set rating
            star.addEventListener('click', function() {
                handleStarRatingChange(rating);
                
                // Force immediate update of unique skill score
                setTimeout(() => {
                    if (window.updateUniqueSkillScore) {
                        window.updateUniqueSkillScore();
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
        starContainer.addEventListener('mouseleave', function() {
            updateStarDisplay(currentRating);
        });
        
        function updateStarDisplay(rating, isHover = false) {
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
        }
        
        // Expose function to set rating programmatically
        window.setStarRating = function(rating) {
            currentRating = rating;
            updateStarDisplay(currentRating);
            
            // Trigger skill update when star rating changes
            if (currentCharacter) {
                updateUniqueSkillFromCharacter();
            }
            
            // Update unique skill score when star rating changes programmatically
            if (window.updateUniqueSkillScore) {
                window.updateUniqueSkillScore();
            }
        };
        
        // Add function to handle manual star rating changes
        function handleStarRatingChange(newRating) {
            currentRating = newRating;
            updateStarDisplay(currentRating);
            
            // Update skill info based on new star rating
            if (currentCharacter) {
                updateUniqueSkillFromCharacter();
            }
            
            // Update unique skill score when star rating changes
            if (window.updateUniqueSkillScore) {
                window.updateUniqueSkillScore();
            }
        }
    }
    
    // Initialize unique skill dropdown (Div 6)
    // Calculate unique skill score based on star level and skill level
    function getUniqueSkillScore(starLevel, skillLevel) {
        if (starLevel <= 2) {
            return skillLevel * 120;
        } else { // starLevel >= 3
            return skillLevel * 170;
        }
    }
    
    function initializeUniqueSkill() {
        const uniqueLevelSelect = document.getElementById('unique-level');
        const uniqueScoreDisplay = document.getElementById('unique-skill-score');
        
        function updateUniqueSkillScore() {
            const skillLevel = parseInt(uniqueLevelSelect?.value) || 1;
            
            // Get current star rating safely
            let starLevel = 3; // default
            if (typeof currentRating !== 'undefined' && currentRating > 0) {
                starLevel = currentRating;
            } else {
                // Try to get from DOM if currentRating not available
                const activeStars = document.querySelectorAll('.star.active');
                if (activeStars.length > 0) {
                    starLevel = activeStars.length;
                }
            }
            
            const score = getUniqueSkillScore(starLevel, skillLevel);
            
            if (uniqueScoreDisplay) {
                uniqueScoreDisplay.textContent = score;
            }
            
            console.log(`Unique Skill - Stars: ${starLevel}, Level: ${skillLevel}, Score: ${score} [Updated at ${new Date().toLocaleTimeString()}]`);
            
            // Update overall score when unique skill changes
            if (window.updateOverallScore) {
                window.updateOverallScore();
            }
            
            return score;
        }
        
        if (uniqueLevelSelect) {
            uniqueLevelSelect.addEventListener('change', function() {
                console.log('Unique skill level changed to:', this.value);
                // Force immediate update
                setTimeout(() => {
                    updateUniqueSkillScore();
                }, 1);
            });
        }
        
        // Initial calculation with delay to ensure star rating is initialized
        setTimeout(() => {
            updateUniqueSkillScore();
        }, 100);
        
        // Expose function to be called when star rating changes
        window.updateUniqueSkillScore = updateUniqueSkillScore;
    }
    
    // Initialize stats system
    function initializeStatsSystem() {
        const statInputs = document.querySelectorAll('.stat-input');
        
        statInputs.forEach(input => {
            // Add event listener for real-time calculation
            input.addEventListener('input', function() {
                updateStatDisplay(this);
            });
            
            // Initialize with current values
            updateStatDisplay(input);
        });
        
        // Wait for all individual updates to complete, then calculate total
        setTimeout(() => {
            updateTotalStatsScore();
        }, 50);
        
        function updateStatDisplay(input) {
            const statRow = input.closest('.stat-row');
            const ratingElement = statRow.querySelector('.rating');
            const scoreElement = statRow.querySelector('.score');
            
            const statValue = parseInt(input.value) || 0;
            
            // Calculate and update rating
            const rating = calculateStatRating(statValue);
            ratingElement.textContent = rating;
            
            // Calculate and update score
            const score = calculateStatScore(statValue);
            scoreElement.textContent = score;
            
            // Update total stats score
            updateTotalStatsScore();
        }
        
        function updateTotalStatsScore() {
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
            if (window.updateOverallScore) {
                window.updateOverallScore();
            }
        }
        
        // Force initial calculation of total stats score
        setTimeout(() => {
            console.log('=== FORCE UPDATE TOTAL STATS ===');
            updateTotalStatsScore();
        }, 100);
        
        // Also force update when all stats are initialized
        setTimeout(() => {
            console.log('=== SECOND FORCE UPDATE TOTAL STATS ===');
            updateTotalStatsScore();
        }, 500);
    }
    
    // Initialize skill system
    async function initializeSkillSystem() {
        const addSkillBtn = document.querySelector('.add-skill-btn');
        const skillsList = document.querySelector('.skills-list');
        
        // Load skills data from JSON file
        let skillsData = {};
        try {
            const response = await fetch('./libs/skills_lib.json');
            if (response.ok) {
                const skillsLib = await response.json();
                // Convert the JSON structure to match our existing format
                for (const [color, skills] of Object.entries(skillsLib)) {
                    skillsData[color] = skills;
                }
                console.log('Skills data loaded successfully from skills_lib.json');
            } else {
                throw new Error('Failed to load skills_lib.json');
            }
        } catch (error) {
            console.warn('Could not load skills_lib.json, using fallback data:', error);
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

        // Add event listener to Add Skill button
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', addNewSkillRow);
        }

        function addNewSkillRow() {
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
            setupSkillRowListeners(skillRow);
        }

        function setupSkillRowListeners(skillRow) {
            const colorSelect = skillRow.querySelector('.color-select');
            const skillSelect = skillRow.querySelector('.skill-select');
            const removeBtn = skillRow.querySelector('.remove-skill-btn');
            const scoreInput = skillRow.querySelector('.skill-score');
            
            colorSelect.addEventListener('change', function() {
                updateSkillOptions(skillSelect, this.value);
                updateSkillScore(skillSelect, scoreInput);
            });
            
            skillSelect.addEventListener('change', function() {
                updateSkillScore(this, scoreInput);
            });
            
            removeBtn.addEventListener('click', function() {
                skillRow.remove();
                updateTotalScore();
            });
            
            updateSkillOptions(skillSelect, colorSelect.value);
        }

        function updateSkillOptions(skillSelect, color) {
            skillSelect.innerHTML = '<option value="">Select a skill...</option>';
            
            if (skillsData[color]) {
                skillsData[color].forEach(skill => {
                    const option = document.createElement('option');
                    option.value = skill.name.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = skill.name;
                    option.setAttribute('data-score', JSON.stringify(skill.score));
                    option.setAttribute('data-check-type', skill['check-type'] || '');
                    skillSelect.appendChild(option);
                });
            }
        }

        function updateSkillScore(skillSelect, scoreInput) {
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
                            const ratingLevel = getRatingLevelFromDiv7(checkType);
                            finalScore = scores[ratingLevel] || scores.base || scores.good || 0;
                            
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
            updateTotalScore();
        }
        
        function getRatingLevelFromDiv7(checkType) {
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
            
            // Convert rating to score level
            if (['A', 'S'].includes(rating)) return 'good';
            if (['B', 'C'].includes(rating)) return 'average';
            if (['D', 'E', 'F'].includes(rating)) return 'bad';
            if (rating === 'G') return 'terrible';
            
            return 'good'; // default
        }
        
        function updateAllSkillScores() {
            const skillSelects = document.querySelectorAll('.skill-select');
            skillSelects.forEach(skillSelect => {
                if (skillSelect.value) { // Only update if skill is selected
                    const scoreInput = skillSelect.closest('.skill-row').querySelector('.skill-score');
                    updateSkillScore(skillSelect, scoreInput);
                }
            });
        }

        function updateTotalScore() {
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
            if (window.updateOverallScore) {
                window.updateOverallScore();
            }
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
                
                removeBtn.addEventListener('click', function() {
                    skillRow.remove();
                    updateTotalScore();
                });
            }
            
            setupSkillRowListeners(skillRow);
        });
        
        // Add listeners to div7 rating selects to update skill scores when ratings change
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
                selectElement.addEventListener('change', function() {
                    console.log(`Rating changed: ${selectId} = ${this.value}`);
                    // Update all skill scores when rating changes
                    updateAllSkillScores();
                });
            } else {
                console.warn(`Div7 element not found: ${selectId}`);
            }
        });
        
        // Initial calculation of all skill scores
        updateAllSkillScores();
        updateTotalScore();
        
        // Debug function to test rating logic
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
    
    // Overall Score calculation function for div8
    function updateOverallScore() {
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
        updateOverallRating(overallScore);
        
        return overallScore;
    }
    
    // Function to calculate and update rating based on overall score
    function updateOverallRating(overallScore) {
        let rating = 'G';
        let nextRating = '';
        let nextThreshold = 0;
        
        // Define rating thresholds based on the image
        const ratingThresholds = [
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
        
        // Find current rating and next threshold
        for (const threshold of ratingThresholds) {
            if (overallScore >= threshold.min) {
                rating = threshold.rating;
                nextRating = threshold.next;
                // Find next threshold value
                if (nextRating) {
                    const nextThresholdData = ratingThresholds.find(t => t.rating === nextRating);
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
});