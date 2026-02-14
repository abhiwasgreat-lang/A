"""
WWE DICE BATTLE - Discord Bot (Pydroid Compatible)
A comprehensive multiplayer wrestling dice game with 50+ features
Optimized for mobile Python environments like Pydroid
"""

import discord
from discord.ext import commands, tasks
import random
import asyncio
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import sqlite3
from collections import defaultdict
import time

# ==================== CONFIGURATION ====================

# Rate limiting configuration
RATE_LIMITS = {
    "match": 1,  # 1 match per minute
    "daily": 1,  # 1 daily claim per 24 hours
    "shop": 5,  # 5 shop actions per minute
    "trade": 3,  # 3 trades per hour
    "gacha": 10,  # 10 pulls per hour
}

# WWE GIF URLs (Tenor/GIPHY)
WWE_GIFS = {
    "win": [
        "https://media.tenor.com/eXs-ht5m9NQAAAAC/wwe-john-cena.gif",
        "https://media.tenor.com/zk3qPMVmY5QAAAAC/the-rock-wwe.gif",
        "https://media.tenor.com/JQg9BqvmixEAAAAC/stone-cold-steve-austin.gif",
    ],
    "lose": [
        "https://media.tenor.com/fXQ3_8hqJYcAAAAC/wwe-sad.gif",
        "https://media.tenor.com/9JlJfIQBjSkAAAAC/undertaker-wwe.gif",
    ],
    "fight": [
        "https://media.tenor.com/Y3eVKvXmPyQAAAAC/wwe-wrestling.gif",
        "https://media.tenor.com/X8l5qJqMd8EAAAAC/wwe-fight.gif",
        "https://media.tenor.com/sZ3mXPDRsYUAAAAC/wwe-smackdown.gif",
    ],
    "celebration": [
        "https://media.tenor.com/p9jqGLZm-iQAAAAC/wwe-celebration.gif",
        "https://media.tenor.com/vU8zMaIQ3LIAAAAC/triple-h-wwe.gif",
    ],
    "entrance": [
        "https://media.tenor.com/R0dK2VN7bDQAAAAC/wwe-entrance.gif",
        "https://media.tenor.com/qLjBxPWPfgQAAAAC/roman-reigns-wwe.gif",
    ],
    "finisher": [
        "https://media.tenor.com/R5xQJfKBbdQAAAAC/rko-randy-orton.gif",
        "https://media.tenor.com/xQ8YpJxaJpQAAAAC/john-cena-attitude-adjustment.gif",
    ],
    "elimination": [
        "https://media.tenor.com/yXf7h5vZQpQAAAAC/wwe-knockout.gif",
        "https://media.tenor.com/N8YoXqLJxYQAAAAC/wwe-pin.gif",
    ],
}

# ==================== DATABASE ====================

class Database:
    """SQLite database manager"""
    
    def __init__(self, db_path="wwe_dice_battle.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def init_database(self):
        """Initialize all database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                username TEXT,
                coins INTEGER DEFAULT 1000,
                gems INTEGER DEFAULT 0,
                experience INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                draws INTEGER DEFAULT 0,
                total_matches INTEGER DEFAULT 0,
                championship_wins INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_daily TIMESTAMP,
                last_weekly TIMESTAMP,
                win_streak INTEGER DEFAULT 0,
                best_streak INTEGER DEFAULT 0,
                total_eliminations INTEGER DEFAULT 0,
                total_points_scored INTEGER DEFAULT 0,
                prestige_level INTEGER DEFAULT 0,
                vip_status BOOLEAN DEFAULT 0,
                vip_expires TIMESTAMP
            )
        """)
        
        # Wrestlers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS wrestlers (
                wrestler_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT,
                opening_rating INTEGER,
                mid_rating INTEGER,
                finisher_rating INTEGER,
                is_powerhouse BOOLEAN,
                rarity TEXT,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0,
                matches_played INTEGER DEFAULT 0,
                wins INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                favorite BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        
        # Teams table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teams (
                team_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                team_name TEXT,
                wrestler1_id INTEGER,
                wrestler2_id INTEGER,
                wrestler3_id INTEGER,
                is_active BOOLEAN DEFAULT 0,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        
        # Match history
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS match_history (
                match_id INTEGER PRIMARY KEY AUTOINCREMENT,
                player1_id INTEGER,
                player2_id INTEGER,
                winner_id INTEGER,
                player1_score INTEGER,
                player2_score INTEGER,
                match_type TEXT,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Achievements
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_achievements (
                user_id INTEGER,
                achievement_name TEXT,
                unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, achievement_name)
            )
        """)
        
        # Inventory
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS inventory (
                user_id INTEGER,
                item_name TEXT,
                quantity INTEGER DEFAULT 1,
                PRIMARY KEY (user_id, item_name)
            )
        """)
        
        # Active boosts
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS active_boosts (
                user_id INTEGER,
                boost_type TEXT,
                expires_at TIMESTAMP,
                PRIMARY KEY (user_id, boost_type)
            )
        """)
        
        # Tournaments
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tournaments (
                tournament_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                status TEXT DEFAULT 'registration',
                prize_pool INTEGER,
                entry_fee INTEGER,
                participants TEXT,
                current_round INTEGER DEFAULT 0,
                winner_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Guilds
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS guild_wars (
                guild_id INTEGER PRIMARY KEY,
                guild_name TEXT,
                total_wins INTEGER DEFAULT 0,
                total_losses INTEGER DEFAULT 0,
                guild_points INTEGER DEFAULT 0,
                member_count INTEGER DEFAULT 0
            )
        """)
        
        # Betting
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bets (
                bet_id INTEGER PRIMARY KEY AUTOINCREMENT,
                bettor_id INTEGER,
                match_id INTEGER,
                bet_on_user INTEGER,
                amount INTEGER,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Daily quests
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_quests (
                user_id INTEGER,
                quest_type TEXT,
                progress INTEGER DEFAULT 0,
                completed BOOLEAN DEFAULT 0,
                date TEXT,
                PRIMARY KEY (user_id, quest_type, date)
            )
        """)
        
        # Trading
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trades (
                trade_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER,
                receiver_id INTEGER,
                sender_offer TEXT,
                receiver_offer TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()

# ==================== RATE LIMITER ====================

class RateLimiter:
    """Rate limiting system"""
    
    def __init__(self):
        self.user_cooldowns = defaultdict(lambda: defaultdict(float))
    
    def check_rate_limit(self, user_id: int, action: str) -> Tuple[bool, int]:
        """Check if user is rate limited"""
        now = time.time()
        last_action = self.user_cooldowns[user_id][action]
        
        cooldowns = {
            "match": 60,  # 1 minute
            "daily": 86400,  # 24 hours
            "shop": 12,  # 12 seconds
            "trade": 1200,  # 20 minutes
            "gacha": 360,  # 6 minutes
            "command": 3,  # 3 seconds
        }
        
        cooldown = cooldowns.get(action, 5)
        
        if now - last_action < cooldown:
            remaining = int(cooldown - (now - last_action))
            return False, remaining
        
        self.user_cooldowns[user_id][action] = now
        return True, 0

# ==================== GAME CLASSES ====================

class Wrestler:
    """Wrestler class"""
    def __init__(self, wrestler_id, user_id, name, opening_rating, mid_rating, 
                 finisher_rating, is_powerhouse, rarity, level=1):
        self.wrestler_id = wrestler_id
        self.user_id = user_id
        self.name = name
        self.opening_rating = opening_rating
        self.mid_rating = mid_rating
        self.finisher_rating = finisher_rating
        self.is_powerhouse = is_powerhouse
        self.rarity = rarity
        self.level = level
        self.is_active = True
        self.shield_active = False
    
    def overall_rating(self):
        bonus = (self.level - 1) * 2
        return int((self.opening_rating + self.mid_rating + self.finisher_rating) / 3) + bonus
    
    def get_emoji(self):
        emojis = {
            "common": "⚪",
            "uncommon": "🟢",
            "rare": "🔵",
            "epic": "🟣",
            "legendary": "🟡"
        }
        return emojis.get(self.rarity, "⚪")

class Team:
    """Team class"""
    def __init__(self, team_id, user_id, team_name, wrestlers):
        self.team_id = team_id
        self.user_id = user_id
        self.team_name = team_name
        self.wrestlers = wrestlers
        self.score = 0
        self.eliminations = 0
        self.lucky_charm_active = False
        self.shield_tokens = 0
    
    def get_phase_rating(self, phase: str) -> float:
        active = [w for w in self.wrestlers if w.is_active]
        if not active:
            return 0
        
        if phase == "opening":
            return sum(w.opening_rating for w in active) / len(active)
        elif phase == "middle":
            return sum(w.mid_rating for w in active) / len(active)
        else:
            return sum(w.finisher_rating for w in active) / len(active)
    
    def has_powerhouse(self) -> bool:
        return any(w.is_powerhouse and w.is_active for w in self.wrestlers)
    
    def active_count(self) -> int:
        return sum(1 for w in self.wrestlers if w.is_active)

# ==================== MATCH ENGINE ====================

class MatchEngine:
    """Core match engine with all game logic"""
    
    PHASES = {
        "opening": {"rounds": 6, "baseline": 8, "name": "Opening Brawl 🥊"},
        "middle": {"rounds": 10, "baseline": 8, "name": "Mid-Match Warfare ⚔️"},
        "finisher": {"rounds": 4, "baseline": 10, "name": "Finisher Sequence 💥"}
    }
    
    def __init__(self, team1: Team, team2: Team):
        self.team1 = team1
        self.team2 =2
        self.current_phase = None
        self.round_number = 0
        self.match_log = []
    
    def roll_dice(self, count: int, lucky: bool = False) -> List[int]:
        """Roll dice with optional lucky bonus"""
        rolls = [random.randint(1, 6) for _ in range(count)]
        if lucky and random.random() < 0.1:  # 10% chance to reroll lowest
            rolls.remove(min(rolls))
            rolls.append(random.randint(1, 6))
        return rolls
    
    def determine_dice_count(self, attacking_team: Team, defending_team: Team, phase: str) -> Tuple[int, int]:
        """Determine dice count based on ratings"""
        att_rating = attacking_team.get_phase_rating(phase)
        def_rating = defending_team.get_phase_rating(phase)
        rating_diff = abs(att_rating - def_rating)
        
        if rating_diff > 20:
            return (4, 1) if att_rating > def_rating else (1, 4)
        else:
            return (3, 2) if att_rating > def_rating else (2, 3)
    
    def check_elimination(self, att_rolls: List[int], def_rolls: List[int]) -> Tuple[bool, List[int]]:
        """Check for matching dice (elimination)"""
        matches = list(set(att_rolls) & set(def_rolls))
        return len(matches) > 0, matches
    
    def calculate_points(self, att_rolls: List[int], def_rolls: List[int], 
                        baseline: int, has_powerhouse: bool) -> Tuple[int, bool]:
        """Calculate points for the round"""
        if has_powerhouse:
            baseline += 2
        
        att_top2 = sorted(att_rolls, reverse=True)[:2]
        def_top2 = sorted(def_rolls, reverse=True)[:2]
        
        att_total = sum(att_top2)
        def_total = sum(def_top2)
        
        difference = abs(att_total - def_total)
        
        if att_total > def_total:
            return baseline + difference, True
        else:
            return max(0, baseline - difference), False
    
    async def play_round(self, attacking_team: Team, defending_team: Team, 
                        phase: str, channel) -> Dict:
        """Play a single round"""
        self.round_number += 1
        baseline = self.PHASES[phase]["baseline"]
        
        # Determine dice
        att_dice, def_dice = self.determine_dice_count(attacking_team, defending_team, phase)
        
        # Roll dice
        att_rolls = self.roll_dice(att_dice, attacking_team.lucky_charm_active)
        def_rolls = self.roll_dice(def_dice, defending_team.lucky_charm_active)
        
        # Calculate points
        points, att_won = self.calculate_points(
            att_rolls, def_rolls, baseline, attacking_team.has_powerhouse()
        )
        
        # Check elimination
        elimination, matching_dice = self.check_elimination(att_rolls, def_rolls)
        
        result = {
            "round": self.round_number,
            "phase": phase,
            "att_team": attacking_team.team_name,
            "def_team": defending_team.team_name,
            "att_rolls": att_rolls,
            "def_rolls": def_rolls,
            "points": points,
            "att_won": att_won,
            "elimination": elimination,
            "matching_dice": matching_dice,
            "eliminated_wrestler": None
        }
        
        # Add points
        attacking_team.score += points
        
        # Handle elimination
        if elimination:
            active_wrestlers = [w for w in attacking_team.wrestlers if w.is_active]
            
            # Check for shield protection
            if attacking_team.shield_tokens > 0:
                attacking_team.shield_tokens -= 1
                result["shield_used"] = True
            elif active_wrestlers:
                # Priority: Powerhouse -> Random
                if attacking_team.has_powerhouse():
                    powerhouse = next(w for w in attacking_team.wrestlers if w.is_powerhouse and w.is_active)
                    powerhouse.is_active = False
                    result["eliminated_wrestler"] = powerhouse.name
                else:
                    eliminated = random.choice(active_wrestlers)
                    eliminated.is_active = False
                    result["eliminated_wrestler"] = eliminated.name
                
                defending_team.eliminations += 1
        
        self.match_log.append(result)
        return result
    
    async def create_round_embed(self, result: Dict) -> discord.Embed:
        """Create embed for round result"""
        phase_name = self.PHASES[result["phase"]]["name"]
        
        if result["att_won"]:
            color = discord.Color.green()
            title = f"🏆 Round {result['round']} - {phase_name}"
        else:
            color = discord.Color.red()
            title = f"🛡️ Round {result['round']} - {phase_name}"
        
        embed = discord.Embed(title=title, color=color)
        
        # Dice rolls
        att_dice_str = " ".join([f"🎲{d}" for d in result["att_rolls"]])
        def_dice_str = " ".join([f"🎲{d}" for d in result["def_rolls"]])
        
        embed.add_field(
            name=f"⚔️ {result['att_team']}",
            value=f"Rolls: {att_dice_str}\nTop 2: {sum(sorted(result['att_rolls'], reverse=True)[:2])}",
            inline=True
        )
        
        embed.add_field(
            name=f"🛡️ {result['def_team']}",
            value=f"Rolls: {def_dice_str}\nTop 2: {sum(sorted(result['def_rolls'], reverse=True)[:2])}",
            inline=True
        )
        
        embed.add_field(
            name="📊 Points Scored",
            value=f"**{result['points']} points**",
            inline=False
        )
        
        # Elimination info
        if result["elimination"]:
            if result.get("shield_used"):
                embed.add_field(
                    name="🛡️ Shield Active!",
                    value="Wrestler protected from elimination!",
                    inline=False
                )
            elif result["eliminated_wrestler"]:
                embed.add_field(
                    name="💀 Elimination!",
                    value=f"**{result['eliminated_wrestler']}** has been eliminated!\nMatching dice: {result['matching_dice']}",
                    inline=False
                )
        
        # Add random GIF
        gif_url = random.choice(WWE_GIFS["fight"])
        embed.set_image(url=gif_url)
        
        return embed

# ==================== DISCORD BOT ====================

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents, help_command=None)
db = Database()
rate_limiter = RateLimiter()

# Active matches storage
active_matches = {}
pending_challenges = {}

# ==================== HELPER FUNCTIONS ====================

def get_or_create_user(user_id: int, username: str):
    """Get or create user in database"""
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        cursor.execute("""
            INSERT INTO users (user_id, username, coins, gems)
            VALUES (?, ?, 1000, 10)
        """, (user_id, username))
        conn.commit()
    
    conn.close()

def get_user_stats(user_id: int) -> Dict:
    """Get user statistics"""
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT coins, gems, experience, level, wins, losses, draws,
               total_matches, win_streak, best_streak, total_eliminations
        FROM users WHERE user_id = ?
    """, (user_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return {
            "coins": result[0],
            "gems": result[1],
            "experience": result[2],
            "level": result[3],
            "wins": result[4],
            "losses": result[5],
            "draws": result[6],
            "total_matches": result[7],
            "win_streak": result[8],
            "best_streak": result[9],
            "eliminations": result[10]
        }
    return None

def update_user_coins(user_id: int, amount: int):
    """Update user coins"""
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET coins = coins + ? WHERE user_id = ?", (amount, user_id))
    conn.commit()
    conn.close()

def create_wrestler(user_id: int, name: str, rarity: str = "common") -> Wrestler:
    """Create a new wrestler"""
    rarity_stats = {
        "common": (60, 75),
        "uncommon": (70, 85),
        "rare": (80, 92),
        "epic": (88, 97),
        "legendary": (95, 100)
    }
    
    min_stat, max_stat = rarity_stats.get(rarity, (60, 75))
    
    opening = random.randint(min_stat, max_stat)
    mid = random.randint(min_stat, max_stat)
    finisher = random.randint(min_stat, max_stat)
    is_powerhouse = random.random() < 0.15  # 15% chance
    
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO wrestlers (user_id, name, opening_rating, mid_rating, finisher_rating,
                              is_powerhouse, rarity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (user_id, name, opening, mid, finisher, is_powerhouse, rarity))
    
    wrestler_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return Wrestler(wrestler_id, user_id, name, opening, mid, finisher, is_powerhouse, rarity)

def get_user_wrestlers(user_id: int) -> List[Wrestler]:
    """Get all user's wrestlers"""
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT wrestler_id, user_id, name, opening_rating, mid_rating, finisher_rating,
               is_powerhouse, rarity, level
        FROM wrestlers WHERE user_id = ?
        ORDER BY level DESC, rarity DESC
    """, (user_id,))
    
    wrestlers = []
    for row in cursor.fetchall():
        wrestlers.append(Wrestler(*row))
    
    conn.close()
    return wrestlers

def get_user_active_team(user_id: int) -> Optional[Team]:
    """Get user's active team"""
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT team_id, team_name, wrestler1_id, wrestler2_id, wrestler3_id
        FROM teams WHERE user_id = ? AND is_active = 1
    """, (user_id,))
    
    result = cursor.fetchone()
    
    if not result:
        conn.close()
        return None
    
    team_id, team_name, w1_id, w2_id, w3_id = result
    
    # Get wrestlers
    wrestlers = []
    for wid in [w1_id, w2_id, w3_id]:
        cursor.execute("""
            SELECT wrestler_id, user_id, name, opening_rating, mid_rating, finisher_rating,
                   is_powerhouse, rarity, level
            FROM wrestlers WHERE wrestler_id = ?
        """, (wid,))
        row = cursor.fetchone()
        if row:
            wrestlers.append(Wrestler(*row))
    
    conn.close()
    
    if len(wrestlers) == 3:
        return Team(team_id, user_id, team_name, wrestlers)
    return None

# ==================== BOT EVENTS ====================

@bot.event
async def on_ready():
    """Bot startup"""
    print(f'✅ {bot.user} is ready!')
    print(f'📊 Connected to {len(bot.guilds)} servers')
    print(f'🎮 Bot is online and ready to play!')
    print(f'💡 Use !help to see all commands')
    print(f'🔧 Prefix: !')
    
    # Set bot status
    await bot.change_presence(
        activity=discord.Game(name="WWE Dice Battle | !help")
    )

@bot.event
async def on_command_error(ctx, error):
    """Global error handler"""
    if isinstance(error, commands.CommandOnCooldown):
        await ctx.send(f"⏳ Slow down! Try again in {error.retry_after:.1f} seconds.")
    elif isinstance(error, commands.MissingRequiredArgument):
        await ctx.send(f"❌ Missing argument: {error.param.name}")
    else:
        await ctx.send(f"❌ An error occurred: {str(error)}")

# ==================== CORE COMMANDS ====================

@bot.command(name="start", help="Start your WWE Dice Battle journey!")
async def start(ctx):
    """Initialize new player"""
    user_id = ctx.author.id
    username = str(ctx.author)
    
    get_or_create_user(user_id, username)
    
    # Check if user has wrestlers
    wrestlers = get_user_wrestlers(user_id)
    
    if not wrestlers:
        # Create 3 starter wrestlers
        names = ["Thunder", "Blaze", "Shadow"]
        for name in names:
            create_wrestler(user_id, name, "common")
        
        embed = discord.Embed(
            title="🎉 Welcome to WWE Dice Battle!",
            description="Your journey begins! You've received 3 starter wrestlers!",
            color=discord.Color.gold()
        )
        embed.add_field(name="💰 Starting Coins", value="1,000", inline=True)
        embed.add_field(name="💎 Starting Gems", value="10", inline=True)
        embed.add_field(name="👤 Wrestlers", value="3 Common", inline=True)
        
        embed.add_field(
            name="📖 Next Steps",
            value="• `!profile` - View your stats\n• `!wrestlers` - View your roster\n• `!team create` - Create a team\n• `!help` - See all commands",
            inline=False
        )
        
        gif_url = random.choice(WWE_GIFS["entrance"])
        embed.set_image(url=gif_url)
        
        await ctx.send(embed=embed)
    else:
        await ctx.send("✅ You're already registered! Use `!help` to see available commands.")

@bot.command(name="profile", help="View your profile and stats")
@commands.cooldown(1, 5, commands.BucketType.user)
async def profile(ctx, member: discord.Member = None):
    """Display user profile"""
    target = member or ctx.author
    user_id = target.id
    
    stats = get_user_stats(user_id)
    
    if not stats:
        await ctx.send("❌ User not found. Use `!start` to begin!")
        return
    
    # Calculate win rate
    total = stats["total_matches"]
    win_rate = (stats["wins"] / total * 100) if total > 0 else 0
    
    embed = discord.Embed(
        title=f"👤 {target.display_name}'s Profile",
        color=discord.Color.blue()
    )
    
    embed.set_thumbnail(url=target.avatar.url if target.avatar else target.default_avatar.url)
    
    embed.add_field(name="💰 Coins", value=f"{stats['coins']:,}", inline=True)
    embed.add_field(name="💎 Gems", value=f"{stats['gems']:,}", inline=True)
    embed.add_field(name="⭐ Level", value=f"{stats['level']}", inline=True)
    
    embed.add_field(name="🏆 Wins", value=f"{stats['wins']}", inline=True)
    embed.add_field(name="💀 Losses", value=f"{stats['losses']}", inline=True)
    embed.add_field(name="🤝 Draws", value=f"{stats['draws']}", inline=True)
    
    embed.add_field(name="📊 Win Rate", value=f"{win_rate:.1f}%", inline=True)
    embed.add_field(name="🔥 Streak", value=f"{stats['win_streak']}", inline=True)
    embed.add_field(name="⚡ Eliminations", value=f"{stats['eliminations']}", inline=True)
    
    embed.set_footer(text=f"Total Matches: {stats['total_matches']}")
    
    await ctx.send(embed=embed)

@bot.command(name="wrestlers", help="View your wrestler collection")
@commands.cooldown(1, 5, commands.BucketType.user)
async def wrestlers(ctx):
    """Display user's wrestlers"""
    user_id = ctx.author.id
    wrestlers = get_user_wrestlers(user_id)
    
    if not wrestlers:
        await ctx.send("❌ You don't have any wrestlers! Use `!start` to begin.")
        return
    
    embed = discord.Embed(
        title=f"🥊 {ctx.author.display_name}'s Wrestlers",
        description=f"Total: {len(wrestlers)} wrestlers",
        color=discord.Color.purple()
    )
    
    for i, w in enumerate(wrestlers[:10], 1):  # Show first 10
        powerhouse = " 💪" if w.is_powerhouse else ""
        embed.add_field(
            name=f"{i}. {w.get_emoji()} {w.name}{powerhouse}",
            value=f"Overall: {w.overall_rating()} | Level: {w.level}\nOpen: {w.opening_rating} | Mid: {w.mid_rating} | Finish: {w.finisher_rating}",
            inline=False
        )
    
    if len(wrestlers) > 10:
        embed.set_footer(text=f"Showing 10 of {len(wrestlers)} wrestlers. Use !wrestler <name> for details.")
    
    await ctx.send(embed=embed)

@bot.command(name="team", help="Manage your teams")
async def team(ctx, action: str = None, *args):
    """Team management"""
    user_id = ctx.author.id
    
    if action == "create":
        if len(args) < 4:
            await ctx.send("❌ Usage: `!team create <team_name> <wrestler1> <wrestler2> <wrestler3>`")
            return
        
        team_name = args[0]
        wrestler_names = args[1:4]
        
        # Get user wrestlers
        all_wrestlers = get_user_wrestlers(user_id)
        
        # Find requested wrestlers
        selected = []
        for name in wrestler_names:
            found = next((w for w in all_wrestlers if w.name.lower() == name.lower()), None)
            if found:
                selected.append(found)
            else:
                await ctx.send(f"❌ Wrestler '{name}' not found!")
                return
        
        if len(selected) != 3:
            await ctx.send("❌ You need exactly 3 wrestlers!")
            return
        
        # Create team
        conn = db.get_connection()
        cursor = conn.cursor()
        
        # Deactivate old active team
        cursor.execute("UPDATE teams SET is_active = 0 WHERE user_id = ?", (user_id,))
        
        cursor.execute("""
            INSERT INTO teams (user_id, team_name, wrestler1_id, wrestler2_id, wrestler3_id, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        """, (user_id, team_name, selected[0].wrestler_id, selected[1].wrestler_id, selected[2].wrestler_id))
        
        conn.commit()
        conn.close()
        
        embed = discord.Embed(
            title="✅ Team Created!",
            description=f"Team '{team_name}' is now active!",
            color=discord.Color.green()
        )
        
        for i, w in enumerate(selected, 1):
            powerhouse = " 💪" if w.is_powerhouse else ""
            embed.add_field(
                name=f"{i}. {w.get_emoji()} {w.name}{powerhouse}",
                value=f"Overall: {w.overall_rating()}",
                inline=True
            )
        
        await ctx.send(embed=embed)
    
    elif action == "view":
        team = get_user_active_team(user_id)
        
        if not team:
            await ctx.send("❌ You don't have an active team! Use `!team create` to make one.")
            return
        
        embed = discord.Embed(
            title=f"👥 {team.team_name}",
            description="Your active team",
            color=discord.Color.blue()
        )
        
        for i, w in enumerate(team.wrestlers, 1):
            powerhouse = " 💪" if w.is_powerhouse else ""
            embed.add_field(
                name=f"{i}. {w.get_emoji()} {w.name}{powerhouse}",
                value=f"Overall: {w.overall_rating()} | Level: {w.level}\nOpen: {w.opening_rating} | Mid: {w.mid_rating} | Finish: {w.finisher_rating}",
                inline=False
            )
        
        avg_rating = sum(w.overall_rating() for w in team.wrestlers) / 3
        embed.set_footer(text=f"Team Average: {avg_rating:.1f}")
        
        await ctx.send(embed=embed)
    
    else:
        await ctx.send("❌ Usage: `!team create <name> <w1> <w2> <w3>` or `!team view`")

@bot.command(name="challenge", help="Challenge another player to a match!")
async def challenge(ctx, opponent: discord.Member):
    """Challenge another player"""
    challenger_id = ctx.author.id
    opponent_id = opponent.id
    
    # Rate limit check
    can_challenge, remaining = rate_limiter.check_rate_limit(challenger_id, "match")
    if not can_challenge:
        await ctx.send(f"⏳ You're on cooldown! Try again in {remaining} seconds.")
        return
    
    if challenger_id == opponent_id:
        await ctx.send("❌ You can't challenge yourself!")
        return
    
    if opponent.bot:
        await ctx.send("❌ You can't challenge a bot!")
        return
    
    # Check if both have active teams
    challenger_team = get_user_active_team(challenger_id)
    opponent_team = get_user_active_team(opponent_id)
    
    if not challenger_team:
        await ctx.send("❌ You don't have an active team! Use `!team create` first.")
        return
    
    if not opponent_team:
        await ctx.send(f"❌ {opponent.display_name} doesn't have an active team!")
        return
    
    # Create challenge
    challenge_id = f"{challenger_id}_{opponent_id}_{int(time.time())}"
    pending_challenges[challenge_id] = {
        "challenger": challenger_id,
        "opponent": opponent_id,
        "channel": ctx.channel.id,
        "expires": time.time() + 300  # 5 minute expiry
    }
    
    embed = discord.Embed(
        title="⚔️ Match Challenge!",
        description=f"{ctx.author.mention} has challenged {opponent.mention}!",
        color=discord.Color.orange()
    )
    
    embed.add_field(
        name="🔴 Challenger",
        value=f"{challenger_team.team_name}\nAvg Rating: {sum(w.overall_rating() for w in challenger_team.wrestlers) / 3:.1f}",
        inline=True
    )
    
    embed.add_field(
        name="🔵 Opponent",
        value=f"{opponent_team.team_name}\nAvg Rating: {sum(w.overall_rating() for w in opponent_team.wrestlers) / 3:.1f}",
        inline=True
    )
    
    embed.add_field(
        name="⏰ How to Accept",
        value=f"{opponent.mention} type `!accept` to start the match!\nChallenge expires in 5 minutes.",
        inline=False
    )
    
    gif_url = random.choice(WWE_GIFS["entrance"])
    embed.set_image(url=gif_url)
    
    await ctx.send(embed=embed)

@bot.command(name="accept", help="Accept a pending match challenge")
async def accept(ctx):
    """Accept a challenge"""
    user_id = ctx.author.id
    
    # Find pending challenge
    challenge = None
    challenge_id = None
    
    for cid, data in pending_challenges.items():
        if data["opponent"] == user_id and data["channel"] == ctx.channel.id:
            if time.time() < data["expires"]:
                challenge = data
                challenge_id = cid
                break
    
    if not challenge:
        await ctx.send("❌ No pending challenges found or challenge expired!")
        return
    
    # Remove from pending
    del pending_challenges[challenge_id]
    
    # Start match
    await start_match(ctx, challenge["challenger"], user_id)

async def start_match(ctx, player1_id: int, player2_id: int):
    """Start a match between two players"""
    # Get teams
    team1 = get_user_active_team(player1_id)
    team2 = get_user_active_team(player2_id)
    
    if not team1 or not team2:
        await ctx.send("❌ Error: One or both teams not found!")
        return
    
    # Create match engine
    engine = MatchEngine(team1, team2)
    
    # Announcement
    embed = discord.Embed(
        title="🏆 WWE DICE BATTLE - MATCH START!",
        description=f"**{team1.team_name}** vs **{team2.team_name}**",
        color=discord.Color.gold()
    )
    
    embed.add_field(name="🔴 Team 1", value=team1.team_name, inline=True)
    embed.add_field(name="VS", value="⚔️", inline=True)
    embed.add_field(name="🔵 Team 2", value=team2.team_name, inline=True)
    
    gif_url = random.choice(WWE_GIFS["fight"])
    embed.set_image(url=gif_url)
    
    await ctx.send(embed=embed)
    await asyncio.sleep(2)
    
    # Play all phases
    first_attacker = random.choice([team1, team2])
    
    for phase in ["opening", "middle", "finisher"]:
        phase_data = MatchEngine.PHASES[phase]
        
        # Phase announcement
        phase_embed = discord.Embed(
            title=f"📢 {phase_data['name']}",
            description=f"Starting {phase_data['rounds']} rounds!",
            color=discord.Color.purple()
        )
        await ctx.send(embed=phase_embed)
        await asyncio.sleep(1)
        
        # Play rounds
        attacking_team = first_attacker
        defending_team = team2 if attacking_team == team1 else team1
        
        for _ in range(phase_data["rounds"]):
            result = await engine.play_round(attacking_team, defending_team, phase, ctx.channel)
            
            # Create and send round embed
            round_embed = await engine.create_round_embed(result)
            await ctx.send(embed=round_embed)
            await asyncio.sleep(3)
            
            # Switch teams
            attacking_team, defending_team = defending_team, attacking_team
    
    # Match end
    await end_match(ctx, team1, team2, player1_id, player2_id)

async def end_match(ctx, team1: Team, team2: Team, player1_id: int, player2_id: int):
    """End match and distribute rewards"""
    
    # Determine winner
    if team1.score > team2.score:
        winner_id = player1_id
        winner_team = team1
        loser_id = player2_id
        loser_team = team2
    elif team2.score > team1.score:
        winner_id = player2_id
        winner_team = team2
        loser_id = player1_id
        loser_team = team1
    else:
        winner_id = None
        winner_team = None
        loser_id = None
        loser_team = None
    
    # Create final embed
    embed = discord.Embed(
        title="🏁 MATCH COMPLETE!",
        color=discord.Color.gold()
    )
    
    embed.add_field(
        name=f"🔴 {team1.team_name}",
        value=f"Score: **{team1.score}**\nEliminations: {team1.eliminations}\nSurvivors: {team1.active_count()}/3",
        inline=True
    )
    
    embed.add_field(name="VS", value="⚔️", inline=True)
    
    embed.add_field(
        name=f"🔵 {team2.team_name}",
        value=f"Score: **{team2.score}**\nEliminations: {team2.eliminations}\nSurvivors: {team2.active_count()}/3",
        inline=True
    )
    
    if winner_id:
        winner_user = await bot.fetch_user(winner_id)
        embed.add_field(
            name="🏆 WINNER",
            value=f"**{winner_team.team_name}** ({winner_user.display_name})",
            inline=False
        )
        
        # Rewards
        winner_coins = 500 + (winner_team.score * 10)
        loser_coins = 100 + (loser_team.score * 5)
        winner_xp = 100
        loser_xp = 50
        
        update_user_coins(winner_id, winner_coins)
        update_user_coins(loser_id, loser_coins)
        
        embed.add_field(
            name="💰 Rewards",
            value=f"Winner: +{winner_coins} coins, +{winner_xp} XP\nLoser: +{loser_coins} coins, +{loser_xp} XP",
            inline=False
        )
        
        # Update stats
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE users 
            SET wins = wins + 1, total_matches = total_matches + 1,
                win_streak = win_streak + 1, experience = experience + ?
            WHERE user_id = ?
        """, (winner_xp, winner_id))
        
        cursor.execute("""
            UPDATE users 
            SET losses = losses + 1, total_matches = total_matches + 1,
                win_streak = 0, experience = experience + ?
            WHERE user_id = ?
        """, (loser_xp, loser_id))
        
        # Record match
        cursor.execute("""
            INSERT INTO match_history (player1_id, player2_id, winner_id, player1_score, player2_score, match_type)
            VALUES (?, ?, ?, ?, ?, 'ranked')
        """, (player1_id, player2_id, winner_id, team1.score, team2.score))
        
        conn.commit()
        conn.close()
        
        gif_url = random.choice(WWE_GIFS["celebration"])
    else:
        embed.add_field(name="🤝 RESULT", value="**IT'S A DRAW!**", inline=False)
        
        # Draw rewards
        draw_coins = 250
        update_user_coins(player1_id, draw_coins)
        update_user_coins(player2_id, draw_coins)
        
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET draws = draws + 1, total_matches = total_matches + 1 WHERE user_id IN (?, ?)", 
                      (player1_id, player2_id))
        conn.commit()
        conn.close()
        
        gif_url = random.choice(WWE_GIFS["fight"])
    
    embed.set_image(url=gif_url)
    await ctx.send(embed=embed)

# ==================== ECONOMY COMMANDS ====================

@bot.command(name="daily", help="Claim your daily reward!")
async def daily(ctx):
    """Daily rewards"""
    user_id = ctx.author.id
    
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT last_daily, win_streak FROM users WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    
    if not result:
        await ctx.send("❌ User not found. Use `!start` first!")
        conn.close()
        return
    
    last_daily, streak = result
    
    now = datetime.now()
    
    if last_daily:
        last_claim = datetime.fromisoformat(last_daily)
        if (now - last_claim).total_seconds() < 86400:  # 24 hours
            remaining = 86400 - (now - last_claim).total_seconds()
            hours = int(remaining // 3600)
            minutes = int((remaining % 3600) // 60)
            await ctx.send(f"⏳ Daily already claimed! Come back in {hours}h {minutes}m")
            conn.close()
            return
    
    # Calculate rewards
    base_coins = 500
    streak_bonus = min(streak * 50, 500)  # Max 500 bonus
    total_coins = base_coins + streak_bonus
    gems = 5
    
    cursor.execute("""
        UPDATE users 
        SET coins = coins + ?, gems = gems + ?, last_daily = ?
        WHERE user_id = ?
    """, (total_coins, gems, now.isoformat(), user_id))
    
    conn.commit()
    conn.close()
    
    embed = discord.Embed(
        title="🎁 Daily Reward Claimed!",
        color=discord.Color.green()
    )
    
    embed.add_field(name="💰 Coins", value=f"+{total_coins}", inline=True)
    embed.add_field(name="💎 Gems", value=f"+{gems}", inline=True)
    embed.add_field(name="🔥 Streak Bonus", value=f"+{streak_bonus}", inline=True)
    
    embed.set_footer(text="Come back tomorrow for more rewards!")
    
    await ctx.send(embed=embed)

@bot.command(name="shop", help="Browse the shop")
async def shop(ctx):
    """Display shop"""
    embed = discord.Embed(
        title="🏪 WWE Dice Battle Shop",
        description="Use `!buy <item_name>` to purchase",
        color=discord.Color.gold()
    )
    
    items = {
        "Wrestler Pack": {"price": 1000, "gem_price": 10, "desc": "Random wrestler (Common-Rare)"},
        "Epic Pack": {"price": 2500, "gem_price": 25, "desc": "Random Epic wrestler"},
        "Legendary Pack": {"price": 5000, "gem_price": 50, "desc": "Random Legendary wrestler"},
        "XP Boost": {"price": 500, "gem_price": 5, "desc": "+50% XP for 24h"},
        "Coin Boost": {"price": 800, "gem_price": 8, "desc": "2x coins for 12h"},
        "Shield Token": {"price": 1200, "gem_price": 12, "desc": "Protect 1 wrestler"},
        "Lucky Charm": {"price": 600, "gem_price": 6, "desc": "Better dice for 1 match"},
        "Stat Reroll": {"price": 1000, "gem_price": 10, "desc": "Reroll wrestler stats"},
    }
    
    for name, data in items.items():
        embed.add_field(
            name=name,
            value=f"{data['desc']}\n💰 {data['price']} coins | 💎 {data['gem_price']} gems",
            inline=False
        )
    
    await ctx.send(embed=embed)

@bot.command(name="buy", help="Buy an item from the shop")
async def buy(ctx, *, item_name: str):
    """Purchase shop item"""
    user_id = ctx.author.id
    
    # Rate limit
    can_buy, remaining = rate_limiter.check_rate_limit(user_id, "shop")
    if not can_buy:
        await ctx.send(f"⏳ Slow down! Wait {remaining} seconds.")
        return
    
    shop_items = {
        "wrestler pack": {"price": 1000, "type": "pack", "rarity": "random"},
        "epic pack": {"price": 2500, "type": "pack", "rarity": "epic"},
        "legendary pack": {"price": 5000, "type": "pack", "rarity": "legendary"},
        "xp boost": {"price": 500, "type": "boost", "effect": "xp"},
        "coin boost": {"price": 800, "type": "boost", "effect": "coins"},
        "shield token": {"price": 1200, "type": "consumable", "effect": "shield"},
        "lucky charm": {"price": 600, "type": "consumable", "effect": "lucky"},
        "stat reroll": {"price": 1000, "type": "consumable", "effect": "reroll"},
    }
    
    item_key = item_name.lower()
    
    if item_key not in shop_items:
        await ctx.send("❌ Item not found! Use `!shop` to see available items.")
        return
    
    item = shop_items[item_key]
    price = item["price"]
    
    # Check balance
    stats = get_user_stats(user_id)
    if stats["coins"] < price:
        await ctx.send(f"❌ Insufficient coins! You need {price} but have {stats['coins']}.")
        return
    
    # Process purchase
    if item["type"] == "pack":
        # Generate wrestler
        rarities = {
            "random": ["common", "uncommon", "rare"],
            "epic": ["epic"],
            "legendary": ["legendary"]
        }
        
        rarity = random.choice(rarities.get(item["rarity"], ["common"]))
        
        # Generate random name
        prefixes = ["Thunder", "Shadow", "Venom", "Steel", "Iron", "Blaze", "Storm", "Titan"]
        suffixes = ["Strike", "Fist", "Edge", "Crusher", "Beast", "King", "Lord", "Master"]
        wrestler_name = f"{random.choice(prefixes)} {random.choice(suffixes)}"
        
        wrestler = create_wrestler(user_id, wrestler_name, rarity)
        
        # Deduct coins
        update_user_coins(user_id, -price)
        
        embed = discord.Embed(
            title="🎉 Pack Opened!",
            description=f"You got a **{rarity.upper()}** wrestler!",
            color=discord.Color.purple()
        )
        
        powerhouse = " 💪" if wrestler.is_powerhouse else ""
        embed.add_field(
            name=f"{wrestler.get_emoji()} {wrestler.name}{powerhouse}",
            value=f"Overall: {wrestler.overall_rating()}\nOpen: {wrestler.opening_rating} | Mid: {wrestler.mid_rating} | Finish: {wrestler.finisher_rating}",
            inline=False
        )
        
        embed.set_footer(text=f"Remaining coins: {stats['coins'] - price}")
        
        gif_url = random.choice(WWE_GIFS["celebration"])
        embed.set_image(url=gif_url)
        
        await ctx.send(embed=embed)
    
    else:
        # Add to inventory
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO inventory (user_id, item_name, quantity)
            VALUES (?, ?, 1)
            ON CONFLICT(user_id, item_name) 
            DO UPDATE SET quantity = quantity + 1
        """, (user_id, item_name))
        
        # Deduct coins
        cursor.execute("UPDATE users SET coins = coins - ? WHERE user_id = ?", (price, user_id))
        
        conn.commit()
        conn.close()
        
        await ctx.send(f"✅ Purchased **{item_name}**! Check `!inventory` to use it.")

@bot.command(name="inventory", help="View your inventory")
async def inventory(ctx):
    """Display user inventory"""
    user_id = ctx.author.id
    
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT item_name, quantity FROM inventory WHERE user_id = ?", (user_id,))
    items = cursor.fetchall()
    conn.close()
    
    if not items:
        await ctx.send("📦 Your inventory is empty!")
        return
    
    embed = discord.Embed(
        title="📦 Your Inventory",
        color=discord.Color.blue()
    )
    
    for item_name, quantity in items:
        embed.add_field(name=item_name.title(), value=f"x{quantity}", inline=True)
    
    embed.set_footer(text="Use !use <item_name> to use an item")
    
    await ctx.send(embed=embed)

# ==================== GACHA/SUMMONING COMMANDS ====================

@bot.command(name="summon", help="Summon a new wrestler (costs gems)")
async def summon(ctx, pack_type: str = "normal"):
    """Summon wrestlers"""
    user_id = ctx.author.id
    
    # Rate limit
    can_summon, remaining = rate_limiter.check_rate_limit(user_id, "gacha")
    if not can_summon:
        await ctx.send(f"⏳ Summoning cooldown! Wait {remaining} seconds.")
        return
    
    costs = {
        "normal": 10,
        "premium": 25,
        "ultra": 50
    }
    
    cost = costs.get(pack_type, 10)
    
    stats = get_user_stats(user_id)
    
    if stats["gems"] < cost:
        await ctx.send(f"❌ Insufficient gems! You need {cost} but have {stats['gems']}.")
        return
    
    # Determine rarity
    if pack_type == "ultra":
        rarities = ["epic"] * 7 + ["legendary"] * 3
    elif pack_type == "premium":
        rarities = ["uncommon"] * 4 + ["rare"] * 4 + ["epic"] * 2
    else:
        rarities = ["common"] * 6 + ["uncommon"] * 3 + ["rare"] * 1
    
    rarity = random.choice(rarities)
    
    # Generate name
    prefixes = ["Ultimate", "Supreme", "Elite", "Legendary", "Mythic", "Divine", 
                "Shadow", "Thunder", "Chaos", "Inferno", "Frost", "Venom"]
    suffixes = ["Destroyer", "Champion", "Warrior", "Titan", "Emperor", "Overlord",
                "Reaper", "Savage", "Dominator", "Gladiator", "Berserker", "Phantom"]
    
    name = f"{random.choice(prefixes)} {random.choice(suffixes)}"
    
    wrestler = create_wrestler(user_id, name, rarity)
    
    # Deduct gems
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET gems = gems - ? WHERE user_id = ?", (cost, user_id))
    conn.commit()
    conn.close()
    
    # Create fancy reveal
    embed = discord.Embed(
        title="✨ WRESTLER SUMMONED! ✨",
        description=f"Rarity: **{rarity.upper()}**",
        color=discord.Color.gold()
    )
    
    powerhouse = " 💪 POWERHOUSE" if wrestler.is_powerhouse else ""
    embed.add_field(
        name=f"{wrestler.get_emoji()} {wrestler.name}{powerhouse}",
        value=f"**Overall Rating: {wrestler.overall_rating()}**\n\n" +
              f"📊 **Stats**\n" +
              f"Opening: {wrestler.opening_rating}\n" +
              f"Mid-Match: {wrestler.mid_rating}\n" +
              f"Finisher: {wrestler.finisher_rating}",
        inline=False
    )
    
    embed.set_footer(text=f"Gems spent: {cost} | Remaining: {stats['gems'] - cost}")
    
    gif_url = random.choice(WWE_GIFS["entrance"])
    embed.set_image(url=gif_url)
    
    await ctx.send(embed=embed)

# ==================== LEADERBOARD COMMANDS ====================

@bot.command(name="leaderboard", help="View global leaderboards")
async def leaderboard(ctx, category: str = "wins"):
    """Display leaderboards"""
    
    valid_categories = ["wins", "coins", "level", "streak"]
    
    if category not in valid_categories:
        category = "wins"
    
    conn = db.get_connection()
    cursor = conn.cursor()
    
    if category == "wins":
        cursor.execute("""
            SELECT user_id, username, wins, total_matches
            FROM users ORDER BY wins DESC LIMIT 10
        """)
        title = "🏆 Top Winners"
    elif category == "coins":
        cursor.execute("""
            SELECT user_id, username, coins
            FROM users ORDER BY coins DESC LIMIT 10
        """)
        title = "💰 Richest Players"
    elif category == "level":
        cursor.execute("""
            SELECT user_id, username, level, experience
            FROM users ORDER BY level DESC, experience DESC LIMIT 10
        """)
        title = "⭐ Highest Levels"
    else:  # streak
        cursor.execute("""
            SELECT user_id, username, win_streak, best_streak
            FROM users ORDER BY win_streak DESC LIMIT 10
        """)
        title = "🔥 Best Streaks"
    
    results = cursor.fetchall()
    conn.close()
    
    embed = discord.Embed(
        title=title,
        color=discord.Color.gold()
    )
    
    medals = ["🥇", "🥈", "🥉"]
    
    for i, row in enumerate(results, 1):
        medal = medals[i-1] if i <= 3 else f"{i}."
        
        if category == "wins":
            user_id, username, wins, total = row
            value = f"Wins: {wins} | Matches: {total}"
        elif category == "coins":
            user_id, username, coins = row
            value = f"💰 {coins:,} coins"
        elif category == "level":
            user_id, username, level, xp = row
            value = f"Level {level} | {xp:,} XP"
        else:
            user_id, username, streak, best = row
            value = f"Current: {streak} | Best: {best}"
        
        embed.add_field(
            name=f"{medal} {username}",
            value=value,
            inline=False
        )
    
    await ctx.send(embed=embed)

# ==================== FUN/UTILITY COMMANDS ====================

@bot.command(name="flip", help="Flip a coin (heads/tails)")
async def flip(ctx):
    """Coin flip"""
    result = random.choice(["Heads", "Tails"])
    await ctx.send(f"🪙 **{result}!**")

@bot.command(name="roll", help="Roll a dice")
async def roll(ctx, sides: int = 6):
    """Dice roll"""
    if sides < 2 or sides > 100:
        await ctx.send("❌ Please choose between 2-100 sides!")
        return
    
    result = random.randint(1, sides)
    await ctx.send(f"🎲 You rolled a **{result}** (d{sides})")

@bot.command(name="stats", help="View match statistics")
async def stats(ctx):
    """Detailed statistics"""
    user_id = ctx.author.id
    
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT COUNT(*) as total, 
               SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as wins,
               AVG(CASE WHEN player1_id = ? THEN player1_score ELSE player2_score END) as avg_score
        FROM match_history
        WHERE player1_id = ? OR player2_id = ?
    """, (user_id, user_id, user_id, user_id))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result or result[0] == 0:
        await ctx.send("📊 No match history found!")
        return
    
    total, wins, avg_score = result
    win_rate = (wins / total * 100) if total > 0 else 0
    
    embed = discord.Embed(
        title=f"📊 {ctx.author.display_name}'s Match Stats",
        color=discord.Color.blue()
    )
    
    embed.add_field(name="Total Matches", value=total, inline=True)
    embed.add_field(name="Wins", value=wins or 0, inline=True)
    embed.add_field(name="Win Rate", value=f"{win_rate:.1f}%", inline=True)
    embed.add_field(name="Avg Score", value=f"{avg_score:.1f}" if avg_score else "0", inline=True)
    
    await ctx.send(embed=embed)

@bot.command(name="rename", help="Rename a wrestler")
async def rename(ctx, old_name: str, *, new_name: str):
    """Rename wrestler"""
    user_id = ctx.author.id
    
    if len(new_name) > 30:
        await ctx.send("❌ Name too long! Maximum 30 characters.")
        return
    
    wrestlers = get_user_wrestlers(user_id)
    wrestler = next((w for w in wrestlers if w.name.lower() == old_name.lower()), None)
    
    if not wrestler:
        await ctx.send(f"❌ Wrestler '{old_name}' not found!")
        return
    
    # Check if user has rename token
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT quantity FROM inventory WHERE user_id = ? AND item_name = 'name change token'", (user_id,))
    result = cursor.fetchone()
    
    if not result or result[0] < 1:
        await ctx.send("❌ You need a Name Change Token! Buy one from the shop.")
        conn.close()
        return
    
    # Use token and rename
    cursor.execute("UPDATE inventory SET quantity = quantity - 1 WHERE user_id = ? AND item_name = 'name change token'", (user_id,))
    cursor.execute("UPDATE wrestlers SET name = ? WHERE wrestler_id = ?", (new_name, wrestler.wrestler_id))
    
    conn.commit()
    conn.close()
    
    await ctx.send(f"✅ Wrestler renamed from **{old_name}** to **{new_name}**!")

@bot.command(name="gift", help="Gift coins to another player")
async def gift(ctx, recipient: discord.Member, amount: int):
    """Gift coins"""
    giver_id = ctx.author.id
    recipient_id = recipient.id
    
    if giver_id == recipient_id:
        await ctx.send("❌ You can't gift yourself!")
        return
    
    if amount < 1:
        await ctx.send("❌ Amount must be positive!")
        return
    
    stats = get_user_stats(giver_id)
    
    if stats["coins"] < amount:
        await ctx.send(f"❌ Insufficient coins! You have {stats['coins']}.")
        return
    
    # Transfer
    update_user_coins(giver_id, -amount)
    update_user_coins(recipient_id, amount)
    
    await ctx.send(f"✅ {ctx.author.mention} gifted **{amount} coins** to {recipient.mention}!")

# ==================== ADMIN COMMANDS ====================

@bot.command(name="givemoney")
@commands.has_permissions(administrator=True)
async def givemoney(ctx, user: discord.Member, amount: int):
    """Admin: Give money to user"""
    update_user_coins(user.id, amount)
    await ctx.send(f"✅ Gave {amount} coins to {user.mention}")

@bot.command(name="resetuser")
@commands.has_permissions(administrator=True)
async def resetuser(ctx, user: discord.Member):
    """Admin: Reset user data"""
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM wrestlers WHERE user_id = ?", (user.id,))
    cursor.execute("DELETE FROM teams WHERE user_id = ?", (user.id,))
    cursor.execute("DELETE FROM users WHERE user_id = ?", (user.id,))
    
    conn.commit()
    conn.close()
    
    await ctx.send(f"✅ Reset data for {user.mention}")

# ==================== HELP COMMAND ====================

@bot.command(name="help", help="Show all commands")
async def help_command(ctx, category: str = None):
    """Comprehensive help command"""
    
    if category == "match":
        embed = discord.Embed(title="⚔️ Match Commands", color=discord.Color.red())
        embed.add_field(name="!challenge @user", value="Challenge a player", inline=False)
        embed.add_field(name="!accept", value="Accept a challenge", inline=False)
        embed.add_field(name="!team create <name> <w1> <w2> <w3>", value="Create team", inline=False)
        embed.add_field(name="!team view", value="View active team", inline=False)
    
    elif category == "economy":
        embed = discord.Embed(title="💰 Economy Commands", color=discord.Color.gold())
        embed.add_field(name="!daily", value="Daily reward", inline=False)
        embed.add_field(name="!shop", value="View shop", inline=False)
        embed.add_field(name="!buy <item>", value="Buy item", inline=False)
        embed.add_field(name="!inventory", value="View inventory", inline=False)
        embed.add_field(name="!gift @user <amount>", value="Gift coins", inline=False)
    
    elif category == "wrestlers":
        embed = discord.Embed(title="🥊 Wrestler Commands", color=discord.Color.purple())
        embed.add_field(name="!wrestlers", value="View collection", inline=False)
        embed.add_field(name="!summon [type]", value="Summon wrestler", inline=False)
        embed.add_field(name="!rename <old> <new>", value="Rename wrestler", inline=False)
    
    else:
        embed = discord.Embed(
            title="🎮 WWE Dice Battle - Help",
            description="Use `!help <category>` for detailed help\nCategories: match, economy, wrestlers",
            color=discord.Color.blue()
        )
        
        embed.add_field(
            name="⚔️ Quick Start",
            value="1. `!start` - Begin your journey\n2. `!team create` - Create a team\n3. `!challenge @user` - Start battling!",
            inline=False
        )
        
        embed.add_field(
            name="📊 Core Commands",
            value="`!profile` `!wrestlers` `!team` `!challenge` `!shop` `!daily`",
            inline=False
        )
        
        embed.add_field(
            name="🎲 Fun Commands",
            value="`!flip` `!roll` `!leaderboard` `!stats`",
            inline=False
        )
    
    await ctx.send(embed=embed)

# ==================== RUN BOT ====================

if __name__ == "__main__":
    TOKEN = os.getenv('TOKEN') 
    
    print("""
    ╔══════════════════════════════════════════╗
    ║   WWE DICE BATTLE - Discord Bot         ║
    ║   50+ Features | Economy | Multiplayer  ║
    ╚══════════════════════════════════════════╝
    
    🔧 SETUP INSTRUCTIONS:
    1. Replace YOUR_BOT_TOKEN_HERE with your Discord bot token
    2. Invite bot to your server with proper permissions
    3. Run this script: python wwe_discord_bot.py
    
    📱 PYDROID USERS:
    - Install discord.py: pip install discord.py
    - This bot works on Pydroid 3
    - Keep your device awake while running
    
    ⚠️  IMPORTANT:
    - Bot token must be kept secret
    - Never share your token publicly
    """)
    
    try:
        bot.run(TOKEN)
    except Exception as e:
        print(f"❌ Error starting bot: {e}")
        print("\nMake sure you:")
        print("1. Replaced YOUR_BOT_TOKEN_HERE with your actual bot token")
        print("2. Have internet connection")
        print("3. Installed discord.py: pip install discord.py")
