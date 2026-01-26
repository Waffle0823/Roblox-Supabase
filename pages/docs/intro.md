---
sidebar_position: 1
---

# Introduction

Welcome to the **Roblox-Supabase** documentation. This library provides a type-safe PostgREST client for [Supabase](https://supabase.com/), specifically designed for Roblox servers using [roblox-ts](https://roblox-ts.com/).

## Overview

Roblox-Supabase allows you to interact with your Supabase database from a Roblox server environment with full TypeScript support. It provides a clean, intuitive API for performing database operations while maintaining type safety.

## Features

- **Type-Safe**: Full TypeScript support for tables, columns, and query results
- **Familiar API**: Similar to the official Supabase JS client
- **Comprehensive Query Support**: Select, insert, update, delete with filtering
- **Roblox-Ready**: Designed specifically for the Roblox environment

## Requirements

- [Roblox Studio](https://www.roblox.com/create) with a game project
- [roblox-ts](https://roblox-ts.com/) set up in your project
- A [Supabase](https://supabase.com/) project with database tables

## Installation

Add the package to your roblox-ts project:

```bash
npm install @rbxts/roblox-supabase
```

## Quick Start

Here's a basic example of using Roblox-Supabase to connect to your database and query data:

```typescript
import { SupabaseClient } from "@rbxts/roblox-supabase";
import { HttpService } from "@rbxts/services";

// Initialize the client
const supabase = new SupabaseClient("https://your-project-url.supabase.co", HttpService.GetSecret("SUPABASE_ANON_KEY"));

// Query data
async function getUsers() {
	const { data, error } = await supabase.from("users").select("*").execute();

	if (error) {
		warn(`Error fetching users: ${error.message}`);
		return;
	}

	print(`Found ${data.size()} users`);
	return data;
}
```

The following pages will guide you through setting up and using Roblox-Supabase in your Roblox projects.
