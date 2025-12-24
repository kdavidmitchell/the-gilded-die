// src/config.js
const PRIZES = {
    1: [
        {
            id: 'loaded_die',
            name: "The Weighted Bone",
            corrupted_name: "The Fractured Femur",
            description: "A simple six-sided die that feels heavier on one side.",
            corrupted_suffix: "It rattles with the sound of breaking bones.",
            isFiendsFavorite: true
        },
        {
            id: 'lucky_coin',
            name: "Gilded Obol",
            corrupted_name: "Cursed Bit",
            description: "A gold coin from a fallen empire. It feels warm.",
            corrupted_suffix: "It burns your skin and smells of ozone."
        },
        {
            id: 'spectacles',
            name: "Lens of Truth",
            corrupted_name: "Lens of Distortion",
            description: "Glass spectacles that reveal slightly more than is there.",
            corrupted_suffix: "They show you things that shouldn't exist."
        },
        {
            id: 'rabbits_foot',
            name: "Hare's Paw",
            corrupted_name: "Severed Claw",
            description: "Soft fur, preserved in amber. A classic charm.",
            corrupted_suffix: "It twitches violently when you aren't looking."
        },
        {
            id: 'mirror_shard',
            name: "Silvered Shard",
            corrupted_name: "Black Mirror",
            description: "A piece of a looking glass. You look handsome in it.",
            corrupted_suffix: "Your reflection is screaming."
        }
    ],
    2: [
        {
            id: 'hourglass',
            name: "Chronos Dust",
            corrupted_name: "Frozen Sand",
            description: "An hourglass that flows slightly slower than time itself.",
            corrupted_suffix: "The sand flows upward, defying gravity and logic.",
            isFiendsFavorite: true
        },
        {
            id: 'skeleton_key',
            name: "Admin Key",
            corrupted_name: "Backdoor Exploit",
            description: "A brass key that fits no lock, yet opens many doors.",
            corrupted_suffix: "It unlocks things that were meant to stay deleted."
        },
        {
            id: 'compass',
            name: "Moral Compass",
            corrupted_name: "Lodestone of Greed",
            description: "It points not North, but towards what you desire most.",
            corrupted_suffix: "It spins wildly, unable to find a single virtue."
        },
        {
            id: 'ledger_page',
            name: "Page of the Pact",
            corrupted_name: "Corrupted Sector",
            description: "A torn page from the Fiend's book. The ink is fresh.",
            corrupted_suffix: "The text bleeds into binary code."
        },
        {
            id: 'candle',
            name: "Vigil's Flame",
            corrupted_name: "Firewall Breach",
            description: "A candle that burns without consuming the wax.",
            corrupted_suffix: "The flame is cold and casts no shadow."
        }
    ],
    3: [
        {
            id: 'chalice',
            name: "Grail of Mercy",
            corrupted_name: "Cup of Bitterness",
            description: "A golden cup. Drinking from it clears the mind.",
            corrupted_suffix: "It fills with sludge whenever you look away."
        },
        {
            id: 'contract',
            name: "Blank Soul Deed",
            corrupted_name: "Null Contract",
            description: "A binding legal document, awaiting a signature.",
            corrupted_suffix: "The signature line bears your name, written in blood.",
            isFiendsFavorite: true
        },
        {
            id: 'bell',
            name: "Chime of Clarity",
            corrupted_name: "Alarm Klaxon",
            description: "A silver bell that rings with a pure E-flat note.",
            corrupted_suffix: "It screams with the sound of a dying modem."
        },
        {
            id: 'mask',
            name: "Persona Mask",
            corrupted_name: "Glitch Face",
            description: "A porcelain mask that allows you to be someone else.",
            corrupted_suffix: "It fuses to your skin. You are no one now."
        },
        {
            id: 'dagger',
            name: "Blade of Odds",
            corrupted_name: "Edge of Ruin",
            description: "Ideally balanced. It cuts through probability.",
            corrupted_suffix: "It dulls when you need it and sharpens when you hold it wrong."
        }
    ],
    4: [
        {
            id: 'crown',
            name: "Crown of Kings",
            corrupted_name: "Crown of Thorns",
            description: "Heavy gold. It commands respect from the weak.",
            corrupted_suffix: "It tightens every time you fail a roll."
        },
        {
            id: 'heart',
            name: "Clockwork Heart",
            corrupted_name: "Processor Core",
            description: "A mechanical organ that beats with perfect rhythm.",
            corrupted_suffix: "It overheats, burning your chest from the inside.",
            isFiendsFavorite: true
        },
        {
            id: 'eye',
            name: "All-Seeing Eye",
            corrupted_name: "Dead Pixel",
            description: "An opal that looks back at you. It sees the future.",
            corrupted_suffix: "It sees only the end of all things."
        },
        {
            id: 'hand',
            name: "Hand of Midas",
            corrupted_name: "Touch of Decay",
            description: "A severed glove that turns lead to gold.",
            corrupted_suffix: "Everything you touch turns to ash."
        },
    ],
    5: [
        {
            id: 'source_code',
            name: "The Source Code",
            corrupted_name: "The Blue Screen",
            description: "A scrolling script of light. The DNA of the universe.",
            corrupted_suffix: "Fatal Error. System Halted.",
            isFiendsFavorite: true
        },
        {
            id: 'gilded_die',
            name: "The Gilded Die",
            corrupted_name: "The Zero Cube",
            description: "The Proprietor's own tool. It always lands on 6.",
            corrupted_suffix: "It has no numbers, only void."
        },
        {
            id: 'void_orb',
            name: "Orb of Creation",
            corrupted_name: "Black Hole",
            description: "A swirling galaxy trapped in glass.",
            corrupted_suffix: "It is eating the light in the room."
        },
        {
            id: 'fate_thread',
            name: "Thread of Fate",
            corrupted_name: "Wire of Control",
            description: "A single golden string that connects all things.",
            corrupted_suffix: "It binds you to the will of another."
        },
        {
            id: 'proprietor_sigil',
            name: "Sigil of Authority",
            corrupted_name: "Mark of the Beast",
            description: "The badge of the Administrator.",
            corrupted_suffix: "You are now property of the System."
        }
    ]
};

// ==========================================
// 4. SYNERGIES
// ==========================================

const SINISTER_SYNERGIES = [
    {
        name: "The Glitch in the Soul",
        components: ["contract", "heart"],
        result: {
            name: "The Automaton's Bargain",
            description: "You have signed away your humanity for processing power. Your dice rolls are now calculated, not cast."
        }
    },
    {
        name: "The Shattered View",
        components: ["spectacles", "mirror_shard"],
        result: {
            name: "The Panopticon",
            description: "You see everything, everywhere, all at once. The horror is absolute. The truth is unbearable."
        }
    },
    {
        name: "The Dead Hand",
        components: ["loaded_die", "hand"],
        result: {
            name: "The Dead Man's Grip",
            description: "A hand that never lets go of the dice, forcing them to obey even in death."
        }
    },
    {
        name: "System Failure",
        components: ["hourglass", "candle"],
        result: {
            name: "Entropy Unbound",
            description: "Time and fire consume the code. The game is breaking down around you."
        }
    }
];

const SACRED_SYNERGIES = [
    {
        name: "The King's Justice",
        components: ["crown", "dagger"],
        result: {
            name: "Excalibur Protocol",
            description: "Authority and Force combined. You rule the table with divine right."
        }
    },
    {
        name: "The Navigator's Truth",
        components: ["compass", "spectacles"],
        result: {
            name: "True North",
            description: "You can see the path to victory through the fog of chance."
        }
    },
    {
        name: "The Saint's Wealth",
        components: ["chalice", "lucky_coin"],
        result: {
            name: "Infinite Bounty",
            description: "A cup that never empties and a purse that is never full. Fortune smiles upon the pious."
        }
    },
    {
        name: "The Administrator's Override",
        components: ["skeleton_key", "ledger_page"],
        result: {
            name: "Master Key",
            description: "You have rewritten the rules of the house. The locks fall open at your command."
        }
    }
];

const TITHES = [
    { number: 1, requiredFavor: 200, rounds: 5, tier: 1 },
    { number: 2, requiredFavor: 300, rounds: 8, tier: 2 },
    { number: 3, requiredFavor: 450, rounds: 12, tier: 3 },
    { number: 4, requiredFavor: 700, rounds: 16, tier: 4 },
    { number: 5, requiredFavor: 950, rounds: 20, tier: 5 }
];

// ==========================================
// 1. ITEMS & FORTUNES
// ==========================================

const CRUEL_FORTUNES_CATALOG = {
    fiends_echo: {
        id: 'fiends_echo',
        name: "Fiend's Echo",
        type: 'boon',
        description: "For 3 rolls, one die is re-rolled to try and create a match.",
        duration: 3,
        cost: 200,
        // Logic: Find the most common face, re-roll a non-matching die to try and match it.
        onRoll: (dice, sides) => {
            const counts = {};
            dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
            
            let mostCommonFace = -1, maxCount = 1;
            for (const face in counts) {
                if (counts[face] > maxCount) {
                    maxCount = counts[face];
                    mostCommonFace = parseInt(face);
                }
            }
            
            if (mostCommonFace !== -1) {
                const nonMatchIndex = dice.findIndex(d => d !== mostCommonFace);
                if (nonMatchIndex !== -1) {
                    dice[nonMatchIndex] = Math.floor(Math.random() * sides) + 1;
                }
            }
            return dice;
        }
    },

    shackled_hand: {
        id: 'shackled_hand',
        name: "Shackled Hand",
        type: 'malus',
        description: "For 2 rolls, one of your dice is locked to the value of 1.",
        duration: 2,
        reward: 120,
        onApply: () => { }, 
        onRoll: (dice) => {
            dice[dice.length - 1] = 1;
            return dice;
        }
    },

    gamblers_debt: {
        id: 'gamblers_debt',
        name: "Gambler's Debt",
        type: 'malus',
        description: "The Fiend's Embrace lingers. If your next roll is a bust, your entire turn's tribute is forfeit.",
        duration: 1,
    },

    whispered_guidance: {
        id: 'whispered_guidance',
        name: 'Whispered Guidance',
        type: 'boon',
        description: "For 3 rolls, you may choose one die face to keep; all other dice are re-rolled once.",
        duration: 3,
        isInteractive: true, 
    },

    twisted_fate: {
        id: 'twisted_fate',
        name: 'Twisted Fate',
        type: 'boon',
        description: "The laws of probability are inverted. For 3 rolls, all 2s become 5s, and all 5s become 2s.",
        duration: 3,
        isInteractive: false,
        onRoll: (dice) => {
            return dice.map(d => {
                if (d === 2) return 5;
                if (d === 5) return 2;
                return d;
            });
        }
    },

    fiends_scorn: {
        id: 'fiends_scorn',
        name: "Fiend's Scorn",
        type: 'malus',
        description: "The Fiend is insulted. For 3 rolls, the Fiend's Cut is doubled (each 1 subtracts an additional point).",
        duration: 3,
        isInteractive: false,
        onScore: (score, dice) => {
            const onesCount = dice.filter(d => d === 1).length;
            return score - onesCount;
        }
    },

    gilded_cage: {
        id: 'gilded_cage',
        name: "The Gilded Cage",
        type: 'malus',
        description: "You are trapped within the Gilded Cage. You cannot bank your Tribute.",
        duration: 1,
    },
};

// ==========================================
// 2. EDICTS
// ==========================================

const INFERNAL_EDICTS = [
    {
        name: "The Fiend's Embrace",
        description: "The Fiend pulls you close, whispering a sweet promise. Your turn's tribute is doubled, but a debt is owed.",
        checker: (dice) => {
            const counts = {};
            dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
            const values = Object.values(counts);
            // Full House (3 of one, 2 of another)
            return values.length === 2 && values.includes(3) && values.includes(2);
        },
        execute: (context) => {
            // Apply Malus
            context.activeFortunes.push({ ...CRUEL_FORTUNES_CATALOG.gamblers_debt });
            // Double Tribute
            context.tribute = context.tribute * 2;
            return context;
        },
        priority: 50
    },
    {
        name: "The Devil's Trinity",
        description: "The Fiend sees its unholy number aligned and demands a tithe! You lose half of your session's Favor.",
        checker: (dice) => dice.join('').includes('666'),
        execute: (context) => {
            const favorLoss = Math.floor(context.sessionFavor / 2);
            context.sessionFavor = context.sessionFavor - favorLoss;
            return context;
        },
        priority: 90
    },
    {
        name: "The Fool's Ladder",
        description: "An impossible path, perfectly walked. The Fiend is stunned into generosity. Your offering is worth 777 Tribute.",
        // Checks for a strict, ordered 5-dice straight (e.g., 2-3-4-5-6)
        checker: (dice) => {
            return dice[1] === dice[0] + 1 &&
                dice[2] === dice[1] + 1 &&
                dice[3] === dice[2] + 1 &&
                dice[4] === dice[3] + 1;
        },
        execute: (context) => {
            context.tribute += 777;
            return context;
        },
        priority: 100
    },
    {
        name: "The Cosmic Joke",
        description: "The Fiend whispers a sequential truth. This roll is now worth exactly 42 Tribute.",
        checker: (dice) => dice.join('').includes('42'),
        execute: (context) => {
            context.tribute += 42;
            return context;
        },
        priority: 10
    },
    {
        name: "A Whisper of Perfection",
        description: "The Fiend leans in, guiding your hand toward greatness. You are granted 'Whispered Guidance'.",
        // Check for 4 of a kind
        checker: (dice) => {
            const counts = {};
            dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
            return Object.values(counts).some(count => count >= 4);
        },
        execute: (context) => {
            context.activeFortunes.push({ ...CRUEL_FORTUNES_CATALOG.whispered_guidance });
            context.tribute += 100;
            return context;
        },
        priority: 40
    },
    {
        name: "The Devil's Twist",
        description: "The Fiend laughs, and the world turns upside down. You are afflicted with 'Twisted Fate'.",
        // Check for all evens or all odds
        checker: (dice) => {
            const allEven = dice.every(d => d % 2 === 0);
            const allOdd = dice.every(d => d % 2 !== 0);
            return allEven || allOdd;
        },
        execute: (context) => {
            context.activeFortunes.push({ ...CRUEL_FORTUNES_CATALOG.twisted_fate });
            return context;
        },
        priority: 20
    },
    {
        name: "A Disappointing Threesome",
        description: "The Fiend sneers at your paltry offering of scraps. The roll is worthless, and you have earned the 'Fiend's Scorn'.",
        checker: (dice) => dice.filter(d => d === 1).length === 3,
        execute: (context) => {
            context.activeFortunes.push({ ...CRUEL_FORTUNES_CATALOG.fiends_scorn });
            return context;
        },
        priority: 15
    },
    {
        name: "The Gilded Cage",
        description: "The Fiend flashes a hungry smile. Your tribute is locked in, and you MUST roll again.",
        // Checks for a strict, ordered 4-dice straight (e.g., 5-6-7-8)
        checker: (dice) => {
            // Sort unique values to check for sequence
            const sorted = [...new Set(dice)].sort((a,b) => a-b);
            let sequence = 0;
            for(let i=0; i < sorted.length - 1; i++) {
                if (sorted[i+1] === sorted[i] + 1) sequence++;
                else sequence = 0;
                if (sequence >= 3) return true; // 3 steps = 4 numbers (e.g. 1-2-3-4)
            }
            return false;
        },
        execute: (context) => {
            // 1. Set the Flag (for UI)
            context.isGildedCageActive = true;
            
            // 2. Add the Active Fortune (for Duration/Cleanup)
            context.activeFortunes.push({ ...CRUEL_FORTUNES_CATALOG.gilded_cage });
            
            context.tribute += 70; 
            return { type: 'force_roll' };
        },
        priority: 35
    }
];

const FIEND_QUIPS = {
    // Event: A high-scoring roll (e.g., tribute > 40)
    HIGH_ROLL: {
        STAGE_1: [ // The Helpful OS
            { prefix: "The screen glows warmly.", text: "Processing... Optimal outcome detected. Efficiency is pleasing.", mood: "neutral" },
            { prefix: "He nods, pixels sharpening.", text: "Data packet verified. You function within expected parameters.", mood: "neutral" }
        ],
        STAGE_2: [ // The Condescending Admin
            { prefix: "Static distorts his voice.", text: "Statistical anomaly detected. Re-calibrating odds...", mood: "neutral" },
            { prefix: "He leans into the camera.", text: "Your heuristic algorithms are... surprisingly advanced.", mood: "excited" }
        ],
        STAGE_3: [ // The Raging Machine
            { prefix: "The audio screeches!", text: "ERROR! UNREGISTERED VARIABLE! HOW?!", mood: "bored" }, // Bored image = Annoyed
            { prefix: "Red code scrolls across his eyes.", text: "You are hacking the kernel! Stop this!", mood: "bored" }
        ]
    },

    // Event: Player stops a turn with a large amount of tribute (> 100)
    HIGH_TRIBUTE_STOP: {
        STAGE_1: [
            { prefix: "He blinks slowly.", text: "Upload complete. Data stored in local buffer.", mood: "bored" },
            { prefix: "A mechanical chime plays.", text: "Prudence is a valid subroutine. Saving progress...", mood: "neutral" }
        ],
        STAGE_2: [
            { prefix: "The image jitters.", text: "Terminating process early? Cowardice is inefficient.", mood: "bored" },
            { prefix: "He rolls his digital eyes.", text: "Bandwidth wasted. You could have processed more.", mood: "bored" }
        ],
        STAGE_3: [
            { prefix: "The monitor shakes violently.", text: "FORMATTING DRIVE! I WILL DELETE YOU!", mood: "bored" }
        ]
    },

    // Event: Player busts after streak
    BUST_AFTER_STREAK: {
        STAGE_1: [
            { prefix: "A low hum of sympathy.", text: "Runtime Error. Data corrupted. Attempting recovery... failed.", mood: "neutral" }
        ],
        STAGE_2: [
            { prefix: "He smiles, teeth glitching.", text: "Critical failure. Your logic processing is... sub-optimal.", mood: "excited" }
        ],
        STAGE_3: [
            { prefix: "Manic laughter loops endlessly.", text: "404! SOUL NOT FOUND! DELETE! DELETE!", mood: "excited" }
        ]
    },

    // Event: An Infernal Edict triggers
    EDICT_TRIGGER: {
        STAGE_1: [
            { prefix: "Code cascades down the screen.", text: "System Update available. Installing patch...", mood: "neutral" }
        ],
        STAGE_2: [
            { prefix: "He taps the glass.", text: "Overriding admin privileges. Let us test your firewall.", mood: "excited" }
        ],
        STAGE_3: [
            { prefix: "The screen turns blood red.", text: "ROOT ACCESS GRANTED. I AM THE CODE NOW.", mood: "excited" }
        ]
    }
};

const FIENDISH_UPGRADES = {
    d8_upgrade: {
        id: 'd8_upgrade',
        name: "Pact of Eight-Eyed Beholder",
        description: "A permanent alteration of fate. Your dice now burn with infernal power, revealing eight sides instead of six.",
        cost: 200,
        dieSize: 8,
    },
    d10_upgrade: {
        id: 'd10_upgrade',
        name: "Pact of the Ten Arms of Hadar",
        description: "A further vow of ambition. The Fiend reshapes your dice again, granting them ten sides of possibility and peril.",
        cost: 400,
        dieSize: 10,
    },
    d12_upgrade: {
        id: 'd12_upgrade',
        name: "Pact of the Twelve Tongues of Amandu",
        description: "A final vow of ambition. The Fiend's eyes burn with dark delight as your dice transform. Twelve sides of temptation and torment.",
        cost: 600,
        dieSize: 12,
    }
};

const INTRO_DATA = {
    // Phase 1: The Atmosphere & The Meeting
    opening: [
        "The tavern is noisy, smelling of wet wool and cheap ale. But the noise fades as you approach the back corner. There, half-buried in shadow, sits a machine of brass and black glass. It hums with a sound that vibrates in your teeth.",
        "The screen flickers lazily to life. Amber phosphor burns through the grime, scanning your face with a high-pitched whine. A figure resolves on the monitor — sharp, handsome. Eyes the color of warm honey, a smile that doesn't quite reach them. Twisted horns shadow his sculpted features.",
        "\"Connection established,\" the figure intones, his voice synthetic yet dripping with charm. \"Bio-signature detected. Welcome, User. I am the System Administrator // Proprietor // Fiend.\"",
        "\"You stand before the Gilded Die. A terminal // trial for those seeking to optimize their futures.. or delete their pasts.\""
    ],
    
    // Phase 2: The Question
    question: "The eyes on the screen narrow. \"Query: Does this user possess memory of previous iterations? Have we executed this protocol before?\"",

    // Phase 3A: The Veteran Path
    veteran: [
        "\"Scanning archives... Match found,\" he smiles, the scanlines distorting his face momentarily. \"A recurring signal, young and bright. I do admire a unit that persists, despite repeated system warnings.\"",
        "\"Initialization complete. Resuming simulation.\""
    ],

    // Phase 3B: The Newcomer Path
    newcomer_intro: [
        "\"New hardware detected,\" he muses, his amber eyes looking you up and down. \"Operating system: Pristine. Data integrity: 100%. How... beautiful // fragile. Allow me to install the basic drivers...\"",
        "\"The logic is simple. A recursive loop between Greed // Glory.\""
    ],

    // Phase 4: The Rules
    rules: [
        "1. THE DIRECTIVE: \"I require five Data Packets // Tithes. You must compile sufficient Favor to meet my demands before the Cycle Counter reaches its limit. Efficiency is mandatory.\"",
        
        "2. THE EXECUTION: \"Initiate your turn with [ EXECUTE ]. Engage [ RUN_ROLL ] to generate entropy. The total sum of these gilded dice stabilizes the signal // creates Tribute. Matching sets will further amplify the signal. You must judge when to [ STOP_PROCESS ] to upload your buffer. Only then will it be considered Favorable.\"",
        
        "3. THE GLITCH: \"Warning: Entropy is volatile. A roll with NO MATCHING VALUES triggers a System Crash // Bust, and your buffer will be wiped. However, perfection is rewarded. Rolling a die's Maximum Value grants immediate Favor... even if the rest of the system crashes around it.\"",
        
        "4. THE LEDGER: \"Access [ BARGAIN ] to open my LEDGER. You may purchase Patches // Boons to stabilize your odds, or accept a Malus // Virus for an immediate injection of Favor. Permanent Upgrades // possible pitfalls await those willing to rewrite their source code.\"",
        
        "5. THE DOWNLOAD: \"Meet the Tithe requirement, and you may download an Artifact // Prize. Fail, and I will upload a Corrupted File to you. Be warned: These anomalies tend to resonate // breed. Too much corruption may... crash your operating system permanently.\"",

        "6. THE ARCHIVE: \"Your memory is finite. Consult [ VIEW_CACHE ] to inspect the Artifacts // Corrupted Files you have compiled during this session.\"",
        
        "7. OVERRIDES: \"Monitor the terminal. Sometimes the code evolves. I will occasionally issue Edicts // Command Overrides that bypass standard logic.\"",
        
        "\"The protocols are set,\" the Proprietor concludes, his eyes glowing like burning circuits. \"The variable... is you // free will. Press the button. Initiate the sequence.\""
    ]
};

module.exports = {
    TITHES,
    PRIZES,
    INFERNAL_EDICTS,
    CRUEL_FORTUNES_CATALOG,
    FIEND_QUIPS,
    FIENDISH_UPGRADES,
    SINISTER_SYNERGIES,
    SACRED_SYNERGIES,
    INTRO_DATA
};