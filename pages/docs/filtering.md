---
sidebar_position: 5
---

# Advanced Filtering

This guide explains how to use filters in Roblox-Supabase to create precise queries for your database.

## Basic Filters

Roblox-Supabase provides a range of filter methods that can be chained together to create complex queries:

### Equality Filters

```typescript
// Equal to
const { data } = await supabase.from("users").select("*").eq("username", "CoolPlayer123").execute();

// Not equal to
const { data } = await supabase.from("scores").select("*").neq("value", 0).execute();
```

### Comparison Filters

```typescript
// Greater than
const { data } = await supabase.from("scores").select("*").gt("value", 1000).execute();

// Greater than or equal to
const { data } = await supabase.from("scores").select("*").gte("value", 1000).execute();

// Less than
const { data } = await supabase.from("users").select("*").lt("created_at", "2023-01-01").execute();

// Less than or equal to
const { data } = await supabase.from("users").select("*").lte("created_at", "2023-01-01").execute();
```

## List Filters

### In List

Filter for values in a list:

```typescript
const { data } = await supabase.from("users").select("*").in("id", [1, 2, 3, 4, 5]).execute();
```

### Not In List

Filter for values not in a list:

```typescript
const { data } = await supabase.from("users").select("*").notIn("id", [1, 2, 3]).execute();
```

## Text Filters

### Pattern Matching with LIKE

```typescript
// Case-sensitive LIKE
const { data } = await supabase.from("users").select("*").like("username", "%Player%").execute();

// Case-insensitive ILIKE
const { data } = await supabase.from("users").select("*").ilike("username", "%player%").execute();
```

### Multiple Pattern Matching

```typescript
// Match any of the patterns
const { data } = await supabase.from("users").select("*").ilikeAnyOf("username", ["%admin%", "%mod%"]).execute();

// Match all of the patterns
const { data } = await supabase.from("users").select("*").likeAllOf("tags", ["%game%", "%vip%"]).execute();
```

## Boolean Filters

```typescript
// Check if a boolean field is true
const { data } = await supabase.from("users").select("*").is("active", true).execute();

// Check if a field is null
const { data } = await supabase.from("users").select("*").is("last_login", undefined).execute();
```

## Regular Expression Matching

```typescript
// Regular expression match
const { data } = await supabase.from("users").select("*").regexMatch("email", ".*@gmail\\.com").execute();

// Case-insensitive regex match
const { data } = await supabase.from("users").select("*").regexIMatch("username", "^admin.*").execute();
```

## Array and JSON Operations

### Contains

Check if an array or JSON field contains specific values:

```typescript
// Check if array contains value
const { data } = await supabase.from("users").select("*").contains("roles", ["admin"]).execute();

// Check if JSON field contains properties
const { data } = await supabase.from("profiles").select("*").contains("preferences", { theme: "dark" }).execute();
```

### Contained By

Check if values are contained within an array:

```typescript
const { data } = await supabase.from("products").select("*").containedBy("tags", ["sale", "featured", "new"]).execute();
```

## Combining Filters

You can chain multiple filters to create complex queries:

```typescript
const { data } = await supabase
	.from("users")
	.select("*")
	.eq("active", true)
	.gt("created_at", "2023-01-01")
	.lt("last_login", "2023-12-31")
	.execute();
```

## Using OR Logic

Use the `or` method for OR conditions:

```typescript
// Find users who are admins OR have VIP status
const { data } = await supabase.from("users").select("*").or("is_admin.eq.true,is_vip.eq.true").execute();
```

## Negating Filters

Use the `not` method to negate a filter:

```typescript
const { data } = await supabase.from("users").select("*").not("status", "eq", "banned").execute();
```

## Full-Text Search

For tables with text search enabled:

```typescript
const { data } = await supabase
	.from("articles")
	.select("*")
	.textSearch("content", "game development", {
		type: "websearch",
		config: "english",
	})
	.execute();
```

## Best Practices

1. **Be specific**: Filter as precisely as possible to minimize data transfer.
2. **Use indexes**: Ensure your Supabase tables have appropriate indexes for frequently filtered columns.
3. **Combine filters**: Use multiple specific filters rather than complex OR conditions when possible.
4. **Test performance**: Monitor query performance with large datasets and optimize as needed.

## Next Steps

Now that you understand filtering, learn about [TypeScript Integration](typescript-integration/) to get the most out of type safety with Roblox-Supabase.
