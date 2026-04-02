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
	const { data, err } = await supabase.from("users").insert({
		username: username,
		created_at: new Date().toISOString(),
	});

	if (err) {
		warn(`Error creating user: ${err.message}`);
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

	const { data, err } = await supabase.from("users").insert(users);

	return data;
}
```

## Updating Data

To modify existing records, use the `update()` method combined with filters:

```typescript
// Update a user's username
async function updateUsername(userId: number, newUsername: string) {
	// By default, update() uses returning: "minimal" which doesn't return data
	const { err } = await supabase.from("users").update({ username: newUsername }).eq("id", userId).execute();

	if (err) {
		warn(`Error updating user: ${err.message}`);
		return false;
	}

	return true;
}

// Update multiple records matching a condition and return the data
async function deactivateInactiveUsers(cutoffDate: string) {
	// Use returning: "representation" to get data back
	const { data, err } = await supabase
		.from("users")
		.update({ active: false }, { returning: "representation" })
		.lt("last_login", cutoffDate)
		.execute();

	if (err) {
		warn(`Error deactivating users: ${err.message}`);
		return 0;
	}

	return data ? data.size() : 0;
}
```

## Upserting Data

The `upsert()` method allows you to insert records if they don't exist or update them if they do:

```typescript
// Upsert a user based on their ID
async function upsertUser(userData: { id?: number; username: string }) {
	// By default, upsert() uses returning: "minimal" which doesn't return data
	// Use returning: "representation" to get the updated data back
	const { data, err } = await supabase
		.from("users")
		.upsert(userData, { onConflict: "id", returning: "representation" })
		.execute();

	if (err) {
		warn(`Error upserting user: ${err.message}`);
		return;
	}

	return data[0];
}

// Upsert multiple records with default minimal return
async function syncUserProfiles(profiles: UserProfile[]) {
	const { err } = await supabase.from("user_profiles").upsert(profiles, { onConflict: "user_id" }).execute();

	return err ? false : true; // Just returns success status since data is minimal
}
```

## Deleting Data

To remove records from your database, use the `delete()` method:

```typescript
// Delete a specific user
async function deleteUser(userId: number) {
	// By default, delete() uses returning: "minimal" which doesn't return data
	const { err } = await supabase.from("users").delete().eq("id", userId).execute();

	if (err) {
		warn(`Error deleting user: ${err.message}`);
		return false;
	}

	return true;
}

// Delete multiple records and get the deleted data back
async function cleanupOldLogs(olderThan: string) {
	// Use returning: "representation" to get the deleted data
	const { data, err } = await supabase
		.from("activity_logs")
		.delete({ returning: "representation" })
		.lt("created_at", olderThan)
		.execute();

	if (err) {
		warn(`Error cleaning logs: ${err.message}`);
		return 0;
	}

	return data ? data.size() : 0; // Number of deleted records if representation is returned
}
```

## Error Handling

Always check for errors when modifying data:

```typescript
const { data, err } = await supabase.from("game_scores").insert({ player_id: playerId, score: newScore }).execute();

if (err) {
	if (err.code === "23505") {
		// Handle unique constraint violation
		warn("This player already has a score recorded");
	} else {
		// Handle other errors
		warn(`Database error: ${err.message}`);
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
