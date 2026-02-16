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
        COMMON: { primary: '#708090', secondary: '#4A5568', text: '#FFFFFF', glow: 'rgba(112,128,144,0.5)' },
        RARE: { primary: '#0070DD', secondary: '#004d99', text: '#FFFFFF', glow: 'rgba(0,112,221,0.6)' },
        EPIC: { primary: '#A335EE', secondary: '#7a1fb8', text: '#FFFFFF', glow: 'rgba(163,53,238,0.7)' },
        LEGENDARY: { primary: '#FF8000', secondary: '#cc6600', text: '#FFFFFF', glow: 'rgba(255,128,0,0.8)' },
        MYTHIC: { primary: '#FFD700', secondary: '#FFA500', text: '#000000', glow: 'rgba(255,215,0,0.9)' }
    }
};

const DB_PATHS = { USERS: './database/users.json', MATCHES: './database/matches.json' };

const WRESTLERS_DATABASE = {
    UNDERTAKER: { id: 'UNDERTAKER', name: 'The Undertaker', rarity: 'MYTHIC', basePrice: 3500000, stats: { overall: 98, power: 95, speed: 80, stamina: 90, technique: 96, charisma: 98, defense: 94 }, finisher: 'Tombstone Piledriver', brand: 'Legend', signature: 'The Deadman', imageUrl: 'https://i.imgur.com/undertaker.png' },
    STONE_COLD: { id: 'STONE_COLD', name: 'Stone Cold Steve Austin', rarity: 'MYTHIC', basePrice: 3450000, stats: { overall: 97, power: 94, speed: 84, stamina: 93, technique: 90, charisma: 99, defense: 91 }, finisher: 'Stone Cold Stunner', brand: 'Legend', signature: 'The Texas Rattlesnake', imageUrl: 'https://i.imgur.com/stonecold.png' },
    THE_ROCK: { id: 'THE_ROCK', name: 'The Rock', rarity: 'MYTHIC', basePrice: 3400000, stats: { overall: 97, power: 93, speed: 86, stamina: 92, technique: 91, charisma: 100, defense: 89 }, finisher: 'Rock Bottom', brand: 'Legend', signature: 'The Great One', imageUrl: 'https://i.imgur.com/therock.png' },
    SHAWN_MICHAELS: { id: 'SHAWN_MICHAELS', name: 'Shawn Michaels', rarity: 'MYTHIC', basePrice: 3350000, stats: { overall: 96, power: 87, speed: 95, stamina: 88, technique: 98, charisma: 96, defense: 85 }, finisher: 'Sweet Chin Music', brand: 'Legend', signature: 'The Heartbreak Kid', imageUrl: 'https://i.imgur.com/hbk.png' },
    TRIPLE_H: { id: 'TRIPLE_H', name: 'Triple H', rarity: 'MYTHIC', basePrice: 3300000, stats: { overall: 96, power: 92, speed: 83, stamina: 93, technique: 94, charisma: 95, defense: 92 }, finisher: 'Pedigree', brand: 'Legend', signature: 'The Game', imageUrl: 'https://i.imgur.com/tripleh.png' },
    ROMAN_REIGNS: { id: 'ROMAN_REIGNS', name: 'Roman Reigns', rarity: 'LEGENDARY', basePrice: 3050000, stats: { overall: 96, power: 98, speed: 85, stamina: 92, technique: 90, charisma: 95, defense: 88 }, finisher: 'Spear', brand: 'SmackDown', signature: 'The Tribal Chief', imageUrl: 'https://i.imgur.com/roman.png' },
    BROCK_LESNAR: { id: 'BROCK_LESNAR', name: 'Brock Lesnar', rarity: 'LEGENDARY', basePrice: 2980000, stats: { overall: 95, power: 99, speed: 82, stamina: 94, technique: 88, charisma: 85, defense: 95 }, finisher: 'F5', brand: 'Raw', signature: 'The Beast Incarnate', imageUrl: 'https://i.imgur.com/brock.png' },
    JOHN_CENA: { id: 'JOHN_CENA', name: 'John Cena', rarity: 'LEGENDARY', basePrice: 2900000, stats: { overall: 94, power: 92, speed: 88, stamina: 96, technique: 89, charisma: 99, defense: 87 }, finisher: 'Attitude Adjustment', brand: 'Free Agent', signature: 'You Cannot See Me', imageUrl: 'https://i.imgur.com/cena.png' },
    EDGE: { id: 'EDGE', name: 'Edge', rarity: 'LEGENDARY', basePrice: 2750000, stats: { overall: 93, power: 87, speed: 84, stamina: 88, technique: 92, charisma: 94, defense: 86 }, finisher: 'Spear', brand: 'SmackDown', signature: 'The Rated R Superstar', imageUrl: 'https://i.imgur.com/edge.png' },
    BECKY_LYNCH: { id: 'BECKY_LYNCH', name: 'Becky Lynch', rarity: 'LEGENDARY', basePrice: 2850000, stats: { overall: 94, power: 86, speed: 89, stamina: 90, technique: 92, charisma: 96, defense: 85 }, finisher: 'Manhandle Slam', brand: 'Raw', signature: 'The Man', imageUrl: 'https://i.imgur.com/becky.png' },
    SETH_ROLLINS: { id: 'SETH_ROLLINS', name: 'Seth Rollins', rarity: 'EPIC', basePrice: 1850000, stats: { overall: 91, power: 85, speed: 92, stamina: 88, technique: 94, charisma: 89, defense: 84 }, finisher: 'Curb Stomp', brand: 'Raw', signature: 'The Visionary', imageUrl: 'https://i.imgur.com/seth.png' },
    AJ_STYLES: { id: 'AJ_STYLES', name: 'AJ Styles', rarity: 'EPIC', basePrice: 1780000, stats: { overall: 90, power: 82, speed: 94, stamina: 86, technique: 96, charisma: 88, defense: 83 }, finisher: 'Phenomenal Forearm', brand: 'SmackDown', signature: 'The Phenomenal One', imageUrl: 'https://i.imgur.com/aj.png' },
    RANDY_ORTON: { id: 'RANDY_ORTON', name: 'Randy Orton', rarity: 'EPIC', basePrice: 1820000, stats: { overall: 90, power: 88, speed: 86, stamina: 89, technique: 93, charisma: 87, defense: 85 }, finisher: 'RKO', brand: 'SmackDown', signature: 'The Viper', imageUrl: 'https://i.imgur.com/orton.png' },
    RHEA_RIPLEY: { id: 'RHEA_RIPLEY', name: 'Rhea Ripley', rarity: 'EPIC', basePrice: 1720000, stats: { overall: 89, power: 91, speed: 84, stamina: 87, technique: 88, charisma: 89, defense: 90 }, finisher: 'Riptide', brand: 'Raw', signature: 'The Nightmare', imageUrl: 'https://i.imgur.com/rhea.png' },
    DREW_MCINTYRE: { id: 'DREW_MCINTYRE', name: 'Drew McIntyre', rarity: 'RARE', basePrice: 980000, stats: { overall: 87, power: 92, speed: 81, stamina: 85, technique: 86, charisma: 84, defense: 88 }, finisher: 'Claymore Kick', brand: 'SmackDown', signature: 'The Scottish Warrior', imageUrl: 'https://i.imgur.com/drew.png' },
    KEVIN_OWENS: { id: 'KEVIN_OWENS', name: 'Kevin Owens', rarity: 'RARE', basePrice: 920000, stats: { overall: 86, power: 88, speed: 79, stamina: 87, technique: 89, charisma: 85, defense: 82 }, finisher: 'Stunner', brand: 'Raw', signature: 'The Prize Fighter', imageUrl: 'https://i.imgur.com/ko.png' },
    FINN_BALOR: { id: 'FINN_BALOR', name: 'Finn Balor', rarity: 'RARE', basePrice: 950000, stats: { overall: 86, power: 80, speed: 91, stamina: 84, technique: 90, charisma: 87, defense: 79 }, finisher: 'Coup de Grace', brand: 'SmackDown', signature: 'The Prince', imageUrl: 'https://i.imgur.com/finn.png' },
    RICOCHET: { id: 'RICOCHET', name: 'Ricochet', rarity: 'COMMON', basePrice: 450000, stats: { overall: 82, power: 75, speed: 95, stamina: 81, technique: 87, charisma: 79, defense: 74 }, finisher: '630 Senton', brand: 'SmackDown', signature: 'The One and Only', imageUrl: 'https://i.imgur.com/ricochet.png' },
    DOLPH_ZIGGLER: { id: 'DOLPH_ZIGGLER', name: 'Dolph Ziggler', rarity: 'COMMON', basePrice: 420000, stats: { overall: 81, power: 76, speed: 88, stamina: 83, technique: 85, charisma: 80, defense: 75 }, finisher: 'Zig Zag', brand: 'Raw', signature: 'The Showoff', imageUrl: 'https://i.imgur.com/ziggler.png' },
    BARON_CORBIN: { id: 'BARON_CORBIN', name: 'Baron Corbin', rarity: 'COMMON', basePrice: 430000, stats: { overall: 81, power: 87, speed: 76, stamina: 83, technique: 78, charisma: 74, defense: 84 }, finisher: 'End of Days', brand: 'SmackDown', signature: 'The Lone Wolf', imageUrl: 'https://i.imgur.com/corbin.png' }
};

const WRESTLERS_ARRAY = Object.values(WRESTLERS_DATABASE);

class PixelAnimationGenerator {
    static createWrestlingAnimation(moveType) {
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#2ECC71';
        ctx.fillRect(0, 0, 800, 600);
        const animations = {
            strike: () => this.drawStrike(ctx),
            grapple: () => this.drawGrapple(ctx),
            suplex: () => this.drawSuplex(ctx),
            ddt: () => this.drawDDT(ctx),
            powerbomb: () => this.drawPowerbomb(ctx),
            slam: () => this.drawSlam(ctx),
            submission: () => this.drawSubmission(ctx),
            finisher: () => this.drawFinisher(ctx)
        };
        if (animations[moveType]) animations[moveType]();
        return canvas.toBuffer();
    }
    static drawWrestler(ctx, x, y, color, flipped = false) {
        ctx.fillStyle = color;
        const scale = flipped ? -1 : 1;
        ctx.save();
        ctx.translate(flipped ? x + 40 : x, y);
        ctx.scale(scale, 1);
        ctx.fillRect(15, 0, 10, 10);
        ctx.fillRect(10, 10, 20, 15);
        ctx.fillRect(5, 25, 10, 20);
        ctx.fillRect(25, 25, 10, 20);
        ctx.fillRect(12, 45, 16, 25);
        ctx.fillRect(8, 70, 10, 25);
        ctx.fillRect(22, 70, 10, 25);
        ctx.restore();
    }
    static drawStrike(ctx) {
        this.drawWrestler(ctx, 150, 200, '#FF6B6B');
        this.drawWrestler(ctx, 550, 200, '#4ECDC4', true);
        ctx.fillStyle = '#FFD93D';
        ctx.beginPath();
        ctx.arc(400, 250, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 60px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('POW!', 330, 270);
    }
    static drawGrapple(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(280, 220, 40, 80);
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(320, 220, 40, 80);
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('GRAPPLE!', 300, 180);
    }
    static drawSuplex(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.save();
        ctx.translate(350, 300);
        ctx.rotate(-Math.PI / 4);
        ctx.fillRect(0, 0, 40, 80);
        ctx.restore();
        this.drawWrestler(ctx, 250, 250, '#4ECDC4');
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('SUPLEX!', 300, 150);
    }
    static drawDDT(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.save();
        ctx.translate(400, 350);
        ctx.rotate(Math.PI);
        ctx.fillRect(-20, -40, 40, 80);
        ctx.restore();
        this.drawWrestler(ctx, 300, 250, '#4ECDC4');
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('DDT!', 340, 180);
    }
    static drawPowerbomb(ctx) {
        this.drawWrestler(ctx, 300, 200, '#4ECDC4');
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(320, 150, 40, 50);
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('POWERBOMB!', 250, 120);
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#FFD93D';
            ctx.beginPath();
            ctx.arc(280 + i * 50, 400, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    static drawSlam(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(300, 400, 80, 40);
        this.drawWrestler(ctx, 280, 150, '#4ECDC4');
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(340, 200);
        ctx.lineTo(340, 380);
        ctx.stroke();
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('SLAM!', 320, 120);
    }
    static drawSubmission(ctx) {
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(280, 280, 60, 40);
        ctx.fillRect(290, 260, 40, 20);
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(320, 300, 80, 30);
        ctx.font = 'bold 50px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('LOCKED!', 280, 220);
    }
    static drawFinisher(ctx) {
        ctx.fillStyle = '#FFD93D';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 800, Math.random() * 600, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        this.drawWrestler(ctx, 300, 250, '#FF6B6B');
        ctx.fillStyle = '#4ECDC4';
        ctx.save();
        ctx.translate(450, 400);
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-20, -40, 40, 80);
        ctx.restore();
        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = '#FF0000';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 5;
        ctx.strokeText('FINISHER!', 220, 150);
        ctx.fillText('FINISHER!', 220, 150);
    }
}

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
        try {
            const wrestlerImg = await loadImage(wrestler.imageUrl);
            ctx.drawImage(wrestlerImg, 50, 100, 300, 300);
        } catch (error) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(50, 100, 300, 300);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 60px Arial';
            ctx.fillText(wrestler.name.charAt(0), 200, 270);
        }
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
                new ButtonBuilder().setCustomId('match_grapple').setLabel('🤼 Grapple').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_suplex').setLabel('🔄 Suplex').setStyle(ButtonStyle.Success).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_ddt').setLabel('⬇️ DDT').setStyle(ButtonStyle.Danger).setDisabled(disabled)
            );
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('match_powerbomb').setLabel('💣 Powerbomb').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_slam').setLabel('🌪️ Slam').setStyle(ButtonStyle.Success).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_submission').setLabel('🔒 Submission').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_special').setLabel('⚡ Special (30)').setStyle(ButtonStyle.Success).setDisabled(disabled)
            );
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('match_finisher').setLabel('🔥 FINISHER (70)').setStyle(ButtonStyle.Danger).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_rotate').setLabel('🔄 Rotate').setStyle(ButtonStyle.Primary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_rest').setLabel('💤 Rest').setStyle(ButtonStyle.Secondary).setDisabled(disabled),
                new ButtonBuilder().setCustomId('match_taunt').setLabel('😤 Taunt').setStyle(ButtonStyle.Secondary).setDisabled(disabled)
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
        switch (action) {
            case 'strike':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 8, 15, 10, 0.85, 5);
                result.message = `👊 Strike for ${result.damage} damage!`;
                animationType = 'strike';
                break;
            case 'grapple':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 10, 20, 15, 0.75, 8);
                result.message = `🤼 Grapple for ${result.damage} damage!`;
                animationType = 'grapple';
                break;
            case 'suplex':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 15, 25, 20, 0.70, 10);
                result.message = `🔄 SUPLEX for ${result.damage} damage!`;
                animationType = 'suplex';
                break;
            case 'ddt':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 12, 22, 18, 0.75, 9);
                result.message = `⬇️ DDT for ${result.damage} damage!`;
                animationType = 'ddt';
                break;
            case 'powerbomb':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 20, 30, 25, 0.65, 15);
                result.message = `💣 POWERBOMB for ${result.damage} damage!`;
                animationType = 'powerbomb';
                break;
            case 'slam':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 14, 24, 17, 0.70, 10);
                result.message = `🌪️ SLAM for ${result.damage} damage!`;
                animationType = 'slam';
                break;
            case 'submission':
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 10, 18, 15, 0.60, 12);
                result.message = `🔒 SUBMISSION for ${result.damage} damage!`;
                animationType = 'submission';
                break;
            case 'special':
                if (attacker.momentum < 30) return { success: false, message: `❌ Need 30 momentum! (Have ${attacker.momentum})` };
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 18, 28, 20, 1.0, 0);
                attacker.momentum -= 30;
                result.message = `⚡ SPECIAL for ${result.damage} damage!`;
                break;
            case 'finisher':
                if (attacker.momentum < 70) return { success: false, message: `❌ Need 70 momentum! (Have ${attacker.momentum})` };
                result = this.performMove(attackerWrestler, defenderWrestler, attacker, 30, 45, 30, 1.0, 0);
                attacker.momentum = 0;
                result.message = `🔥 FINISHER for ${result.damage} damage!`;
                animationType = 'finisher';
                break;
            case 'rest':
                const staminaGain = Utils.randomInt(20, 30);
                const healthGain = Utils.randomInt(10, 20);
                attackerWrestler.stamina = Math.min(100, attackerWrestler.stamina + staminaGain);
                attackerWrestler.health = Math.min(100, attackerWrestler.health + healthGain);
                result = { success: true, message: `💤 Rest! +${staminaGain} STA, +${healthGain} HP!` };
                break;
            case 'taunt':
                const momentumGain = Utils.randomInt(15, 25);
                attacker.momentum = Math.min(100, attacker.momentum + momentumGain);
                result = { success: true, message: `😤 Taunt! +${momentumGain} momentum!` };
                break;
            case 'rotate':
                result = this.rotateWrestler(attacker);
                break;
            default:
                return { success: false, message: 'Invalid action!' };
        }
        if (defenderWrestler.health <= 0 && !defenderWrestler.eliminated) {
            defenderWrestler.eliminated = true;
            const wrestlerData = Utils.getWrestler(defenderWrestler.wrestlerId);
            result.elimination = true;
            result.eliminatedWrestler = wrestlerData.name;
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
    performMove(attacker, defender, player, minDmg, maxDmg, stamina, hitChance, momentum) {
        if (attacker.stamina < stamina) return { success: false, damage: 0, message: '❌ Not enough stamina!' };
        if (Math.random() < hitChance) {
            const damage = Utils.randomInt(minDmg, maxDmg);
            attacker.stamina -= stamina;
            defender.health = Math.max(0, defender.health - damage);
            player.momentum = Math.min(100, player.momentum + momentum);
            return { success: true, damage };
        } else {
            attacker.stamina -= Math.floor(stamina / 2);
            return { success: false, damage: 0, message: '🛡️ Missed!' };
        }
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
            .setTitle('🤼 WWE 5v5 TAG TEAM MATCH!')
            .setDescription(`Turn ${match.turnNumber} | <@${match.currentTurn}>'s turn`)
            .addFields(
                {
                    name: `⭐ Player 1 - ${p1Alive}/5 Alive`,
                    value: `Active: ${p1Wrestler.name}\nHP: ${Utils.progressBar(p1Active.health, 100)}\nSTA: ${Utils.progressBar(p1Active.stamina, 100)}\nMOM: ${p1.momentum}/100`,
                    inline: true
                },
                { name: '⚔️', value: 'VS', inline: true },
                {
                    name: `⭐ Player 2 - ${p2Alive}/5 Alive`,
                    value: `Active: ${p2Wrestler.name}\nHP: ${Utils.progressBar(p2Active.health, 100)}\nSTA: ${Utils.progressBar(p2Active.stamina, 100)}\nMOM: ${p2.momentum}/100`,
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
            message.reply('❌ Error occurred!');
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
        .setTitle('🎉 WELCOME TO WWE 5v5!')
        .setDescription(`${message.author.username} - Your team is ready!`)
        .addFields({ name: '💰 Purse', value: Utils.formatCurrency(CONFIG.STARTING_PURSE), inline: true }, { name: '🤼 Team', value: '5 Wrestlers', inline: true });
    message.reply({ embeds: [embed] });
});

commandHandler.register('start', async (message, args) => {
    await commandHandler.commands.get('debut')(message, args);
});

commandHandler.register('drop', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ Use !debut first!');
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
        .addFields({ name: '💰 Value', value: Utils.formatCurrency(wrestler.basePrice) });
    message.reply({ embeds: [embed], files: [attachment] });
});

commandHandler.register('pack', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

commandHandler.register('open', async (message, args) => {
    await commandHandler.commands.get('drop')(message, args);
});

commandHandler.register('daily', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ Use !debut first!');
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
    const streakBonus = streak * 100;
    const reward = CONFIG.DAILY_REWARD + streakBonus;
    user.purse += reward;
    user.totalCoinsEarned += reward;
    user.lastDaily = now;
    user.dailyStreak = streak;
    await db.updateUser(userId, user);
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('📅 DAILY REWARD!')
        .addFields({ name: '💰 Reward', value: Utils.formatCurrency(reward), inline: true }, { name: '🔥 Streak', value: `${streak} days`, inline: true }, { name: '💼 Balance', value: Utils.formatCurrency(user.purse), inline: true });
    message.reply({ embeds: [embed] });
});

commandHandler.register('claim', async (message, args) => {
    await commandHandler.commands.get('daily')(message, args);
});

commandHandler.register('vote', async (message) => {
    const userId = message.author.id;
    const user = await db.getUser(userId);
    if (!user) return message.reply('❌ Use !debut first!');
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
    user.totalCoinsEarned += reward;
    user.lastVote = now;
    await db.updateUser(userId, user);
    message.reply(`🗳️ Thanks for voting! ${Utils.formatCurrency(reward)}`);
});

commandHandler.register('purse', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`💰 ${target.username}'s Purse`)
        .addFields({ name: '💼 Balance', value: Utils.formatCurrency(user.purse), inline: true }, { name: '📈 Level', value: `${user.level}`, inline: true }, { name: '🎴 Cards', value: `${user.squad.length}`, inline: true });
    message.reply({ embeds: [embed] });
});

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

commandHandler.register('squad', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    if (user.squad.length === 0) return message.reply('❌ No wrestlers!');
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`📦 ${target.username}'s Squad`)
        .setDescription(`Total: ${user.squad.length} wrestlers`);
    const displaySquad = user.squad.slice(0, 20);
    displaySquad.forEach((card, i) => {
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) embed.addFields({ name: `${i + 1}. ${w.name}`, value: `${Utils.getRarityEmoji(w.rarity)} ${w.rarity} | ${w.stats.overall}`, inline: true });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('roster', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

commandHandler.register('collection', async (message, args) => {
    await commandHandler.commands.get('squad')(message, args);
});

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
        .setTitle(`⭐ ${target.username}'s Playing 5`);
    user.playingXI.forEach((cardId, i) => {
        const card = user.squad.find(c => c.id === cardId);
        if (!card) return;
        const w = Utils.getWrestler(card.wrestlerId);
        if (w) embed.addFields({ name: `${i + 1}. ${w.name}`, value: `${Utils.getRarityEmoji(w.rarity)} OVR: ${w.stats.overall}`, inline: true });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('team', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

commandHandler.register('playingxi', async (message, args) => {
    await commandHandler.commands.get('xi')(message, args);
});

commandHandler.register('profile', async (message) => {
    const target = message.mentions.users.first() || message.author;
    const user = await db.getUser(target.id);
    if (!user) return message.reply(`❌ ${target.username} hasn't started!`);
    const winRate = user.matchesPlayed > 0 ? ((user.wins / user.matchesPlayed) * 100).toFixed(1) : 0;
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
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

commandHandler.register('stats', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

commandHandler.register('me', async (message, args) => {
    await commandHandler.commands.get('profile')(message, args);
});

commandHandler.register('leaderboard', async (message) => {
    const users = await db.loadData(DB_PATHS.USERS);
    const userArray = Object.values(users);
    const sorted = userArray.sort((a, b) => b.wins - a.wins);
    const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏆 LEADERBOARD')
        .setDescription('Top 10 by wins');
    sorted.slice(0, 10).forEach((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        embed.addFields({ name: `${medal} ${u.username}`, value: `${u.wins} wins | Level ${u.level}`, inline: false });
    });
    message.reply({ embeds: [embed] });
});

commandHandler.register('lb', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('top', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('rank', async (message, args) => {
    await commandHandler.commands.get('leaderboard')(message, args);
});

commandHandler.register('view', async (message, args) => {
    if (!args.length) return message.reply('❌ Specify wrestler!');
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    if (!wrestler) return message.reply('❌ Wrestler not found!');
    const embed = new EmbedBuilder()
        .setColor(Utils.getRarityColor(wrestler.rarity))
        .setTitle(`${Utils.getRarityEmoji(wrestler.rarity)} ${wrestler.name}`)
        .setDescription(`*"${wrestler.signature}"*`)
        .addFields(
            { name: '⭐ Overall', value: `${wrestler.stats.overall}`, inline: true },
            { name: '🏷️ Rarity', value: wrestler.rarity, inline: true },
            { name: '💰 Price', value: Utils.formatCurrency(wrestler.basePrice), inline: true },
            { name: '💪 Power', value: `${wrestler.stats.power}`, inline: true },
            { name: '⚡ Speed', value: `${wrestler.stats.speed}`, inline: true },
            { name: '🛡️ Defense', value: `${wrestler.stats.defense}`, inline: true },
            { name: '⚡ Finisher', value: wrestler.finisher }
        );
    message.reply({ embeds: [embed] });
});

commandHandler.register('show', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

commandHandler.register('card', async (message, args) => {
    await commandHandler.commands.get('view')(message, args);
});

commandHandler.register('buy', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ Use !debut first!');
    if (!args.length) return message.reply('❌ Specify wrestler!');
    const searchName = args.join(' ').toLowerCase();
    const wrestler = WRESTLERS_ARRAY.find(w => w.name.toLowerCase().includes(searchName));
    if (!wrestler) return message.reply('❌ Wrestler not found!');
    if (user.purse < wrestler.basePrice) return message.reply(`❌ Need ${Utils.formatCurrency(wrestler.basePrice)} but have ${Utils.formatCurrency(user.purse)}`);
    user.purse -= wrestler.basePrice;
    user.totalCoinsSpent += wrestler.basePrice;
    user.squad.push({ id: Utils.generateId(), wrestlerId: wrestler.id, acquiredAt: Date.now() });
    user.cardsOwned++;
    await db.updateUser(message.author.id, user);
    message.reply(`✅ Bought **${wrestler.name}** for ${Utils.formatCurrency(wrestler.basePrice)}!`);
});

commandHandler.register('purchase', async (message, args) => {
    await commandHandler.commands.get('buy')(message, args);
});

commandHandler.register('sell', async (message, args) => {
    const user = await db.getUser(message.author.id);
    if (!user) return message.reply('❌ Use !debut first!');
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

commandHandler.register('market', async (message, args) => {
    let wrestlers = WRESTLERS_ARRAY;
    let filterText = 'All Wrestlers';
    if (args.length > 0) {
        const rarity = args[0].toUpperCase();
        if (['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].includes(rarity)) {
            wrestlers = WRESTLERS_ARRAY.filter(w => w.rarity === rarity);
            filterText = `${rarity} Wrestlers`;
        }
    }
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🏪 MARKET')
        .setDescription(`${filterText} - Showing ${Math.min(wrestlers.length, 15)} of ${wrestlers.length}`);
    wrestlers.slice(0, 15).forEach(w => {
        embed.addFields({ name: `${Utils.getRarityEmoji(w.rarity)} ${w.name}`, value: `OVR: ${w.stats.overall} | ${Utils.formatCurrency(w.basePrice)}`, inline: true });
    });
    embed.setFooter({ text: 'Use !buy <wrestler>' });
    message.reply({ embeds: [embed] });
});

commandHandler.register('shop', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

commandHandler.register('store', async (message, args) => {
    await commandHandler.commands.get('market')(message, args);
});

commandHandler.register('play', async (message) => {
    const user1 = await db.getUser(message.author.id);
    if (!user1) return message.reply('❌ Use !debut first!');
    if (user1.playingXI.length < 5) return message.reply('❌ Need 5 wrestlers!');
    const opponent = message.mentions.users.first();
    if (!opponent) return message.reply('❌ Mention opponent!');
    if (opponent.bot) return message.reply('❌ Cannot battle bots!');
    const user2 = await db.getUser(opponent.id);
    if (!user2) return message.reply(`❌ ${opponent.username} hasn't started!`);
    if (user2.playingXI.length < 5) return message.reply(`❌ ${opponent.username} needs 5 wrestlers!`);
    const match = matchEngine.createMatch(message.author.id, opponent.id, message.channel.id);
    const p1Squad = user1.playingXI.map(cardId => user1.squad.find(c => c.id === cardId)).filter(c => c);
    const p2Squad = user2.playingXI.map(cardId => user2.squad.find(c => c.id === cardId)).filter(c => c);
    matchEngine.loadWrestlers(match, p1Squad, p2Squad);
    const embed = matchEngine.generateMatchEmbed(match);
    const buttons = UIComponents.createMatchButtons();
    const matchMsg = await message.reply({ content: `🤼 5v5 MATCH! ${message.author} vs ${opponent}\n<@${match.currentTurn}> your turn!`, embeds: [embed], components: buttons });
    match.messageId = matchMsg.id;
});

commandHandler.register('battle', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

commandHandler.register('fight', async (message, args) => {
    await commandHandler.commands.get('play')(message, args);
});

commandHandler.register('help', async (message) => {
    const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🤼 WWE BOT COMMANDS')
        .addFields(
            { name: '🎯 Start', value: '!debut, !start' },
            { name: '🎴 Cards', value: '!drop, !pack, !squad, !xi, !view <wrestler>' },
            { name: '💰 Economy', value: '!daily, !vote, !purse, !buy <wrestler>, !sell <wrestler>, !market' },
            { name: '⚔️ Battle', value: '!play @user - 8 moves: Strike, Grapple, Suplex, DDT, Powerbomb, Slam, Submission, Special, Finisher, Rotate, Rest, Taunt' },
            { name: '📊 Stats', value: '!profile, !stats, !leaderboard' }
        );
    message.reply({ embeds: [embed] });
});

commandHandler.register('commands', async (message, args) => {
    await commandHandler.commands.get('help')(message, args);
});

commandHandler.register('h', async (message, args) => {
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
        if (!matchId) return interaction.reply({ content: '❌ No active match!', ephemeral: true });
        const match = matchEngine.activeMatches.get(matchId);
        const result = matchEngine.executeAction(matchId, interaction.user.id, action);
        if (!result.success) return interaction.reply({ content: result.message, ephemeral: true });
        let files = [];
        if (result.animationType) {
            const animBuffer = PixelAnimationGenerator.createWrestlingAnimation(result.animationType);
            files = [new AttachmentBuilder(animBuffer, { name: 'animation.png' })];
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
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🏆 MATCH FINISHED!')
                .setDescription(`<@${winnerId}> WINS!`);
            await interaction.update({ content: `🏆 <@${winnerId}> WINS!`, embeds: [embed], components: [], files });
            matchEngine.activeMatches.delete(matchId);
        } else {
            const embed = matchEngine.generateMatchEmbed(result.match);
            const buttons = UIComponents.createMatchButtons();
            await interaction.update({ content: `${result.result.message}\n<@${result.match.currentTurn}> your turn!`, embeds: [embed], components: buttons, files });
        }
    }
});

client.on('ready', async () => {
    console.log(`✅ ${client.user.tag} is ONLINE!`);
    client.user.setActivity('!help | WWE 5v5', { type: 3 });
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
