# ImportNow — Import Directly from China to India

A modern, interactive web application for **ImportNow**, streamlining cross-border sourcing and logistics from China to India. Built with React, Vite, Tailwind CSS, and Three.js, featuring interactive 3D visualizations, rich editorial content, and responsive UI animations.

**Live Demo:** [importnow-hazel.vercel.app](https://importnow-hazel.vercel.app/)

## Features

- **Interactive 3D Visualizations:** Powered by `Three.js`, featuring an interactive hero globe and a 3D shipping route scene in the *How It Works* section.
- **Full Editorial & Blog System:** Dedicated `/blogs` hub with category filters, live search, and pagination, linked to nine full-length article pages with sidebars and related article recommendations.
- **Smooth UI & Motion:** 3D scroll-reveal animations, interactive project-card hover effects, and high-contrast micro-interactions.
- **Responsive Design:** Styled with Tailwind CSS v4 and custom typography (`Inter`, `Plus Jakarta Sans`, and `JetBrains Mono`) for desktop and mobile viewports.

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 | Component-based UI architecture |
| **Build Tool** | Vite 6 | Fast dev server and optimized production bundling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive styling |
| **3D Graphics** | Three.js | Hero globe and 3D port/shipping route visualizations |
| **Typography** | Google Fonts | `Inter` (body), `Plus Jakarta Sans` (headings), `JetBrains Mono` (labels) |
| **Deployment** | Vercel | Continuous deployment from GitHub |

## Project Structure

```text
importnow/
├── public/                 # Static assets
├── src/
│   ├── App.jsx             # Main application layout, routing, and UI sections
│   ├── portScene.js        # Three.js 3D globe and shipping route logic
│   └── articlesContent.js  # Structured data for blog posts and article pages
├── index.html              # HTML entry point & Google Fonts setup
├── package.json            # Dependencies and build scripts
└── vite.config.js          # Vite configuration

