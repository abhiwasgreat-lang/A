const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const CONFIG = {
    PREFIX: '!',
    BOT_TOKEN: process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
    STARTING_PURSE: 5000000,
    DAILY_REWARD: 3000,
    VOTE_REWARD: 5000,
    DROP_RATES: { COMMON: 50, RARE: 30, EPIC: 15, LEGENDARY: 4, MYTHIC: 1 },
    XP_PER_WIN: 100,
    XP_PER_LOSS: 25,
    BASE_LEVEL_XP: 1000,
    XP_MULTIPLIER: 1.5,
    COLORS: { COMMON: '#808080', RARE: '#0070DD', EPIC: '#A335EE', LEGENDARY: '#FF8000', MYTHIC: '#FFD700' },
    CARD_COLORS: {
        COMMON: { primary: '#708090', secondary: '#4A5568', text: '#FFFFFF' },
        RARE: { primary: '#0070DD', secondary: '#004d99', text: '#FFFFFF' },
        EPIC: { primary: '#A335EE', secondary: '#7a1fb8', text: '#FFFFFF' },
        LEGENDARY: { primary: '#FF8000', secondary: '#cc6600', text: '#FFFFFF' },
        MYTHIC: { primary: '#FFD700', secondary: '#FFA500', text: '#000000' }
    },
    MOVE_ANIMATIONS: {
        strike: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        punch: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        kick: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        grapple: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        suplex: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        ddt: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        powerbomb: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        slam: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        submission: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        clothesline: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        dropkick: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        elbow: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        knee: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        special: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        finisher: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        blocked: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif',
        reversed: 'https://media.tenor.com/Vb0S_pQO8H4AAAAC/mika-street-fighter.gif'
    }
};

const DB_PATHS = { USERS: './database/users.json', MATCHES: './database/matches.json' };

const WRESTLERS_DATABASE = {
    UNDERTAKER: { id: 'UNDERTAKER', name: 'The Undertaker', rarity: 'MYTHIC', basePrice: 3500000, stats: { overall: 98, power: 95, speed: 80, stamina: 90, technique: 96, charisma: 98, defense: 94 }, finisher: 'Tombstone', brand: 'Legend', signature: 'Deadman', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4e5e6f22-6d18-4c4c-a5d1-e6a6e8e5f5e5/undertaker.png' },
    STONE_COLD: { id: 'STONE_COLD', name: 'Stone Cold', rarity: 'MYTHIC', basePrice: 3450000, stats: { overall: 97, power: 94, speed: 84, stamina: 93, technique: 90, charisma: 99, defense: 91 }, finisher: 'Stunner', brand: 'Legend', signature: 'Rattlesnake', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/stonecold.png' },
    THE_ROCK: { id: 'THE_ROCK', name: 'The Rock', rarity: 'MYTHIC', basePrice: 3400000, stats: { overall: 97, power: 93, speed: 86, stamina: 92, technique: 91, charisma: 100, defense: 89 }, finisher: 'Rock Bottom', brand: 'Legend', signature: 'Great One', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/therock.png' },
    SHAWN_MICHAELS: { id: 'SHAWN_MICHAELS', name: 'Shawn Michaels', rarity: 'MYTHIC', basePrice: 3350000, stats: { overall: 96, power: 87, speed: 95, stamina: 88, technique: 98, charisma: 96, defense: 85 }, finisher: 'Sweet Chin Music', brand: 'Legend', signature: 'HBK', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/hbk.png' },
    TRIPLE_H: { id: 'TRIPLE_H', name: 'Triple H', rarity: 'MYTHIC', basePrice: 3300000, stats: { overall: 96, power: 92, speed: 83, stamina: 93, technique: 94, charisma: 95, defense: 92 }, finisher: 'Pedigree', brand: 'Legend', signature: 'The Game', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/tripleh.png' },
    HULK_HOGAN: { id: 'HULK_HOGAN', name: 'Hulk Hogan', rarity: 'MYTHIC', basePrice: 3200000, stats: { overall: 95, power: 91, speed: 79, stamina: 92, technique: 84, charisma: 98, defense: 89 }, finisher: 'Leg Drop', brand: 'Legend', signature: 'Hulkster', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/hogan.png' },
    BRET_HART: { id: 'BRET_HART', name: 'Bret Hart', rarity: 'MYTHIC', basePrice: 3100000, stats: { overall: 94, power: 86, speed: 84, stamina: 90, technique: 97, charisma: 90, defense: 87 }, finisher: 'Sharpshooter', brand: 'Legend', signature: 'Excellence', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/bret.png' },
    ROMAN_REIGNS: { id: 'ROMAN_REIGNS', name: 'Roman Reigns', rarity: 'LEGENDARY', basePrice: 3050000, stats: { overall: 96, power: 98, speed: 85, stamina: 92, technique: 90, charisma: 95, defense: 88 }, finisher: 'Spear', brand: 'SmackDown', signature: 'Tribal Chief', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/roman.png' },
    BROCK_LESNAR: { id: 'BROCK_LESNAR', name: 'Brock Lesnar', rarity: 'LEGENDARY', basePrice: 2980000, stats: { overall: 95, power: 99, speed: 82, stamina: 94, technique: 88, charisma: 85, defense: 95 }, finisher: 'F5', brand: 'Raw', signature: 'Beast', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/brock.png' },
    JOHN_CENA: { id: 'JOHN_CENA', name: 'John Cena', rarity: 'LEGENDARY', basePrice: 2900000, stats: { overall: 94, power: 92, speed: 88, stamina: 96, technique: 89, charisma: 99, defense: 87 }, finisher: 'AA', brand: 'Free Agent', signature: 'Never Give Up', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/cena.png' },
    EDGE: { id: 'EDGE', name: 'Edge', rarity: 'LEGENDARY', basePrice: 2750000, stats: { overall: 93, power: 87, speed: 84, stamina: 88, technique: 92, charisma: 94, defense: 86 }, finisher: 'Spear', brand: 'SmackDown', signature: 'Rated R', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/edge.png' },
    BECKY_LYNCH: { id: 'BECKY_LYNCH', name: 'Becky Lynch', rarity: 'LEGENDARY', basePrice: 2850000, stats: { overall: 94, power: 86, speed: 89, stamina: 90, technique: 92, charisma: 96, defense: 85 }, finisher: 'Manhandle Slam', brand: 'Raw', signature: 'The Man', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/becky.png' },
    CHARLOTTE_FLAIR: { id: 'CHARLOTTE_FLAIR', name: 'Charlotte Flair', rarity: 'LEGENDARY', basePrice: 2820000, stats: { overall: 93, power: 84, speed: 88, stamina: 89, technique: 94, charisma: 93, defense: 87 }, finisher: 'Natural Selection', brand: 'SmackDown', signature: 'Queen', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/charlotte.png' },
    CM_PUNK: { id: 'CM_PUNK', name: 'CM Punk', rarity: 'LEGENDARY', basePrice: 2780000, stats: { overall: 92, power: 85, speed: 89, stamina: 90, technique: 94, charisma: 97, defense: 84 }, finisher: 'GTS', brand: 'Raw', signature: 'Best in World', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/punk.png' },
    BATISTA: { id: 'BATISTA', name: 'Batista', rarity: 'LEGENDARY', basePrice: 2700000, stats: { overall: 91, power: 96, speed: 78, stamina: 91, technique: 84, charisma: 88, defense: 93 }, finisher: 'Batista Bomb', brand: 'Legend', signature: 'Animal', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/batista.png' },
    REY_MYSTERIO: { id: 'REY_MYSTERIO', name: 'Rey Mysterio', rarity: 'LEGENDARY', basePrice: 2680000, stats: { overall: 91, power: 72, speed: 96, stamina: 82, technique: 94, charisma: 91, defense: 76 }, finisher: '619', brand: 'SmackDown', signature: 'Underdog', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/rey.png' },
    KANE: { id: 'KANE', name: 'Kane', rarity: 'LEGENDARY', basePrice: 2650000, stats: { overall: 90, power: 94, speed: 75, stamina: 89, technique: 85, charisma: 87, defense: 92 }, finisher: 'Chokeslam', brand: 'Legend', signature: 'Big Red Machine', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/kane.png' },
    RIC_FLAIR: { id: 'RIC_FLAIR', name: 'Ric Flair', rarity: 'LEGENDARY', basePrice: 2800000, stats: { overall: 93, power: 83, speed: 81, stamina: 88, technique: 95, charisma: 99, defense: 85 }, finisher: 'Figure Four', brand: 'Legend', signature: 'Nature Boy', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/flair.png' },
    RANDY_SAVAGE: { id: 'RANDY_SAVAGE', name: 'Randy Savage', rarity: 'LEGENDARY', basePrice: 2750000, stats: { overall: 92, power: 89, speed: 88, stamina: 90, technique: 92, charisma: 96, defense: 86 }, finisher: 'Elbow Drop', brand: 'Legend', signature: 'Macho Man', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/savage.png' },
    ULTIMATE_WARRIOR: { id: 'ULTIMATE_WARRIOR', name: 'Ultimate Warrior', rarity: 'LEGENDARY', basePrice: 2680000, stats: { overall: 90, power: 94, speed: 91, stamina: 95, technique: 80, charisma: 93, defense: 87 }, finisher: 'Splash', brand: 'Legend', signature: 'Warrior', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/warrior.png' },
    SETH_ROLLINS: { id: 'SETH_ROLLINS', name: 'Seth Rollins', rarity: 'EPIC', basePrice: 1850000, stats: { overall: 91, power: 85, speed: 92, stamina: 88, technique: 94, charisma: 89, defense: 84 }, finisher: 'Curb Stomp', brand: 'Raw', signature: 'Visionary', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/seth.png' },
    AJ_STYLES: { id: 'AJ_STYLES', name: 'AJ Styles', rarity: 'EPIC', basePrice: 1780000, stats: { overall: 90, power: 82, speed: 94, stamina: 86, technique: 96, charisma: 88, defense: 83 }, finisher: 'Phenomenal Forearm', brand: 'SmackDown', signature: 'Phenomenal', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/aj.png' },
    RANDY_ORTON: { id: 'RANDY_ORTON', name: 'Randy Orton', rarity: 'EPIC', basePrice: 1820000, stats: { overall: 90, power: 88, speed: 86, stamina: 89, technique: 93, charisma: 87, defense: 85 }, finisher: 'RKO', brand: 'SmackDown', signature: 'Viper', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/orton.png' },
    BOBBY_LASHLEY: { id: 'BOBBY_LASHLEY', name: 'Bobby Lashley', rarity: 'EPIC', basePrice: 1750000, stats: { overall: 89, power: 96, speed: 80, stamina: 91, technique: 84, charisma: 82, defense: 90 }, finisher: 'Hurt Lock', brand: 'Raw', signature: 'All Mighty', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/lashley.png' },
    RHEA_RIPLEY: { id: 'RHEA_RIPLEY', name: 'Rhea Ripley', rarity: 'EPIC', basePrice: 1720000, stats: { overall: 89, power: 91, speed: 84, stamina: 87, technique: 88, charisma: 89, defense: 90 }, finisher: 'Riptide', brand: 'Raw', signature: 'Nightmare', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/rhea.png' },
    BIANCA_BELAIR: { id: 'BIANCA_BELAIR', name: 'Bianca Belair', rarity: 'EPIC', basePrice: 1690000, stats: { overall: 88, power: 89, speed: 92, stamina: 90, technique: 86, charisma: 90, defense: 83 }, finisher: 'KOD', brand: 'Raw', signature: 'EST', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/bianca.png' },
    ASUKA: { id: 'ASUKA', name: 'Asuka', rarity: 'EPIC', basePrice: 1650000, stats: { overall: 87, power: 83, speed: 90, stamina: 85, technique: 93, charisma: 88, defense: 84 }, finisher: 'Asuka Lock', brand: 'SmackDown', signature: 'Empress', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/asuka.png' },
    SAMI_ZAYN: { id: 'SAMI_ZAYN', name: 'Sami Zayn', rarity: 'EPIC', basePrice: 1580000, stats: { overall: 87, power: 80, speed: 89, stamina: 86, technique: 92, charisma: 90, defense: 81 }, finisher: 'Helluva Kick', brand: 'SmackDown', signature: 'Underdog', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/sami.png' },
    CODY_RHODES: { id: 'CODY_RHODES', name: 'Cody Rhodes', rarity: 'EPIC', basePrice: 1820000, stats: { overall: 90, power: 86, speed: 88, stamina: 89, technique: 91, charisma: 94, defense: 85 }, finisher: 'Cross Rhodes', brand: 'SmackDown', signature: 'American Nightmare', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/cody.png' },
    SHEAMUS: { id: 'SHEAMUS', name: 'Sheamus', rarity: 'EPIC', basePrice: 1600000, stats: { overall: 87, power: 90, speed: 75, stamina: 88, technique: 83, charisma: 82, defense: 91 }, finisher: 'Brogue Kick', brand: 'SmackDown', signature: 'Celtic Warrior', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/sheamus.png' },
    NAKAMURA: { id: 'NAKAMURA', name: 'Shinsuke Nakamura', rarity: 'EPIC', basePrice: 1640000, stats: { overall: 88, power: 84, speed: 88, stamina: 85, technique: 94, charisma: 91, defense: 82 }, finisher: 'Kinshasa', brand: 'SmackDown', signature: 'King of Strong Style', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/nakamura.png' },
    BRAUN_STROWMAN: { id: 'BRAUN_STROWMAN', name: 'Braun Strowman', rarity: 'EPIC', basePrice: 1680000, stats: { overall: 88, power: 98, speed: 72, stamina: 90, technique: 79, charisma: 85, defense: 94 }, finisher: 'Powerslam', brand: 'SmackDown', signature: 'Monster', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/braun.png' },
    SAMOA_JOE: { id: 'SAMOA_JOE', name: 'Samoa Joe', rarity: 'EPIC', basePrice: 1620000, stats: { overall: 87, power: 91, speed: 79, stamina: 87, technique: 93, charisma: 86, defense: 89 }, finisher: 'Coquina Clutch', brand: 'SmackDown', signature: 'Submission Machine', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/joe.png' },
    KOFI_KINGSTON: { id: 'KOFI_KINGSTON', name: 'Kofi Kingston', rarity: 'EPIC', basePrice: 1550000, stats: { overall: 86, power: 81, speed: 93, stamina: 87, technique: 88, charisma: 89, defense: 80 }, finisher: 'Trouble in Paradise', brand: 'Raw', signature: 'Dreadlocked', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/kofi.png' },
    XAVIER_WOODS: { id: 'XAVIER_WOODS', name: 'Xavier Woods', rarity: 'EPIC', basePrice: 1520000, stats: { overall: 85, power: 79, speed: 91, stamina: 86, technique: 87, charisma: 92, defense: 78 }, finisher: 'Honor Roll', brand: 'Raw', signature: 'King Woods', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/xavier.png' },
    BIG_E: { id: 'BIG_E', name: 'Big E', rarity: 'EPIC', basePrice: 1590000, stats: { overall: 87, power: 93, speed: 82, stamina: 88, technique: 85, charisma: 91, defense: 87 }, finisher: 'Big Ending', brand: 'Raw', signature: 'Powerhouse', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/bige.png' },
    CESARO: { id: 'CESARO', name: 'Cesaro', rarity: 'EPIC', basePrice: 1610000, stats: { overall: 87, power: 95, speed: 83, stamina: 89, technique: 94, charisma: 80, defense: 86 }, finisher: 'Neutralizer', brand: 'SmackDown', signature: 'Swiss Cyborg', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/cesaro.png' },
    RIDDLE: { id: 'RIDDLE', name: 'Riddle', rarity: 'EPIC', basePrice: 1560000, stats: { overall: 86, power: 84, speed: 87, stamina: 88, technique: 91, charisma: 87, defense: 82 }, finisher: 'RKO', brand: 'Raw', signature: 'Bro', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/riddle.png' },
    LA_KNIGHT: { id: 'LA_KNIGHT', name: 'LA Knight', rarity: 'EPIC', basePrice: 1700000, stats: { overall: 88, power: 87, speed: 85, stamina: 87, technique: 89, charisma: 95, defense: 84 }, finisher: 'BFT', brand: 'SmackDown', signature: 'Yeah', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/laknight.png' },
    GUNTHER: { id: 'GUNTHER', name: 'Gunther', rarity: 'EPIC', basePrice: 1780000, stats: { overall: 90, power: 94, speed: 80, stamina: 92, technique: 95, charisma: 86, defense: 93 }, finisher: 'Powerbomb', brand: 'Raw', signature: 'Ring General', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/gunther.png' },
    DREW_MCINTYRE: { id: 'DREW_MCINTYRE', name: 'Drew McIntyre', rarity: 'RARE', basePrice: 980000, stats: { overall: 87, power: 92, speed: 81, stamina: 85, technique: 86, charisma: 84, defense: 88 }, finisher: 'Claymore', brand: 'SmackDown', signature: 'Scottish Warrior', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/drew.png' },
    KEVIN_OWENS: { id: 'KEVIN_OWENS', name: 'Kevin Owens', rarity: 'RARE', basePrice: 920000, stats: { overall: 86, power: 88, speed: 79, stamina: 87, technique: 89, charisma: 85, defense: 82 }, finisher: 'Stunner', brand: 'Raw', signature: 'Prize Fighter', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/ko.png' },
    FINN_BALOR: { id: 'FINN_BALOR', name: 'Finn Balor', rarity: 'RARE', basePrice: 950000, stats: { overall: 86, power: 80, speed: 91, stamina: 84, technique: 90, charisma: 87, defense: 79 }, finisher: 'Coup de Grace', brand: 'SmackDown', signature: 'Prince', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/finn.png' },
    DAMIAN_PRIEST: { id: 'DAMIAN_PRIEST', name: 'Damian Priest', rarity: 'RARE', basePrice: 900000, stats: { overall: 85, power: 90, speed: 83, stamina: 86, technique: 84, charisma: 83, defense: 85 }, finisher: 'South of Heaven', brand: 'Raw', signature: 'Archer', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/priest.png' },
    DOMINIK_MYSTERIO: { id: 'DOMINIK_MYSTERIO', name: 'Dominik Mysterio', rarity: 'RARE', basePrice: 850000, stats: { overall: 84, power: 78, speed: 88, stamina: 83, technique: 86, charisma: 82, defense: 77 }, finisher: '619', brand: 'Raw', signature: 'Dirty Dom', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/dom.png' },
    AUSTIN_THEORY: { id: 'AUSTIN_THEORY', name: 'Austin Theory', rarity: 'RARE', basePrice: 880000, stats: { overall: 84, power: 83, speed: 86, stamina: 85, technique: 85, charisma: 84, defense: 80 }, finisher: 'ATL', brand: 'Raw', signature: 'A-Town', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/theory.png' },
    BRONSON_REED: { id: 'BRONSON_REED', name: 'Bronson Reed', rarity: 'RARE', basePrice: 910000, stats: { overall: 85, power: 94, speed: 74, stamina: 88, technique: 82, charisma: 79, defense: 90 }, finisher: 'Tsunami', brand: 'Raw', signature: 'Big Bronson', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/reed.png' },
    LUDWIG_KAISER: { id: 'LUDWIG_KAISER', name: 'Ludwig Kaiser', rarity: 'RARE', basePrice: 870000, stats: { overall: 84, power: 85, speed: 83, stamina: 84, technique: 88, charisma: 80, defense: 83 }, finisher: 'Kaiser Roll', brand: 'Raw', signature: 'Austrian', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/kaiser.png' },
    SANTOS_ESCOBAR: { id: 'SANTOS_ESCOBAR', name: 'Santos Escobar', rarity: 'RARE', basePrice: 890000, stats: { overall: 85, power: 82, speed: 88, stamina: 85, technique: 89, charisma: 83, defense: 81 }, finisher: 'Phantom Driver', brand: 'SmackDown', signature: 'El Hijo', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/santos.png' },
    ANGELO_DAWKINS: { id: 'ANGELO_DAWKINS', name: 'Angelo Dawkins', rarity: 'RARE', basePrice: 820000, stats: { overall: 83, power: 86, speed: 82, stamina: 84, technique: 81, charisma: 85, defense: 82 }, finisher: 'Anoint', brand: 'SmackDown', signature: 'Curse', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/dawkins.png' },
    MONTEZ_FORD: { id: 'MONTEZ_FORD', name: 'Montez Ford', rarity: 'RARE', basePrice: 860000, stats: { overall: 84, power: 81, speed: 93, stamina: 86, technique: 84, charisma: 89, defense: 78 }, finisher: 'From Heavens', brand: 'SmackDown', signature: 'Frog Splash', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/montez.png' },
    CHAD_GABLE: { id: 'CHAD_GABLE', name: 'Chad Gable', rarity: 'RARE', basePrice: 930000, stats: { overall: 86, power: 84, speed: 87, stamina: 86, technique: 95, charisma: 82, defense: 84 }, finisher: 'Chaos Theory', brand: 'Raw', signature: 'Master Gable', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/gable.png' },
    OTIS: { id: 'OTIS', name: 'Otis', rarity: 'RARE', basePrice: 840000, stats: { overall: 83, power: 92, speed: 73, stamina: 86, technique: 79, charisma: 88, defense: 88 }, finisher: 'Caterpillar', brand: 'Raw', signature: 'Oh Yeah', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/otis.png' },
    CARMELO_HAYES: { id: 'CARMELO_HAYES', name: 'Carmelo Hayes', rarity: 'RARE', basePrice: 940000, stats: { overall: 86, power: 81, speed: 90, stamina: 85, technique: 88, charisma: 87, defense: 79 }, finisher: 'Nothing But Net', brand: 'SmackDown', signature: 'Him', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/hayes.png' },
    ANDRADE: { id: 'ANDRADE', name: 'Andrade', rarity: 'RARE', basePrice: 960000, stats: { overall: 86, power: 84, speed: 89, stamina: 84, technique: 91, charisma: 83, defense: 82 }, finisher: 'Hammerlock DDT', brand: 'SmackDown', signature: 'El Idolo', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/andrade.png' },
    TOMMASO_CIAMPA: { id: 'TOMMASO_CIAMPA', name: 'Tommaso Ciampa', rarity: 'RARE', basePrice: 900000, stats: { overall: 85, power: 87, speed: 81, stamina: 86, technique: 90, charisma: 84, defense: 85 }, finisher: 'Fairytale Ending', brand: 'Raw', signature: 'Psycho Killer', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/ciampa.png' },
    TYLER_BATE: { id: 'TYLER_BATE', name: 'Tyler Bate', rarity: 'RARE', basePrice: 870000, stats: { overall: 84, power: 86, speed: 86, stamina: 87, technique: 90, charisma: 82, defense: 81 }, finisher: 'Tyler Driver 97', brand: 'SmackDown', signature: 'Big Strong Boy', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/bate.png' },
    DRAGON_LEE: { id: 'DRAGON_LEE', name: 'Dragon Lee', rarity: 'RARE', basePrice: 890000, stats: { overall: 85, power: 79, speed: 95, stamina: 82, technique: 88, charisma: 81, defense: 76 }, finisher: 'Dragonrana', brand: 'Raw', signature: 'Dragon', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/dragonlee.png' },
    JD_MCDONAGH: { id: 'JD_MCDONAGH', name: 'JD McDonagh', rarity: 'RARE', basePrice: 850000, stats: { overall: 84, power: 82, speed: 87, stamina: 84, technique: 88, charisma: 80, defense: 80 }, finisher: 'Devils Inside', brand: 'Raw', signature: 'Irish Ace', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/jd.png' },
    RICOCHET: { id: 'RICOCHET', name: 'Ricochet', rarity: 'COMMON', basePrice: 450000, stats: { overall: 82, power: 75, speed: 95, stamina: 81, technique: 87, charisma: 79, defense: 74 }, finisher: '630', brand: 'SmackDown', signature: 'One and Only', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/ricochet.png' },
    DOLPH_ZIGGLER: { id: 'DOLPH_ZIGGLER', name: 'Dolph Ziggler', rarity: 'COMMON', basePrice: 420000, stats: { overall: 81, power: 76, speed: 88, stamina: 83, technique: 85, charisma: 80, defense: 75 }, finisher: 'Zig Zag', brand: 'Raw', signature: 'Showoff', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/ziggler.png' },
    BARON_CORBIN: { id: 'BARON_CORBIN', name: 'Baron Corbin', rarity: 'COMMON', basePrice: 430000, stats: { overall: 81, power: 87, speed: 76, stamina: 83, technique: 78, charisma: 74, defense: 84 }, finisher: 'End of Days', brand: 'SmackDown', signature: 'Lone Wolf', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/corbin.png' },
    IVAR: { id: 'IVAR', name: 'Ivar', rarity: 'COMMON', basePrice: 410000, stats: { overall: 80, power: 90, speed: 72, stamina: 82, technique: 77, charisma: 76, defense: 86 }, finisher: 'Viking Splash', brand: 'Raw', signature: 'Viking', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/ivar.png' },
    VALHALLA: { id: 'VALHALLA', name: 'Valhalla', rarity: 'COMMON', basePrice: 400000, stats: { overall: 79, power: 76, speed: 81, stamina: 80, technique: 79, charisma: 84, defense: 77 }, finisher: 'Shield Slam', brand: 'Raw', signature: 'Warrior', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/valhalla.png' },
    AKIRA_TOZAWA: { id: 'AKIRA_TOZAWA', name: 'Akira Tozawa', rarity: 'COMMON', basePrice: 390000, stats: { overall: 79, power: 74, speed: 89, stamina: 80, technique: 83, charisma: 77, defense: 73 }, finisher: 'Senton', brand: 'Raw', signature: 'Ah', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/tozawa.png' },
    SHELTON_BENJAMIN: { id: 'SHELTON_BENJAMIN', name: 'Shelton Benjamin', rarity: 'COMMON', basePrice: 440000, stats: { overall: 81, power: 83, speed: 85, stamina: 81, technique: 86, charisma: 76, defense: 80 }, finisher: 'Paydirt', brand: 'SmackDown', signature: 'Gold Standard', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/shelton.png' },
    R_TRUTH: { id: 'R_TRUTH', name: 'R-Truth', rarity: 'COMMON', basePrice: 430000, stats: { overall: 80, power: 77, speed: 83, stamina: 82, technique: 80, charisma: 92, defense: 76 }, finisher: 'AA', brand: 'Raw', signature: 'Whats Up', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/truth.png' },
    APOLLO_CREWS: { id: 'APOLLO_CREWS', name: 'Apollo Crews', rarity: 'COMMON', basePrice: 460000, stats: { overall: 82, power: 84, speed: 87, stamina: 83, technique: 82, charisma: 78, defense: 79 }, finisher: 'Standing Moonsault', brand: 'SmackDown', signature: 'Conqueror', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/apollo.png' },
    CEDRIC_ALEXANDER: { id: 'CEDRIC_ALEXANDER', name: 'Cedric Alexander', rarity: 'COMMON', basePrice: 440000, stats: { overall: 81, power: 78, speed: 91, stamina: 81, technique: 85, charisma: 77, defense: 75 }, finisher: 'Lumbar Check', brand: 'Raw', signature: 'Heart of 205', imageUrl: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/cedric.png' }
};

const WRESTLERS_ARRAY = Object.values(WRESTLERS_DATABASE);

class CardGenerator {
    static async createCard(wrestler) {
        const canvas = createCanvas(400, 600);
        const ctx = canvas.getContext('2d');
        const colors = CONFIG.CARD_COLORS[wrestler.rarity];
        const gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 600);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 380, 580);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(30, 30, 340, 50);
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(wrestler.rarity, 200, 65);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(50, 100, 300, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px Arial';
        ctx.fillText(wrestler.name.charAt(0), 200, 270);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(30, 420, 340, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Arial';
        ctx.fillText(wrestler.name, 200, 460);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(30, 490, 340, 80);
        ctx.fillStyle = colors.primary;
        ctx.fillRect(50, 500, 80, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(wrestler.stats.overall, 90, 540);
        ctx.font = 'bold 12px Arial';
        ctx.fillText('OVR', 90, 555);
        const stats = [
            { label: 'PWR', value: wrestler.stats.power },
            { label: 'SPD', value: wrestler.stats.speed },
            { label: 'DEF', value: wrestler.stats.defense }
        ];
        ctx.font = 'bold 16px Arial';
        stats.forEach((stat, i) => {
            const x = 160 + (i * 70);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${stat.label}:`, x, 520);
            ctx.fillStyle = colors.primary;
            ctx.fillText(stat.value, x, 545);
        });
        ctx.fillStyle = colors.primary;
        ctx.fillRect(30, 575, 340, 15);
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 11px Arial';
        ctx.fillText(`⚡ ${wrestler.finisher}`, 200, 586);
        return canvas.toBuffer();
    }
}

class DatabaseManager {
    constructor() {
        this.cache = new Map();
    }
    async loadData(filePath) {
        try {
            if (this.cache.has(filePath)) return this.cache.get(filePath);
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
        const emojis = { COMMON: '⚪', RARE: '🔵', EPIC: '🟣', LEGENDARY: '🟠', MYTHIC: '🟡' };
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

class UIComponents {
    static createMatchButtons(disabled = false) {
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('match_strike').setLabel('👊 Strike').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_punch').setLabel('✊ Punch').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_kick').setLabel('🦵 Kick').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_grapple').setLabel('🤼 Grapple').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_suplex').setLabel('🔄 Suplex').setStyle(ButtonStyle.Success).setDisabled(disabled)
            );
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('match_ddt').setLabel('⬇️ DDT').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_powerbomb').setLabel('💣 Powerbomb').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_slam').setLabel('🌪️ Slam').setStyle(ButtonStyle.Success).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_submission').setLabel('🔒 Submission').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_clothesline').setLabel('👕 Clothesline').setStyle(ButtonStyle.Primary).setDisabled(disabled)
            );
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('match_dropkick').setLabel('🚀 Dropkick').setStyle(ButtonStyle.Success).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_elbow').setLabel('💪 Elbow').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_knee').setLabel('🦿 Knee').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_special').setLabel('⚡ Special').setStyle(ButtonStyle.Success).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_finisher').setLabel('🔥 FINISHER').setStyle(ButtonStyle.Danger).setDisabled(disabled)
            );
        return [row1, row2, row3];
    }
}

class MatchEngine {
    constructor() {
        this.activeMatches = new Map();
    }
    createMatch(player1Id, player2Id, channelId) {
        const matchId = Utils.generateId();
        const match = {
            id: matchId,
            player1: { id: player1Id, activeWrestlerIndex: 0, wrestlers: [], teamHealth: 100, momentum: 0 },
            player2: { id: player2Id, activeWrestlerIndex: 0, wrestlers: [], teamHealth: 100, momentum: 0 },
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
    loadWrestlers(match, player1Squad, player2Squad) {
        match.player1.wrestlers = player1Squad.slice(0, 5).map(card => ({ cardId: card.id, wrestlerId: card.wrestlerId, health: 100, stamina: 100, isActive: false, eliminated: false }));
        match.player2.wrestlers = player2Squad.slice(0, 5).map(card => ({ cardId: card.id, wrestlerId: card.wrestlerId, health: 100, stamina: 100, isActive: false, eliminated: false }));
        if (match.player1.wrestlers.length > 0) match.player1.wrestlers[0].isActive = true;
        if (match.player2.wrestlers.length > 0) match.player2.wrestlers[0].isActive = true;
    }
    getActiveWrestler(player) {
        return player.wrestlers[player.activeWrestlerIndex];
    }
    rotateWrestler(player) {
        const current = this.getActiveWrestler(player);
        current.isActive = false;
        let nextIndex = (player.activeWrestlerIndex + 1) % player.wrestlers.length;
        let attempts = 0;
        while (player.wrestlers[nextIndex].eliminated && attempts < player.wrestlers.length) {
            nextIndex = (nextIndex + 1) % player.wrestlers.length;
            attempts++;
        }
        if (attempts >= player.wrestlers.length) return { success: false, message: '❌ No wrestlers available!' };
        player.activeWrestlerIndex = nextIndex;
        player.wrestlers[nextIndex].isActive = true;
        const newWrestler = Utils.getWrestler(player.wrestlers[nextIndex].wrestlerId);
        return { success: true, message: `🔄 ${newWrestler.name} enters!`, wrestler: newWrestler };
    }
    executeAction(matchId, playerId, action) {
        const match = this.activeMatches.get(matchId);
        if (!match || match.status !== 'active') return { success: false, message: 'Match not found!' };
        if (match.currentTurn !== playerId) return { success: false, message: 'Not your turn!' };
        const attacker = match.player1.id === playerId ? match.player1 : match.player2;
        const defender = match.player1.id === playerId ? match.player2 : match.player1;
        const attackerWrestler = this.getActiveWrestler(attacker);
        const defenderWrestler = this.getActiveWrestler(defender);
        let result = {};
        let animationType = null;
        const attackerData = Utils.getWrestler(attackerWrestler.wrestlerId);
        const moves = {
            strike: { min: 8, max: 15, stamina: 10, chance: 0.85, momentum: 5 },
            punch: { min: 7, max: 14, stamina: 8, chance: 0.87, momentum: 4 },
            kick: { min: 9, max: 16, stamina: 12, chance: 0.83, momentum: 6 },
            grapple: { min: 10, max: 20, stamina: 15, chance: 0.75, momentum: 8 },
            suplex: { min: 15, max: 25, stamina: 20, chance: 0.70, momentum: 10 },
            ddt: { min: 12, max: 22, stamina: 18, chance: 0.75, momentum: 9 },
            powerbomb: { min: 20, max: 30, stamina: 25, chance: 0.65, momentum: 15 },
            slam: { min: 14, max: 24, stamina: 17, chance: 0.70, momentum: 10 },
            submission: { min: 10, max: 18, stamina: 15, chance: 0.60, momentum: 12 },
            clothesline: { min: 11, max: 19, stamina: 13, chance: 0.77, momentum: 7 },
            dropkick: { min: 13, max: 21, stamina: 16, chance: 0.72, momentum: 9 },
            elbow: { min: 10, max: 17, stamina: 11, chance: 0.80, momentum: 6 },
            knee: { min: 12, max: 20, stamina: 14, chance: 0.75, momentum: 8 }
        };
        if (moves[action]) {
            const move = moves[action];
            if (attackerWrestler.stamina < move.stamina) {
                return { success: false, message: '❌ Not enough stamina!' };
            }
            if (Math.random() < move.chance) {
                const damage = Utils.randomInt(move.min, move.max);
                attackerWrestler.stamina -= move.stamina;
                defenderWrestler.health = Math.max(0, defenderWrestler.health - damage);
                attacker.momentum = Math.min(100, attacker.momentum + move.momentum);
                result = { success: true, damage, message: `${attackerData.name} hits ${action.toUpperCase()} for ${damage} damage!` };
                animationType = action;
            } else {
                attackerWrestler.stamina -= Math.floor(move.stamina / 2);
                const blocked = Math.random() < 0.5;
                result = { success: false, damage: 0, message: blocked ? `🛡️ BLOCKED!` : `🔄 REVERSED!` };
                animationType = blocked ? 'blocked' : 'reversed';
            }
        } else if (action === 'special') {
            if (attacker.momentum < 30) return { success: false, message: `❌ Need 30 momentum! (Have ${attacker.momentum})` };
            const damage = Utils.randomInt(18, 28);
            attackerWrestler.stamina -= 20;
            attacker.momentum -= 30;
            defenderWrestler.health = Math.max(0, defenderWrestler.health - damage);
            result = { success: true, damage, message: `⚡ ${attackerData.name} hits SPECIAL for ${damage} damage!` };
            animationType = 'special';
        } else if (action === 'finisher') {
            if (attacker.momentum < 70) return { success: false, message: `❌ Need 70 momentum! (Have ${attacker.momentum})` };
            const damage = Utils.randomInt(30, 45);
            attackerWrestler.stamina -= 30;
            attacker.momentum = 0;
            defenderWrestler.health = Math.max(0, defenderWrestler.health - damage);
            result = { success: true, damage, message: `🔥 ${attackerData.name} hits ${attackerData.finisher.toUpperCase()}! ${damage} damage!` };
            animationType = 'finisher';
        }
        if (defenderWrestler.health <= 0 && !defenderWrestler.eliminated) {
            defenderWrestler.eliminated = true;
            const defenderData = Utils.getWrestler(defenderWrestler.wrestlerId);
            result.elimination = true;
            result.eliminatedWrestler = defenderData.name;
            const rotateResult = this.rotateWrestler(defender);
            if (rotateResult.success) {
                result.message += `\n💥 ${result.eliminatedWrestler} ELIMINATED!\n${rotateResult.message}`;
            }
        }
        match.log.push({ turn: match.turnNumber, player: playerId, action, result });
        match.currentTurn = match.player1.id === playerId ? match.player2.id : match.player1.id;
        match.turnNumber++;
        const winner = this.checkWinCondition(match);
        if (winner) {
            match.status = 'finished';
            match.winner = winner;
        }
        return { success: true, result, match, winner, animationType };
    }
    checkWinCondition(match) {
        const p1Alive = match.player1.wrestlers.filter(w => !w.eliminated).length;
        const p2Alive = match.player2.wrestlers.filter(w => !w.eliminated).length;
        if (p1Alive === 0) return match.player2.id;
        if (p2Alive === 0) return match.player1.id;
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
            .setColor('#FF0000')
            .setTitle('🤼 WWE 5v5 TAG MATCH!')
            .setDescription(`Turn ${match.turnNumber} | <@${match.currentTurn}>'s turn`)
            .addFields(
                {
                    name: `⭐ P1 - ${p1Alive}/5`,
                    value: `${p1Wrestler.name}\nHP: ${Utils.progressBar(p1Active.health, 100)}\nSTA: ${Utils.progressBar(p1Active.stamina, 100)}\nMOM: ${p1.momentum}`,
                    inline: true
                },
                { name: '⚔️', value: 'VS', inline: true },
                {
                    name: `⭐ P2 - ${p2Alive}/5`,
                    value: `${p2Wrestler.name}\nHP: ${Utils.progressBar(p2Active.health, 100)}\nSTA: ${Utils.progressBar(p2Active.stamina, 100)}\nMOM: ${p2.momentum}`,
                    inline: true
                }
            );
        if (match.log.length > 0) {
            const lastAction = match.log[match.log.length - 1];
            embed.addFields({ name: '📋 Last', value: lastAction.result.message.substring(0, 1024) });
        }
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
            console.error(`Error: ${commandName}:`, error);
            message.reply('❌ Error!');
        }
    }
}

const commandHandler = new CommandHandler();

commandHandler.register('debut', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (user) return message.reply('❌ Already debuted!');
    const newUser = await db.createUser(userId, message.author.username);
    const startingWrestlers = [];
    for (let i = 0; i < 3; i++) {
        const commonWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'COMMON');
        const wrestler = Utils.randomElement(commonWrestlers);
        startingWrestlers.push({ id: Utils.generateId(), wrestlerId: wrestler.id, acquiredAt: Date.now() });
    }
    const rareWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'RARE');
    startingWrestlers.push({ id: Utils.generateId(), wrestlerId: Utils.randomElement(rareWrestlers).id, acquiredAt: Date.now() });
    const epicWrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === 'EPIC');
    startingWrestlers.push({ id: Utils.generateId(), wrestlerId: Utils.randomElement(epicWrestlers).id, acquiredAt: Date.now() });
    newUser.squad = startingWrestlers;
    newUser.playingXI = startingWrestlers.map(w => w.id);
    newUser.cardsOwned = 5;
    await db.updateUser(userId, newUser);
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎉 WELCOME!')
        .setDescription(`${message.author.username}`)
        .addFields({ name: '💰', value: Utils.formatCurrency(CONFIG.STARTING_PURSE) });
    message.reply({ embeds: [embed] });
});

commandHandler.register('start', async (m, a) => await commandHandler.commands.get('debut')(m, a));

commandHandler.register('drop', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ Use !debut!');
    const rarity = Utils.weightedRandom(CONFIG.DROP_RATES);
    const wrestlersOfRarity = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
    const wrestler = Utils.randomElement(wrestlersOfRarity);
    const newCard = { id: Utils.generateId(), wrestlerId: wrestler.id, acquiredAt: Date.now() };
    user.squad.push(newCard);
    user.cardsOwned++;
    await db.updateUser(userId, user);
    const cardBuffer = await CardGenerator.createCard(wrestler);
    const attachment = new AttachmentBuilder(cardBuffer, { name: `${wrestler.id}.png` });
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle('🎴 NEW WRESTLER!')
        .setDescription(`${wrestler.rarity} - ${wrestler.name}`)
        .setImage(`attachment://${wrestler.id}.png`)
        .addFields({ name: '💰', value: Utils.formatCurrency(wrestler.basePrice) });
    message.reply({ embeds: [embed], files: [attachment] });
});

commandHandler.register('pack', async (m, a) => await commandHandler.commands.get('drop')(m, a));
commandHandler.register('open', async (m, a) => await commandHandler.commands.get('drop')(m, a));

commandHandler.register('daily', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ !debut first!');
    const now = Date.now();
    const lastDaily = user.lastDaily || 0;
    const timeSince = now - lastDaily;
    const oneDay = 86400000;
    if (timeSince < oneDay) {
        const timeLeft = oneDay - timeSince;
        return message.reply(`⏰ ${Utils.formatDuration(timeLeft)}`);
    }
    let streak = user.dailyStreak || 0;
    if (timeSince < oneDay * 2) streak++;
    else streak = 1;
    const reward = CONFIG.DAILY_REWARD + (streak * 100);
    user.purse += reward;
    user.totalCoinsEarned += reward;
    user.lastDaily = now;
    user.dailyStreak = streak;
    await db.updateUser(userId, user);
    message.reply(`📅 DAILY! ${Utils.formatCurrency(reward)} | Streak: ${streak}`);
});

commandHandler.register('claim', async (m, a) => await commandHandler.commands.get('daily')(m, a));

commandHandler.register('vote', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ !debut first!');
    const now = Date.now();
    const lastVote = user.lastVote || 0;
    const timeSince = now - lastVote;
    const twelveHours = 43200000;
    if (timeSince < twelveHours) return message.reply(`⏰ ${Utils.formatDuration(twelveHours - timeSince)}`);
    user.purse += CONFIG.VOTE_REWARD;
    user.totalCoinsEarned += CONFIG.VOTE_REWARD;
    user.lastVote = now;
    await db.updateUser(userId, user);
    message.reply(`🗳️ ${Utils.formatCurrency(CONFIG.VOTE_REWARD)}`);
});

commandHandler.register('purse', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    message.reply(`💰 ${target.username}: ${Utils.formatCurrency(user.purse)} | Level ${user.level}`);
});

commandHandler.register('bal', async (m, a) => await commandHandler.commands.get('purse')(m, a));
commandHandler.register('balance', async (m, a) => await commandHandler.commands.get('purse')(m, a));

commandHandler.register('squad', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    if (user.squad.length === 0) return message.reply('❌ No wrestlers!');
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`📦 ${target.username}'s Squad`)
        .setDescription(`Total: ${user.squad.length}`);
    user.squad.slice(0, 20).forEach((card, i) => {
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) embed.addFields({ name: `${i + 1}. ${w.name}`, value: `${Utils.getRarityEmoji(w.rarity)} ${w.stats.overall}`, inline: true });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('roster', async (m, a) => await commandHandler.commands.get('squad')(m, a));

commandHandler.register('xi', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    if (user.playingXI.length === 0) {
        const top5 = user.squad.slice(0, 5).map(c => c.id);
        user.playingXI = top5;
        await db.updateUser(target.id, user);
    }
    const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle(`⭐ ${target.username}'s Team`);
    user.playingXI.forEach((cardId, i) => {
        const card = user.squad.find(c => c.id === cardId);
        if (!card) return;
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) embed.addFields({ name: `${i + 1}. ${w.name}`, value: `${w.stats.overall}`, inline: true });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('team', async (m, a) => await commandHandler.commands.get('xi')(m, a));

commandHandler.register('profile', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    const winRate = user.matchesPlayed > 0 ? ((user.wins / user.matchesPlayed) * 100).toFixed(1) : 0;
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`📊 ${target.username}`)
        .addFields(
            { name: 'Level', value: `${user.level}`, inline: true },
            { name: 'Wins', value: `${user.wins}`, inline: true },
            { name: 'Win %', value: `${winRate}%`, inline: true }
        );
    message.reply({ embeds: [embed] });
});

commandHandler.register('stats', async (m, a) => await commandHandler.commands.get('profile')(m, a));

commandHandler.register('leaderboard', async (message) => {
    const users = await db.loadData(DB_PATHS.USERS);
    const userArray = Object.values(users);
    const sorted = userArray.sort((a, b) => b.wins - a.wins);
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏆 TOP 10')
        .setDescription('By wins');
    sorted.slice(0, 10).forEach((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        embed.addFields({ name: `${medal} ${u.username}`, value: `${u.wins} wins`, inline: false });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('lb', async (m, a) => await commandHandler.commands.get('leaderboard')(m, a));
commandHandler.register('top', async (m, a) => await commandHandler.commands.get('leaderboard')(m, a));

commandHandler.register('view', async (message, args) => {
    if (!args.length) return message.reply('❌ !view <wrestler>');
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    if (!wrestler) return message.reply('❌ Not found!');
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle(`${Utils.getRarityEmoji(wrestler.rarity)} ${wrestler.name}`)
        .addFields(
            { name: 'OVR', value: `${wrestler.stats.overall}`, inline: true },
            { name: 'Rarity', value: wrestler.rarity, inline: true },
            { name: 'Price', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: 'Finisher', value: wrestler.finisher }
        );
    message.reply({ embeds: [embed] });
});

commandHandler.register('show', async (m, a) => await commandHandler.commands.get('view')(m, a));

commandHandler.register('buy', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ !debut first!');
    if (!args.length) return message.reply('❌ !buy <wrestler>');
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    if (!wrestler) return message.reply('❌ Not found!');
    if (user.purse < wrestler.basePrice) return message.reply(`❌ Need ${Utils.formatCurrency(wrestler.basePrice)}`);
    user.purse -= wrestler.basePrice;
    user.totalCoinsSpent += wrestler.basePrice;
    user.squad.push({ id: Utils.generateId(), wrestlerId: wrestler.id, acquiredAt: Date.now() });
    user.cardsOwned++;
    await db.updateUser(message.author.id, user);
    message.reply(`✅ Bought ${wrestler.name}!`);
});

commandHandler.register('sell', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ !debut first!');
    if (!args.length) return message.reply('❌ !sell <wrestler>');
    const searchName = args.join(' ').toLowerCase();
    const userCard = user.squad.find(card => {
        const w = Utils.getWrestler(card.wrestlerId);
        return w && w.name.toLowerCase().includes(searchName);
    });
    if (!userCard) return message.reply('❌ You don\'t own!');
    const wrestler = Utils.getWrestler(userCard.wrestlerId);
    const sellPrice = Math.floor(wrestler.basePrice * 0.7);
    user.purse += sellPrice;
    user.squad = user.squad.filter(c => c.id !== userCard.id);
    user.playingXI = user.playingXI.filter(id => id !== userCard.id);
    await db.updateUser(message.author.id, user);
    message.reply(`✅ Sold ${wrestler.name} for ${Utils.formatCurrency(sellPrice)}!`);
});

commandHandler.register('market', async (message) => {
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🏪 MARKET')
        .setDescription('Showing 15');
    WRESTLERS_ARRAY.slice(0, 15).forEach(w => {
        embed.addFields({ name: `${Utils.getRarityEmoji(w.rarity)} ${w.name}`, value: `${w.stats.overall} | ${Utils.formatCurrency(w.basePrice)}`, inline: true });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('shop', async (m, a) => await commandHandler.commands.get('market')(m, a));

commandHandler.register('play', async (message) => {
    const user1 = await db.getUser(message.author.id);
    if (!user1) return message.reply('❌ !debut first!');
    if (user1.playingXI.length < 5) return message.reply('❌ Need 5!');
    const opponent = message.mentions.users.first();
    if (!opponent) return message.reply('❌ Mention opponent!');
    if (opponent.bot) return message.reply('❌ No bots!');
    const user2 = await db.getUser(opponent.id);
    if (!user2) return message.reply(`❌ ${opponent.username} hasn't started!`);
    if (user2.playingXI.length < 5) return message.reply(`❌ ${opponent.username} needs 5!`);
    const match = matchEngine.createMatch(message.author.id, opponent.id, message.channel.id);
    const p1Squad = user1.playingXI.map(cardId => user1.squad.find(c => c.id === cardId)).filter(c => c);
    const p2Squad = user2.playingXI.map(cardId => user2.squad.find(c => c.id === cardId)).filter(c => c);
    matchEngine.loadWrestlers(match, p1Squad, p2Squad);
    const embed = matchEngine.generateMatchEmbed(match);
    const buttons = UIComponents.createMatchButtons();
    await message.reply({ content: `🤼 ${message.author} vs ${opponent}\n<@${match.currentTurn}> turn!`, embeds: [embed], components: buttons });
});

commandHandler.register('battle', async (m, a) => await commandHandler.commands.get('play')(m, a));
commandHandler.register('fight', async (m, a) => await commandHandler.commands.get('play')(m, a));

commandHandler.register('help', async (message) => {
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🤼 WWE BOT')
        .addFields(
            { name: 'Start', value: '!debut' },
            { name: 'Cards', value: '!drop, !squad, !xi' },
            { name: 'Economy', value: '!daily, !purse, !buy, !sell' },
            { name: 'Battle', value: '!play @user (15 moves!)' },
            { name: 'Stats', value: '!profile, !lb' }
        );
    message.reply({ embeds: [embed] });
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
        if (!matchId) return interaction.reply({ content: '❌ No match!', ephemeral: true });
        const match = matchEngine.activeMatches.get(matchId);
        const result = matchEngine.executeAction(matchId, interaction.user.id, action);
        if (!result.success) return interaction.reply({ content: result.message, ephemeral: true });
        let content = result.result.message;
        if (result.animationType && CONFIG.MOVE_ANIMATIONS[result.animationType]) {
            content += `\n${CONFIG.MOVE_ANIMATIONS[result.animationType]}`;
        }
        if (result.winner) {
            const winnerId = result.winner;
            const loserId = winnerId === match.player1.id ? match.player2.id : match.player1.id;
            const winnerUser = await db.getUser(winnerId);
            const loserUser = await db.getUser(loserId);
            winnerUser.wins++;
            winnerUser.matchesPlayed++;
            winnerUser.xp += CONFIG.XP_PER_WIN;
            winnerUser.level = Utils.calculateLevel(winnerUser.xp);
            await db.updateUser(winnerId, winnerUser);
            loserUser.losses++;
            loserUser.matchesPlayed++;
            loserUser.xp += CONFIG.XP_PER_LOSS;
            loserUser.level = Utils.calculateLevel(loserUser.xp);
            await db.updateUser(loserId, loserUser);
            await interaction.update({ content: `🏆 <@${winnerId}> WINS!`, embeds: [], components: [] });
            matchEngine.activeMatches.delete(matchId);
        } else {
            const embed = matchEngine.generateMatchEmbed(result.match);
            const buttons = UIComponents.createMatchButtons();
            await interaction.update({ content: `${content}\n<@${result.match.currentTurn}> turn!`, embeds: [embed], components: buttons });
        }
    }
});

client.on('ready', async () => {
    console.log(`✅ ${client.user.tag} ONLINE!`);
    client.user.setActivity('!help', { type: 3 });
    for (const pathValue of Object.values(DB_PATHS)) {
        await db.loadData(pathValue);
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(CONFIG.PREFIX)) return;
    const args = message.content.slice(CONFIG.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    await commandHandler.handle(message, commandName, args);
});

client.login(CONFIG.BOT_TOKEN);
