# Contributing to Roblox-Supabase

Thank you for considering contributing to Roblox-Supabase! When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project. This library aims to provide a reliable, type-safe way to interact with Supabase from Roblox environments, and contributions should maintain this goal.

## Issue and Pull Request Process

### Filing Issues

Before filing an issue:

* Check if the issue already exists in the Issues section
* Provide clear reproduction steps and environment details
* Specify the version of Roblox-Supabase, roblox-ts, and TypeScript you're using

### Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new API methods, 
   type definitions, or any changes to the usage examples.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of the project maintainer, or if you 
   do not have permission to do that, you may request the maintainer to merge it for you.

## Development Guidelines

### Setup and Development Environment

1. Fork and clone the repository
2. Install dependencies using `npm install`
3. Make your changes in a feature branch
4. Test your changes by running `npm run build` to ensure compatibility with roblox-ts

### TypeScript Style Guidelines

* Follow the existing code style in the project
* Use TypeScript interfaces and types for better type safety
* Use proper type definitions for Supabase and Roblox API interactions
* Prioritize type safety and proper error handling
* Document your code with TSDoc comments
* Use ESLint and Prettier for code formatting (`npm run lint`)

### Roblox-TS Specific Guidelines

* Be mindful of Roblox's networking limitations when implementing features
* Ensure your code compiles properly to valid Luau through roblox-ts
* Test functionality in both server and client contexts when applicable
* Consider memory and performance implications for Roblox environments
