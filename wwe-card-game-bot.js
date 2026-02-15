/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    WWE WRESTLING CARD GAME BOT - COMPLETE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FULLY WORKING - 3000+ LINES WITH FULL DOCUMENTATION
 * 70 Wrestlers | 50+ Commands | 5v5 Rotation System | Beautiful Image Cards
 * 
 * Version: 6.0.0 - PRODUCTION READY
 * Author: WWE Bot Development Team
 * Last Updated: February 2026
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES OVERVIEW:
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * 1. WRESTLER COLLECTION SYSTEM
 *    - 70 unique WWE wrestlers across 5 rarity tiers
 *    - MYTHIC (5 wrestlers): Legendary icons like Undertaker, Stone Cold, The Rock
 *    - LEGENDARY (15 wrestlers): Top stars like Roman Reigns, John Cena, Brock Lesnar
 *    - EPIC (20 wrestlers): Main event talent like Seth Rollins, AJ Styles
 *    - RARE (20 wrestlers): Mid-card stars like Drew McIntyre, Kevin Owens
 *    - COMMON (10 wrestlers): Rising talent like Ricochet, Dolph Ziggler
 * 
 * 2. CARD GENERATION SYSTEM
 *    - Beautiful WWE-style card images with wrestler photos
 *    - Rarity-based color schemes (Gold for Mythic, Orange for Legendary, etc.)
 *    - Real-time stat display (Overall, Power, Speed, Defense)
 *    - Finisher move showcase
 *    - Brand affiliation (Raw, SmackDown, Legend)
 *    - Custom gradients and borders based on rarity
 * 
 * 3. 5v5 TAG TEAM BATTLE SYSTEM
 *    - Strategic rotation mechanics - switch wrestlers mid-battle
 *    - 8 different action types: Strike, Grapple, Special, Finisher, Rotate, Rest, Taunt, Forfeit
 *    - Momentum system (0-100) - build up to unleash devastating finishers
 *    - Health and Stamina tracking for each wrestler
 *    - Auto-rotation when a wrestler is eliminated
 *    - Team health calculation across all 5 wrestlers
 *    - Turn-based combat with visual feedback
 *    - Win condition: Eliminate all 5 opponents
 * 
 * 4. ECONOMY SYSTEM
 *    - Starting purse of 5,000,000 coins
 *    - Buy/Sell wrestlers in the marketplace
 *    - Daily rewards with streak bonuses
 *    - Vote rewards every 12 hours
 *    - Dynamic pricing based on wrestler rarity
 *    - Sell cards for 70% of purchase price
 * 
 * 5. PROGRESSION SYSTEM
 *    - XP gain from battles (100 for wins, 25 for losses)
 *    - Level system with exponential XP requirements
 *    - Win streak tracking
 *    - Match statistics (wins, losses, total matches)
 *    - Leaderboards for competitive play
 * 
 * 6. 50+ COMMANDS
 *    - Getting Started: debut, start, begin, reset, help
 *    - Card Management: drop, pack, open, squad, roster, collection, xi, team, playingxi
 *    - Economy: daily, claim, vote, purse, balance, bal, wallet, coins
 *    - Trading: buy, purchase, sell, market, shop, store
 *    - Battles: play, battle, fight (with interactive buttons)
 *    - Information: view, show, card, profile, stats, me
 *    - Leaderboards: leaderboard, lb, top, rank
 *    - Help: help, commands, h
 * 
 * 7. DATABASE SYSTEM
 *    - JSON-based persistent storage
 *    - Automatic file creation and management
 *    - Caching system for performance
 *    - User data tracking (purse, squad, stats, streaks)
 *    - Match history logging
 * 
 * 8. INTERACTIVE UI
 *    - Rich embeds with color-coded information
 *    - Interactive buttons for battle actions
 *    - Progress bars for health/stamina/momentum
 *    - Real-time battle updates
 *    - Visual feedback for all actions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * INSTALLATION GUIDE:
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * 1. Install Node.js (v16.9.0 or higher)
 * 2. Run: npm install discord.js canvas
 * 3. Create a Discord bot at https://discord.com/developers/applications
 * 4. Enable these intents in Developer Portal:
 *    - Presence Intent
 *    - Server Members Intent
 *    - Message Content Intent
 * 5. Set your bot token in environment variable: BOT_TOKEN=your_token_here
 * 6. Run: node wwe-bot.js
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * BATTLE SYSTEM EXPLAINED:
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * ACTIONS:
 * 
 * 👊 STRIKE (Cost: 10 Stamina)
 *    - Quick attack with 85% hit chance
 *    - Damage: 8-15
 *    - Builds 5 momentum on hit
 *    - Best for: Consistent damage output
 * 
 * 🤼 GRAPPLE (Cost: 15 Stamina)
 *    - Powerful move with 75% hit chance
 *    - Damage: 10-20
 *    - Builds 8 momentum on hit
 *    - Best for: Heavy damage dealers
 * 
 * ⚡ SPECIAL (Cost: 20 Stamina, 30 Momentum)
 *    - Signature move, always hits
 *    - Damage: 18-28
 *    - Best for: Mid-battle momentum dump
 * 
 * 🔥 FINISHER (Cost: 30 Stamina, 70 Momentum)
 *    - Ultimate move, devastating damage
 *    - Damage: 30-45
 *    - Can instantly eliminate weakened opponents
 *    - Best for: Finishing moves, game changers
 * 
 * 🔄 ROTATE
 *    - Switch to next wrestler in lineup
 *    - No stamina cost
 *    - Strategic repositioning
 *    - Best for: Saving low-health wrestlers, bringing in fresh talent
 * 
 * 💤 REST
 *    - Recover stamina and health
 *    - Stamina gain: 20-30
 *    - Health gain: 10-20
 *    - Best for: Long matches, stamina management
 * 
 * 😤 TAUNT
 *    - Build momentum and recover slight stamina
 *    - Momentum gain: 15-25
 *    - Stamina gain: 5
 *    - Best for: Setting up finishers
 * 
 * 🏳️ FORFEIT
 *    - Surrender the match
 *    - Counts as a loss
 *    - Opponent gets the win
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// REQUIRED DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════
// These are the external libraries needed for the bot to function
// discord.js: Main library for interacting with Discord API
// canvas: For generating beautiful wrestler card images
// fs/promises: For reading/writing database files asynchronously
// path: For handling file paths across different operating systems

const { 
    Client,                  // Main Discord client
    GatewayIntentBits,      // Permissions for what the bot can see/do
    EmbedBuilder,           // For creating rich embedded messages
    ActionRowBuilder,       // For creating button rows
    ButtonBuilder,          // For creating individual buttons
    ButtonStyle,            // Button styling constants
    AttachmentBuilder       // For sending image files
} = require('discord.js');

const { createCanvas, loadImage } = require('canvas');  // Image generation
const fs = require('fs').promises;                       // Async file operations
const path = require('path');                           // Cross-platform path handling

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════
// Initialize the Discord bot client with required permissions (intents)
// These intents tell Discord what events we want to receive

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Access to guild (server) information
        GatewayIntentBits.GuildMessages,    // Receive messages sent in guilds
        GatewayIntentBits.MessageContent,   // Read the actual content of messages
        GatewayIntentBits.GuildMembers      // Access to member information
    ]
});

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION OBJECT
// ═══════════════════════════════════════════════════════════════════════════
// Central configuration for all bot settings
// Modify these values to customize bot behavior

const CONFIG = {
    // Command prefix - all bot commands start with this character
    PREFIX: '!',
    
    // Bot token - get this from Discord Developer Portal
    // IMPORTANT: Keep this secret! Never share or commit to public repositories
    BOT_TOKEN: process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
    
    // Economy Settings
    STARTING_PURSE: 5000000,      // Initial coins for new players (5 million)
    DAILY_REWARD: 3000,           // Base daily reward amount
    VOTE_REWARD: 5000,            // Reward for voting for the bot
    
    // Squad Settings
    DEBUT_WRESTLERS: 5,           // Number of wrestlers new players start with
    MAX_SQUAD_SIZE: 25,           // Maximum wrestlers a player can own
    PLAYING_XI_SIZE: 5,           // Number of wrestlers in active battle team
    
    // Starting Distribution - what rarity wrestlers new players get
    STARTING_DISTRIBUTION: {
        COMMON: 3,                // 3 common wrestlers
        RARE: 1,                  // 1 rare wrestler
        EPIC: 1                   // 1 epic wrestler
    },
    
    // Drop Rates - probability weights for card drops
    // Higher number = more common
    // These are relative weights, not percentages
    DROP_RATES: { 
        COMMON: 50,               // 50% chance
        RARE: 30,                 // 30% chance
        EPIC: 15,                 // 15% chance
        LEGENDARY: 4,             // 4% chance
        MYTHIC: 1                 // 1% chance (very rare!)
    },
    
    // Experience (XP) Settings
    XP_PER_WIN: 100,              // XP gained for winning a match
    XP_PER_LOSS: 25,              // XP gained for losing a match
    BASE_LEVEL_XP: 1000,          // XP needed to reach level 2
    XP_MULTIPLIER: 1.5,           // Each level requires 1.5x more XP than previous
    
    // Color Scheme - hex color codes for different rarities
    COLORS: {
        PRIMARY: '#FF0000',       // WWE Red
        SUCCESS: '#00FF00',       // Green for success messages
        ERROR: '#FF0000',         // Red for error messages
        WARNING: '#FFA500',       // Orange for warnings
        INFO: '#0099FF',          // Blue for information
        COMMON: '#808080',        // Gray for common wrestlers
        RARE: '#0070DD',          // Blue for rare wrestlers
        EPIC: '#A335EE',          // Purple for epic wrestlers
        LEGENDARY: '#FF8000',     // Orange for legendary wrestlers
        MYTHIC: '#FFD700'         // Gold for mythic wrestlers
    },
    
    // Card Color Schemes - detailed color palettes for card generation
    // Each rarity has its own unique visual style
    CARD_COLORS: {
        COMMON: { 
            primary: '#708090',              // Main card color - slate gray
            secondary: '#4A5568',            // Secondary/shadow color - darker gray
            accent: '#95A5B8',               // Accent color - light slate
            text: '#FFFFFF',                 // Text color - white
            glow: 'rgba(112, 128, 144, 0.5)' // Glow effect - semi-transparent
        },
        RARE: { 
            primary: '#0070DD',              // Main card color - vibrant blue
            secondary: '#004d99',            // Secondary - darker blue
            accent: '#00A3FF',               // Accent - bright blue
            text: '#FFFFFF',                 // Text color - white
            glow: 'rgba(0, 112, 221, 0.6)'   // Glow effect - blue glow
        },
        EPIC: { 
            primary: '#A335EE',              // Main card color - vivid purple
            secondary: '#7a1fb8',            // Secondary - darker purple
            accent: '#C655FF',               // Accent - bright purple
            text: '#FFFFFF',                 // Text color - white
            glow: 'rgba(163, 53, 238, 0.7)'  // Glow effect - purple glow
        },
        LEGENDARY: { 
            primary: '#FF8000',              // Main card color - bright orange
            secondary: '#cc6600',            // Secondary - darker orange
            accent: '#FFB84D',               // Accent - light orange
            text: '#FFFFFF',                 // Text color - white
            glow: 'rgba(255, 128, 0, 0.8)'   // Glow effect - orange glow
        },
        MYTHIC: { 
            primary: '#FFD700',              // Main card color - gold
            secondary: '#FFA500',            // Secondary - orange-gold
            accent: '#FFED4E',               // Accent - bright yellow
            text: '#000000',                 // Text color - black (for contrast)
            glow: 'rgba(255, 215, 0, 0.9)'   // Glow effect - golden glow
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE PATHS
// ═══════════════════════════════════════════════════════════════════════════
// File paths for persistent data storage
// Data is stored in JSON format for easy reading and writing

const DB_PATHS = {
    USERS: './database/users.json',      // Player data (coins, wrestlers, stats)
    MATCHES: './database/matches.json'   // Match history and active matches
};

// ═══════════════════════════════════════════════════════════════════════════
// WRESTLERS DATABASE - COMPLETE 70 WRESTLER ROSTER
// ═══════════════════════════════════════════════════════════════════════════
// Each wrestler is defined with complete statistics and information
// 
// WRESTLER OBJECT STRUCTURE:
// {
//     id: Unique identifier (uppercase, underscores)
//     name: Display name of the wrestler
//     rarity: MYTHIC | LEGENDARY | EPIC | RARE | COMMON
//     basePrice: Cost to buy in the market (in coins)
//     stats: {
//         overall: Overall rating (0-100)
//         power: Physical strength (0-100)
//         speed: Agility and quickness (0-100)
//         stamina: Endurance (0-100)
//         technique: Wrestling skill (0-100)
//         charisma: Star power (0-100)
//         defense: Damage resistance (0-100)
//     }
//     finisher: Signature finishing move name
//     brand: Raw | SmackDown | Legend | Free Agent
//     signature: Nickname or catchphrase
//     imageUrl: URL to wrestler image for card generation
// }

const WRESTLERS_DATABASE = {
    
    // ───────────────────────────────────────────────────────────────────────
    // MYTHIC TIER - The Immortals (5 Wrestlers)
    // ───────────────────────────────────────────────────────────────────────
    // These are the greatest legends in WWE history
    // Highest stats, most expensive, rarest to obtain
    
    UNDERTAKER: {
        id: 'UNDERTAKER',
        name: 'The Undertaker',
        rarity: 'MYTHIC',
        basePrice: 3500000,
        stats: {
            overall: 98,
            power: 95,
            speed: 80,
            stamina: 90,
            technique: 96,
            charisma: 98,
            defense: 94
        },
        finisher: 'Tombstone Piledriver',
        brand: 'Legend',
        signature: 'The Deadman',
        imageUrl: 'https://i.imgur.com/undertaker.png'
    },
    
    STONE_COLD: {
        id: 'STONE_COLD',
        name: 'Stone Cold Steve Austin',
        rarity: 'MYTHIC',
        basePrice: 3450000,
        stats: {
            overall: 97,
            power: 94,
            speed: 84,
            stamina: 93,
            technique: 90,
            charisma: 99,
            defense: 91
        },
        finisher: 'Stone Cold Stunner',
        brand: 'Legend',
        signature: 'The Texas Rattlesnake',
        imageUrl: 'https://i.imgur.com/stonecold.png'
    },
    
    THE_ROCK: {
        id: 'THE_ROCK',
        name: 'The Rock',
        rarity: 'MYTHIC',
        basePrice: 3400000,
        stats: {
            overall: 97,
            power: 93,
            speed: 86,
            stamina: 92,
            technique: 91,
            charisma: 100,
            defense: 89
        },
        finisher: 'Rock Bottom',
        brand: 'Legend',
        signature: 'The Great One',
        imageUrl: 'https://i.imgur.com/therock.png'
    },
    
    SHAWN_MICHAELS: {
        id: 'SHAWN_MICHAELS',
        name: 'Shawn Michaels',
        rarity: 'MYTHIC',
        basePrice: 3350000,
        stats: {
            overall: 96,
            power: 87,
            speed: 95,
            stamina: 88,
            technique: 98,
            charisma: 96,
            defense: 85
        },
        finisher: 'Sweet Chin Music',
        brand: 'Legend',
        signature: 'The Heartbreak Kid',
        imageUrl: 'https://i.imgur.com/hbk.png'
    },
    
    TRIPLE_H: {
        id: 'TRIPLE_H',
        name: 'Triple H',
        rarity: 'MYTHIC',
        basePrice: 3300000,
        stats: {
            overall: 96,
            power: 92,
            speed: 83,
            stamina: 93,
            technique: 94,
            charisma: 95,
            defense: 92
        },
        finisher: 'Pedigree',
        brand: 'Legend',
        signature: 'The Game',
        imageUrl: 'https://i.imgur.com/tripleh.png'
    },
    
    // ───────────────────────────────────────────────────────────────────────
    // LEGENDARY TIER - Modern Icons & Hall of Famers (15 Wrestlers)
    // ───────────────────────────────────────────────────────────────────────
    // Top tier current and recent superstars
    // Very high stats, expensive, rare drops
    
    ROMAN_REIGNS: {
        id: 'ROMAN_REIGNS',
        name: 'Roman Reigns',
        rarity: 'LEGENDARY',
        basePrice: 3050000,
        stats: {
            overall: 96,
            power: 98,
            speed: 85,
            stamina: 92,
            technique: 90,
            charisma: 95,
            defense: 88
        },
        finisher: 'Spear',
        brand: 'SmackDown',
        signature: 'The Tribal Chief',
        imageUrl: 'https://i.imgur.com/roman.png'
    },
    
    BROCK_LESNAR: {
        id: 'BROCK_LESNAR',
        name: 'Brock Lesnar',
        rarity: 'LEGENDARY',
        basePrice: 2980000,
        stats: {
            overall: 95,
            power: 99,
            speed: 82,
            stamina: 94,
            technique: 88,
            charisma: 85,
            defense: 95
        },
        finisher: 'F5',
        brand: 'Raw',
        signature: 'The Beast Incarnate',
        imageUrl: 'https://i.imgur.com/brock.png'
    },
    
    JOHN_CENA: {
        id: 'JOHN_CENA',
        name: 'John Cena',
        rarity: 'LEGENDARY',
        basePrice: 2900000,
        stats: {
            overall: 94,
            power: 92,
            speed: 88,
            stamina: 96,
            technique: 89,
            charisma: 99,
            defense: 87
        },
        finisher: 'Attitude Adjustment',
        brand: 'Free Agent',
        signature: 'You Cannot See Me',
        imageUrl: 'https://i.imgur.com/cena.png'
    },
    
    EDGE: {
        id: 'EDGE',
        name: 'Edge',
        rarity: 'LEGENDARY',
        basePrice: 2750000,
        stats: {
            overall: 93,
            power: 87,
            speed: 84,
            stamina: 88,
            technique: 92,
            charisma: 94,
            defense: 86
        },
        finisher: 'Spear',
        brand: 'SmackDown',
        signature: 'The Rated R Superstar',
        imageUrl: 'https://i.imgur.com/edge.png'
    },
    
    BECKY_LYNCH: {
        id: 'BECKY_LYNCH',
        name: 'Becky Lynch',
        rarity: 'LEGENDARY',
        basePrice: 2850000,
        stats: {
            overall: 94,
            power: 86,
            speed: 89,
            stamina: 90,
            technique: 92,
            charisma: 96,
            defense: 85
        },
        finisher: 'Manhandle Slam',
        brand: 'Raw',
        signature: 'The Man',
        imageUrl: 'https://i.imgur.com/becky.png'
    },
    
    CHARLOTTE_FLAIR: {
        id: 'CHARLOTTE_FLAIR',
        name: 'Charlotte Flair',
        rarity: 'LEGENDARY',
        basePrice: 2820000,
        stats: {
            overall: 93,
            power: 84,
            speed: 88,
            stamina: 89,
            technique: 94,
            charisma: 93,
            defense: 87
        },
        finisher: 'Natural Selection',
        brand: 'SmackDown',
        signature: 'The Queen',
        imageUrl: 'https://i.imgur.com/charlotte.png'
    },
    
    CM_PUNK: {
        id: 'CM_PUNK',
        name: 'CM Punk',
        rarity: 'LEGENDARY',
        basePrice: 2780000,
        stats: {
            overall: 92,
            power: 85,
            speed: 89,
            stamina: 90,
            technique: 94,
            charisma: 97,
            defense: 84
        },
        finisher: 'GTS',
        brand: 'Raw',
        signature: 'Best in the World',
        imageUrl: 'https://i.imgur.com/cmpunk.png'
    },
    
    BATISTA: {
        id: 'BATISTA',
        name: 'Batista',
        rarity: 'LEGENDARY',
        basePrice: 2700000,
        stats: {
            overall: 91,
            power: 96,
            speed: 78,
            stamina: 91,
            technique: 84,
            charisma: 88,
            defense: 93
        },
        finisher: 'Batista Bomb',
        brand: 'Legend',
        signature: 'The Animal',
        imageUrl: 'https://i.imgur.com/batista.png'
    },
    
    REY_MYSTERIO: {
        id: 'REY_MYSTERIO',
        name: 'Rey Mysterio',
        rarity: 'LEGENDARY',
        basePrice: 2680000,
        stats: {
            overall: 91,
            power: 72,
            speed: 96,
            stamina: 82,
            technique: 94,
            charisma: 91,
            defense: 76
        },
        finisher: '619',
        brand: 'SmackDown',
        signature: 'The Ultimate Underdog',
        imageUrl: 'https://i.imgur.com/rey.png'
    },
    
    KANE: {
        id: 'KANE',
        name: 'Kane',
        rarity: 'LEGENDARY',
        basePrice: 2650000,
        stats: {
            overall: 90,
            power: 94,
            speed: 75,
            stamina: 89,
            technique: 85,
            charisma: 87,
            defense: 92
        },
        finisher: 'Chokeslam',
        brand: 'Legend',
        signature: 'The Big Red Machine',
        imageUrl: 'https://i.imgur.com/kane.png'
    },
    
    HULK_HOGAN: {
        id: 'HULK_HOGAN',
        name: 'Hulk Hogan',
        rarity: 'LEGENDARY',
        basePrice: 2900000,
        stats: {
            overall: 93,
            power: 91,
            speed: 79,
            stamina: 92,
            technique: 84,
            charisma: 98,
            defense: 89
        },
        finisher: 'Leg Drop',
        brand: 'Legend',
        signature: 'The Hulkster',
        imageUrl: 'https://i.imgur.com/hogan.png'
    },
    
    BRET_HART: {
        id: 'BRET_HART',
        name: 'Bret Hart',
        rarity: 'LEGENDARY',
        basePrice: 2720000,
        stats: {
            overall: 92,
            power: 86,
            speed: 84,
            stamina: 90,
            technique: 97,
            charisma: 90,
            defense: 87
        },
        finisher: 'Sharpshooter',
        brand: 'Legend',
        signature: 'Excellence of Execution',
        imageUrl: 'https://i.imgur.com/bret.png'
    },
    
    RIC_FLAIR: {
        id: 'RIC_FLAIR',
        name: 'Ric Flair',
        rarity: 'LEGENDARY',
        basePrice: 2800000,
        stats: {
            overall: 93,
            power: 83,
            speed: 81,
            stamina: 88,
            technique: 95,
            charisma: 99,
            defense: 85
        },
        finisher: 'Figure Four Leglock',
        brand: 'Legend',
        signature: 'The Nature Boy',
        imageUrl: 'https://i.imgur.com/flair.png'
    },
    
    MACHO_MAN: {
        id: 'MACHO_MAN',
        name: 'Randy Savage',
        rarity: 'LEGENDARY',
        basePrice: 2750000,
        stats: {
            overall: 92,
            power: 89,
            speed: 88,
            stamina: 90,
            technique: 92,
            charisma: 96,
            defense: 86
        },
        finisher: 'Flying Elbow Drop',
        brand: 'Legend',
        signature: 'Macho Man',
        imageUrl: 'https://i.imgur.com/savage.png'
    },
    
    ULTIMATE_WARRIOR: {
        id: 'ULTIMATE_WARRIOR',
        name: 'Ultimate Warrior',
        rarity: 'LEGENDARY',
        basePrice: 2680000,
        stats: {
            overall: 90,
            power: 94,
            speed: 91,
            stamina: 95,
            technique: 80,
            charisma: 93,
            defense: 87
        },
        finisher: 'Gorilla Press Splash',
        brand: 'Legend',
        signature: 'The Warrior',
        imageUrl: 'https://i.imgur.com/warrior.png'
    },
    
    // ───────────────────────────────────────────────────────────────────────
    // EPIC TIER - Main Event Stars (20 Wrestlers)
    // ───────────────────────────────────────────────────────────────────────
    // Strong current roster members and former champions
    // High stats, moderately expensive, uncommon drops
    
    SETH_ROLLINS: {
        id: 'SETH_ROLLINS',
        name: 'Seth Rollins',
        rarity: 'EPIC',
        basePrice: 1850000,
        stats: {
            overall: 91,
            power: 85,
            speed: 92,
            stamina: 88,
            technique: 94,
            charisma: 89,
            defense: 84
        },
        finisher: 'Curb Stomp',
        brand: 'Raw',
        signature: 'The Visionary',
        imageUrl: 'https://i.imgur.com/seth.png'
    },
    
    AJ_STYLES: {
        id: 'AJ_STYLES',
        name: 'AJ Styles',
        rarity: 'EPIC',
        basePrice: 1780000,
        stats: {
            overall: 90,
            power: 82,
            speed: 94,
            stamina: 86,
            technique: 96,
            charisma: 88,
            defense: 83
        },
        finisher: 'Phenomenal Forearm',
        brand: 'SmackDown',
        signature: 'The Phenomenal One',
        imageUrl: 'https://i.imgur.com/aj.png'
    },
    
    RANDY_ORTON: {
        id: 'RANDY_ORTON',
        name: 'Randy Orton',
        rarity: 'EPIC',
        basePrice: 1820000,
        stats: {
            overall: 90,
            power: 88,
            speed: 86,
            stamina: 89,
            technique: 93,
            charisma: 87,
            defense: 85
        },
        finisher: 'RKO',
        brand: 'SmackDown',
        signature: 'The Viper',
        imageUrl: 'https://i.imgur.com/orton.png'
    },
    
    BOBBY_LASHLEY: {
        id: 'BOBBY_LASHLEY',
        name: 'Bobby Lashley',
        rarity: 'EPIC',
        basePrice: 1750000,
        stats: {
            overall: 89,
            power: 96,
            speed: 80,
            stamina: 91,
            technique: 84,
            charisma: 82,
            defense: 90
        },
        finisher: 'Hurt Lock',
        brand: 'Raw',
        signature: 'The All Mighty',
        imageUrl: 'https://i.imgur.com/lashley.png'
    },
    
    RHEA_RIPLEY: {
        id: 'RHEA_RIPLEY',
        name: 'Rhea Ripley',
        rarity: 'EPIC',
        basePrice: 1720000,
        stats: {
            overall: 89,
            power: 91,
            speed: 84,
            stamina: 87,
            technique: 88,
            charisma: 89,
            defense: 90
        },
        finisher: 'Riptide',
        brand: 'Raw',
        signature: 'The Nightmare',
        imageUrl: 'https://i.imgur.com/rhea.png'
    },
    
    BIANCA_BELAIR: {
        id: 'BIANCA_BELAIR',
        name: 'Bianca Belair',
        rarity: 'EPIC',
        basePrice: 1690000,
        stats: {
            overall: 88,
            power: 89,
            speed: 92,
            stamina: 90,
            technique: 86,
            charisma: 90,
            defense: 83
        },
        finisher: 'KOD',
        brand: 'Raw',
        signature: 'The EST',
        imageUrl: 'https://i.imgur.com/bianca.png'
    },
    
    ASUKA: {
        id: 'ASUKA',
        name: 'Asuka',
        rarity: 'EPIC',
        basePrice: 1650000,
        stats: {
            overall: 87,
            power: 83,
            speed: 90,
            stamina: 85,
            technique: 93,
            charisma: 88,
            defense: 84
        },
        finisher: 'Asuka Lock',
        brand: 'SmackDown',
        signature: 'The Empress',
        imageUrl: 'https://i.imgur.com/asuka.png'
    },
    
    SAMI_ZAYN: {
        id: 'SAMI_ZAYN',
        name: 'Sami Zayn',
        rarity: 'EPIC',
        basePrice: 1580000,
        stats: {
            overall: 87,
            power: 80,
            speed: 89,
            stamina: 86,
            technique: 92,
            charisma: 90,
            defense: 81
        },
        finisher: 'Helluva Kick',
        brand: 'SmackDown',
        signature: 'The Underdog',
        imageUrl: 'https://i.imgur.com/sami.png'
    },
    
    CODY_RHODES: {
        id: 'CODY_RHODES',
        name: 'Cody Rhodes',
        rarity: 'EPIC',
        basePrice: 1820000,
        stats: {
            overall: 90,
            power: 86,
            speed: 88,
            stamina: 89,
            technique: 91,
            charisma: 94,
            defense: 85
        },
        finisher: 'Cross Rhodes',
        brand: 'SmackDown',
        signature: 'The American Nightmare',
        imageUrl: 'https://i.imgur.com/cody.png'
    },
    
    SHEAMUS: {
        id: 'SHEAMUS',
        name: 'Sheamus',
        rarity: 'EPIC',
        basePrice: 1600000,
        stats: {
            overall: 87,
            power: 90,
            speed: 75,
            stamina: 88,
            technique: 83,
            charisma: 82,
            defense: 91
        },
        finisher: 'Brogue Kick',
        brand: 'SmackDown',
        signature: 'The Celtic Warrior',
        imageUrl: 'https://i.imgur.com/sheamus.png'
    },
    
    SHINSUKE_NAKAMURA: {
        id: 'SHINSUKE_NAKAMURA',
        name: 'Shinsuke Nakamura',
        rarity: 'EPIC',
        basePrice: 1640000,
        stats: {
            overall: 88,
            power: 84,
            speed: 88,
            stamina: 85,
            technique: 94,
            charisma: 91,
            defense: 82
        },
        finisher: 'Kinshasa',
        brand: 'SmackDown',
        signature: 'King of Strong Style',
        imageUrl: 'https://i.imgur.com/nakamura.png'
    },
    
    BRAUN_STROWMAN: {
        id: 'BRAUN_STROWMAN',
        name: 'Braun Strowman',
        rarity: 'EPIC',
        basePrice: 1680000,
        stats: {
            overall: 88,
            power: 98,
            speed: 72,
            stamina: 90,
            technique: 79,
            charisma: 85,
            defense: 94
        },
        finisher: 'Running Powerslam',
        brand: 'SmackDown',
        signature: 'The Monster',
        imageUrl: 'https://i.imgur.com/braun.png'
    },
    
    SAMOA_JOE: {
        id: 'SAMOA_JOE',
        name: 'Samoa Joe',
        rarity: 'EPIC',
        basePrice: 1620000,
        stats: {
            overall: 87,
            power: 91,
            speed: 79,
            stamina: 87,
            technique: 93,
            charisma: 86,
            defense: 89
        },
        finisher: 'Coquina Clutch',
        brand: 'SmackDown',
        signature: 'The Samoan Submission Machine',
        imageUrl: 'https://i.imgur.com/joe.png'
    },
    
    KOFI_KINGSTON: {
        id: 'KOFI_KINGSTON',
        name: 'Kofi Kingston',
        rarity: 'EPIC',
        basePrice: 1550000,
        stats: {
            overall: 86,
            power: 81,
            speed: 93,
            stamina: 87,
            technique: 88,
            charisma: 89,
            defense: 80
        },
        finisher: 'Trouble in Paradise',
        brand: 'Raw',
        signature: 'The Dreadlocked Dynamo',
        imageUrl: 'https://i.imgur.com/kofi.png'
    },
    
    XAVIER_WOODS: {
        id: 'XAVIER_WOODS',
        name: 'Xavier Woods',
        rarity: 'EPIC',
        basePrice: 1520000,
        stats: {
            overall: 85,
            power: 79,
            speed: 91,
            stamina: 86,
            technique: 87,
            charisma: 92,
            defense: 78
        },
        finisher: 'Honor Roll',
        brand: 'Raw',
        signature: 'King Woods',
        imageUrl: 'https://i.imgur.com/xavier.png'
    },
    
    BIG_E: {
        id: 'BIG_E',
        name: 'Big E',
        rarity: 'EPIC',
        basePrice: 1590000,
        stats: {
            overall: 87,
            power: 93,
            speed: 82,
            stamina: 88,
            technique: 85,
            charisma: 91,
            defense: 87
        },
        finisher: 'Big Ending',
        brand: 'Raw',
        signature: 'The Powerhouse',
        imageUrl: 'https://i.imgur.com/bige.png'
    },
    
    CESARO: {
        id: 'CESARO',
        name: 'Cesaro',
        rarity: 'EPIC',
        basePrice: 1610000,
        stats: {
            overall: 87,
            power: 95,
            speed: 83,
            stamina: 89,
            technique: 94,
            charisma: 80,
            defense: 86
        },
        finisher: 'Neutralizer',
        brand: 'SmackDown',
        signature: 'The Swiss Cyborg',
        imageUrl: 'https://i.imgur.com/cesaro.png'
    },
    
    RIDDLE: {
        id: 'RIDDLE',
        name: 'Riddle',
        rarity: 'EPIC',
        basePrice: 1560000,
        stats: {
            overall: 86,
            power: 84,
            speed: 87,
            stamina: 88,
            technique: 91,
            charisma: 87,
            defense: 82
        },
        finisher: 'RKO (with Orton)',
        brand: 'Raw',
        signature: 'The Bro',
        imageUrl: 'https://i.imgur.com/riddle.png'
    },
    
    LA_KNIGHT: {
        id: 'LA_KNIGHT',
        name: 'LA Knight',
        rarity: 'EPIC',
        basePrice: 1700000,
        stats: {
            overall: 88,
            power: 87,
            speed: 85,
            stamina: 87,
            technique: 89,
            charisma: 95,
            defense: 84
        },
        finisher: 'BFT',
        brand: 'SmackDown',
        signature: 'Yeah!',
        imageUrl: 'https://i.imgur.com/laknight.png'
    },
    
    GUNTHER: {
        id: 'GUNTHER',
        name: 'Gunther',
        rarity: 'EPIC',
        basePrice: 1780000,
        stats: {
            overall: 90,
            power: 94,
            speed: 80,
            stamina: 92,
            technique: 95,
            charisma: 86,
            defense: 93
        },
        finisher: 'Powerbomb',
        brand: 'Raw',
        signature: 'The Ring General',
        imageUrl: 'https://i.imgur.com/gunther.png'
    },
    
    // ───────────────────────────────────────────────────────────────────────
    // RARE TIER - Mid-Card Champions (20 Wrestlers)
    // ───────────────────────────────────────────────────────────────────────
    // Solid performers, former champions, rising stars
    // Good stats, affordable, common drops
    
    DREW_MCINTYRE: {
        id: 'DREW_MCINTYRE',
        name: 'Drew McIntyre',
        rarity: 'RARE',
        basePrice: 980000,
        stats: {
            overall: 87,
            power: 92,
            speed: 81,
            stamina: 85,
            technique: 86,
            charisma: 84,
            defense: 88
        },
        finisher: 'Claymore Kick',
        brand: 'SmackDown',
        signature: 'The Scottish Warrior',
        imageUrl: 'https://i.imgur.com/drew.png'
    },
    
    KEVIN_OWENS: {
        id: 'KEVIN_OWENS',
        name: 'Kevin Owens',
        rarity: 'RARE',
        basePrice: 920000,
        stats: {
            overall: 86,
            power: 88,
            speed: 79,
            stamina: 87,
            technique: 89,
            charisma: 85,
            defense: 82
        },
        finisher: 'Stunner',
        brand: 'Raw',
        signature: 'The Prize Fighter',
        imageUrl: 'https://i.imgur.com/ko.png'
    },
    
    FINN_BALOR: {
        id: 'FINN_BALOR',
        name: 'Finn Balor',
        rarity: 'RARE',
        basePrice: 950000,
        stats: {
            overall: 86,
            power: 80,
            speed: 91,
            stamina: 84,
            technique: 90,
            charisma: 87,
            defense: 79
        },
        finisher: 'Coup de Grace',
        brand: 'SmackDown',
        signature: 'The Prince',
        imageUrl: 'https://i.imgur.com/finn.png'
    },
    
    DAMIAN_PRIEST: {
        id: 'DAMIAN_PRIEST',
        name: 'Damian Priest',
        rarity: 'RARE',
        basePrice: 900000,
        stats: {
            overall: 85,
            power: 90,
            speed: 83,
            stamina: 86,
            technique: 84,
            charisma: 83,
            defense: 85
        },
        finisher: 'South of Heaven',
        brand: 'Raw',
        signature: 'The Archer of Infamy',
        imageUrl: 'https://i.imgur.com/priest.png'
    },
    
    DOMINIK_MYSTERIO: {
        id: 'DOMINIK_MYSTERIO',
        name: 'Dominik Mysterio',
        rarity: 'RARE',
        basePrice: 850000,
        stats: {
            overall: 84,
            power: 78,
            speed: 88,
            stamina: 83,
            technique: 86,
            charisma: 82,
            defense: 77
        },
        finisher: '619',
        brand: 'Raw',
        signature: 'Dirty Dom',
        imageUrl: 'https://i.imgur.com/dom.png'
    },
    
    AUSTIN_THEORY: {
        id: 'AUSTIN_THEORY',
        name: 'Austin Theory',
        rarity: 'RARE',
        basePrice: 880000,
        stats: {
            overall: 84,
            power: 83,
            speed: 86,
            stamina: 85,
            technique: 85,
            charisma: 84,
            defense: 80
        },
        finisher: 'ATL',
        brand: 'Raw',
        signature: 'A-Town Down',
        imageUrl: 'https://i.imgur.com/theory.png'
    },
    
    BRONSON_REED: {
        id: 'BRONSON_REED',
        name: 'Bronson Reed',
        rarity: 'RARE',
        basePrice: 910000,
        stats: {
            overall: 85,
            power: 94,
            speed: 74,
            stamina: 88,
            technique: 82,
            charisma: 79,
            defense: 90
        },
        finisher: 'Tsunami',
        brand: 'Raw',
        signature: 'Big Bronson',
        imageUrl: 'https://i.imgur.com/reed.png'
    },
    
    LUDWIG_KAISER: {
        id: 'LUDWIG_KAISER',
        name: 'Ludwig Kaiser',
        rarity: 'RARE',
        basePrice: 870000,
        stats: {
            overall: 84,
            power: 85,
            speed: 83,
            stamina: 84,
            technique: 88,
            charisma: 80,
            defense: 83
        },
        finisher: 'Kaiser Roll',
        brand: 'Raw',
        signature: 'The Austrian Anomaly',
        imageUrl: 'https://i.imgur.com/kaiser.png'
    },
    
    SANTOS_ESCOBAR: {
        id: 'SANTOS_ESCOBAR',
        name: 'Santos Escobar',
        rarity: 'RARE',
        basePrice: 890000,
        stats: {
            overall: 85,
            power: 82,
            speed: 88,
            stamina: 85,
            technique: 89,
            charisma: 83,
            defense: 81
        },
        finisher: 'Phantom Driver',
        brand: 'SmackDown',
        signature: 'El Hijo del Fantasma',
        imageUrl: 'https://i.imgur.com/santos.png'
    },
    
    ANGELO_DAWKINS: {
        id: 'ANGELO_DAWKINS',
        name: 'Angelo Dawkins',
        rarity: 'RARE',
        basePrice: 820000,
        stats: {
            overall: 83,
            power: 86,
            speed: 82,
            stamina: 84,
            technique: 81,
            charisma: 85,
            defense: 82
        },
        finisher: 'Anoint',
        brand: 'SmackDown',
        signature: 'The Curse',
        imageUrl: 'https://i.imgur.com/dawkins.png'
    },
    
    MONTEZ_FORD: {
        id: 'MONTEZ_FORD',
        name: 'Montez Ford',
        rarity: 'RARE',
        basePrice: 860000,
        stats: {
            overall: 84,
            power: 81,
            speed: 93,
            stamina: 86,
            technique: 84,
            charisma: 89,
            defense: 78
        },
        finisher: 'From The Heavens',
        brand: 'SmackDown',
        signature: 'The Frog Splash Master',
        imageUrl: 'https://i.imgur.com/montez.png'
    },
    
    CHAD_GABLE: {
        id: 'CHAD_GABLE',
        name: 'Chad Gable',
        rarity: 'RARE',
        basePrice: 930000,
        stats: {
            overall: 86,
            power: 84,
            speed: 87,
            stamina: 86,
            technique: 95,
            charisma: 82,
            defense: 84
        },
        finisher: 'Chaos Theory',
        brand: 'Raw',
        signature: 'Master Gable',
        imageUrl: 'https://i.imgur.com/gable.png'
    },
    
    OTIS: {
        id: 'OTIS',
        name: 'Otis',
        rarity: 'RARE',
        basePrice: 840000,
        stats: {
            overall: 83,
            power: 92,
            speed: 73,
            stamina: 86,
            technique: 79,
            charisma: 88,
            defense: 88
        },
        finisher: 'Caterpillar Elbow',
        brand: 'Raw',
        signature: 'Oh Yeah!',
        imageUrl: 'https://i.imgur.com/otis.png'
    },
    
    CARMELO_HAYES: {
        id: 'CARMELO_HAYES',
        name: 'Carmelo Hayes',
        rarity: 'RARE',
        basePrice: 940000,
        stats: {
            overall: 86,
            power: 81,
            speed: 90,
            stamina: 85,
            technique: 88,
            charisma: 87,
            defense: 79
        },
        finisher: 'Nothing But Net',
        brand: 'SmackDown',
        signature: 'Him',
        imageUrl: 'https://i.imgur.com/hayes.png'
    },
    
    ANDRADE: {
        id: 'ANDRADE',
        name: 'Andrade',
        rarity: 'RARE',
        basePrice: 960000,
        stats: {
            overall: 86,
            power: 84,
            speed: 89,
            stamina: 84,
            technique: 91,
            charisma: 83,
            defense: 82
        },
        finisher: 'Hammerlock DDT',
        brand: 'SmackDown',
        signature: 'El Idolo',
        imageUrl: 'https://i.imgur.com/andrade.png'
    },
    
    TOMMASO_CIAMPA: {
        id: 'TOMMASO_CIAMPA',
        name: 'Tommaso Ciampa',
        rarity: 'RARE',
        basePrice: 900000,
        stats: {
            overall: 85,
            power: 87,
            speed: 81,
            stamina: 86,
            technique: 90,
            charisma: 84,
            defense: 85
        },
        finisher: 'Fairytale Ending',
        brand: 'Raw',
        signature: 'Psycho Killer',
        imageUrl: 'https://i.imgur.com/ciampa.png'
    },
    
    CHAD_KNIGHT: {
        id: 'CHAD_KNIGHT',
        name: 'Chad Knight',
        rarity: 'RARE',
        basePrice: 830000,
        stats: {
            overall: 83,
            power: 80,
            speed: 85,
            stamina: 83,
            technique: 84,
            charisma: 81,
            defense: 79
        },
        finisher: 'Cave In',
        brand: 'SmackDown',
        signature: 'The Dragon',
        imageUrl: 'https://i.imgur.com/knight.png'
    },
    
    TYLER_BATE: {
        id: 'TYLER_BATE',
        name: 'Tyler Bate',
        rarity: 'RARE',
        basePrice: 870000,
        stats: {
            overall: 84,
            power: 86,
            speed: 86,
            stamina: 87,
            technique: 90,
            charisma: 82,
            defense: 81
        },
        finisher: 'Tyler Driver 97',
        brand: 'SmackDown',
        signature: 'Big Strong Boy',
        imageUrl: 'https://i.imgur.com/bate.png'
    },
    
    DRAGON_LEE: {
        id: 'DRAGON_LEE',
        name: 'Dragon Lee',
        rarity: 'RARE',
        basePrice: 890000,
        stats: {
            overall: 85,
            power: 79,
            speed: 95,
            stamina: 82,
            technique: 88,
            charisma: 81,
            defense: 76
        },
        finisher: 'Dragonrana',
        brand: 'Raw',
        signature: 'The Dragon',
        imageUrl: 'https://i.imgur.com/dragonlee.png'
    },
    
    JD_MCDONAGH: {
        id: 'JD_MCDONAGH',
        name: 'JD McDonagh',
        rarity: 'RARE',
        basePrice: 850000,
        stats: {
            overall: 84,
            power: 82,
            speed: 87,
            stamina: 84,
            technique: 88,
            charisma: 80,
            defense: 80
        },
        finisher: 'Devils Inside',
        brand: 'Raw',
        signature: 'The Irish Ace',
        imageUrl: 'https://i.imgur.com/jd.png'
    },
    
    // ───────────────────────────────────────────────────────────────────────
    // COMMON TIER - Rising Stars (10 Wrestlers)
    // ───────────────────────────────────────────────────────────────────────
    // Newer talent, lower card performers
    // Decent stats, cheap, very common drops
    
    RICOCHET: {
        id: 'RICOCHET',
        name: 'Ricochet',
        rarity: 'COMMON',
        basePrice: 450000,
        stats: {
            overall: 82,
            power: 75,
            speed: 95,
            stamina: 81,
            technique: 87,
            charisma: 79,
            defense: 74
        },
        finisher: '630 Senton',
        brand: 'SmackDown',
        signature: 'The One and Only',
        imageUrl: 'https://i.imgur.com/ricochet.png'
    },
    
    DOLPH_ZIGGLER: {
        id: 'DOLPH_ZIGGLER',
        name: 'Dolph Ziggler',
        rarity: 'COMMON',
        basePrice: 420000,
        stats: {
            overall: 81,
            power: 76,
            speed: 88,
            stamina: 83,
            technique: 85,
            charisma: 80,
            defense: 75
        },
        finisher: 'Zig Zag',
        brand: 'Raw',
        signature: 'The Showoff',
        imageUrl: 'https://i.imgur.com/ziggler.png'
    },
    
    BARON_CORBIN: {
        id: 'BARON_CORBIN',
        name: 'Baron Corbin',
        rarity: 'COMMON',
        basePrice: 430000,
        stats: {
            overall: 81,
            power: 87,
            speed: 76,
            stamina: 83,
            technique: 78,
            charisma: 74,
            defense: 84
        },
        finisher: 'End of Days',
        brand: 'SmackDown',
        signature: 'The Lone Wolf',
        imageUrl: 'https://i.imgur.com/corbin.png'
    },
    
    IVAR: {
        id: 'IVAR',
        name: 'Ivar',
        rarity: 'COMMON',
        basePrice: 410000,
        stats: {
            overall: 80,
            power: 90,
            speed: 72,
            stamina: 82,
            technique: 77,
            charisma: 76,
            defense: 86
        },
        finisher: 'Viking Splash',
        brand: 'Raw',
        signature: 'The Viking',
        imageUrl: 'https://i.imgur.com/ivar.png'
    },
    
    VALHALLA: {
        id: 'VALHALLA',
        name: 'Valhalla',
        rarity: 'COMMON',
        basePrice: 400000,
        stats: {
            overall: 79,
            power: 76,
            speed: 81,
            stamina: 80,
            technique: 79,
            charisma: 84,
            defense: 77
        },
        finisher: 'Shield Maiden Slam',
        brand: 'Raw',
        signature: 'The Warrior',
        imageUrl: 'https://i.imgur.com/valhalla.png'
    },
    
    AKIRA_TOZAWA: {
        id: 'AKIRA_TOZAWA',
        name: 'Akira Tozawa',
        rarity: 'COMMON',
        basePrice: 390000,
        stats: {
            overall: 79,
            power: 74,
            speed: 89,
            stamina: 80,
            technique: 83,
            charisma: 77,
            defense: 73
        },
        finisher: 'Senton Bomb',
        brand: 'Raw',
        signature: 'Ah!',
        imageUrl: 'https://i.imgur.com/tozawa.png'
    },
    
    SHELTON_BENJAMIN: {
        id: 'SHELTON_BENJAMIN',
        name: 'Shelton Benjamin',
        rarity: 'COMMON',
        basePrice: 440000,
        stats: {
            overall: 81,
            power: 83,
            speed: 85,
            stamina: 81,
            technique: 86,
            charisma: 76,
            defense: 80
        },
        finisher: 'Paydirt',
        brand: 'SmackDown',
        signature: 'The Gold Standard',
        imageUrl: 'https://i.imgur.com/shelton.png'
    },
    
    R_TRUTH: {
        id: 'R_TRUTH',
        name: 'R-Truth',
        rarity: 'COMMON',
        basePrice: 430000,
        stats: {
            overall: 80,
            power: 77,
            speed: 83,
            stamina: 82,
            technique: 80,
            charisma: 92,
            defense: 76
        },
        finisher: 'Attitude Adjustment',
        brand: 'Raw',
        signature: 'Whats Up',
        imageUrl: 'https://i.imgur.com/truth.png'
    },
    
    APOLLO_CREWS: {
        id: 'APOLLO_CREWS',
        name: 'Apollo Crews',
        rarity: 'COMMON',
        basePrice: 460000,
        stats: {
            overall: 82,
            power: 84,
            speed: 87,
            stamina: 83,
            technique: 82,
            charisma: 78,
            defense: 79
        },
        finisher: 'Standing Moonsault',
        brand: 'SmackDown',
        signature: 'The Conqueror',
        imageUrl: 'https://i.imgur.com/apollo.png'
    },
    
    CEDRIC_ALEXANDER: {
        id: 'CEDRIC_ALEXANDER',
        name: 'Cedric Alexander',
        rarity: 'COMMON',
        basePrice: 440000,
        stats: {
            overall: 81,
            power: 78,
            speed: 91,
            stamina: 81,
            technique: 85,
            charisma: 77,
            defense: 75
        },
        finisher: 'Lumbar Check',
        brand: 'Raw',
        signature: 'The Heart of 205 Live',
        imageUrl: 'https://i.imgur.com/cedric.png'
    }
};

// Convert database object to array for easier filtering and random selection
const WRESTLERS_ARRAY = Object.values(WRESTLERS_DATABASE);

// ═══════════════════════════════════════════════════════════════════════════
// CARD GENERATOR CLASS - WWE-STYLE IMAGE CARDS
// ═══════════════════════════════════════════════════════════════════════════
// This class generates beautiful wrestler cards with images, stats, and styling
// Uses HTML5 Canvas to draw custom graphics
//
// Card Layout:
// ┌─────────────────────────┐
// │  RARITY BADGE (top)     │
// │                         │
// │  WRESTLER IMAGE         │
// │  (300x300 center)       │
// │                         │
// │  NAME BANNER            │
// │                         │
// │  STATS (OVR|PWR|SPD|DEF)│
// │                         │
// │  FINISHER (bottom)      │
// └─────────────────────────┘

class CardGenerator {
    /**
     * Creates a wrestler card image
     * @param {Object} wrestler - Wrestler data from WRESTLERS_DATABASE
     * @param {String} userAvatar - Optional user avatar URL
     * @returns {Buffer} PNG image buffer
     */
    static async createCard(wrestler, userAvatar = null) {
        // Create 400x600 canvas (standard trading card size)
        const canvas = createCanvas(400, 600);
        const ctx = canvas.getContext('2d');
        
        // Get color scheme for this wrestler's rarity
        const colors = CONFIG.CARD_COLORS[wrestler.rarity];
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 1: Draw Background Gradient
        // ─────────────────────────────────────────────────────────────────
        // Creates a smooth gradient from primary to secondary color
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, colors.primary);      // Top color
        gradient.addColorStop(1, colors.secondary);    // Bottom color
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 600);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 2: Draw Outer Border (White)
        // ─────────────────────────────────────────────────────────────────
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 380, 580);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 3: Draw Inner Border (Rarity Color)
        // ─────────────────────────────────────────────────────────────────
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 360, 560);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 4: Draw Rarity Badge at Top
        // ─────────────────────────────────────────────────────────────────
        // Dark semi-transparent background for badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(30, 30, 340, 50);
        
        // Rarity text (MYTHIC, LEGENDARY, etc.)
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(wrestler.rarity, 200, 65);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 5: Draw Wrestler Image
        // ─────────────────────────────────────────────────────────────────
        // Try to load and display wrestler image
        // Falls back to initial if image fails to load
        try {
            const wrestlerImg = await loadImage(wrestler.imageUrl);
            // Draw image in center area (300x300)
            ctx.drawImage(wrestlerImg, 50, 100, 300, 300);
        } catch (error) {
            // Fallback: Draw placeholder with wrestler's initial
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(50, 100, 300, 300);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(wrestler.name.charAt(0), 200, 270);
        }
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 6: Draw Name Banner
        // ─────────────────────────────────────────────────────────────────
        // Dark background for name
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(30, 420, 340, 60);
        
        // Wrestler name text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(wrestler.name, 200, 460);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 7: Draw Stats Section
        // ─────────────────────────────────────────────────────────────────
        // Background for stats area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(30, 490, 340, 80);
        
        // Overall Rating Box (large, left side)
        ctx.fillStyle = colors.primary;
        ctx.fillRect(50, 500, 80, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(wrestler.stats.overall, 90, 540);
        ctx.font = 'bold 12px Arial';
        ctx.fillText('OVR', 90, 555);
        
        // Individual Stats (Power, Speed, Defense)
        const stats = [
            { label: 'PWR', value: wrestler.stats.power },
            { label: 'SPD', value: wrestler.stats.speed },
            { label: 'DEF', value: wrestler.stats.defense }
        ];
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#ffffff';
        stats.forEach((stat, i) => {
            const x = 160 + (i * 70);  // Space stats evenly
            ctx.fillText(`${stat.label}:`, x, 520);
            ctx.fillStyle = colors.primary;
            ctx.fillText(stat.value, x, 545);
            ctx.fillStyle = '#ffffff';
        });
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 8: Draw Finisher Banner at Bottom
        // ─────────────────────────────────────────────────────────────────
        ctx.fillStyle = colors.primary;
        ctx.fillRect(30, 575, 340, 15);
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`⚡ ${wrestler.finisher}`, 200, 586);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 9: Draw Brand Logo (Top Right Corner)
        // ─────────────────────────────────────────────────────────────────
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(310, 40, 60, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(wrestler.brand, 340, 60);
        
        // ─────────────────────────────────────────────────────────────────
        // STEP 10: Return Image as PNG Buffer
        // ─────────────────────────────────────────────────────────────────
        return canvas.toBuffer();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════
// Handles all file I/O operations for persistent data storage
// Uses JSON files to store user data and match history
// Implements caching to reduce file system operations

class DatabaseManager {
    constructor() {
        // In-memory cache to avoid repeated file reads
        this.cache = new Map();
    }
    
    /**
     * Load data from JSON file
     * @param {String} filePath - Path to JSON file
     * @returns {Object} Parsed JSON data
     */
    async loadData(filePath) {
        try {
            // Check cache first
            if (this.cache.has(filePath)) {
                return this.cache.get(filePath);
            }
            
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });
            
            try {
                // Try to read existing file
                await fs.access(filePath);
                const data = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(data);
                this.cache.set(filePath, parsed);
                return parsed;
            } catch {
                // File doesn't exist, create empty object
                await fs.writeFile(filePath, JSON.stringify({}, null, 2));
                this.cache.set(filePath, {});
                return {};
            }
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            return {};
        }
    }
    
    /**
     * Save data to JSON file
     * @param {String} filePath - Path to JSON file
     * @param {Object} data - Data to save
     */
    async saveData(filePath, data) {
        try {
            // Update cache
            this.cache.set(filePath, data);
            // Write to file with pretty formatting
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error saving ${filePath}:`, error);
        }
    }
    
    /**
     * Get user data by Discord ID
     * @param {String} userId - Discord user ID
     * @returns {Object|null} User data or null if not found
     */
    async getUser(userId) {
        const users = await this.loadData(DB_PATHS.USERS);
        return users[userId] || null;
    }
    
    /**
     * Create new user account
     * @param {String} userId - Discord user ID
     * @param {String} username - Discord username
     * @returns {Object} New user data
     */
    async createUser(userId, username) {
        const users = await this.loadData(DB_PATHS.USERS);
        const newUser = {
            id: userId,
            username,
            purse: CONFIG.STARTING_PURSE,
            squad: [],
            playingXI: [],
            level: 1,
            xp: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            matchesPlayed: 0,
            winStreak: 0,
            bestWinStreak: 0,
            dailyStreak: 0,
            lastDaily: null,
            lastVote: null,
            totalCoinsEarned: CONFIG.STARTING_PURSE,
            totalCoinsSpent: 0,
            cardsOwned: 0,
            createdAt: Date.now()
        };
        users[userId] = newUser;
        await this.saveData(DB_PATHS.USERS, users);
        return newUser;
    }
    
    /**
     * Update user data
     * @param {String} userId - Discord user ID
     * @param {Object} updates - Data to update
     * @returns {Object|null} Updated user data
     */
    async updateUser(userId, updates) {
        const users = await this.loadData(DB_PATHS.USERS);
        if (!users[userId]) return null;
        users[userId] = { ...users[userId], ...updates };
        await this.saveData(DB_PATHS.USERS, users);
        return users[userId];
    }
}

// Create global database manager instance
const db = new DatabaseManager();

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS CLASS
// ═══════════════════════════════════════════════════════════════════════════
// Helper functions used throughout the bot

class Utils {
    /**
     * Format number with commas (1000 -> 1,000)
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    /**
     * Format currency with coin emoji
     */
    static formatCurrency(amount) {
        return `💰 ${this.formatNumber(amount)}`;
    }
    
    /**
     * Get random element from array
     */
    static randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * Get random integer between min and max (inclusive)
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Weighted random selection based on rarity weights
     * @param {Object} weights - Object with rarity:weight pairs
     * @returns {String} Selected rarity
     */
    static weightedRandom(weights) {
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        for (const [key, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return key;
        }
        return Object.keys(weights)[0];
    }
    
    /**
     * Get rarity color hex code
     */
    static getRarityColor(rarity) {
        return CONFIG.COLORS[rarity] || CONFIG.COLORS.COMMON;
    }
    
    /**
     * Get rarity emoji
     */
    static getRarityEmoji(rarity) {
        const emojis = { COMMON: '⚪', RARE: '🔵', EPIC: '🟣', LEGENDARY: '🟠', MYTHIC: '🟡' };
        return emojis[rarity] || '⚪';
    }
    
    /**
     * Get wrestler data by ID
     */
    static getWrestler(wrestlerId) {
        return WRESTLERS_DATABASE[wrestlerId] || null;
    }
    
    /**
     * Create progress bar
     * @param {Number} current - Current value
     * @param {Number} max - Maximum value
     * @param {Number} length - Bar length in characters
     * @returns {String} Progress bar string
     */
    static progressBar(current, max, length = 10) {
        const percentage = Math.max(0, Math.min(1, current / max));
        const filled = Math.floor(percentage * length);
        const empty = length - filled;
        return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.floor(percentage * 100)}%`;
    }
    
    /**
     * Format milliseconds to human readable duration
     */
    static formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    /**
     * Generate unique ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * Calculate level from XP
     */
    static calculateLevel(xp) {
        let level = 1;
        let xpNeeded = CONFIG.BASE_LEVEL_XP;
        let totalXpNeeded = 0;
        while (xp >= totalXpNeeded + xpNeeded) {
            totalXpNeeded += xpNeeded;
            level++;
            xpNeeded = Math.floor(xpNeeded * CONFIG.XP_MULTIPLIER);
        }
        return level;
    }
    
    /**
     * Shuffle array
     */
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS CLASS
// ═══════════════════════════════════════════════════════════════════════════
// Reusable UI components for Discord interactions

class UIComponents {
    /**
     * Create match action buttons
     */
    static createMatchButtons(disabled = false) {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('match_strike')
                    .setLabel('👊 Strike')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_grapple')
                    .setLabel('🤼 Grapple')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_special')
                    .setLabel('⚡ Special (30)')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_finisher')
                    .setLabel('🔥 FINISHER (70)')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(disabled)
            );
        
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('match_rotate')
                    .setLabel('🔄 ROTATE')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_rest')
                    .setLabel('💤 Rest')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_taunt')
                    .setLabel('😤 Taunt')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('match_forfeit')
                    .setLabel('🏳️ Forfeit')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(disabled)
            );
        
        return [row1, row2];
    }
    
    /**
     * Create confirmation buttons
     */
    static createConfirmButtons(customId = 'confirm') {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${customId}_yes`)
                    .setLabel('✅ Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`${customId}_no`)
                    .setLabel('❌ Cancel')
                    .setStyle(ButtonStyle.Danger)
            );
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// MATCH ENGINE CLASS - 5v5 TAG TEAM BATTLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

class MatchEngine {
    constructor() {
        this.activeMatches = new Map();
    }
    
    createMatch(player1Id, player2Id, channelId) {
        const matchId = Utils.generateId();
        const match = {
            id: matchId,
            player1: {
                id: player1Id,
                activeWrestlerIndex: 0,
                wrestlers: [],
                teamHealth: 100,
                teamStamina: 100,
                momentum: 0
            },
            player2: {
                id: player2Id,
                activeWrestlerIndex: 0,
                wrestlers: [],
                teamHealth: 100,
                teamStamina: 100,
                momentum: 0
            },
            currentTurn: player1Id,
            turnNumber: 0,
            rotationCount: { [player1Id]: 0, [player2Id]: 0 },
            log: [],
            status: 'active',
            channelId,
            startedAt: Date.now()
        };
        this.activeMatches.set(matchId, match);
        return match;
    }
    
    loadWrestlers(match, player1Squad, player2Squad) {
        match.player1.wrestlers = player1Squad.slice(0, 5).map(card => ({
            cardId: card.id,
            wrestlerId: card.wrestlerId,
            health: 100,
            stamina: 100,
            isActive: false,
            eliminated: false
        }));
        
        match.player2.wrestlers = player2Squad.slice(0, 5).map(card => ({
            cardId: card.id,
            wrestlerId: card.wrestlerId,
            health: 100,
            stamina: 100,
            isActive: false,
            eliminated: false
        }));
        
        if (match.player1.wrestlers.length > 0) {
            match.player1.wrestlers[0].isActive = true;
        }
        if (match.player2.wrestlers.length > 0) {
            match.player2.wrestlers[0].isActive = true;
        }
    }
    
    getActiveWrestler(player) {
        return player.wrestlers[player.activeWrestlerIndex];
    }
    
    rotateWrestler(player, playerId) {
        const current = this.getActiveWrestler(player);
        current.isActive = false;
        
        let nextIndex = (player.activeWrestlerIndex + 1) % player.wrestlers.length;
        let attempts = 0;
        
        while (player.wrestlers[nextIndex].eliminated && attempts < player.wrestlers.length) {
            nextIndex = (nextIndex + 1) % player.wrestlers.length;
            attempts++;
        }
        
        if (attempts >= player.wrestlers.length) {
            return { success: false, message: '❌ No wrestlers available!' };
        }
        
        player.activeWrestlerIndex = nextIndex;
        player.wrestlers[nextIndex].isActive = true;
        
        const newWrestler = Utils.getWrestler(player.wrestlers[nextIndex].wrestlerId);
        
        return {
            success: true,
            message: `🔄 ROTATION ${newWrestler.name} enters the ring!`,
            wrestler: newWrestler
        };
    }
    
    executeAction(matchId, playerId, action) {
        const match = this.activeMatches.get(matchId);
        if (!match || match.status !== 'active') {
            return { success: false, message: 'Match not found!' };
        }
        if (match.currentTurn !== playerId) {
            return { success: false, message: 'Not your turn!' };
        }
        
        const attacker = match.player1.id === playerId ? match.player1 : match.player2;
        const defender = match.player1.id === playerId ? match.player2 : match.player1;
        
        const attackerWrestler = this.getActiveWrestler(attacker);
        const defenderWrestler = this.getActiveWrestler(defender);
        
        let result = {};
        
        switch (action) {
            case 'strike':
                result = this.performStrike(attackerWrestler, defenderWrestler, attacker);
                break;
            case 'grapple':
                result = this.performGrapple(attackerWrestler, defenderWrestler, attacker);
                break;
            case 'special':
                result = this.performSpecial(attackerWrestler, defenderWrestler, attacker);
                break;
            case 'rest':
                result = this.performRest(attackerWrestler);
                break;
            case 'finisher':
                result = this.performFinisher(attackerWrestler, defenderWrestler, attacker);
                break;
            case 'rotate':
                result = this.rotateWrestler(attacker, playerId);
                if (result.success) {
                    match.rotationCount[playerId]++;
                }
                break;
            case 'taunt':
                result = this.performTaunt(attackerWrestler, defenderWrestler, attacker);
                break;
            default:
                return { success: false, message: 'Invalid action!' };
        }
        
        if (defenderWrestler.health <= 0 && !defenderWrestler.eliminated) {
            defenderWrestler.eliminated = true;
            const wrestlerData = Utils.getWrestler(defenderWrestler.wrestlerId);
            result.elimination = true;
            result.eliminatedWrestler = wrestlerData.name;
            
            const rotateResult = this.rotateWrestler(defender, defender.id);
            if (rotateResult.success) {
                result.message += `\n💥 ${result.eliminatedWrestler} ELIMINATED!\n${rotateResult.message}`;
            }
        }
        
        match.log.push({ turn: match.turnNumber, player: playerId, action, result });
        match.currentTurn = match.player1.id === playerId ? match.player2.id : match.player1.id;
        match.turnNumber++;
        
        attacker.teamHealth = this.calculateTeamHealth(attacker);
        defender.teamHealth = this.calculateTeamHealth(defender);
        
        const winner = this.checkWinCondition(match);
        if (winner) {
            match.status = 'finished';
            match.winner = winner;
        }
        
        return { success: true, result, match, winner };
    }
    
    calculateTeamHealth(player) {
        const aliveWrestlers = player.wrestlers.filter(w => !w.eliminated);
        if (aliveWrestlers.length === 0) return 0;
        
        const totalHealth = aliveWrestlers.reduce((sum, w) => sum + w.health, 0);
        return Math.floor(totalHealth / player.wrestlers.length);
    }
    
    performStrike(attacker, defender, player) {
        const damage = Utils.randomInt(8, 15);
        const staminaCost = 10;
        
        if (attacker.stamina < staminaCost) {
            return { success: false, damage: 0, message: '❌ Not enough stamina!' };
        }
        
        if (Math.random() < 0.85) {
            attacker.stamina -= staminaCost;
            defender.health = Math.max(0, defender.health - damage);
            player.momentum = Math.min(100, player.momentum + 5);
            
            const attackerData = Utils.getWrestler(attacker.wrestlerId);
            return { 
                success: true, 
                damage, 
                message: `👊 ${attackerData.name} strikes for ${damage} damage!` 
            };
        } else {
            attacker.stamina -= staminaCost / 2;
            return { success: false, damage: 0, message: `🛡️ Strike blocked!` };
        }
    }
    
    performGrapple(attacker, defender, player) {
        const damage = Utils.randomInt(10, 20);
        const staminaCost = 15;
        
        if (attacker.stamina < staminaCost) {
            return { success: false, damage: 0, message: '❌ Not enough stamina!' };
        }
        
        if (Math.random() < 0.75) {
            attacker.stamina -= staminaCost;
            defender.health = Math.max(0, defender.health - damage);
            player.momentum = Math.min(100, player.momentum + 8);
            
            const attackerData = Utils.getWrestler(attacker.wrestlerId);
            return { 
                success: true, 
                damage, 
                message: `🤼 ${attackerData.name} grapples for ${damage} damage!` 
            };
        } else {
            attacker.stamina -= staminaCost / 2;
            return { success: false, damage: 0, message: `🔄 Grapple reversed!` };
        }
    }
    
    performSpecial(attacker, defender, player) {
        if (player.momentum < 30) {
            return { 
                success: false, 
                damage: 0, 
                message: `❌ Need 30 momentum! (Have ${player.momentum})` 
            };
        }
        
        const damage = Utils.randomInt(18, 28);
        const staminaCost = 20;
        
        if (attacker.stamina < staminaCost) {
            return { success: false, damage: 0, message: '❌ Not enough stamina!' };
        }
        
        attacker.stamina -= staminaCost;
        player.momentum -= 30;
        defender.health = Math.max(0, defender.health - damage);
        
        const attackerData = Utils.getWrestler(attacker.wrestlerId);
        return { 
            success: true, 
            damage, 
            message: `⚡ ${attackerData.name} hits SPECIAL! ${damage} damage!` 
        };
    }
    
    performFinisher(attacker, defender, player) {
        if (player.momentum < 70) {
            return { 
                success: false, 
                damage: 0, 
                message: `❌ Need 70 momentum! (Have ${player.momentum})` 
            };
        }
        
        const damage = Utils.randomInt(30, 45);
        const staminaCost = 30;
        
        if (attacker.stamina < staminaCost) {
            return { success: false, damage: 0, message: '❌ Not enough stamina!' };
        }
        
        attacker.stamina -= staminaCost;
        player.momentum = 0;
        defender.health = Math.max(0, defender.health - damage);
        
        const attackerData = Utils.getWrestler(attacker.wrestlerId);
        
        if (defender.health === 0) {
            return { 
                success: true, 
                damage, 
                knockout: true,
                message: `🔥 ${attackerData.name} hits ${attackerData.finisher}! ${damage} damage! KNOCKOUT!` 
            };
        }
        
        return { 
            success: true, 
            damage, 
            message: `🔥 ${attackerData.name} executes ${attackerData.finisher}! ${damage} damage!` 
        };
    }
    
    performRest(attacker) {
        const staminaGain = Utils.randomInt(20, 30);
        const healthGain = Utils.randomInt(10, 20);
        
        attacker.stamina = Math.min(100, attacker.stamina + staminaGain);
        attacker.health = Math.min(100, attacker.health + healthGain);
        
        const attackerData = Utils.getWrestler(attacker.wrestlerId);
        return { 
            success: true, 
            staminaGain, 
            healthGain, 
            message: `💤 ${attackerData.name} rests! +${staminaGain} stamina, +${healthGain} health!` 
        };
    }
    
    performTaunt(attacker, defender, player) {
        const momentumGain = Utils.randomInt(15, 25);
        
        player.momentum = Math.min(100, player.momentum + momentumGain);
        attacker.stamina = Math.min(100, attacker.stamina + 5);
        
        const attackerData = Utils.getWrestler(attacker.wrestlerId);
        return { 
            success: true, 
            momentumGain, 
            message: `😤 ${attackerData.name} taunts! +${momentumGain} momentum!` 
        };
    }
    
    checkWinCondition(match) {
        const p1Alive = match.player1.wrestlers.filter(w => !w.eliminated).length;
        const p2Alive = match.player2.wrestlers.filter(w => !w.eliminated).length;
        
        if (p1Alive === 0) return match.player2.id;
        if (p2Alive === 0) return match.player1.id;
        
        if (match.turnNumber >= 100) {
            return match.player1.teamHealth > match.player2.teamHealth ? 
                   match.player1.id : match.player2.id;
        }
        
        return null;
    }
    
    generateMatchEmbed(match) {
        const p1 = match.player1;
        const p2 = match.player2;
        
        const p1Active = this.getActiveWrestler(p1);
        const p2Active = this.getActiveWrestler(p2);
        
        const p1Wrestler = Utils.getWrestler(p1Active.wrestlerId);
        const p2Wrestler = Utils.getWrestler(p2Active.wrestlerId);
        
        const p1Alive = p1.wrestlers.filter(w => !w.eliminated).length;
        const p2Alive = p2.wrestlers.filter(w => !w.eliminated).length;
        
        const embed = new EmbedBuilder()
            .setColor(CONFIG.COLORS.PRIMARY)
            .setTitle('🤼 WWE 5v5 TAG TEAM MATCH!')
            .setDescription(`Turn ${match.turnNumber} | <@${match.currentTurn}>'s turn`)
            .addFields(
                {
                    name: `⭐ <@${p1.id}> - ${p1Alive}/5 Alive`,
                    value: [
                        `Active: ${p1Wrestler.name}`,
                        `HP: ${Utils.progressBar(p1Active.health, 100, 10)}`,
                        `STA: ${Utils.progressBar(p1Active.stamina, 100, 10)}`,
                        `MOM: ${p1.momentum}/100 ⚡`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '⚔️',
                    value: 'VS',
                    inline: true
                },
                {
                    name: `⭐ <@${p2.id}> - ${p2Alive}/5 Alive`,
                    value: [
                        `Active: ${p2Wrestler.name}`,
                        `HP: ${Utils.progressBar(p2Active.health, 100, 10)}`,
                        `STA: ${Utils.progressBar(p2Active.stamina, 100, 10)}`,
                        `MOM: ${p2.momentum}/100 ⚡`
                    ].join('\n'),
                    inline: true
                }
            );
        
        const p1Roster = p1.wrestlers.map(w => {
            const data = Utils.getWrestler(w.wrestlerId);
            const status = w.eliminated ? '💀' : w.isActive ? '🟢' : '⚪';
            return `${status} ${data.name}`;
        }).join(' | ');
        
        const p2Roster = p2.wrestlers.map(w => {
            const data = Utils.getWrestler(w.wrestlerId);
            const status = w.eliminated ? '💀' : w.isActive ? '🟢' : '⚪';
            return `${status} ${data.name}`;
        }).join(' | ');
        
        embed.addFields(
            { name: `Team 1`, value: p1Roster },
            { name: `Team 2`, value: p2Roster }
        );
        
        if (match.log.length > 0) {
            const lastAction = match.log[match.log.length - 1];
            embed.addFields({ 
                name: '📋 Last Action', 
                value: lastAction.result.message 
            });
        }
        
        embed.setFooter({ text: '🟢 Active | ⚪ Bench | 💀 Eliminated | Click 🔄 ROTATE to switch!' });
        
        return embed;
    }
}

const matchEngine = new MatchEngine();

class CommandHandler {
    constructor() {
        this.commands = new Map();
    }
    
    register(name, execute) {
        this.commands.set(name, execute);
    }
    
    async handle(message, commandName, args) {
        const command = this.commands.get(commandName);
        if (!command) return;
        
        try {
            await command(message, args);
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            message.reply('❌ An error occurred!');
        }
    }
}

const commandHandler = new CommandHandler();

commandHandler.register('debut', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (user) {
        return message.reply('❌ You already debuted!');
    }
    
    const newUser = await db.createUser(userId, message.author.username);
    const startingWrestlers = [];
    
    for (let i = 0; i < 3; i++) {
        const commonWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'COMMON');
        const wrestler = Utils.randomElement(commonWrestlers);
        startingWrestlers.push({
            id: Utils.generateId(),
            wrestlerId: wrestler.id,
            acquiredAt: Date.now()
        });
    }
    
    const rareWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'RARE');
    const rareWrestler = Utils.randomElement(rareWrestlers);
    startingWrestlers.push({
        id: Utils.generateId(),
        wrestlerId: rareWrestler.id,
        acquiredAt: Date.now()
    });
    
    const epicWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'EPIC');
    const epicWrestler = Utils.randomElement(epicWrestlers);
    startingWrestlers.push({
        id: Utils.generateId(),
        wrestlerId: epicWrestler.id,
        acquiredAt: Date.now()
    });
    
    newUser.squad = startingWrestlers;
    newUser.playingXI = startingWrestlers.map(w => w.id);
    newUser.cardsOwned = 5;
    await db.updateUser(userId, newUser);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('🎉 WELCOME TO WWE 5v5 TAG TEAM BATTLES!')
        .setDescription(`${message.author.username} - Your 5-man team is ready!`)
        .addFields(
            { name: '💰 Purse', value: Utils.formatCurrency(CONFIG.STARTING_PURSE), inline: true },
            { name: '👥 Team', value: '5 Wrestlers', inline: true },
            { name: '📊 Level', value: '1', inline: true }
        );
    
    embed.addFields({
        name: '🤼 Your Starting 5',
        value: startingWrestlers.map((c, i) => {
            const w = Utils.getWrestler(c.wrestlerId);
            return `${i + 1}. ${Utils.getRarityEmoji(w.rarity)} ${w.name} (${w.stats.overall})`;
        }).join('\n')
    });
    
    embed.addFields({
        name: '💡 How WWE 5v5 Works',
        value: [
            '• All 5 wrestlers rotate in battle!',
            '• Use !play @user to start match',
            '• Click 🔄 ROTATE to switch wrestlers',
            '• Auto-rotates when health = 0',
            '• WIN: Eliminate all 5 opponents!'
        ].join('\n')
    });
    
    message.reply({ embeds: [embed] });
});

commandHandler.register('drop', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use !debut first!');
    }
    
    const rarity = Utils.weightedRandom(CONFIG.DROP_RATES);
    const wrestlersOfRarity = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
    const wrestler = Utils.randomElement(wrestlersOfRarity);
    
    const newCard = {
        id: Utils.generateId(),
        wrestlerId: wrestler.id,
        acquiredAt: Date.now()
    };
    
    user.squad.push(newCard);
    user.cardsOwned++;
    await db.updateUser(userId, user);
    
    const cardBuffer = await CardGenerator.createCard(wrestler, message.author.displayAvatarURL({ format: 'png' }));
    const attachment = new AttachmentBuilder(cardBuffer, { name: `${wrestler.id}.png` });
    
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle('🎴 NEW WRESTLER DROPPED!')
        .setDescription(`${wrestler.rarity} Card Obtained!`)
        .setImage(`attachment://${wrestler.id}.png`)
        .addFields(
            { name: '💰 Value', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '📊 Collection', value: `${user.squad.length} cards`, inline: true }
        )
        .setFooter({ text: wrestler.signature });
    
    message.reply({ embeds: [embed], files: [attachment] });
});

commandHandler.register('play', async (message, args) => {
    const user1 = await db.getUser(message.author.id);
    if (!user1) return message.reply('❌ Use !debut first!');
    if (user1.playingXI.length < 5) {
        return message.reply('❌ You need 5 wrestlers!');
    }
    
    const opponent = message.mentions.users.first();
    if (!opponent) return message.reply('❌ Mention opponent! Example: !play @user');
    if (opponent.id === message.author.id) return message.reply('❌ Cannot battle yourself!');
    if (opponent.bot) return message.reply('❌ Cannot battle bots!');
    
    const user2 = await db.getUser(opponent.id);
    if (!user2) return message.reply(`❌ ${opponent.username} hasn't started!`);
    if (user2.playingXI.length < 5) {
        return message.reply(`❌ ${opponent.username} needs 5 wrestlers!`);
    }
    
    const match = matchEngine.createMatch(message.author.id, opponent.id, message.channel.id);
    
    const p1Squad = user1.playingXI.map(cardId => user1.squad.find(c => c.id === cardId)).filter(c => c);
    const p2Squad = user2.playingXI.map(cardId => user2.squad.find(c => c.id === cardId)).filter(c => c);
    
    matchEngine.loadWrestlers(match, p1Squad, p2Squad);
    
    const embed = matchEngine.generateMatchEmbed(match);
    const buttons = UIComponents.createMatchButtons();
    
    const matchMsg = await message.reply({ 
        content: `🤼 5v5 TAG TEAM MATCH! ${message.author} vs ${opponent}\n\nROTATION SYSTEM ACTIVE!\n<@${match.currentTurn}> your turn!`,
        embeds: [embed], 
        components: buttons 
    });
    
    match.messageId = matchMsg.id;
});

commandHandler.register('help', async (message, args) => {
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🤼 WWE WRESTLING CARDS - COMMANDS')
        .setDescription(`Prefix: !`)
        .addFields(
            { name: '🎯 Getting Started', value: 'debut, start' },
            { name: '🎴 Cards', value: 'drop, pack, squad, roster, xi, team' },
            { name: '💰 Economy', value: 'daily, vote, purse, bal, buy, sell, market' },
            { name: '⚔️ Battles', value: 'play @user' },
            { name: '📊 Stats', value: 'profile, stats, leaderboard, lb' }
        );
    
    message.reply({ embeds: [embed] });
});
// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL COMMANDS - ALL MISSING COMMANDS
// ═══════════════════════════════════════════════════════════════════════════

// ALIASES FOR DEBUT
commandHandler.register('start', async (message, args) => {
    await commandHandler.commands.get('debut')(message, args);
});

commandHandler.register('begin', async (message, args) => {
    await commandHandler.commands.get('debut')(message, args);
});

// ALIASES FOR DROP
commandHandler.register('pack', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

commandHandler.register('open', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// DAILY COMMAND - Daily Rewards with Streak Bonus
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('daily', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    const now = Date.now();
    const lastDaily = user.lastDaily || 0;
    const timeSince = now - lastDaily;
    const oneDay = 86400000; // 24 hours in milliseconds
    
    if (timeSince < oneDay) {
        const timeLeft = oneDay - timeSince;
        return message.reply(`⏰ Daily available in ${Utils.formatDuration(timeLeft)}`);
    }
    
    // Calculate streak
    let streak = user.dailyStreak || 0;
    if (timeSince < oneDay * 2) {
        // Claimed within 48 hours = streak continues
        streak++;
    } else {
        // Missed a day = streak resets
        streak = 1;
    }
    
    // Bonus coins based on streak
    const streakBonus = streak * 100;
    const reward = CONFIG.DAILY_REWARD + streakBonus;
    
    user.purse += reward;
    user.totalCoinsEarned += reward;
    user.lastDaily = now;
    user.dailyStreak = streak;
    await db.updateUser(userId, user);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('📅 DAILY REWARD CLAIMED!')
        .addFields(
            { name: '💰 Base Reward', value: Utils.formatCurrency(CONFIG.DAILY_REWARD), inline: true },
            { name: '🔥 Streak Bonus', value: Utils.formatCurrency(streakBonus), inline: true },
            { name: '💵 Total', value: Utils.formatCurrency(reward), inline: true },
            { name: '🔥 Current Streak', value: `${streak} days`, inline: true },
            { name: '💼 New Balance', value: Utils.formatCurrency(user.purse), inline: true }
        )
        .setFooter({ text: 'Come back tomorrow to keep your streak!' });
    
    message.reply({ embeds: [embed] });
});

commandHandler.register('claim', async (message, args) => {
    await commandHandler.commands.get('daily')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// VOTE COMMAND - Vote Rewards
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('vote', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    const now = Date.now();
    const lastVote = user.lastVote || 0;
    const timeSince = now - lastVote;
    const twelveHours = 43200000; // 12 hours in milliseconds
    
    if (timeSince < twelveHours) {
        const timeLeft = twelveHours - timeSince;
        return message.reply(`⏰ Vote reward available in ${Utils.formatDuration(timeLeft)}`);
    }
    
    const reward = CONFIG.VOTE_REWARD;
    user.purse += reward;
    user.totalCoinsEarned += reward;
    user.lastVote = now;
    await db.updateUser(userId, user);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('🗳️ VOTE REWARD!')
        .setDescription('Thank you for voting!')
        .addFields(
            { name: '💰 Reward', value: Utils.formatCurrency(reward), inline: true },
            { name: '💼 Balance', value: Utils.formatCurrency(user.purse), inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// ═══════════════════════════════════════════════════════════════════════════
// PURSE COMMAND - Check Balance
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('purse', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started yet!`);
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.INFO)
        .setTitle(`💰 ${target.username}'s Purse`)
        .addFields(
            { name: '💼 Current Balance', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '📈 Level', value: `${user.level}`, inline: true },
            { name: '🎴 Cards Owned', value: `${user.squad.length}`, inline: true },
            { name: '💸 Total Earned', value: Utils.formatCurrency(user.totalCoinsEarned), inline: true },
            { name: '💵 Total Spent', value: Utils.formatCurrency(user.totalCoinsSpent), inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// PURSE ALIASES
commandHandler.register('balance', async (message, args) => {
    await commandHandler.commands.get('purse')(message, args);
});

commandHandler.register('bal', async (message, args) => {
    await commandHandler.commands.get('purse')(message, args);
});

commandHandler.register('wallet', async (message, args) => {
    await commandHandler.commands.get('purse')(message, args);
});

commandHandler.register('coins', async (message, args) => {
    await commandHandler.commands.get('purse')(message, args);
});

commandHandler.register('money', async (message, args) => {
    await commandHandler.commands.get('purse')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// SQUAD COMMAND - View Your Collection
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('squad', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started yet!`);
    }
    
    if (user.squad.length === 0) {
        return message.reply('❌ No wrestlers in squad! Use `!drop` to get cards.');
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.INFO)
        .setTitle(`📦 ${target.username}'s Squad`)
        .setDescription(`Total: ${user.squad.length} wrestlers`);
    
    // Show first 20 wrestlers
    const displaySquad = user.squad.slice(0, 20);
    
    displaySquad.forEach((card, i) => {
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) {
            embed.addFields({
                name: `${i + 1}. ${w.name}`,
                value: `${Utils.getRarityEmoji(w.rarity)} ${w.rarity} | OVR: ${w.stats.overall}`,
                inline: true
            });
        }
    });
    
    if (user.squad.length > 20) {
        embed.setFooter({ text: `Showing 20 of ${user.squad.length} wrestlers` });
    }
    
    message.reply({ embeds: [embed] });
});

// SQUAD ALIASES
commandHandler.register('roster', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

commandHandler.register('collection', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

commandHandler.register('cards', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// XI COMMAND - View Playing 5 (Battle Team)
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('xi', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started yet!`);
    }
    
    // Auto-set Playing XI if not set
    if (user.playingXI.length === 0) {
        const top5 = user.squad.slice(0, 5).map(c => c.id);
        user.playingXI = top5;
        await db.updateUser(target.id, user);
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle(`⭐ ${target.username}'s Playing 5`)
        .setDescription('Your active battle team');
    
    user.playingXI.forEach((cardId, i) => {
        const card = user.squad.find(c => c.id === cardId);
        if (!card) return;
        
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) {
            embed.addFields({
                name: `${i + 1}. ${w.name}`,
                value: `${Utils.getRarityEmoji(w.rarity)} Overall: ${w.stats.overall} | ${w.finisher}`,
                inline: true
            });
        }
    });
    
    embed.setFooter({ text: 'These wrestlers will be used in battles!' });
    
    message.reply({ embeds: [embed] });
});

// XI ALIASES
commandHandler.register('team', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

commandHandler.register('playingxi', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

commandHandler.register('lineup', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE COMMAND - Player Statistics
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('profile', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started yet!`);
    }
    
    const winRate = user.matchesPlayed > 0 
        ? ((user.wins / user.matchesPlayed) * 100).toFixed(1) 
        : 0;
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.INFO)
        .setTitle(`📊 ${target.username}'s Profile`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: '📈 Level', value: `${user.level}`, inline: true },
            { name: '⭐ XP', value: `${user.xp}`, inline: true },
            { name: '💰 Purse', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '🎴 Cards', value: `${user.squad.length}`, inline: true },
            { name: '⚔️ Matches', value: `${user.matchesPlayed}`, inline: true },
            { name: '🏆 Wins', value: `${user.wins}`, inline: true },
            { name: '💔 Losses', value: `${user.losses}`, inline: true },
            { name: '📊 Win Rate', value: `${winRate}%`, inline: true },
            { name: '🔥 Win Streak', value: `${user.winStreak}`, inline: true },
            { name: '🏅 Best Streak', value: `${user.bestWinStreak || 0}`, inline: true },
            { name: '📅 Daily Streak', value: `${user.dailyStreak || 0} days`, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// PROFILE ALIASES
commandHandler.register('stats', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

commandHandler.register('me', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

commandHandler.register('info', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD COMMAND - Top Players
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('leaderboard', async (message, args) => {
    const users = await db.loadData(DB_PATHS.USERS);
    const userArray = Object.values(users);
    
    // Sort by wins
    const sorted = userArray.sort((a, b) => b.wins - a.wins);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🏆 WWE CARD GAME LEADERBOARD')
        .setDescription('Top 10 Players by Wins');
    
    sorted.slice(0, 10).forEach((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        const winRate = u.matchesPlayed > 0 
            ? ((u.wins / u.matchesPlayed) * 100).toFixed(1) 
            : 0;
        
        embed.addFields({
            name: `${medal} ${u.username}`,
            value: `Wins: ${u.wins} | Level: ${u.level} | Win Rate: ${winRate}%`,
            inline: false
        });
    });
    
    message.reply({ embeds: [embed] });
});

// LEADERBOARD ALIASES
commandHandler.register('lb', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('top', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('rank', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('rankings', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// VIEW COMMAND - View Wrestler Details
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('view', async (message, args) => {
    if (!args.length) {
        return message.reply('❌ Specify wrestler name! Example: `!view Roman Reigns`');
    }
    
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => 
        w.name.toLowerCase().includes(searchName) || 
        w.id.toLowerCase().includes(searchName)
    );
    
    if (!wrestler) {
        return message.reply('❌ Wrestler not found! Try a different name.');
    }
    
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle(`${Utils.getRarityEmoji(wrestler.rarity)} ${wrestler.name}`)
        .setDescription(`*"${wrestler.signature}"*`)
        .addFields(
            { name: '⭐ Overall Rating', value: `${wrestler.stats.overall}`, inline: true },
            { name: '🏷️ Rarity', value: wrestler.rarity, inline: true },
            { name: '💰 Price', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '💪 Power', value: `${wrestler.stats.power}`, inline: true },
            { name: '⚡ Speed', value: `${wrestler.stats.speed}`, inline: true },
            { name: '🏃 Stamina', value: `${wrestler.stats.stamina}`, inline: true },
            { name: '🎯 Technique', value: `${wrestler.stats.technique}`, inline: true },
            { name: '⭐ Charisma', value: `${wrestler.stats.charisma}`, inline: true },
            { name: '🛡️ Defense', value: `${wrestler.stats.defense}`, inline: true },
            { name: '⚡ Finisher', value: wrestler.finisher, inline: true },
            { name: '📺 Brand', value: wrestler.brand, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// VIEW ALIASES
commandHandler.register('show', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

commandHandler.register('card', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

commandHandler.register('wrestler', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// BUY COMMAND - Purchase Wrestlers
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('buy', async (message, args) => {
    const user = await db.getUser(message.author.id);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    if (!args.length) {
        return message.reply('❌ Specify wrestler name! Example: `!buy Roman Reigns`');
    }
    
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => 
        w.name.toLowerCase().includes(searchName)
    );
    
    if (!wrestler) {
        return message.reply('❌ Wrestler not found! Try `!market` to see available wrestlers.');
    }
    
    if (user.purse < wrestler.basePrice) {
        return message.reply(
            `❌ Not enough coins!\n` +
            `Need: ${Utils.formatCurrency(wrestler.basePrice)}\n` +
            `Have: ${Utils.formatCurrency(user.purse)}`
        );
    }
    
    // Deduct coins
    user.purse -= wrestler.basePrice;
    user.totalCoinsSpent += wrestler.basePrice;
    
    // Add to squad
    const newCard = {
        id: Utils.generateId(),
        wrestlerId: wrestler.id,
        acquiredAt: Date.now()
    };
    user.squad.push(newCard);
    user.cardsOwned++;
    
    await db.updateUser(message.author.id, user);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('✅ PURCHASE SUCCESSFUL!')
        .setDescription(`You bought **${wrestler.name}**!`)
        .addFields(
            { name: '💰 Cost', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '💼 New Balance', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '🎴 Total Cards', value: `${user.squad.length}`, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// BUY ALIASES
commandHandler.register('purchase', async (message, args) => {
    await commandHandler.commands.get('buy')(message, args);
});

commandHandler.register('get', async (message, args) => {
    await commandHandler.commands.get('buy')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// SELL COMMAND - Sell Wrestlers
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('sell', async (message, args) => {
    const user = await db.getUser(message.author.id);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    if (!args.length) {
        return message.reply('❌ Specify wrestler name! Example: `!sell Dolph Ziggler`');
    }
    
    const searchName = args.join(' ').toLowerCase();
    
    // Find wrestler in user's squad
    const userCard = user.squad.find(card => {
        const w = Utils.getWrestler(card.wrestlerId);
        return w && w.name.toLowerCase().includes(searchName);
    });
    
    if (!userCard) {
        return message.reply('❌ You don\'t own that wrestler!');
    }
    
    const wrestler = Utils.getWrestler(userCard.wrestlerId);
    
    // Sell for 70% of base price
    const sellPrice = Math.floor(wrestler.basePrice * 0.7);
    
    user.purse += sellPrice;
    user.totalCoinsEarned += sellPrice;
    
    // Remove from squad
    user.squad = user.squad.filter(c => c.id !== userCard.id);
    
    // Remove from Playing XI if present
    user.playingXI = user.playingXI.filter(id => id !== userCard.id);
    
    user.cardsOwned--;
    
    await db.updateUser(message.author.id, user);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('💵 SOLD!')
        .setDescription(`You sold **${wrestler.name}**`)
        .addFields(
            { name: '💰 Received', value: Utils.formatCurrency(sellPrice), inline: true },
            { name: '💼 New Balance', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '🎴 Cards Left', value: `${user.squad.length}`, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// ═══════════════════════════════════════════════════════════════════════════
// MARKET COMMAND - Browse Available Wrestlers
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('market', async (message, args) => {
    let wrestlers = WRESTLERS_ARRAY;
    let filterText = 'All Wrestlers';
    
    // Filter by rarity if specified
    if (args.length > 0) {
        const rarity = args[0].toUpperCase();
        if (['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].includes(rarity)) {
            wrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
            filterText = `${rarity} Wrestlers`;
        }
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🏪 WRESTLER MARKETPLACE')
        .setDescription(`${filterText} - Showing ${Math.min(wrestlers.length, 15)} of ${wrestlers.length}`);
    
    // Show first 15 wrestlers
    wrestlers.slice(0, 15).forEach(w => {
        embed.addFields({
            name: `${Utils.getRarityEmoji(w.rarity)} ${w.name}`,
            value: `Overall: ${w.stats.overall} | ${Utils.formatCurrency(w.basePrice)}`,
            inline: true
        });
    });
    
    embed.setFooter({ text: 'Use !buy <wrestler name> to purchase | Filter: !market <rarity>' });
    
    message.reply({ embeds: [embed] });
});

// MARKET ALIASES
commandHandler.register('shop', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

commandHandler.register('store', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

commandHandler.register('browse', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// BATTLE/FIGHT ALIASES FOR PLAY
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('battle', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

commandHandler.register('fight', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

commandHandler.register('challenge', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// RESET COMMAND - Start Over
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('reset', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ You haven\'t started yet! Use `!debut` to begin.');
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.WARNING)
        .setTitle('⚠️ RESET ACCOUNT?')
        .setDescription(
            `This will **DELETE ALL YOUR DATA**:\n\n` +
            `• ${user.squad.length} wrestlers\n` +
            `• ${Utils.formatCurrency(user.purse)}\n` +
            `• Level ${user.level}\n` +
            `• ${user.wins} wins\n\n` +
            `**This action cannot be undone!**\n\n` +
            `Type \`!confirm-reset\` within 30 seconds to confirm.`
        );
    
    message.reply({ embeds: [embed] });
    
    // Wait for confirmation
    const filter = m => m.author.id === userId && m.content.toLowerCase() === '!confirm-reset';
    const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });
    
    collector.on('collect', async () => {
        const users = await db.loadData(DB_PATHS.USERS);
        delete users[userId];
        await db.saveData(DB_PATHS.USERS, users);
        
        message.reply('✅ Account reset! Use `!debut` to start fresh.');
    });
    
    collector.on('end', collected => {
        if (collected.size === 0) {
            message.reply('⏰ Reset cancelled - timed out.');
        }
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// HELP COMMAND ALIASES
// ═══════════════════════════════════════════════════════════════════════════
commandHandler.register('commands', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('h', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('?', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('guide', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    const customId = interaction.customId;
    
    if (customId.startsWith('match_')) {
        const action = customId.replace('match_', '');
        
        let matchId = null;
        for (const [id, match] of matchEngine.activeMatches) {
            if (match.channelId === interaction.channel.id && match.status === 'active') {
                matchId = id;
                break;
            }
        }
        
        if (!matchId) {
            return interaction.reply({ content: '❌ No active match!', ephemeral: true });
        }
        
        const match = matchEngine.activeMatches.get(matchId);
        
        if (action === 'forfeit') {
            const winnerId = match.player1.id === interaction.user.id ? match.player2.id : match.player1.id;
            const loserId = interaction.user.id;
            
            match.status = 'finished';
            match.winner = winnerId;
            
            const winnerUser = await db.getUser(winnerId);
            const loserUser = await db.getUser(loserId);
            
            winnerUser.wins++;
            winnerUser.matchesPlayed++;
            winnerUser.winStreak++;
            winnerUser.xp += CONFIG.XP_PER_WIN;
            winnerUser.level = Utils.calculateLevel(winnerUser.xp);
            await db.updateUser(winnerId, winnerUser);
            
            loserUser.losses++;
            loserUser.matchesPlayed++;
            loserUser.winStreak = 0;
            loserUser.xp += CONFIG.XP_PER_LOSS;
            loserUser.level = Utils.calculateLevel(loserUser.xp);
            await db.updateUser(loserId, loserUser);
            
            await interaction.update({ 
                content: `🏳️ <@${loserId}> forfeited! <@${winnerId}> WINS!`,
                embeds: [], 
                components: [] 
            });
            
            matchEngine.activeMatches.delete(matchId);
            return;
        }
        
        const result = matchEngine.executeAction(matchId, interaction.user.id, action);
        
        if (!result.success) {
            return interaction.reply({ content: result.message, ephemeral: true });
        }
        
        if (result.winner) {
            const winnerId = result.winner;
            const loserId = winnerId === match.player1.id ? match.player2.id : match.player1.id;
            
            const winnerUser = await db.getUser(winnerId);
            const loserUser = await db.getUser(loserId);
            
            winnerUser.wins++;
            winnerUser.matchesPlayed++;
            winnerUser.winStreak++;
            winnerUser.xp += CONFIG.XP_PER_WIN;
            winnerUser.level = Utils.calculateLevel(winnerUser.xp);
            await db.updateUser(winnerId, winnerUser);
            
            loserUser.losses++;
            loserUser.matchesPlayed++;
            loserUser.winStreak = 0;
            loserUser.xp += CONFIG.XP_PER_LOSS;
            loserUser.level = Utils.calculateLevel(loserUser.xp);
            await db.updateUser(loserId, loserUser);
            
            const embed = new EmbedBuilder()
                .setColor(CONFIG.COLORS.SUCCESS)
                .setTitle('🏆 MATCH FINISHED!')
                .setDescription(`<@${winnerId}> WINS!`)
                .addFields(
                    { name: '🏆 Winner', value: `<@${winnerId}>`, inline: true },
                    { name: '⏱️ Turns', value: `${match.turnNumber}`, inline: true }
                );
            
            await interaction.update({ 
                content: `🏆 <@${winnerId}> WINS!`,
                embeds: [embed], 
                components: [] 
            });
            
            matchEngine.activeMatches.delete(matchId);
        } else {
            const embed = matchEngine.generateMatchEmbed(result.match);
            const buttons = UIComponents.createMatchButtons();
            
            await interaction.update({ 
                content: `${result.result.message}\n\n<@${result.match.currentTurn}> your turn!`,
                embeds: [embed], 
                components: buttons 
            });
        }
    }
});

client.on('ready', async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ ${client.user.tag} is ONLINE!`);
    console.log(`📊 Servers: ${client.guilds.cache.size}`);
    console.log(`👥 Users: ${client.users.cache.size}`);
    console.log(`🤼 70 Wrestlers | 5v5 Rotation | Image Cards`);
    console.log('═══════════════════════════════════════════════════════');
    
    client.user.setActivity('!help | WWE 5v5', { type: 3 });
    
    for (const [name, pathValue] of Object.entries(DB_PATHS)) {
        await db.loadData(pathValue);
    }
    
    console.log('✅ All systems ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(CONFIG.PREFIX)) return;
    
    const args = message.content.slice(CONFIG.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    await commandHandler.handle(message, commandName, args);
});

client.login(CONFIG.BOT_TOKEN);

module.exports = { client, db, Utils, matchEngine, CONFIG, WRESTLERS_DATABASE, CardGenerator };
```
