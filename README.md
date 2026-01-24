<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/Waffle0823/Roblox-Supabase">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Roblox Supabase</h3>

  <p align="center">
    A TypeScript-first Supabase wrapper for Roblox, built specifically for the roblox-ts ecosystem.
    <br />
    <a href="https://waffle0823.github.io/Roblox-Supabase"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!-- TODO: Add demo link when available -->
    <a href="https://github.com/Waffle0823/Roblox-Supabase">View Demo</a>
    &middot;
    <a href="https://github.com/Waffle0823/Roblox-Supabase/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/Waffle0823/Roblox-Supabase/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Roblox-Supabase is a TypeScript-first Supabase client library specifically designed for Roblox using the roblox-ts ecosystem. This library provides a type-safe way to interact with your Supabase backend from Roblox games and experiences.

Key features:
* Type-safe PostgREST client for Supabase interactions
* Designed specifically for the Roblox platform
* Built with TypeScript using roblox-ts
* Simple API for making requests to your Supabase backend
* Handles authentication and request formatting



### Built With

* [![TypeScript][TypeScript.org]][TypeScript-url]
* [![Roblox-TS][Roblox-TS.org]][Roblox-TS-url]
* [![Supabase][Supabase.com]][Supabase-url]



<!-- GETTING STARTED -->
## Getting Started

To start using Roblox-Supabase in your Roblox project, follow these steps:

### Prerequisites

* [Roblox Studio](https://www.roblox.com/create)
* [roblox-ts](https://roblox-ts.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Supabase Account](https://supabase.com/)

### Installation

1. Add the package to your roblox-ts project:
   ```sh
   npm install @rbxts/roblox-supabase
   ```

2. Set up a Supabase project at [https://supabase.com](https://supabase.com)

3. Get your Supabase URL and anon key from your Supabase project settings

4. Initialize the client in your code:
   ```ts
   import { SupabaseClient } from "@rbxts/roblox-supabase";
   
   const HttpService = game.GetService("HttpService");
   
   // Initialize the client
   const supabase = new SupabaseClient("YOUR_SUPABASE_URL", HttpService.GetSecret("SUPABASE_ANON_KEY"));
   ```



<!-- USAGE EXAMPLES -->
## Usage

### Basic Example

```ts
// Initialize the client
import { SupabaseClient } from "@rbxts/roblox-supabase";

const HttpService = game.GetService("HttpService");

const supabase = new SupabaseClient("YOUR_SUPABASE_URL", HttpService.GetSecret("SUPABASE_ANON_KEY"));

// Make a request
const result = await supabase
  .from("players")
  .select()
  .eq("id", player.UserId)
  .single();
```

_More examples and detailed documentation coming soon._



<!-- ROADMAP -->
## Roadmap

- [x] Basic Supabase client implementation
- [ ] Request functionality
- [ ] Complete Supabase API coverage
- [ ] Authentication methods
- [ ] Realtime subscriptions
- [ ] Storage functionality
- [ ] Comprehensive documentation
- [ ] Code examples

See the [open issues](https://github.com/Waffle0823/Roblox-Supabase/issues) for a full list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development process, and guidelines for submitting pull requests.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Top contributors:

<a href="https://github.com/Waffle0823/Roblox-Supabase/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Waffle0823/Roblox-Supabase" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Waffle0823 - csshin9928@gmail.com

Project Link: [https://github.com/Waffle0823/Roblox-Supabase](https://github.com/Waffle0823/Roblox-Supabase)



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Supabase Documentation](https://supabase.com/docs)
* [roblox-ts Documentation](https://roblox-ts.com/)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [Roblox Developer Hub](https://developer.roblox.com/)
* [PostgREST Documentation](https://postgrest.org/)



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Waffle0823/Roblox-Supabase.svg?style=for-the-badge
[contributors-url]: https://github.com/Waffle0823/Roblox-Supabase/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Waffle0823/Roblox-Supabase.svg?style=for-the-badge
[forks-url]: https://github.com/Waffle0823/Roblox-Supabase/network/members
[stars-shield]: https://img.shields.io/github/stars/Waffle0823/Roblox-Supabase.svg?style=for-the-badge
[stars-url]: https://github.com/Waffle0823/Roblox-Supabase/stargazers
[issues-shield]: https://img.shields.io/github/issues/Waffle0823/Roblox-Supabase.svg?style=for-the-badge
[issues-url]: https://github.com/Waffle0823/Roblox-Supabase/issues
[license-shield]: https://img.shields.io/github/license/Waffle0823/Roblox-Supabase.svg?style=for-the-badge
[license-url]: https://github.com/Waffle0823/Roblox-Supabase/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
[TypeScript.org]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Roblox-TS.org]: https://img.shields.io/badge/roblox--ts-2EA44F?style=for-the-badge&logo=typescript&logoColor=white
[Roblox-TS-url]: https://roblox-ts.com/
[Supabase.com]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/ 