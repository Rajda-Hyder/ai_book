// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Learn robotics from the ground up — beginner-friendly, hands-on, AI-enhanced',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://rajda-hyder.github.io',
  // Set the /<baseUrl>/ pathname under which your Docusaurus site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/my_ai_book_project/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Rajda-Hyder',
  projectName: 'my_ai_book_project',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/Rajda-Hyder/my_ai_book_project/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '🤖 Robotics Textbook',
        logo: {
          alt: 'Robotics Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Lessons',
          },
          {
            href: 'https://github.com/Rajda-Hyder/my_ai_book_project',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Panaversity',
                href: 'https://panaversity.dev',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/Rajda-Hyder/my_ai_book_project/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/Rajda-Hyder/my_ai_book_project',
              },
            ],
          },
        ],
        copyright: `Copyright © 2025 Physical AI & Humanoid Robotics. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['python', 'javascript', 'typescript'],
      },
    }),
};

export default config;
