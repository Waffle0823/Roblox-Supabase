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

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at csshin9928@gmail.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/