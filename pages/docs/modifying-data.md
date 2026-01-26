---
sidebar_position: 4
---

# Modifying Data

This guide explains how to insert, update, and delete data in your Supabase database using Roblox-Supabase.

## Inserting Data

To add new records to your database, use the `insert()` method:

```typescript
import { supabase } from "./supabaseClient";

// Insert a single record
async function createUser(username: string) {
	const { data, error } = await supabase.from("users").insert({
		username: username,
		created_at: new Date().toISOString(),
	});

	if (error) {
		warn(`Error creating user: ${error.message}`);
		return;
	}

	print(`Created user with ID: ${data[0].id}`);
	return data[0];
}

// Insert multiple records at once
async function createUsers(usernames: string[]) {
	const users = usernames.map((username) => ({
		username,
		created_at: new Date().toISOString(),
	}));

	const { data, error } = await supabase.from("users").insert(users);

	return data;
}
```

## Updating Data

To modify existing records, use the `update()` method combined with filters:

```typescript
// Update a user's username
async function updateUsername(userId: number, newUsername: string) {
	const { data, error } = await supabase.from("users").update({ username: newUsername }).eq("id", userId).execute();

	if (error) {
		warn(`Error updating user: ${error.message}`);
		return false;
	}

	return true;
}

// Update multiple records matching a condition
async function deactivateInactiveUsers(cutoffDate: string) {
	const { data, error } = await supabase
		.from("users")
		.update({ active: false })
		.lt("last_login", cutoffDate)
		.execute();

	if (error) {
		warn(`Error deactivating users: ${error.message}`);
		return 0;
	}

	return data.size();
}
```

## Upserting Data

The `upsert()` method allows you to insert records if they don't exist or update them if they do:

```typescript
// Upsert a user based on their ID
async function upsertUser(userData: { id?: number; username: string }) {
	const { data, error } = await supabase
		.from("users")
		.upsert(userData, { onConflict: "id", ignoreDuplicates: false })
		.execute();

	if (error) {
		warn(`Error upserting user: ${error.message}`);
		return;
	}

	return data[0];
}

// Upsert multiple records
async function syncUserProfiles(profiles: UserProfile[]) {
	const { data, error } = await supabase.from("user_profiles").upsert(profiles, { onConflict: "user_id" }).execute();

	return data;
}
```

## Deleting Data

To remove records from your database, use the `delete()` method:

```typescript
// Delete a specific user
async function deleteUser(userId: number) {
	const { error } = await supabase.from("users").delete().eq("id", userId).execute();

	if (error) {
		warn(`Error deleting user: ${error.message}`);
		return false;
	}

	return true;
}

// Delete multiple records matching a condition
async function cleanupOldLogs(olderThan: string) {
	const { data, error } = await supabase.from("activity_logs").delete().lt("created_at", olderThan).execute();

	if (error) {
		warn(`Error cleaning logs: ${error.message}`);
		return 0;
	}

	return data.size(); // Number of deleted records
}
```

## Error Handling

Always check for errors when modifying data:

```typescript
const { data, error } = await supabase.from("game_scores").insert({ player_id: playerId, score: newScore }).execute();

if (error) {
	if (error.code === "23505") {
		// Handle unique constraint violation
		warn("This player already has a score recorded");
	} else {
		// Handle other errors
		warn(`Database error: ${error.message}`);
	}
	return;
}

// Continue with successful operation
```

## Transaction Safety

Roblox-Supabase operations are atomic at the request level, meaning each individual query is guaranteed to fully succeed or fail.

However, if you need to perform multiple related operations, you may need to implement your own error handling and recovery logic, as Roblox-Supabase does not currently support multi-operation transactions.

## Next Steps

Now that you understand how to modify data, learn about [Advanced Filtering](filtering) to create more complex queries.
