import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: "Roblox Supabase",
	tagline: "A type-safe PostgREST client for Supabase, designed for Roblox servers using roblox-ts",
	favicon: "img/favicon.ico",

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Set the production url of your site here
	url: "https://waffle0823.github.io",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/Roblox-Supabase/",

	// GitHub pages deployment config.
	organizationName: "Waffle0823", // Usually your GitHub org/user name.
	projectName: "Roblox-Supabase", // Usually your repo name.

	onBrokenLinks: "throw",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					// Edit URL for your repo
					editUrl: "https://github.com/Waffle0823/Roblox-Supabase/edit/main/pages/",
				},
				blog: {
					showReadingTime: true,
					feedOptions: {
						type: ["rss", "atom"],
						xslt: true,
					},
					// Edit URL for your repo
					editUrl: "https://github.com/Waffle0823/Roblox-Supabase/edit/main/pages/",
					// Useful options to enforce blogging best practices
					onInlineTags: "warn",
					onInlineAuthors: "warn",
					onUntruncatedBlogPosts: "warn",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
				sitemap: {
					changefreq: "weekly",
					priority: 0.5,
					ignorePatterns: ["/tags/**"],
					filename: "sitemap.xml",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/docusaurus-social-card.jpg",
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "Roblox Supabase",
			logo: {
				alt: "Roblox Supabase Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "tutorialSidebar",
					position: "left",
					label: "Documentation",
				},
				{
					to: "/docs/api-reference",
					label: "API Reference",
					position: "left",
				},
				{
					to: "/docs/tutorial-examples",
					label: "Examples",
					position: "left",
				},
				{ to: "/blog", label: "Blog", position: "left" },
				{
					href: "https://github.com/Waffle0823/Roblox-Supabase",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Documentation",
					items: [
						{
							label: "Getting Started",
							to: "/docs/getting-started",
						},
						{
							label: "API Reference",
							to: "/docs/api-reference",
						},
						{
							label: "Examples",
							to: "/docs/tutorial-examples",
						},
					],
				},
				{
					title: "Related",
					items: [
						{
							label: "Supabase",
							href: "https://supabase.com",
						},
						{
							label: "roblox-ts",
							href: "https://roblox-ts.com",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "Blog",
							to: "/blog",
						},
						{
							label: "GitHub",
							href: "https://github.com/Waffle0823/Roblox-Supabase",
						},
						{
							label: "Report Issues",
							href: "https://github.com/Waffle0823/Roblox-Supabase/issues",
						},
					],
				},
			],
			copyright: `${new Date().getFullYear()} Roblox-Supabase MIT LICENSE.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
