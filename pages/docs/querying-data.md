---
sidebar_position: 3
---

# Querying Data

This guide explains how to query and retrieve data from your Supabase database using Roblox-Supabase.

## Basic Queries

The `select()` method allows you to query data from your tables with full type safety.

```typescript
// Import your client
import { supabase } from "./supabaseClient";

// Select all columns from the users table
async function getAllUsers() {
	const { data, error } = await supabase.from("users").select("*").execute();

	if (error) {
		warn(`Error: ${error.message}`);
		return [];
	}

	return data;
}

// Select specific columns
async function getUserNames() {
	const { data, error } = await supabase.from("users").select("id, username").execute();

	return data;
}
```

## Single Results

When you expect only one result, use `single()` or `maybeSingle()`:

```typescript
// Get exactly one user - will error if not exactly one result
async function getUser(userId: number) {
	const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();

	if (error) {
		warn(`Error getting user: ${error.message}`);
		return undefined;
	}

	return data;
}

// Get at most one user - won't error if no results
async function findUser(username: string) {
	const { data, error } = await supabase.from("users").select("*").eq("username", username).maybeSingle();

	return data; // Will be undefined if no user found
}
```

## Handling Responses

All query methods return a `SupabaseResponse` object that contains:

```typescript
{
  data: T | undefined; // The query result data
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | undefined; // Error information if the query failed
  status: number; // HTTP status code
  statusText: string; // Status description
}
```

Always check for errors before using the data:

```typescript
const { data, error } = await supabase.from("scores").select("*").execute();

if (error) {
	warn(`Failed to get scores: ${error.message}`);
	// Handle the error appropriately
	return;
}

// Now it's safe to use data
data.forEach((score) => {
	print(`Player ${score.player_id}: ${score.value}`);
});
```

## Pagination

For large datasets, you can paginate results:

```typescript
// Get the first 10 users
const { data: page1 } = await supabase.from("users").select("*").range(0, 9).execute();

// Get the next 10 users
const { data: page2 } = await supabase.from("users").select("*").range(10, 19).execute();
```

## Ordering Results

You can order results using PostgreSQL ordering:

```typescript
// Order by username ascending
const { data } = await supabase.from("users").select("*").order("username", { ascending: true }).execute();

// Order by created_at descending (newest first)
const { data: newUsers } = await supabase.from("users").select("*").order("created_at", { ascending: false }).execute();
```

## Performance Considerations

When working with Roblox servers:

1. **Fetch only what you need**: Select only necessary columns to reduce data transfer.
2. **Use pagination**: For large tables, fetch data in smaller chunks.
3. **Cache frequently accessed data**: Don't repeatedly fetch data that rarely changes.
4. **Consider rate limits**: Supabase may have rate limits depending on your plan.

In the next section, you'll learn how to [modify data](modifying-data) in your database using insert, update, and delete operations.
