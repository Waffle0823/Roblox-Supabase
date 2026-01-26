---
sidebar_position: 2
---

# Getting Started

This guide will help you set up Roblox-Supabase in your Roblox project and establish a connection to your Supabase database.

## Prerequisites

Before you begin, ensure you have:

1. A Roblox project set up with [roblox-ts](https://roblox-ts.com/)
2. A [Supabase](https://supabase.com/) project with database tables
3. Your Supabase project URL and anon key

## Installation

Add the Roblox-Supabase and Supabase packages to your project:

```bash
npm install @rbxts/roblox-supabase
npm install supabase --save-dev
```

## Setting Up Types

For the best development experience with TypeScript, you should generate your database types directly from your Supabase project. This gives you full type safety when interacting with your database.

Generate your types using the Supabase CLI:

```bash
npx supabase gen types typescript --project-id "your-project-id" --schema public > types/database.types.ts
```

This command will automatically generate TypeScript types based on your actual database schema, ensuring your types always match your database structure.

## Initializing the Client

Now you can create a Supabase client with your database types:

```typescript
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { HttpService } from "@rbxts/services";
import { Database } from "./types/database.types";

// It's recommended to keep these in a secure configuration
const supabaseUrl = "https://your-project-url.supabase.co";
const supabaseKey = HttpService.GetSecret("SUPABASE_ANON_KEY"); // Use a Secret type for security

// Initialize the client with your database types
const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseKey);

// Now you can use the client with full type safety
export { supabase };
```

## Security Considerations

When using Roblox-Supabase:

1. **Never expose your service role key** in your client code
2. Use Row-Level Security (RLS) policies in Supabase to protect your data
3. Consider which database operations should be allowed from your game

## Next Steps

Now that you have set up Roblox-Supabase, you can:

- Learn about [Querying Data](querying-data)
- See how to [Insert, Update, and Delete Data](modifying-data)
- Explore [Advanced Filtering](filtering)
