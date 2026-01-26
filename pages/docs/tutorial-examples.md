---
sidebar_position: 8
---

# Tutorial & Examples

This page provides practical examples of using Roblox-Supabase in common Roblox game scenarios.

## Example 1: Player Data Management

This example shows how to create a data management system for saving and loading player data.

### Setting Up

```typescript
// playerData.ts
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { Players, HttpService } from "@rbxts/services";

// Define your database types (You can use supabase cli to generate automatically)
type Database = {
	public: {
		Tables: {
			player_data: {
				Row: {
					user_id: string;
					coins: number;
					level: number;
					items: string[];
					last_save: string;
				};
				Insert: {
					user_id: string;
					coins?: number;
					level?: number;
					items?: string[];
					last_save?: string;
				};
				Update: {
					user_id?: string;
					coins?: number;
					level?: number;
					items?: string[];
					last_save?: string;
				};
			};
		};
	};
};

// Initialize the Supabase client
const supabase = new SupabaseClient<Database>(
	"https://your-project-url.supabase.co",
	HttpService.GetSecret("SUPABASE_ANON_KEY"),
);

// Default player data structure
const DEFAULT_PLAYER_DATA = {
	coins: 0,
	level: 1,
	items: [] as string[],
};

// Type alias for player data
type PlayerData = Database["public"]["Tables"]["player_data"]["Row"];

// Class for managing player data
export class PlayerDataManager {
	private dataCache = new Map<string, PlayerData>();

	constructor() {
		// Setup player joined event
		Players.PlayerAdded.Connect((player) => this.loadPlayerData(player));
		Players.PlayerRemoving.Connect((player) => this.savePlayerData(player));
	}

	// Load player data when they join
	async loadPlayerData(player: Player) {
		const userId = player.UserId.toString();

		try {
			// Try to load existing data
			const { data, error } = await supabase.from("player_data").select("*").eq("user_id", userId).maybeSingle();

			if (error) {
				warn(`Error loading data for ${player.Name}: ${error.message}`);
				return;
			}

			// If player has existing data
			if (data) {
				print(`Loaded data for ${player.Name}`);
				this.dataCache.set(userId, data);
			} else {
				// Create new data for first-time players
				print(`Creating new data for ${player.Name}`);
				const newData = {
					user_id: userId,
					...DEFAULT_PLAYER_DATA,
					last_save: new Date().toISOString(),
				};

				const { data: createdData, error: createError } = await supabase.from("player_data").insert(newData);

				if (createError) {
					warn(`Error creating data: ${createError.message}`);
					return;
				}

				this.dataCache.set(userId, createdData[0]);
			}
		} catch (e) {
			warn(`Unexpected error: ${e}`);
		}
	}

	// Save player data
	async savePlayerData(player: Player) {
		const userId = player.UserId.toString();
		const data = this.dataCache.get(userId);

		if (!data) {
			warn(`No data to save for ${player.Name}`);
			return;
		}

		try {
			const { error } = await supabase
				.from("player_data")
				.update({
					...data,
					last_save: new Date().toISOString(),
				})
				.eq("user_id", userId)
				.execute();

			if (error) {
				warn(`Error saving data for ${player.Name}: ${error.message}`);
			} else {
				print(`Saved data for ${player.Name}`);
			}
		} catch (e) {
			warn(`Unexpected error: ${e}`);
		}
	}

	// Get player data
	getPlayerData(player: Player) {
		return this.dataCache.get(player.UserId.toString());
	}

	// Update player data
	updatePlayerData(player: Player, update: Partial<PlayerData>) {
		const userId = player.UserId.toString();
		const currentData = this.dataCache.get(userId);

		if (!currentData) {
			warn(`No data found for ${player.Name}`);
			return;
		}

		// Update the cache with new values
		this.dataCache.set(userId, {
			...currentData,
			...update,
		});
	}
}

// Create a singleton instance
export const playerDataManager = new PlayerDataManager();
```

### Usage

```typescript
// gameScript.ts
import { playerDataManager } from "./playerData";
import { Players } from "@rbxts/services";

// Example of updating player data
function giveCoins(player: Player, amount: number) {
	const data = playerDataManager.getPlayerData(player);
	if (!data) return;

	playerDataManager.updatePlayerData(player, {
		coins: data.coins + amount,
	});

	print(`Gave ${amount} coins to ${player.Name}. New total: ${data.coins + amount}`);
}

// Example of using player data
function levelUpPlayer(player: Player) {
	const data = playerDataManager.getPlayerData(player);
	if (!data) return;

	playerDataManager.updatePlayerData(player, {
		level: data.level + 1,
	});

	print(`${player.Name} leveled up to ${data.level + 1}!`);
}

// Example of adding items to player inventory
function giveItem(player: Player, itemId: string) {
	const data = playerDataManager.getPlayerData(player);
	if (!data) return;

	const updatedItems = [...data.items];
	updatedItems.push(itemId);

	playerDataManager.updatePlayerData(player, {
		items: updatedItems,
	});

	print(`Gave ${itemId} to ${player.Name}`);
}

// Connect to game events
game.GetService("ServerScriptService").CoinsAdded.Connect((player, amount) => {
	giveCoins(player, amount);
});
```

## Example 2: Global Leaderboard System

This example demonstrates creating and managing a global leaderboard.

```typescript
// leaderboard.ts
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { HttpService } from "@rbxts/services";

type LeaderboardDatabase = {
	public: {
		Tables: {
			leaderboard: {
				Row: {
					id: number;
					user_id: string;
					username: string;
					score: number;
					updated_at: string;
				};
				Insert: {
					id?: number;
					user_id: string;
					username: string;
					score: number;
					updated_at?: string;
				};
				Update: {
					id?: number;
					user_id?: string;
					username?: string;
					score?: number;
					updated_at?: string;
				};
			};
		};
	};
};

// Type alias for leaderboard entry
type LeaderboardEntry = LeaderboardDatabase["public"]["Tables"]["leaderboard"]["Row"];

const supabase = new SupabaseClient<LeaderboardDatabase>(
	"https://your-project-url.supabase.co",
	HttpService.GetSecret("SUPABASE_ANON_KEY"),
);

export class LeaderboardManager {
	// Update a player's score
	async updateScore(userId: string, username: string, score: number): Promise<boolean> {
		try {
			// Use upsert to either insert new score or update existing
			const { error } = await supabase
				.from("leaderboard")
				.upsert(
					{
						user_id: userId,
						username: username,
						score: score,
						updated_at: new Date().toISOString(),
					},
					{ onConflict: "user_id" },
				)
				.execute();

			if (error) {
				warn(`Error updating leaderboard: ${error.message}`);
				return false;
			}

			return true;
		} catch (e) {
			warn(`Unexpected error: ${e}`);
			return false;
		}
	}

	// Get top scores
	async getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
		try {
			const { data, error } = await supabase
				.from("leaderboard")
				.select("*")
				.order("score", { ascending: false })
				.limit(limit)
				.execute();

			if (error) {
				warn(`Error getting top scores: ${error.message}`);
				return [];
			}

			return data || [];
		} catch (e) {
			warn(`Unexpected error: ${e}`);
			return [];
		}
	}

	// Get a player's rank
	async getPlayerRank(userId: string): Promise<number | undefined> {
		try {
			// Get player's score first
			const { data: playerData, error: playerError } = await supabase
				.from("leaderboard")
				.select("score")
				.eq("user_id", userId)
				.maybeSingle();

			if (playerError || !playerData) {
				warn(`Error getting player score: ${playerError?.message || "Player not found"}`);
				return undefined;
			}

			// Count players with higher scores
			const { data: rankData, error: rankError } = await supabase
				.from("leaderboard")
				.select("id", { count: "exact" })
				.gt("score", playerData.score)
				.execute();

			if (rankError) {
				warn(`Error calculating rank: ${rankError.message}`);
				return undefined;
			}

			// Rank is players ahead + 1
			return (rankData?.length || 0) + 1;
		} catch (e) {
			warn(`Unexpected error: ${e}`);
			return undefined;
		}
	}
}

export const leaderboardManager = new LeaderboardManager();
```

## Example 3: Server Configuration System

This example shows how to store and retrieve game configuration from Supabase.

```typescript
// configManager.ts
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { HttpService } from "@rbxts/services";

type ConfigDatabase = {
	public: {
		Tables: {
			game_config: {
				Row: {
					key: string;
					value: string;
					category: string;
					updated_at: string;
				};
				Insert: {
					key: string;
					value: string;
					category?: string;
					updated_at?: string;
				};
				Update: {
					key?: string;
					value?: string;
					category?: string;
					updated_at?: string;
				};
			};
		};
	};
};

// Type alias for config entry
type ConfigEntry = ConfigDatabase["public"]["Tables"]["game_config"]["Row"];

const supabase = new SupabaseClient<ConfigDatabase>(
	"https://your-project-url.supabase.co",
	HttpService.GetSecret("SUPABASE_ANON_KEY"),
);

export class ConfigManager {
	private configCache = new Map<string, string>();
	private loaded = false;

	constructor() {
		this.loadAllConfigs();
	}

	// Load all configurations
	async loadAllConfigs() {
		try {
			const { data, error } = await supabase.from("game_config").select("*").execute();

			if (error) {
				warn(`Error loading configs: ${error.message}`);
				return;
			}

			// Cache all configs
			data?.forEach((config) => {
				this.configCache.set(config.key, config.value);
			});

			this.loaded = true;
			print(`Loaded ${data?.size() || 0} configuration items`);
		} catch (e) {
			warn(`Unexpected error: ${e}`);
		}
	}

	// Wait until configs are loaded
	async waitForLoaded(): Promise<boolean> {
		if (this.loaded) return true;

		// Wait for up to 10 seconds for configs to load
		for (let i = 0; i < 100; i++) {
			await new Promise((resolve) => task.delay(0.1, resolve));
			if (this.loaded) return true;
		}

		return false;
	}

	// Get a config value
	getConfig<T>(key: string, defaultValue: T): T {
		const value = this.configCache.get(key);
		if (value === undefined) return defaultValue;

		try {
			// Handle different types
			if (typeIs(defaultValue, "number")) {
				return tonumber(value) as T;
			} else if (typeIs(defaultValue, "boolean")) {
				return (value.lower() === "true") as unknown as T;
			} else if (typeIs(defaultValue, "table")) {
				return HttpService.JSONDecode(value) as T;
			}

			// String or other type
			return value as unknown as T;
		} catch (e) {
			warn(`Error parsing config ${key}: ${e}`);
			return defaultValue;
		}
	}

	// Update a config value (admin only)
	async updateConfig(key: string, value: unknown): Promise<boolean> {
		try {
			// Convert value to string for storage
			let stringValue: string;

			if (typeIs(value, "table")) {
				stringValue = HttpService.JSONEncode(value);
			} else {
				stringValue = tostring(value);
			}

			const { error } = await supabase
				.from("game_config")
				.upsert(
					{
						key: key,
						value: stringValue,
						updated_at: new Date().toISOString(),
					},
					{ onConflict: "key" },
				)
				.execute();

			if (error) {
				warn(`Error updating config: ${error.message}`);
				return false;
			}

			// Update local cache
			this.configCache.set(key, stringValue);
			return true;
		} catch (e) {
			warn(`Unexpected error: ${e}`);
			return false;
		}
	}
}

export const configManager = new ConfigManager();
```

### Usage Example

```typescript
// gameScript.ts
import { configManager } from "./configManager";

// Wait for configs to load before starting game
async function initializeGame() {
	const loaded = await configManager.waitForLoaded();
	if (!loaded) {
		warn("Failed to load game configurations!");
		return;
	}

	// Get game settings with defaults
	const roundTime = configManager.getConfig("round_time", 120);
	const maxPlayers = configManager.getConfig("max_players", 10);
	const itemDropRate = configManager.getConfig("item_drop_rate", 0.25);
	const welcomeMessage = configManager.getConfig("welcome_message", "Welcome to the game!");

	print(`Game initialized with round time: ${roundTime}s`);
	print(`Max players: ${maxPlayers}`);
	print(`Item drop rate: ${itemDropRate * 100}%`);
	print(`Welcome message: ${welcomeMessage}`);

	// Start the game with these settings
	startGame(roundTime, maxPlayers, itemDropRate);
}

// Admin command to update settings
function adminUpdateSetting(key: string, value: unknown) {
	configManager.updateConfig(key, value).then((success) => {
		if (success) {
			print(`Updated ${key} to ${value}`);
		} else {
			print(`Failed to update ${key}`);
		}
	});
}

// Initialize the game
initializeGame();
```

These examples demonstrate common use cases for Roblox-Supabase in game development. Adapt them to fit your specific game requirements and structure.
