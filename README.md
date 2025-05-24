<a href="#">
  <h1 align="center">Sitemint: Your All-in-One Web Management Toolkit</h1>
</a>

<!-- Add a relevant image/mockup for Sitemint here if available -->
<!-- <img width="1440" alt="dashboard_mockup" src="placeholder_image_url.jpg"> -->

<p align="center">
  Empower your web projects with Sitemint - streamlined site management, deployment, and insights at your fingertips.
  <br/>
  <strong>Now fully localized for English-speaking businesses in Ireland! 🇮🇪</strong>
</p>

<p align="center">
  <!-- Add relevant badges, e.g., Twitter, build status -->
  <a href="LICENSE.md">
    <img src="https://img.shields.io/github/license/codehagen/sitemint?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/Localized-Ireland%20🇮🇪-green" alt="Ireland Localized" />
  <img src="https://img.shields.io/badge/Language-English-blue" alt="English Language" />
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#localization-features"><strong>🌍 Localization</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#contributing"><strong>Credits</strong></a>
</p>
<br/>

## Introduction

Welcome to Sitemint, where we are redefining web project management for **English-speaking businesses in Ireland**. Sitemint provides a comprehensive suite of tools to help you build, deploy, and manage your web applications with ease. Whether you're scraping data, managing databases, or deploying your next big idea, Sitemint is designed to streamline your workflow with full Irish localization.

Gain powerful insights and control over your web projects, enabling you to focus on innovation and development while serving the Irish market with proper localization and business practices.

## 🌍 Localization Features

This fork has been **completely adapted from Norwegian to English for Irish businesses** with the following transformations:

### 🗣️ **Language & Content Transformation**
- **Full English localization** - All Norwegian content removed and replaced with professional English
- **Irish business terminology** - Adapted from Norwegian to proper business language for the Irish market  
- **Professional email templates** - Converted Norwegian templates to English for client communication

### 💰 **Currency & Format Changes**
- **Euro currency support** (€) - **Changed from** Norwegian Kroner (NOK/kr)
- **Irish phone number format** (+353) - **Updated from** Norwegian (+47)
- **European date formats** (DD/MM/YYYY) - **Converted from** Norwegian formatting
- **Irish business hours** (Mon-Fri: 9:00-17:30) - **Updated from** Norwegian "Man-Fre: 07:00-16:00"

### 🏢 **Business Practice Adaptations**
- **Irish domain support** (.ie, .com, .co.uk) - **Expanded from** Norwegian .no domains only
- **Irish address formats** - **Converted from** Norwegian addressing standards
- **Irish business assumptions** - **Adapted from** Norwegian business practices for AI content generation
- **Locale configuration** (en_IE) - **Changed from** Norwegian nb_NO locale

### 🎨 **Template Conversions**
- **Carpenter template fully translated** - **Converted from** Norwegian snekker template to English carpenter/tradesperson
- **Irish placeholder content** - **Replaced** Norwegian examples with realistic Irish business examples
- **Professional navigation** - **Translated** Norwegian navigation ("Tjenester", "Om Oss", "Kontakt") to English ("Services", "About Us", "Contact")
- **Contact forms** - **Adapted** Norwegian form fields to Irish-appropriate labels

### 🤖 **AI Content Generation Updates**
- **English AI prompts** - **Converted from** Norwegian (Bokmål) instructions to English content generation
- **Irish business context** - **Changed** AI understanding from Norwegian to Irish market context
- **Professional tone** - **Adapted from** Norwegian business communication style to Irish professional standards

### 📧 **Email Template Transformation**
- **Company rebrand** - **Changed from** "CodeNord" to "Sitemint Team"
- **Contact details** - **Updated from** Norwegian phone/email to Irish equivalents
- **Domain changes** - **Converted from** .codenord.no to .sitemint.ie
- **Language conversion** - **Translated** entire email content from Norwegian to professional English

## What we are using

Sitemint is built with a modern, powerful stack: Next.js 15, Prisma, Tailwind CSS, and Shadcn/UI.
<br/>
These technologies are seamlessly integrated to accelerate development and provide a top-tier user experience for Irish businesses **instead of the original Norwegian market focus**.

## Directory Structure

Sitemint's project structure **(with Irish localization modifications)**:

    .
    ├── app                          # Main application (Next.js App Router)
    │    ├── actions                 # Server actions (database, scraper, deploy)
    │    │    └── scraper           # 🔄 Converted from Norwegian to Irish-localized content scraping
    │    ├── api                     # API routes
    │    ├── (routes)                # Application routes
    │    └── ...
    ├── components                   # Shared UI components
    │    ├── maker                  # 🔄 English email generation tools (was Norwegian)
    │    └── sites                  # 🔄 Irish-localized site templates
    │         └── carpenter         # Complete English carpenter template (was Norwegian snekker)
    ├── config                       # Project configuration files
    ├── lib                          # Utility functions and libraries
    │    └── utils.ts               # 🔄 Irish locale configuration (changed from nb_NO to en_IE)
    ├── prisma                       # Prisma schema and migrations
    ├── public                       # Static assets
    ├── LICENSE.md
    └── README.md

## Installation

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/codehagen/sitemint.git
cd sitemint
```

1. Install dependencies using pnpm (or your preferred package manager like bun, npm, yarn):

```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` (or `.env`) and update the variables.

```bash
cp env.example .env.local
```

3. Input all necessary environment variables. This will likely include:
   - Database connection string (e.g., for a PostgreSQL database like Neon)
   - OpenAI API Key (for AI-powered English content generation **instead of Norwegian**)
   - Any other service API keys or configurations

4. Push the Prisma schema to your database:
   (Ensure your database is running and accessible)
```bash
npx prisma db push  
```

5. Start the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack + Features

### Core Frameworks & Libraries

- [Next.js](https://nextjs.org/) – React framework for building performant server-rendered and static web applications.
- [Prisma](https://www.prisma.io/) – Modern ORM for Node.js and TypeScript, simplifying database access.
- [React](https://react.dev/) – A JavaScript library for building user interfaces.
- [OpenAI](https://openai.com/) - Integrated for AI-powered English content generation for Irish businesses **(converted from Norwegian business focus)**.
- [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation.

### UI & UX

- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development.
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease.
- [@tabler/icons-react](https://tabler-icons.io/) – Icon libraries for crisp, clear visuals.
- [Recharts](https://recharts.org/) - Composable charting library.
- [Sonner](https://sonner.emilkowal.ski/) - Opinionated toast component for React.

### Development & Tooling

- [TypeScript](https://www.typescriptlang.org/) – Strongly typed programming language that builds on JavaScript.
- [ESLint](https://eslint.org/) – Pluggable linting utility for JavaScript and JSX.
- [@tanstack/react-table](https://tanstack.com/table/v8) - Headless UI for building powerful tables & datagrids.

### Platforms (Example Integrations)

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with Git.

## 🚀 Quick Start for Irish Businesses

**This fork enables you to:**

1. **Scrape Irish websites** - Use the website scraper with automatic English content generation (converted from Norwegian)
2. **Generate professional emails** - Built-in English email templates for client outreach (was Norwegian)
3. **Deploy carpenter sites** - Ready-to-use English carpenter/tradesperson templates (converted from Norwegian snekker)
4. **Irish business standards** - Automatic formatting for Irish phone numbers, addresses, and currency (adapted from Norwegian standards)

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/codehagen/sitemint/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/codehagen/sitemint/pulls) to add new features/make quality-of-life improvements/fix bugs.

**This fork represents a complete Norwegian → English localization effort for the Irish market! 🇮🇪**

<a href="https://github.com/codehagen/sitemint/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=codehagen/sitemint" />
</a>

## Repo Activity (Example)

![Sitemint repo activity – generated by Axiom](https://repobeats.axiom.co/api/embed/c76db17605a0f0164a2e743c89f22e05b702cb7d.svg "Repobeats analytics image")
