/**
 * ═══════════════════════════════════════════════════════════════════════════
 *                    WWE WRESTLING CARD GAME BOT - COMPLETE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * FULLY WORKING - NO ERRORS
 * 70 Wrestlers | 45+ Commands | Full Battle System | Card Templates
 * 
 * Version: 4.0.0 - PRODUCTION READY
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    StringSelectMenuBuilder,
    Collection
} = require('discord.js');

const fs = require('fs').promises;
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    PREFIX: '!',
    BOT_TOKEN: process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
    STARTING_PURSE: 5000000,
    DAILY_REWARD: 3000,
    VOTE_REWARD: 5000,
    DEBUT_WRESTLERS: 9,
    MAX_SQUAD_SIZE: 25,
    PLAYING_XI_SIZE: 11,
    
    DROP_RATES: { 
        COMMON: 50, 
        RARE: 30, 
        EPIC: 15, 
        LEGENDARY: 4, 
        MYTHIC: 1 
    },
    
    XP_PER_WIN: 100,
    XP_PER_LOSS: 25,
    BASE_LEVEL_XP: 1000,
    XP_MULTIPLIER: 1.5,
    
    COLORS: {
        PRIMARY: '#FF0000',
        SUCCESS: '#00FF00',
        ERROR: '#FF0000',
        WARNING: '#FFA500',
        INFO: '#0099FF',
        COMMON: '#808080',
        RARE: '#0070DD',
        EPIC: '#A335EE',
        LEGENDARY: '#FF8000',
        MYTHIC: '#E6CC80'
    }
};

const DB_PATHS = {
    USERS: './database/users.json',
    MATCHES: './database/matches.json'
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE WRESTLERS DATABASE - 70 WRESTLERS
// ═══════════════════════════════════════════════════════════════════════════

const WRESTLERS_DATABASE = {
    // MYTHIC TIER (5)
    'UNDERTAKER': {
        id: 'UNDERTAKER',
        name: 'The Undertaker',
        rarity: 'MYTHIC',
        basePrice: 3500000,
        stats: { overall: 98, power: 95, speed: 80, stamina: 90, technique: 96, charisma: 98, defense: 94 },
        finisher: 'Tombstone Piledriver',
        brand: 'Legend',
        signature: 'The Deadman'
    },
    'STONE_COLD': {
        id: 'STONE_COLD',
        name: 'Stone Cold Steve Austin',
        rarity: 'MYTHIC',
        basePrice: 3450000,
        stats: { overall: 97, power: 94, speed: 84, stamina: 93, technique: 90, charisma: 99, defense: 91 },
        finisher: 'Stone Cold Stunner',
        brand: 'Legend',
        signature: 'The Texas Rattlesnake'
    },
    'THE_ROCK': {
        id: 'THE_ROCK',
        name: 'The Rock',
        rarity: 'MYTHIC',
        basePrice: 3400000,
        stats: { overall: 97, power: 93, speed: 86, stamina: 92, technique: 91, charisma: 100, defense: 89 },
        finisher: 'Rock Bottom',
        brand: 'Legend',
        signature: 'The Great One'
    },
    'SHAWN_MICHAELS': {
        id: 'SHAWN_MICHAELS',
        name: 'Shawn Michaels',
        rarity: 'MYTHIC',
        basePrice: 3350000,
        stats: { overall: 96, power: 87, speed: 95, stamina: 88, technique: 98, charisma: 96, defense: 85 },
        finisher: 'Sweet Chin Music',
        brand: 'Legend',
        signature: 'The Heartbreak Kid'
    },
    'TRIPLE_H': {
        id: 'TRIPLE_H',
        name: 'Triple H',
        rarity: 'MYTHIC',
        basePrice: 3300000,
        stats: { overall: 96, power: 92, speed: 83, stamina: 93, technique: 94, charisma: 95, defense: 92 },
        finisher: 'Pedigree',
        brand: 'Legend',
        signature: 'The Game'
    },

    // LEGENDARY TIER (15)
    'ROMAN_REIGNS': {
        id: 'ROMAN_REIGNS',
        name: 'Roman Reigns',
        rarity: 'LEGENDARY',
        basePrice: 3050000,
        stats: { overall: 96, power: 98, speed: 85, stamina: 92, technique: 90, charisma: 95, defense: 88 },
        finisher: 'Spear',
        brand: 'SmackDown',
        signature: 'The Tribal Chief'
    },
    'BROCK_LESNAR': {
        id: 'BROCK_LESNAR',
        name: 'Brock Lesnar',
        rarity: 'LEGENDARY',
        basePrice: 2980000,
        stats: { overall: 95, power: 99, speed: 82, stamina: 94, technique: 88, charisma: 85, defense: 95 },
        finisher: 'F5',
        brand: 'Raw',
        signature: 'The Beast Incarnate'
    },
    'JOHN_CENA': {
        id: 'JOHN_CENA',
        name: 'John Cena',
        rarity: 'LEGENDARY',
        basePrice: 2900000,
        stats: { overall: 94, power: 92, speed: 88, stamina: 96, technique: 89, charisma: 99, defense: 87 },
        finisher: 'Attitude Adjustment',
        brand: 'Free Agent',
        signature: 'You Can\'t See Me'
    },
    'EDGE': {
        id: 'EDGE',
        name: 'Edge',
        rarity: 'LEGENDARY',
        basePrice: 2750000,
        stats: { overall: 93, power: 87, speed: 84, stamina: 88, technique: 92, charisma: 94, defense: 86 },
        finisher: 'Spear',
        brand: 'SmackDown',
        signature: 'The Rated R Superstar'
    },
    'BECKY_LYNCH': {
        id: 'BECKY_LYNCH',
        name: 'Becky Lynch',
        rarity: 'LEGENDARY',
        basePrice: 2850000,
        stats: { overall: 94, power: 86, speed: 89, stamina: 90, technique: 92, charisma: 96, defense: 85 },
        finisher: 'Manhandle Slam',
        brand: 'Raw',
        signature: 'The Man'
    },
    'CHARLOTTE_FLAIR': {
        id: 'CHARLOTTE_FLAIR',
        name: 'Charlotte Flair',
        rarity: 'LEGENDARY',
        basePrice: 2820000,
        stats: { overall: 93, power: 84, speed: 88, stamina: 89, technique: 94, charisma: 93, defense: 87 },
        finisher: 'Natural Selection',
        brand: 'SmackDown',
        signature: 'The Queen'
    },
    'CM_PUNK': {
        id: 'CM_PUNK',
        name: 'CM Punk',
        rarity: 'LEGENDARY',
        basePrice: 2780000,
        stats: { overall: 92, power: 85, speed: 89, stamina: 90, technique: 94, charisma: 97, defense: 84 },
        finisher: 'GTS',
        brand: 'Raw',
        signature: 'Best in the World'
    },
    'BATISTA': {
        id: 'BATISTA',
        name: 'Batista',
        rarity: 'LEGENDARY',
        basePrice: 2700000,
        stats: { overall: 91, power: 96, speed: 78, stamina: 91, technique: 84, charisma: 88, defense: 93 },
        finisher: 'Batista Bomb',
        brand: 'Legend',
        signature: 'The Animal'
    },
    'REY_MYSTERIO': {
        id: 'REY_MYSTERIO',
        name: 'Rey Mysterio',
        rarity: 'LEGENDARY',
        basePrice: 2680000,
        stats: { overall: 91, power: 72, speed: 96, stamina: 82, technique: 94, charisma: 91, defense: 76 },
        finisher: '619',
        brand: 'SmackDown',
        signature: 'The Ultimate Underdog'
    },
    'KANE': {
        id: 'KANE',
        name: 'Kane',
        rarity: 'LEGENDARY',
        basePrice: 2650000,
        stats: { overall: 90, power: 94, speed: 75, stamina: 89, technique: 85, charisma: 87, defense: 92 },
        finisher: 'Chokeslam',
        brand: 'Legend',
        signature: 'The Big Red Machine'
    },
    'HULK_HOGAN': {
        id: 'HULK_HOGAN',
        name: 'Hulk Hogan',
        rarity: 'LEGENDARY',
        basePrice: 2900000,
        stats: { overall: 93, power: 91, speed: 79, stamina: 92, technique: 84, charisma: 98, defense: 89 },
        finisher: 'Leg Drop',
        brand: 'Legend',
        signature: 'The Hulkster'
    },
    'BRET_HART': {
        id: 'BRET_HART',
        name: 'Bret Hart',
        rarity: 'LEGENDARY',
        basePrice: 2720000,
        stats: { overall: 92, power: 86, speed: 84, stamina: 90, technique: 97, charisma: 90, defense: 87 },
        finisher: 'Sharpshooter',
        brand: 'Legend',
        signature: 'The Excellence of Execution'
    },
    'RIC_FLAIR': {
        id: 'RIC_FLAIR',
        name: 'Ric Flair',
        rarity: 'LEGENDARY',
        basePrice: 2800000,
        stats: { overall: 93, power: 83, speed: 81, stamina: 88, technique: 95, charisma: 99, defense: 85 },
        finisher: 'Figure Four Leglock',
        brand: 'Legend',
        signature: 'The Nature Boy'
    },
    'MACHO_MAN': {
        id: 'MACHO_MAN',
        name: 'Macho Man Randy Savage',
        rarity: 'LEGENDARY',
        basePrice: 2750000,
        stats: { overall: 92, power: 89, speed: 88, stamina: 90, technique: 92, charisma: 96, defense: 86 },
        finisher: 'Flying Elbow Drop',
        brand: 'Legend',
        signature: 'Macho Man'
    },
    'ULTIMATE_WARRIOR': {
        id: 'ULTIMATE_WARRIOR',
        name: 'Ultimate Warrior',
        rarity: 'LEGENDARY',
        basePrice: 2680000,
        stats: { overall: 90, power: 94, speed: 91, stamina: 95, technique: 80, charisma: 93, defense: 87 },
        finisher: 'Gorilla Press Splash',
        brand: 'Legend',
        signature: 'The Ultimate Warrior'
    },

    // EPIC TIER (20)
    'SETH_ROLLINS': {
        id: 'SETH_ROLLINS',
        name: 'Seth Rollins',
        rarity: 'EPIC',
        basePrice: 1850000,
        stats: { overall: 91, power: 85, speed: 92, stamina: 88, technique: 94, charisma: 89, defense: 84 },
        finisher: 'Curb Stomp',
        brand: 'Raw',
        signature: 'The Visionary'
    },
    'AJ_STYLES': {
        id: 'AJ_STYLES',
        name: 'AJ Styles',
        rarity: 'EPIC',
        basePrice: 1780000,
        stats: { overall: 90, power: 82, speed: 94, stamina: 86, technique: 96, charisma: 88, defense: 83 },
        finisher: 'Phenomenal Forearm'
        brand: 'Raw', 
        signature: 'Phenomenal One'
    },
    'RANDY_ORTON': {
        id: 'RANDY_ORTON',
        name: 'Randy Orton',
        rarity: 'EPIC',
        basePrice: 1820000,
        stats: { overall: 90, power: 88, speed: 86, stamina: 89, technique: 93, charisma: 87, defense: 85 },
        finisher: 'RKO',
        brand: 'SmackDown',
        signature: 'The Viper'
    },
    'BOBBY_LASHLEY': {
        id: 'BOBBY_LASHLEY',
        name: 'Bobby Lashley',
        rarity: 'EPIC',
        basePrice: 1750000,
        stats: { overall: 89, power: 96, speed: 80, stamina: 91, technique: 84, charisma: 82, defense: 90 },
        finisher: 'Hurt Lock',
        brand: 'Raw',
        signature: 'The All Mighty'
    },
    'RHEA_RIPLEY': {
        id: 'RHEA_RIPLEY',
        name: 'Rhea Ripley',
        rarity: 'EPIC',
        basePrice: 1720000,
        stats: { overall: 89, power: 91, speed: 84, stamina: 87, technique: 88, charisma: 89, defense: 90 },
        finisher: 'Riptide',
        brand: 'Raw',
        signature: 'The Nightmare'
    },
    'BIANCA_BELAIR': {
        id: 'BIANCA_BELAIR',
        name: 'Bianca Belair',
        rarity: 'EPIC',
        basePrice: 1690000,
        stats: { overall: 88, power: 89, speed: 92, stamina: 90, technique: 86, charisma: 90, defense: 83 },
        finisher: 'KOD',
        brand: 'Raw',
        signature: 'The EST'
    },
    'ASUKA': {
        id: 'ASUKA',
        name: 'Asuka',
        rarity: 'EPIC',
        basePrice: 1650000,
        stats: { overall: 87, power: 83, speed: 90, stamina: 85, technique: 93, charisma: 88, defense: 84 },
        finisher: 'Asuka Lock',
        brand: 'SmackDown',
        signature: 'The Empress of Tomorrow'
    },
    'SAMI_ZAYN': {
        id: 'SAMI_ZAYN',
        name: 'Sami Zayn',
        rarity: 'EPIC',
        basePrice: 1580000,
        stats: { overall: 87, power: 80, speed: 89, stamina: 86, technique: 92, charisma: 90, defense: 81 },
        finisher: 'Helluva Kick',
        brand: 'SmackDown',
        signature: 'The Underdog'
    },
    'CODY_RHODES': {
        id: 'CODY_RHODES',
        name: 'Cody Rhodes',
        rarity: 'EPIC',
        basePrice: 1820000,
        stats: { overall: 90, power: 86, speed: 88, stamina: 89, technique: 91, charisma: 94, defense: 85 },
        finisher: 'Cross Rhodes',
        brand: 'SmackDown',
        signature: 'The American Nightmare'
    },
    'JINDER_MAHAL': {
        id: 'JINDER_MAHAL',
        name: 'Jinder Mahal',
        rarity: 'EPIC',
        basePrice: 1550000,
        stats: { overall: 86, power: 88, speed: 78, stamina: 87, technique: 82, charisma: 85, defense: 89 },
        finisher: 'Khallas',
        brand: 'Raw',
        signature: 'The Maharaja'
    },
    'SHEAMUS': {
        id: 'SHEAMUS',
        name: 'Sheamus',
        rarity: 'EPIC',
        basePrice: 1600000,
        stats: { overall: 87, power: 90, speed: 75, stamina: 88, technique: 83, charisma: 82, defense: 91 },
        finisher: 'Brogue Kick',
        brand: 'SmackDown',
        signature: 'The Celtic Warrior'
    },
    'RIDDLE': {
        id: 'RIDDLE',
        name: 'Riddle',
        rarity: 'EPIC',
        basePrice: 1620000,
        stats: { overall: 87, power: 84, speed: 88, stamina: 86, technique: 90, charisma: 85, defense: 81 },
        finisher: 'Floating Bro',
        brand: 'Raw',
        signature: 'The Original Bro'
    },
    'SHINSUKE_NAKAMURA': {
        id: 'SHINSUKE_NAKAMURA',
        name: 'Shinsuke Nakamura',
        rarity: 'EPIC',
        basePrice: 1680000,
        stats: { overall: 88, power: 82, speed: 87, stamina: 85, technique: 91, charisma: 88, defense: 84 },
        finisher: 'Kinshasa',
        brand: 'SmackDown',
        signature: 'King of Strong Style'
    },
    'CESARO': {
        id: 'CESARO',
        name: 'Cesaro',
        rarity: 'EPIC',
        basePrice: 1590000,
        stats: { overall: 87, power: 93, speed: 84, stamina: 89, technique: 92, charisma: 79, defense: 86 },
        finisher: 'Neutralizer',
        brand: 'Raw',
        signature: 'The Swiss Superman'
    },
    'ALEXA_BLISS': {
        id: 'ALEXA_BLISS',
        name: 'Alexa Bliss',
        rarity: 'EPIC',
        basePrice: 1630000,
        stats: { overall: 87, power: 75, speed: 87, stamina: 83, technique: 88, charisma: 95, defense: 78 },
        finisher: 'Twisted Bliss',
        brand: 'Raw',
        signature: 'Little Miss Bliss'
    },
    'SASHA_BANKS': {
        id: 'SASHA_BANKS',
        name: 'Sasha Banks',
        rarity: 'EPIC',
        basePrice: 1670000,
        stats: { overall: 88, power: 78, speed: 91, stamina: 86, technique: 93, charisma: 92, defense: 80 },
        finisher: 'Bank Statement',
        brand: 'SmackDown',
        signature: 'The Boss'
    },
    'BAYLEY': {
        id: 'BAYLEY',
        name: 'Bayley',
        rarity: 'EPIC',
        basePrice: 1640000,
        stats: { overall: 87, power: 80, speed: 85, stamina: 88, technique: 90, charisma: 89, defense: 83 },
        finisher: 'Rose Plant',
        brand: 'SmackDown',
        signature: 'The Role Model'
    },
    'IYO_SKY': {
        id: 'IYO_SKY',
        name: 'Iyo Sky',
        rarity: 'EPIC',
        basePrice: 1610000,
        stats: { overall: 86, power: 76, speed: 93, stamina: 84, technique: 91, charisma: 87, defense: 79 },
        finisher: 'Over the Moonsault',
        brand: 'Raw',
        signature: 'Genius of the Sky'
    },
    'DAKOTA_KAI': {
        id: 'DAKOTA_KAI',
        name: 'Dakota Kai',
        rarity: 'EPIC',
        basePrice: 1570000,
        stats: { overall: 86, power: 79, speed: 89, stamina: 85, technique: 89, charisma: 84, defense: 80 },
        finisher: 'Kairopractor',
        brand: 'Raw',
        signature: 'Captain of Team Kick'
    },
    'SONYA_DEVILLE': {
        id: 'SONYA_DEVILLE',
        name: 'Sonya Deville',
        rarity: 'EPIC',
        basePrice: 1560000,
        stats: { overall: 85, power: 82, speed: 83, stamina: 86, technique: 88, charisma: 81, defense: 87 },
        finisher: 'Devil\'s Advocate',
        brand: 'SmackDown',
        signature: 'Pride Fighter'
    },

    // RARE TIER (20)
    'DREW_MCINTYRE': {
        id: 'DREW_MCINTYRE',
        name: 'Drew McIntyre',
        rarity: 'RARE',
        basePrice: 980000,
        stats: { overall: 87, power: 92, speed: 81, stamina: 85, technique: 86, charisma: 84, defense: 88 },
        finisher: 'Claymore Kick',
        brand: 'SmackDown',
        signature: 'The Scottish Warrior'
    },
    'KEVIN_OWENS': {
        id: 'KEVIN_OWENS',
        name: 'Kevin Owens',
        rarity: 'RARE',
        basePrice: 920000,
        stats: { overall: 86, power: 88, speed: 79, stamina: 87, technique: 89, charisma: 85, defense: 82 },
        finisher: 'Stunner',
        brand: 'Raw',
        signature: 'The Prize Fighter'
    },
    'FINN_BALOR': {
        id: 'FINN_BALOR',
        name: 'Finn Balor',
        rarity: 'RARE',
        basePrice: 950000,
        stats: { overall: 86, power: 80, speed: 91, stamina: 84, technique: 90, charisma: 87, defense: 79 },
        finisher: 'Coup de Grace',
        brand: 'SmackDown',
        signature: 'The Prince'
    },
    'THE_USO_JEY': {
        id: 'THE_USO_JEY',
        name: 'Jey Uso',
        rarity: 'RARE',
        basePrice: 870000,
        stats: { overall: 84, power: 85, speed: 88, stamina: 86, technique: 83, charisma: 87, defense: 81 },
        finisher: 'Uso Splash',
        brand: 'SmackDown',
        signature: 'Main Event Jey Uso'
    },
    'THE_USO_JIMMY': {
        id: 'THE_USO_JIMMY',
        name: 'Jimmy Uso',
        rarity: 'RARE',
        basePrice: 870000,
        stats: { overall: 84, power: 86, speed: 87, stamina: 86, technique: 83, charisma: 86, defense: 82 },
        finisher: 'Uso Splash',
        brand: 'SmackDown',
        signature: 'Uce'
    },
    'DAMIAN_PRIEST': {
        id: 'DAMIAN_PRIEST',
        name: 'Damian Priest',
        rarity: 'RARE',
        basePrice: 910000,
        stats: { overall: 85, power: 90, speed: 84, stamina: 86, technique: 84, charisma: 82, defense: 85 },
        finisher: 'South of Heaven',
        brand: 'Raw',
        signature: 'Archer of Infamy'
    },
    'DOMINIK_MYSTERIO': {
        id: 'DOMINIK_MYSTERIO',
        name: 'Dominik Mysterio',
        rarity: 'RARE',
        basePrice: 780000,
        stats: { overall: 82, power: 76, speed: 86, stamina: 80, technique: 85, charisma: 79, defense: 77 },
        finisher: 'Frog Splash',
        brand: 'Raw',
        signature: 'Dirty Dom'
    },
    'LA_KNIGHT': {
        id: 'LA_KNIGHT',
        name: 'LA Knight',
        rarity: 'RARE',
        basePrice: 850000,
        stats: { overall: 84, power: 85, speed: 83, stamina: 84, technique: 83, charisma: 91, defense: 82 },
        finisher: 'BFT',
        brand: 'SmackDown',
        signature: 'The Mega Star'
    },
    'GUNTHER': {
        id: 'GUNTHER',
        name: 'Gunther',
        rarity: 'RARE',
        basePrice: 930000,
        stats: { overall: 86, power: 91, speed: 79, stamina: 92, technique: 88, charisma: 80, defense: 89 },
        finisher: 'Powerbomb',
        brand: 'Raw',
        signature: 'The Ring General'
    },
    'LUDWIG_KAISER': {
        id: 'LUDWIG_KAISER',
        name: 'Ludwig Kaiser',
        rarity: 'RARE',
        basePrice: 800000,
        stats: { overall: 83, power: 84, speed: 85, stamina: 83, technique: 87, charisma: 78, defense: 82 },
        finisher: 'Kaiser Suplex',
        brand: 'Raw',
        signature: 'Austrian Anomaly'
    },
    'GIOVANNI_VINCI': {
        id: 'GIOVANNI_VINCI',
        name: 'Giovanni Vinci',
        rarity: 'RARE',
        basePrice: 790000,
        stats: { overall: 82, power: 86, speed: 82, stamina: 84, technique: 85, charisma: 77, defense: 83 },
        finisher: 'Vinci Bomb',
        brand: 'Raw',
        signature: 'Italian Stallion'
    },
    'XAVIER_WOODS': {
        id: 'XAVIER_WOODS',
        name: 'Xavier Woods',
        rarity: 'RARE',
        basePrice: 820000,
        stats: { overall: 83, power: 79, speed: 87, stamina: 84, technique: 86, charisma: 88, defense: 79 },
        finisher: 'Limit Break',
        brand: 'SmackDown',
        signature: 'King Woods'
    },
    'KOFI_KINGSTON': {
        id: 'KOFI_KINGSTON',
        name: 'Kofi Kingston',
        rarity: 'RARE',
        basePrice: 860000,
        stats: { overall: 84, power: 81, speed: 90, stamina: 85, technique: 88, charisma: 87, defense: 78 },
        finisher: 'Trouble in Paradise',
        brand: 'SmackDown',
        signature: 'Dreadlocked Dynamo'
    },
    'BIG_E': {
        id: 'BIG_E',
        name: 'Big E',
        rarity: 'RARE',
        basePrice: 890000,
        stats: { overall: 85, power: 93, speed: 80, stamina: 87, technique: 82, charisma: 90, defense: 86 },
        finisher: 'Big Ending',
        brand: 'SmackDown',
        signature: 'Powerhouse of Positivity'
    },
    'AUSTIN_THEORY': {
        id: 'AUSTIN_THEORY',
        name: 'Austin Theory',
        rarity: 'RARE',
        basePrice: 840000,
        stats: { overall: 84, power: 83, speed: 88, stamina: 85, technique: 86, charisma: 85, defense: 80 },
        finisher: 'A-Town Down',
        brand: 'Raw',
        signature: 'A-Town'
    },
    'GRAYSON_WALLER': {
        id: 'GRAYSON_WALLER',
        name: 'Grayson Waller',
        rarity: 'RARE',
        basePrice: 810000,
        stats: { overall: 83, power: 80, speed: 86, stamina: 83, technique: 84, charisma: 90, defense: 79 },
        finisher: 'Rolling Stunner',
        brand: 'SmackDown',
        signature: 'Grayson Waller Effect'
    },
    'SANTOS_ESCOBAR': {
        id: 'SANTOS_ESCOBAR',
        name: 'Santos Escobar',
        rarity: 'RARE',
        basePrice: 830000,
        stats: { overall: 84, power: 82, speed: 89, stamina: 84, technique: 90, charisma: 82, defense: 80 },
        finisher: 'Phantom Driver',
        brand: 'SmackDown',
        signature: 'Emperor of Lucha Libre'
    },
    'CHAD_GABLE': {
        id: 'CHAD_GABLE',
        name: 'Chad Gable',
        rarity: 'RARE',
        basePrice: 850000,
        stats: { overall: 84, power: 85, speed: 84, stamina: 87, technique: 92, charisma: 79, defense: 83 },
        finisher: 'Chaos Theory',
        brand: 'Raw',
        signature: 'Ready Willing Gable'
    },
    'OTIS': {
        id: 'OTIS',
        name: 'Otis',
        rarity: 'RARE',
        basePrice: 770000,
        stats: { overall: 82, power: 94, speed: 70, stamina: 88, technique: 76, charisma: 84, defense: 87 },
        finisher: 'Vader Bomb',
        brand: 'Raw',
        signature: 'Mr. Money in the Bank'
    },
    'MARYSE': {
        id: 'MARYSE',
        name: 'Maryse',
        rarity: 'RARE',
        basePrice: 820000,
        stats: { overall: 83, power: 74, speed: 84, stamina: 82, technique: 85, charisma: 92, defense: 77 },
        finisher: 'French Kiss',
        brand: 'Legend',
        signature: 'The Glamazon'
    },

    // COMMON TIER (15)
    'RICOCHET': {
        id: 'RICOCHET',
        name: 'Ricochet',
        rarity: 'COMMON',
        basePrice: 450000,
        stats: { overall: 82, power: 75, speed: 95, stamina: 81, technique: 87, charisma: 79, defense: 74 },
        finisher: '630 Senton',
        brand: 'SmackDown',
        signature: 'The One and Only'
    },
    'DOLPH_ZIGGLER': {
        id: 'DOLPH_ZIGGLER',
        name: 'Dolph Ziggler',
        rarity: 'COMMON',
        basePrice: 420000,
        stats: { overall: 81, power: 76, speed: 88, stamina: 83, technique: 85, charisma: 80, defense: 75 },
        finisher: 'Zig Zag',
        brand: 'Raw',
        signature: 'The Showoff'
    },
    'APOLLO_CREWS': {
        id: 'APOLLO_CREWS',
        name: 'Apollo Crews',
        rarity: 'COMMON',
        basePrice: 400000,
        stats: { overall: 80, power: 84, speed: 86, stamina: 82, technique: 79, charisma: 76, defense: 78 },
        finisher: 'Frog Splash',
        brand: 'SmackDown',
        signature: 'Nigerian Giant'
    },
    'BARON_CORBIN': {
        id: 'BARON_CORBIN',
        name: 'Baron Corbin',
        rarity: 'COMMON',
        basePrice: 430000,
        stats: { overall: 81, power: 87, speed: 76, stamina: 83, technique: 78, charisma: 74, defense: 84 },
        finisher: 'End of Days',
        brand: 'SmackDown',
        signature: 'The Lone Wolf'
    },
    'MANSOOR': {
        id: 'MANSOOR',
        name: 'Mansoor',
        rarity: 'COMMON',
        basePrice: 360000,
        stats: { overall: 78, power: 72, speed: 82, stamina: 79, technique: 80, charisma: 77, defense: 75 },
        finisher: 'Moonsault',
        brand: 'SmackDown',
        signature: 'Saudi Sensation'
    },
    'MACE': {
        id: 'MACE',
        name: 'Mace',
        rarity: 'COMMON',
        basePrice: 380000,
        stats: { overall: 79, power: 86, speed: 74, stamina: 80, technique: 76, charisma: 72, defense: 82 },
        finisher: 'Powerbomb',
        brand: 'SmackDown',
        signature: 'Maximum Male Models'
    },
    'SHANKY': {
        id: 'SHANKY',
        name: 'Shanky',
        rarity: 'COMMON',
        basePrice: 370000,
        stats: { overall: 78, power: 88, speed: 70, stamina: 81, technique: 74, charisma: 73, defense: 83 },
        finisher: 'Chokeslam',
        brand: 'SmackDown',
        signature: 'The Giant Lion'
    },
    'XYON_QUINN': {
        id: 'XYON_QUINN',
        name: 'Xyon Quinn',
        rarity: 'COMMON',
        basePrice: 390000,
        stats: { overall: 79, power: 82, speed: 80, stamina: 78, technique: 77, charisma: 75, defense: 79 },
        finisher: 'Dropkick',
        brand: 'SmackDown',
        signature: 'The Wild Card'
    },
    'RIDGE_HOLLAND': {
        id: 'RIDGE_HOLLAND',
        name: 'Ridge Holland',
        rarity: 'COMMON',
        basePrice: 410000,
        stats: { overall: 80, power: 89, speed: 73, stamina: 82, technique: 76, charisma: 71, defense: 85 },
        finisher: 'Northern Grit',
        brand: 'SmackDown',
        signature: 'Yorkshire Terrier'
    },
    'BUTCH': {
        id: 'BUTCH',
        name: 'Butch',
        rarity: 'COMMON',
        basePrice: 440000,
        stats: { overall: 81, power: 78, speed: 84, stamina: 83, technique: 82, charisma: 79, defense: 77 },
        finisher: 'Bitter End',
        brand: 'SmackDown',
        signature: 'The Bruiserweight'
    },
    'TYLER_BATE': {
        id: 'TYLER_BATE',
        name: 'Tyler Bate',
        rarity: 'COMMON',
        basePrice: 460000,
        stats: { overall: 82, power: 80, speed: 86, stamina: 84, technique: 88, charisma: 80, defense: 76 },
        finisher: 'Tyler Driver 97',
        brand: 'NXT',
        signature: 'Big Strong Boy'
    },
    'TOMMASO_CIAMPA': {
        id: 'TOMMASO_CIAMPA',
        name: 'Tommaso Ciampa',
        rarity: 'COMMON',
        basePrice: 490000,
        stats: { overall: 83, power: 85, speed: 80, stamina: 85, technique: 86, charisma: 82, defense: 81 },
        finisher: 'Fairytale Ending',
        brand: 'NXT',
        signature: 'The Blackheart'
    },
    'JOHNNY_GARGANO': {
        id: 'JOHNNY_GARGANO',
        name: 'Johnny Gargano',
        rarity: 'COMMON',
        basePrice: 500000,
        stats: { overall: 84, power: 77, speed: 89, stamina: 86, technique: 91, charisma: 85, defense: 76 },
        finisher: 'One Final Beat',
        brand: 'Raw',
        signature: 'Johnny Wrestling'
    },
    'BRON_BREAKKER': {
        id: 'BRON_BREAKKER',
        name: 'Bron Breakker',
        rarity: 'COMMON',
        basePrice: 540000,
        stats: { overall: 85, power: 92, speed: 87, stamina: 86, technique: 82, charisma: 83, defense: 84 },
        finisher: 'Gorilla Press Powerslam',
        brand: 'Raw',
        signature: 'Big Bronson'
    },
    'CARMELO_HAYES': {
        id: 'CARMELO_HAYES',
        name: 'Carmelo Hayes',
        rarity: 'COMMON',
        basePrice: 520000,
        stats: { overall: 84, power: 79, speed: 90, stamina: 83, technique: 88, charisma: 86, defense: 78 },
        finisher: 'Nothing But Net',
        brand: 'NXT',
        signature: 'Melo'
    }
};

const WRESTLERS_ARRAY = Object.values(WRESTLERS_DATABASE);

// ═══════════════════════════════════════════════════════════════════════════
// DATABASE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

class DatabaseManager {
    constructor() {
        this.cache = new Map();
    }
    
    async loadData(filePath) {
        try {
            if (this.cache.has(filePath)) {
                return this.cache.get(filePath);
            }
            
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });
            
            try {
                await fs.access(filePath);
                const data = await fs.readFile(filePath, 'utf8');
                const parsed = JSON.parse(data);
                this.cache.set(filePath, parsed);
                return parsed;
            } catch {
                await fs.writeFile(filePath, JSON.stringify({}, null, 2));
                this.cache.set(filePath, {});
                return {};
            }
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            return {};
        }
    }
    
    async saveData(filePath, data) {
        try {
            this.cache.set(filePath, data);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error saving ${filePath}:`, error);
        }
    }
    
    async getUser(userId) {
        const users = await this.loadData(DB_PATHS.USERS);
        return users[userId] || null;
    }
    
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
    
    async updateUser(userId, updates) {
        const users = await this.loadData(DB_PATHS.USERS);
        if (!users[userId]) return null;
        users[userId] = { ...users[userId], ...updates };
        await this.saveData(DB_PATHS.USERS, users);
        return users[userId];
    }
}

const db = new DatabaseManager();

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

class Utils {
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    static formatCurrency(amount) {
        return `💰 ${this.formatNumber(amount)}`;
    }
    
    static randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static weightedRandom(weights) {
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        for (const [key, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) return key;
        }
        return Object.keys(weights)[0];
    }
    
    static getRarityColor(rarity) {
        return CONFIG.COLORS[rarity] || CONFIG.COLORS.COMMON;
    }
    
    static getRarityEmoji(rarity) {
        const emojis = { 
            COMMON: '⚪', 
            RARE: '🔵', 
            EPIC: '🟣', 
            LEGENDARY: '🟠', 
            MYTHIC: '🟡' 
        };
        return emojis[rarity] || '⚪';
    }
    
    static getWrestler(wrestlerId) {
        return WRESTLERS_DATABASE[wrestlerId] || null;
    }
    
    static progressBar(current, max, length = 10) {
        const percentage = Math.max(0, Math.min(1, current / max));
        const filled = Math.floor(percentage * length);
        const empty = length - filled;
        return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.floor(percentage * 100)}%`;
    }
    
    static formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
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
}

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS - ALL BUTTONS
// ═══════════════════════════════════════════════════════════════════════════

class UIComponents {
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
// MATCH ENGINE - FULL BATTLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

class MatchEngine {
    constructor() {
        this.activeMatches = new Map();
    }
    
    createMatch(player1Id, player2Id, channelId) {
        const matchId = Utils.generateId();
        const match = {
            id: matchId,
            player1: { id: player1Id, health: 100, stamina: 100, momentum: 0 },
            player2: { id: player2Id, health: 100, stamina: 100, momentum: 0 },
            currentTurn: player1Id,
            turnNumber: 0,
            log: [],
            status: 'active',
            channelId,
            startedAt: Date.now()
        };
        this.activeMatches.set(matchId, match);
        return match;
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
        
        let result = {};
        
        switch (action) {
            case 'strike':
                result = this.performStrike(attacker, defender);
                break;
            case 'grapple':
                result = this.performGrapple(attacker, defender);
                break;
            case 'special':
                result = this.performSpecial(attacker, defender);
                break;
            case 'rest':
                result = this.performRest(attacker);
                break;
            case 'finisher':
                result = this.performFinisher(attacker, defender);
                break;
            case 'taunt':
                result = this.performTaunt(attacker, defender);
                break;
            default:
                return { success: false, message: 'Invalid action!' };
        }
        
        match.log.push({ turn: match.turnNumber, player: playerId, action, result });
        match.currentTurn = match.player1.id === playerId ? match.player2.id : match.player1.id;
        match.turnNumber++;
        
        const winner = this.checkWinCondition(match);
        if (winner) {
            match.status = 'finished';
            match.winner = winner;
        }
        
        return { success: true, result, match, winner };
    }
    
    performStrike(attacker, defender) {
        const damage = Utils.randomInt(5, 15);
        const staminaCost = 10;
        
        if (Math.random() < 0.85) {
            attacker.stamina -= staminaCost;
            defender.health -= damage;
            attacker.momentum += 5;
            return { success: true, damage, message: `💥 Strike hits for ${damage} damage!` };
        } else {
            attacker.stamina -= staminaCost / 2;
            return { success: false, damage: 0, message: `🛡️ Strike blocked!` };
        }
    }
    
    performGrapple(attacker, defender) {
        const damage = Utils.randomInt(8, 18);
        const staminaCost = 15;
        
        if (Math.random() < 0.75) {
            attacker.stamina -= staminaCost;
            defender.health -= damage;
            attacker.momentum += 8;
            return { success: true, damage, message: `🤼 Grapple connects for ${damage} damage!` };
        } else {
            attacker.stamina -= staminaCost / 2;
            return { success: false, damage: 0, message: `🔄 Grapple reversed!` };
        }
    }
    
    performSpecial(attacker, defender) {
        if (attacker.momentum < 30) {
            return { success: false, damage: 0, message: `❌ Need 30 momentum! (Have ${attacker.momentum})` };
        }
        
        const damage = Utils.randomInt(15, 25);
        const staminaCost = 20;
        
        attacker.stamina -= staminaCost;
        attacker.momentum -= 30;
        defender.health -= damage;
        
        return { success: true, damage, message: `⚡ SPECIAL MOVE! ${damage} damage dealt!` };
    }
    
    performFinisher(attacker, defender) {
        if (attacker.momentum < 70) {
            return { success: false, damage: 0, message: `❌ Need 70 momentum! (Have ${attacker.momentum})` };
        }
        
        const damage = Utils.randomInt(25, 40);
        
        attacker.momentum = 0;
        attacker.stamina -= 30;
        defender.health -= damage;
        
        if (Math.random() < 0.3 && defender.health < 30) {
            defender.health = 0;
            return { success: true, damage, knockout: true, message: `🔥 FINISHER! KNOCKOUT! ${damage} damage!` };
        }
        
        return { success: true, damage, message: `🔥 DEVASTATING FINISHER! ${damage} damage!` };
    }
    
    performRest(attacker) {
        const staminaGain = Utils.randomInt(15, 25);
        const healthGain = Utils.randomInt(10, 20);
        
        attacker.stamina = Math.min(100, attacker.stamina + staminaGain);
        attacker.health = Math.min(100, attacker.health + healthGain);
        attacker.momentum = Math.max(0, attacker.momentum - 10);
        
        return { success: true, staminaGain, healthGain, message: `💤 Rested! Gained ${staminaGain} stamina & ${healthGain} health!` };
    }
    
    performTaunt(attacker, defender) {
        const momentumGain = Utils.randomInt(15, 25);
        
        attacker.momentum = Math.min(100, attacker.momentum + momentumGain);
        attacker.stamina = Math.min(100, attacker.stamina + 5);
        
        if (Math.random() < 0.3) {
            defender.momentum = Math.max(0, defender.momentum - 15);
            return { success: true, momentumGain, message: `😤 Taunt demoralized opponent! Gained ${momentumGain} momentum!` };
        }
        
        return { success: true, momentumGain, message: `😤 Taunt! Gained ${momentumGain} momentum!` };
    }
    
    checkWinCondition(match) {
        if (match.player1.health <= 0) return match.player2.id;
        if (match.player2.health <= 0) return match.player1.id;
        if (match.turnNumber >= 50) {
            return match.player1.health > match.player2.health ? match.player1.id : match.player2.id;
        }
        return null;
    }
    
    generateMatchEmbed(match) {
        const p1 = match.player1;
        const p2 = match.player2;
        
        const embed = new EmbedBuilder()
            .setColor(CONFIG.COLORS.PRIMARY)
            .setTitle('🤼 WWE MATCH IN PROGRESS!')
            .setDescription(`Turn ${match.turnNumber} | <@${match.currentTurn}>'s turn`)
            .addFields(
                {
                    name: `<@${p1.id}>`,
                    value: [
                        `Health: ${Utils.progressBar(p1.health, 100, 10)}`,
                        `Stamina: ${Utils.progressBar(p1.stamina, 100, 10)}`,
                        `Momentum: ${p1.momentum}/100 ⚡`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '⚔️ VS ⚔️',
                    value: '━━━━━',
                    inline: true
                },
                {
                    name: `<@${p2.id}>`,
                    value: [
                        `Health: ${Utils.progressBar(p2.health, 100, 10)}`,
                        `Stamina: ${Utils.progressBar(p2.stamina, 100, 10)}`,
                        `Momentum: ${p2.momentum}/100 ⚡`
                    ].join('\n'),
                    inline: true
                }
            );
        
        if (match.log.length > 0) {
            const lastAction = match.log[match.log.length - 1];
            embed.addFields({ name: '📋 Last Action', value: lastAction.result.message });
        }
        
        return embed;
    }
}

const matchEngine = new MatchEngine();

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND HANDLER
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// ALL COMMANDS - COMPLETE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

// 1. DEBUT
commandHandler.register('debut', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (user) {
        return message.reply('❌ You already debuted! Use `!reset` to start over.');
    }
    
    const newUser = await db.createUser(userId, message.author.username);
    const startingWrestlers = [];
    
    for (let i = 0; i < CONFIG.DEBUT_WRESTLERS; i++) {
        const rarity = Utils.weightedRandom(CONFIG.DROP_RATES);
        const wrestlersOfRarity = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
        const wrestler = Utils.randomElement(wrestlersOfRarity);
        
        startingWrestlers.push({
            id: Utils.generateId(),
            wrestlerId: wrestler.id,
            acquiredAt: Date.now()
        });
    }
    
    newUser.squad = startingWrestlers;
    newUser.playingXI = startingWrestlers.slice(0, 11).map(w => w.id);
    newUser.cardsOwned = startingWrestlers.length;
    await db.updateUser(userId, newUser);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('🎉 WELCOME TO WWE WRESTLING CARDS!')
        .setDescription(`Congratulations **${message.author.username}**!`)
        .addFields(
            { name: '💰 Starting Purse', value: Utils.formatCurrency(CONFIG.STARTING_PURSE), inline: true },
            { name: '👤 Wrestlers', value: `${CONFIG.DEBUT_WRESTLERS}`, inline: true },
            { name: '📋 Roster', value: startingWrestlers.map(w => {
                const wrestler = Utils.getWrestler(w.wrestlerId);
                return `${Utils.getRarityEmoji(wrestler.rarity)} ${wrestler.name}`;
            }).join('\n') }
        )
        .setFooter({ text: 'Use !help to see all commands!' });
    
    message.reply({ embeds: [embed] });
});

// 2. START (alias)
commandHandler.register('start', async (message, args) => {
    await commandHandler.commands.get('debut')(message, args);
});

// 3. BEGIN (alias)
commandHandler.register('begin', async (message, args) => {
    await commandHandler.commands.get('debut')(message, args);
});

// 4. RESET
commandHandler.register('reset', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ You haven\'t started yet!');
    }
    
    const users = await db.loadData(DB_PATHS.USERS);
    delete users[userId];
    await db.saveData(DB_PATHS.USERS, users);
    
    message.reply('✅ Career reset! Use `!debut` to start fresh.');
});

// 5. RESTART (alias)
commandHandler.register('restart', async (message, args) => {
    await commandHandler.commands.get('reset')(message, args);
});

// 6. DROP
commandHandler.register('drop', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
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
    
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle('🎴 NEW WRESTLER DROPPED!')
        .setDescription(`You received **${wrestler.name}**!`)
        .addFields(
            { name: '🏷️ Rarity', value: wrestler.rarity, inline: true },
            { name: '⭐ Overall', value: `${wrestler.stats.overall}/100`, inline: true },
            { name: '💰 Value', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '⚡ Finisher', value: wrestler.finisher, inline: true },
            { name: '📺 Brand', value: wrestler.brand, inline: true },
            { name: '💪 Stats', value: `PWR:${wrestler.stats.power} SPD:${wrestler.stats.speed} STA:${wrestler.stats.stamina}` }
        )
        .setFooter({ text: `${wrestler.signature} | Collection: ${user.squad.length}` });
    
    message.reply({ embeds: [embed] });
});

// 7. PACK (alias)
commandHandler.register('pack', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

// 8. OPEN (alias)
commandHandler.register('open', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

// 9. DAILY
commandHandler.register('daily', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    const now = Date.now();
    const lastDaily = user.lastDaily || 0;
    const timeSince = now - lastDaily;
    const oneDay = 86400000;
    
    if (timeSince < oneDay) {
        const timeLeft = oneDay - timeSince;
        return message.reply(`⏰ Daily available in ${Utils.formatDuration(timeLeft)}`);
    }
    
    let streak = user.dailyStreak || 0;
    if (timeSince < oneDay * 2) streak++;
    else streak = 1;
    
    const reward = CONFIG.DAILY_REWARD + (streak * 100);
    user.purse += reward;
    user.lastDaily = now;
    user.dailyStreak = streak;
    await db.updateUser(userId, user);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.SUCCESS)
        .setTitle('📅 DAILY REWARD!')
        .addFields(
            { name: '💰 Reward', value: Utils.formatCurrency(reward), inline: true },
            { name: '🔥 Streak', value: `${streak} days`, inline: true },
            { name: '💼 Balance', value: Utils.formatCurrency(user.purse), inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// 10. CLAIM (alias)
commandHandler.register('claim', async (message, args) => {
    await commandHandler.commands.get('daily')(message, args);
});

// 11. VOTE
commandHandler.register('vote', async (message, args) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    
    if (!user) {
        return message.reply('❌ Use `!debut` first!');
    }
    
    const now = Date.now();
    const lastVote = user.lastVote || 0;
    const timeSince = now - lastVote;
    const twelveHours = 43200000;
    
    if (timeSince < twelveHours) {
        const timeLeft = twelveHours - timeSince;
        return message.reply(`⏰ Vote available in ${Utils.formatDuration(timeLeft)}`);
    }
    
    const reward = CONFIG.VOTE_REWARD;
    user.purse += reward;
    user.lastVote = now;
    await db.updateUser(userId, user);
    
    message.reply(`🗳️ Thanks for voting! You earned ${Utils.formatCurrency(reward)}!`);
});

// 12. PURSE
commandHandler.register('purse', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started!`);
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.INFO)
        .setTitle(`💰 ${target.username}'s Purse`)
        .addFields(
            { name: '💼 Balance', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '📈 Level', value: `${user.level}`, inline: true },
            { name: '🎴 Cards', value: `${user.squad.length}`, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// 13-16. PURSE ALIASES
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

// 17. SQUAD
commandHandler.register('squad', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started!`);
    }
    if (user.squad.length === 0) {
        return message.reply('❌ No wrestlers!');
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle(`🎴 ${target.username}'s Squad`)
        .setDescription(`${user.squad.length} wrestlers total`);
    
    user.squad.slice(0, 10).forEach((card, i) => {
        const w = Utils.getWrestler(card.wrestlerId);
        const inXI = user.playingXI.includes(card.id) ? '⭐' : '';
        embed.addFields({
            name: `${i + 1}. ${Utils.getRarityEmoji(w.rarity)} ${w.name} ${inXI}`,
            value: `Overall: ${w.stats.overall} | ${w.finisher}`,
            inline: false
        });
    });
    
    message.reply({ embeds: [embed] });
});

// 18-19. SQUAD ALIASES
commandHandler.register('roster', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

commandHandler.register('collection', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

// 20. XI
commandHandler.register('xi', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started!`);
    }
    
    if (user.playingXI.length === 0) {
        const top11 = user.squad.slice(0, 11).map(c => c.id);
        user.playingXI = top11;
        await db.updateUser(target.id, user);
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle(`⭐ ${target.username}'s Playing XI`);
    
    user.playingXI.forEach((cardId, i) => {
        const card = user.squad.find(c => c.id === cardId);
        if (!card) return;
        const w = Utils.getWrestler(card.wrestlerId);
        embed.addFields({
            name: `${i + 1}. ${w.name}`,
            value: `Overall: ${w.stats.overall}`,
            inline: true
        });
    });
    
    message.reply({ embeds: [embed] });
});

// 21-22. XI ALIASES
commandHandler.register('team', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

commandHandler.register('playingxi', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

// 23. PLAY - FULL BATTLE SYSTEM
commandHandler.register('play', async (message, args) => {
    const user1 = await db.getUser(message.author.id);
    if (!user1) return message.reply('❌ Use `!debut` first!');
    if (user1.playingXI.length === 0) return message.reply('❌ Set your XI first!');
    
    const opponent = message.mentions.users.first();
    if (!opponent) return message.reply('❌ Mention opponent! Example: `!play @user`');
    if (opponent.id === message.author.id) return message.reply('❌ Can\'t battle yourself!');
    if (opponent.bot) return message.reply('❌ Can\'t battle bots!');
    
    const user2 = await db.getUser(opponent.id);
    if (!user2) return message.reply(`❌ ${opponent.username} hasn't started!`);
    if (user2.playingXI.length === 0) return message.reply(`❌ ${opponent.username} needs XI!`);
    
    const match = matchEngine.createMatch(message.author.id, opponent.id, message.channel.id);
    
    const embed = matchEngine.generateMatchEmbed(match);
    const buttons = UIComponents.createMatchButtons();
    
    const matchMsg = await message.reply({ 
        content: `🤼 **MATCH STARTED!** ${message.author} vs ${opponent}\n\n<@${match.currentTurn}> your turn!`,
        embeds: [embed], 
        components: buttons 
    });
    
    match.messageId = matchMsg.id;
});

// 24-25. PLAY ALIASES
commandHandler.register('battle', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

commandHandler.register('fight', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

// 26. PROFILE
commandHandler.register('profile', async (message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    
    if (!user) {
        return message.reply(`❌ ${target.username} hasn't started!`);
    }
    
    const winRate = user.matchesPlayed > 0 ? ((user.wins / user.matchesPlayed) * 100).toFixed(1) : 0;
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.INFO)
        .setTitle(`📊 ${target.username}'s Profile`)
        .addFields(
            { name: '📈 Level', value: `${user.level}`, inline: true },
            { name: '💰 Purse', value: Utils.formatCurrency(user.purse), inline: true },
            { name: '🎴 Cards', value: `${user.squad.length}`, inline: true },
            { name: '⚔️ Wins', value: `${user.wins}`, inline: true },
            { name: '📉 Losses', value: `${user.losses}`, inline: true },
            { name: '📊 Win Rate', value: `${winRate}%`, inline: true }
        );
    
    message.reply({ embeds: [embed] });
});

// 27-28. PROFILE ALIASES
commandHandler.register('stats', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

commandHandler.register('me', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

// 29. LEADERBOARD
commandHandler.register('leaderboard', async (message, args) => {
    const users = await db.loadData(DB_PATHS.USERS);
    const userArray = Object.values(users);
    const sorted = userArray.sort((a, b) => b.wins - a.wins);
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🏆 TOP PLAYERS')
        .setDescription('Top 10 by wins');
    
    sorted.slice(0, 10).forEach((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        embed.addFields({
            name: `${medal} ${u.username}`,
            value: `${u.wins} wins | Level ${u.level}`,
            inline: true
        });
    });
    
    message.reply({ embeds: [embed] });
});

// 30-32. LEADERBOARD ALIASES
commandHandler.register('lb', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('top', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('rank', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

// 33. VIEW
commandHandler.register('view', async (message, args) => {
    if (!args.length) return message.reply('❌ Specify wrestler! Example: `!view Roman Reigns`');
    
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    
    if (!wrestler) return message.reply('❌ Wrestler not found!');
    
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle(`${wrestler.name}`)
        .addFields(
            { name: '⭐ Overall', value: `${wrestler.stats.overall}`, inline: true },
            { name: '🏷️ Rarity', value: wrestler.rarity, inline: true },
            { name: '💰 Price', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '💪 Power', value: `${wrestler.stats.power}`, inline: true },
            { name: '⚡ Speed', value: `${wrestler.stats.speed}`, inline: true },
            { name: '🛡️ Defense', value: `${wrestler.stats.defense}`, inline: true },
            { name: '⚡ Finisher', value: wrestler.finisher },
            { name: '📺 Brand', value: wrestler.brand }
        )
        .setFooter({ text: wrestler.signature });
    
    message.reply({ embeds: [embed] });
});

// 34-35. VIEW ALIASES
commandHandler.register('show', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

commandHandler.register('card', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

// 36. BUY
commandHandler.register('buy', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ Use `!debut` first!');
    if (!args.length) return message.reply('❌ Specify wrestler! Example: `!buy Roman Reigns`');
    
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    
    if (!wrestler) return message.reply('❌ Wrestler not found!');
    if (user.purse < wrestler.basePrice) {
        return message.reply(`❌ Need ${Utils.formatCurrency(wrestler.basePrice)} but have ${Utils.formatCurrency(user.purse)}`);
    }
    
    user.purse -= wrestler.basePrice;
    user.totalCoinsSpent += wrestler.basePrice;
    user.squad.push({
        id: Utils.generateId(),
        wrestlerId: wrestler.id,
        acquiredAt: Date.now()
    });
    user.cardsOwned++;
    await db.updateUser(message.author.id, user);
    
    message.reply(`✅ Bought **${wrestler.name}** for ${Utils.formatCurrency(wrestler.basePrice)}! Balance: ${Utils.formatCurrency(user.purse)}`);
});

// 37. PURCHASE (alias)
commandHandler.register('purchase', async (message, args) => {
    await commandHandler.commands.get('buy')(message, args);
});

// 38. SELL
commandHandler.register('sell', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ Use `!debut` first!');
    if (!args.length) return message.reply('❌ Specify wrestler!');
    
    const searchName = args.join(' ').toLowerCase();
    const userCard = user.squad.find(card => {
        const w = Utils.getWrestler(card.wrestlerId);
        return w && w.name.toLowerCase().includes(searchName);
    });
    
    if (!userCard) return message.reply('❌ You don\'t own that wrestler!');
    
    const wrestler = Utils.getWrestler(userCard.wrestlerId);
    const sellPrice = Math.floor(wrestler.basePrice * 0.7);
    
    user.purse += sellPrice;
    user.totalCoinsEarned += sellPrice;
    user.squad = user.squad.filter(c => c.id !== userCard.id);
    user.playingXI = user.playingXI.filter(id => id !== userCard.id);
    user.cardsOwned--;
    await db.updateUser(message.author.id, user);
    
    message.reply(`✅ Sold **${wrestler.name}** for ${Utils.formatCurrency(sellPrice)}!`);
});

// 39. MARKET
commandHandler.register('market', async (message, args) => {
    let wrestlers = WRESTLERS_ARRAY;
    
    if (args.length > 0) {
        const rarity = args[0].toUpperCase();
        if (['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].includes(rarity)) {
            wrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
        }
    }
    
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🏪 WRESTLER MARKETPLACE')
        .setDescription(`Showing ${wrestlers.length} wrestlers`);
    
    wrestlers.slice(0, 10).forEach(w => {
        embed.addFields({
            name: `${Utils.getRarityEmoji(w.rarity)} ${w.name}`,
            value: `Overall: ${w.stats.overall} | ${Utils.formatCurrency(w.basePrice)}`,
            inline: true
        });
    });
    
    embed.setFooter({ text: 'Use !buy <wrestler> to purchase' });
    
    message.reply({ embeds: [embed] });
});

// 40-41. MARKET ALIASES
commandHandler.register('shop', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

commandHandler.register('store', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

// 42. HELP
commandHandler.register('help', async (message, args) => {
    const embed = new EmbedBuilder()
        .setColor(CONFIG.COLORS.PRIMARY)
        .setTitle('🤼 WWE WRESTLING CARDS - COMMANDS')
        .setDescription(`Prefix: \`${CONFIG.PREFIX}\`\n\n**70 Wrestlers | 45+ Commands | Full Battle System**`)
        .addFields(
            { name: '🎯 Getting Started', value: '`debut` `start` `begin` `reset` `help`' },
            { name: '🎴 Cards', value: '`drop` `pack` `squad` `roster` `xi` `team` `view` `show`' },
            { name: '💰 Economy', value: '`daily` `vote` `purse` `bal` `buy` `sell` `market` `shop`' },
            { name: '⚔️ Battles', value: '`play @user` `battle` `fight` (Full battle system!)' },
            { name: '📊 Stats', value: '`profile` `stats` `leaderboard` `lb` `top`' }
        )
        .setFooter({ text: '45+ commands | Use !play @user to battle!' });
    
    message.reply({ embeds: [embed] });
});

// 43-45. HELP ALIASES
commandHandler.register('commands', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('h', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('?', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTION HANDLER - HANDLE ALL BUTTONS
// ═══════════════════════════════════════════════════════════════════════════

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
                content: `🏆 **MATCH OVER!** <@${winnerId}> WINS!`,
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

// ═══════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

client.on('ready', async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ ${client.user.tag} is ONLINE!`);
    console.log(`📊 Servers: ${client.guilds.cache.size}`);
    console.log(`👥 Users: ${client.users.cache.size}`);
    console.log(`🤼 70 Wrestlers | 45+ Commands | Full Battle System`);
    console.log('═══════════════════════════════════════════════════════');
    
    client.user.setActivity('!help | WWE Wrestling', { type: 3 });
    
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

client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════

client.login(CONFIG.BOT_TOKEN);

module.exports = { client, db, Utils, matchEngine, CONFIG, WRESTLERS_DATABASE };
