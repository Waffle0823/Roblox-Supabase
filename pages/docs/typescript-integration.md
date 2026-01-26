---
sidebar_position: 6
---

# TypeScript Integration

This guide explains how to leverage TypeScript's type system with Roblox-Supabase for maximum type safety and developer experience.

## Type Safety Benefits

Roblox-Supabase is built with TypeScript at its core, providing several benefits:

- **Autocomplete for tables and columns**: Your IDE can suggest valid table and column names
- **Type checking for queries**: Catch errors at compile time rather than runtime
- **Safer data handling**: Properly typed responses make working with data more reliable
- **Better developer experience**: Reduce errors and improve productivity

## Defining Database Types

The first step to fully typed queries is defining your database structure. Create a type definition that represents your Supabase schema:

```typescript
// types/database.types.ts
export type Database = {
	public: {
		Tables: {
			users: {
				Row: {
					id: number;
					username: string;
					email: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: number; // Optional for auto-incrementing columns
					username: string;
					email: string;
					created_at?: string; // Optional with defaults
					updated_at?: string;
				};
				Update: {
					id?: number;
					username?: string;
					email?: string;
					created_at?: string;
					updated_at?: string;
				};
			};

			posts: {
				Row: {
					id: number;
					title: string;
					content: string;
					user_id: number;
					published: boolean;
					created_at: string;
				};
				Insert: {
					id?: number;
					title: string;
					content: string;
					user_id: number;
					published?: boolean;
					created_at?: string;
				};
				Update: {
					id?: number;
					title?: string;
					content?: string;
					user_id?: number;
					published?: boolean;
					created_at?: string;
				};
			};

			// Add more tables as needed
		};
	};
};
```

> Looking to automate this process? Jump to [Automating Type Generation](#automating-type-generation).

## Setting Up the Client with Types

When initializing your Supabase client, pass your database type as a generic parameter:

```typescript
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { Database } from "./types/database.types";

const supabase = new SupabaseClient<Database>("https://your-project-url.supabase.co", "your-anon-key");

export { supabase };
```

## Type Safety in Action

With your types set up, you'll get full type checking throughout your code:

### Typed Table Selection

```typescript
// TypeScript will ensure 'users' is a valid table
const query = supabase.from("users");

// This would cause a compile error if 'userz' isn't a table
const badQuery = supabase.from("userz"); // TypeScript error
```

### Typed Column Selection

```typescript
// TypeScript knows which columns exist on the users table
const { data } = await supabase.from("users").select("id, username, email").execute();

// This would cause a compile error
const badQuery = await supabase
	.from("users")
	.select("id, unknown_column") // TypeScript error
	.execute();
```

### Typed Filters

```typescript
// TypeScript ensures column exists and value type matches
const query = supabase
	.from("users")
	.eq("id", 123) // Works because id is a number
	.execute();

// This would cause a type error
const badQuery = supabase
	.from("users")
	.eq("id", "not-a-number") // TypeScript error
	.execute();
```

### Typed Results

```typescript
const { data } = await supabase.from("users").select("*").execute();

// data is typed as an array of users with correct types
data?.forEach((user) => {
	// TypeScript knows the structure of user
	print(`${user.id}: ${user.username}`);

	// This would cause a type error
	print(user.unknown_property); // TypeScript error
});
```

## Type-Safe Inserts and Updates

```typescript
// Insert with proper types
const insertResult = await supabase.from("users").insert({
	username: "newplayer",
	email: "player@example.com",
	// id is optional (auto-increment)
	// created_at is optional (server default)
});

// Update with proper types
const updateResult = await supabase
	.from("posts")
	.update({
		title: "Updated Title",
		published: true,
		// All fields are optional in updates
	})
	.eq("id", 123)
	.execute();

// This would cause a type error
const badInsert = await supabase
	.from("users")
	.insert({
		username: 123, // TypeScript error: username should be string
		unknown_field: "value", // TypeScript error: field doesn't exist
	})
	.execute();
```

## Automating Type Generation

While manual type definition works well, you might want to automate this process to keep types in sync with your database schema.

Supabase offers type generation tools, but they need to be adapted for the Roblox-Supabase client. You can:

1. Use the Supabase CLI to generate types
2. Modify the output to match Roblox-Supabase's expected format
3. Include the types in your project

## Best Practices

1. **Keep types up to date**: Update your type definitions whenever you modify your database schema
2. **Use strict TypeScript settings**: Enable strict mode in your `tsconfig.json` for maximum type safety
3. **Separate types by domain**: For large projects, organize types by domain or feature
4. **Consider enums for constants**: Use TypeScript enums for fields with fixed values

## Next Steps

Now that you understand how to leverage TypeScript with Roblox-Supabase, check out the [API Reference](api-reference) for a complete overview of available methods.
