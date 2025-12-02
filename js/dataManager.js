// Data Manager Module - Handles loading and managing Uma Musume and character data

const DataManager = (function() {
    'use strict';

    // Private variables
    let umaMusumeData = {};
    let charactersData = {};
    let currentUma = null;
    let currentCharacter = null;

    // Public API
    return {
        // Uma Musume data methods
        async loadUmaMusumeData() {
            try {
                console.log('Loading Uma Musume data...');
                const response = await fetch('assets/data/uma_musume.json');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Uma Musume data loaded:', data);
                umaMusumeData = data;
                return data;
            } catch (error) {
                console.error('Error loading Uma Musume data:', error);
                throw error;
            }
        },

        getUmaMusumeData() {
            return umaMusumeData;
        },

        getCurrentUma() {
            return currentUma;
        },

        setCurrentUma(uma) {
            currentUma = uma;
        },

        findUmaById(id) {
            if (umaMusumeData.uma_musume && Array.isArray(umaMusumeData.uma_musume)) {
                return umaMusumeData.uma_musume.find(uma => uma.id === id);
            }
            return null;
        },

        // Character data methods
        async loadCharacterData() {
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
            
            console.log('Loaded characters:', Object.keys(charactersData));
            return charactersData;
        },

        getCharactersData() {
            return charactersData;
        },

        getCurrentCharacter() {
            return currentCharacter;
        },

        setCurrentCharacter(character) {
            currentCharacter = character;
        },

        findCharacterById(id) {
            return charactersData[id] || null;
        },

        // Add fallback data if no characters loaded
        addFallbackCharacter() {
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
        }
    };
})();

// Make available globally
window.DataManager = DataManager;
