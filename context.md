# Portfolio — Project Context

## Project Overview
Modern, dark-themed developer portfolio for **Yuvraj Purbia**, inspired by [redoyanulhaque.me](https://www.redoyanulhaque.me/). Built with **React (Vite)**, **GSAP animations**, and custom CSS. Features a loading screen, smooth scroll animations, interactive skill panels, career timeline, and a custom cursor.

---

## Candidate Details

### Personal Information
- **Name:** Yuvraj Purbia
- **Phone:** +91 9024015370
- **Email:** purbiayuvraj23@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/yuvraj-purbia-464355210/
- **GitHub:** https://github.com/yuvrajpurbia
- **Location:** Jaipur, India

### Education
- **Degree:** B.Tech in Computer Science and Engineering
- **Institution:** Maharashtra Institute of Technology WPU, Pune, MH
- **CGPA:** 8.10
- **Duration:** 2020 – 2024

### Professional Experience

| # | Role | Company | Location | Type | Duration |
|---|------|---------|----------|------|----------|
| 1 | Application Developer | Sabai Innovations | Jaipur, India | Full-time (On-site) | Nov 2025 – Present |
| 2 | MERN Stack Developer | Cuvette | Remote | Full-time | May 2025 – Oct 2025 |
| 3 | Angular Developer (Intern) | Brandspark Technologies | Pune, India | Internship | Jul 2024 – Jan 2025 |

### Projects Showcased

1. **BlitzScale — High-Concurrency Flash Sale Engine**
   - Tech: React, Node.js, Express.js, MongoDB, Redis, BullMQ, Artillery, Docker
   - Handles 10,000+ concurrent users, Redis-based distributed locking, BullMQ async processing

2. **MockMind — AI-Powered Interview Simulator**
   - Tech: React, Node.js, Python, OpenAI API, BERT, NLP, Sentence Transformers, MongoDB
   - LLM-powered AI interviewer, NLP scoring engine, AI-driven skill gap detection

3. **SpeedSense — Web Performance Intelligence SaaS**
   - Tech: MERN Stack, Puppeteer, Lighthouse API, Recharts, Tailwind CSS
   - Automated Lighthouse audits, AI-driven optimization suggestions, competitor benchmarking

### Technical Skills
JavaScript (ES6+), TypeScript, Python, React.js/Next.js, Node.js/Express.js, MongoDB/Redis, OpenAI API/LLM Integration, Docker, DSA, OOPs

---

## Tech Stack Used

| Category | Technology |
|----------|-----------|
| Framework | React 18 (Vite 6) |
| Animations | GSAP 3.12 + ScrollTrigger |
| Icons | react-icons 5.3 |
| Styling | Custom CSS (no Tailwind — matching reference design) |
| Font | Inter (Google Fonts) |
| Build Tool | Vite |
| Package Manager | npm |

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--backgroundColor` | `#0b080c` | Page background |
| `--accentColor` | `#c2a4ff` | Purple accent (headings, links, hover) |
| `--accentColorDark` | `#7f40ff` | Deeper purple (gradients) |
| Text primary | `#eae5ec` | Body text |
| Text secondary | `rgba(255,255,255,0.5-0.75)` | Muted text |

### Typography
- **Font:** Inter (weight 100–900)
- **Headings:** 28px–70px depending on section
- **Body:** 14px–20px

### Reference Portfolio
- **URL:** https://www.redoyanulhaque.me/
- **Original stack:** React, Three.js (React Three Fiber), GSAP, Lenis smooth scroll, Vercel Analytics
- **Adaptation:** Replaced Three.js 3D model with CSS orb/rings/particles. Kept all section layouts, color scheme, animations, and responsive breakpoints faithful to the original.

---

## File Structure

```
Portfolio/
├── context.md                          # This file — project context and progress
├── index.html                          # Entry HTML with meta tags
├── package.json                        # npm config (React, GSAP, react-icons)
├── package-lock.json                   # npm lock file
├── vite.config.js                      # Vite + React plugin config
├── public/
│   └── favicon.svg                     # Purple "Y" favicon
├── src/
│   ├── main.jsx                        # React DOM entry point
│   ├── App.jsx                         # Main app — loading gate + all sections
│   ├── config.js                       # All personal data (editable)
│   ├── styles/
│   │   ├── index.css                   # Global styles, CSS variables, resets
│   │   ├── Loading.css                 # Animated loading screen
│   │   ├── Navbar.css                  # Fixed header with hover text reveal
│   │   ├── Landing.css                 # Hero section (orb, rings, particles)
│   │   ├── About.css                   # About section with word reveal
│   │   ├── Career.css                  # Timeline with glowing purple dot
│   │   ├── WhatIDo.css                 # Expandable skill panels
│   │   ├── Works.css                   # Project cards grid
│   │   ├── TechStack.css              # Pyramid tech icons
│   │   ├── Contact.css                 # Contact info + CTA footer
│   │   └── Cursor.css                  # Custom cursor (mix-blend-mode)
│   └── components/
│       ├── Loading.jsx                 # Click-to-enter loading screen
│       ├── Navbar.jsx                  # Logo + email + ABOUT/WORK/CONTACT nav
│       ├── Landing.jsx                 # Hero with animated orb & social icons
│       ├── About.jsx                   # GSAP scroll-triggered word reveal
│       ├── Career.jsx                  # Career timeline with scroll animation
│       ├── WhatIDo.jsx                 # Two expandable skill panels
│       ├── Works.jsx                   # Project cards with tech tags
│       ├── TechStack.jsx              # Icon pyramid (15 technologies)
│       ├── Contact.jsx                 # Contact info + Hire Me button
│       └── Cursor.jsx                  # Custom cursor with lerp tracking
├── dist/                               # Production build output
│   ├── index.html
│   └── assets/                         # Bundled JS + CSS
└── node_modules/                       # Dependencies
```

---

## Sections (Top to Bottom)

| # | Section | Component | Key Features |
|---|---------|-----------|-------------|
| 0 | Loading Screen | `Loading.jsx` | Purple glow hover, click-to-expand transition |
| 1 | Navbar | `Navbar.jsx` | Fixed header, hover text reveal, scroll fade gradient |
| 2 | Hero / Landing | `Landing.jsx` | Animated orb + rings + particles, name intro, title, social icons |
| 3 | About Me | `About.jsx` | GSAP word-by-word opacity reveal on scroll |
| 4 | What I Do | `WhatIDo.jsx` | Two expandable panels (AI & Backend / Full-Stack), corner borders, tech tags |
| 5 | Career Journey | `Career.jsx` | Purple gradient timeline, glowing dot, scroll-triggered animations |
| 6 | My Works | `Works.jsx` | Project cards grid, hover lift, icons, tech tags |
| 7 | Tech Stack | `TechStack.jsx` | Pyramid layout, 15 tech icons (react-icons/si), hover scale + glow |
| 8 | Contact | `Contact.jsx` | Email, phone, socials, location, "Hire Me" CTA, copyright footer |
| — | Cursor | `Cursor.jsx` | Custom circle cursor, mix-blend-mode difference, lerp tracking |

---

## Progress Log

### Step 1: Reference Analysis
- Fetched and analyzed https://www.redoyanulhaque.me/ source code
- Identified tech stack: React (Vite), Three.js, GSAP, Lenis, Vercel Analytics
- Extracted full config.js with sections, colors, font, and layout structure
- Downloaded and analyzed all CSS files (Navbar, MainContainer, MyWorks)
- Mapped all sections: Loading → Navbar → Hero → About → WhatIDo → Career → Works → TechStack → Contact

### Step 2: Project Initialization
- Initialized Vite + React project in `c:/Users/vijay/Desktop/Personal Projects/Portfolio/`
- Created `package.json` with dependencies: react, react-dom, gsap, react-icons
- Installed all dependencies via npm
- Created `vite.config.js` with React plugin
- Created `index.html` with meta tags and SEO description
- Created purple "Y" `favicon.svg`

### Step 3: Data Configuration
- Created `src/config.js` with all personal data from Resume AI context.md
- Mapped experiences, projects, skills, education, contact, social links, tech stack
- Data is fully editable from one file

### Step 4: Design System & Global Styles
- Created `src/styles/index.css` with CSS variables matching reference:
  - `--backgroundColor: #0b080c` (dark background)
  - `--accentColor: #c2a4ff` (purple accent)
  - Inter font (replacing Geist from reference)
- Full responsive breakpoints: 500px, 600px, 768px, 900px, 1025px, 1200px, 1400px, 1600px, 1920px

### Step 5: Loading Screen
- Animated button with purple glow on hover
- Click expands button to fill screen (cubic-bezier transition)
- Fades out to reveal main content

### Step 6: Navbar
- Fixed header with logo (left), email (center), nav links (right)
- Hover text reveal animation (translateY text swap)
- Scroll-triggered gradient fade at top
- Responsive: stacks vertically on mobile, horizontal on desktop

### Step 7: Hero / Landing Section
- CSS-based animated orb (replacing Three.js 3D model from reference)
- Pulsing rings expanding outward
- 8 floating particles with staggered animations
- Animated purple gradient circles (top-left, right-side)
- GSAP entrance animations for text and social icons
- Social icons (GitHub, LinkedIn, Email) fixed on left side

### Step 8: About Section
- Word-by-word opacity reveal using GSAP ScrollTrigger
- Scrub-linked to scroll position
- Responsive text sizing (1.9vw on desktop, fixed on mobile)

### Step 9: What I Do Section
- Two expandable skill panels: "AI & Backend" and "Full-Stack"
- Corner border decorations (::before/::after pseudo-elements)
- Hover/click expands panel, sibling contracts
- Tech tags with pill styling
- Flicker-in animation on load

### Step 10: Career Timeline
- Vertical purple gradient line with glowing animated dot
- Three experience entries with scroll-triggered fade-in
- Gradient text heading ("My Career Journey")
- Responsive: side-by-side on desktop, stacked on mobile

### Step 11: Project Cards
- Grid layout (auto-fill, minmax 380px)
- Each card: numbered badge, icon visual, title, category, description, tech tags
- Hover: translateY lift + purple border glow + shadow
- Project-specific icons (FaBolt, FaBrain, FaChartLine)
- GSAP staggered entrance animation

### Step 12: Tech Stack Pyramid
- 15 technology icons from react-icons/si
- Arranged in pyramid rows (3-5-4-3)
- Hover: scale up + purple glow + border highlight
- Radial gradient background effects
- GSAP back.out bounce entrance

### Step 13: Contact Section
- Email, phone, GitHub, LinkedIn links
- "Let's build something intelligent together" tagline
- Purple "Hire Me" CTA button with arrow
- Copyright footer with current year
- GSAP scroll-triggered entrance

### Step 14: Custom Cursor
- 50px circle with mix-blend-mode: difference
- Lerp-based smooth tracking (0.15 factor)
- Hides on [data-cursor="disable"] elements
- Desktop only (hidden on mobile)

### Step 15: Build & Verification
- Production build successful (Vite 6.4.1)
- Bundle sizes: 186KB (React + icons), 70KB (app), 43KB (ScrollTrigger), 29KB (CSS)
- Dev server tested and confirmed working on http://localhost:5173

---

## How to Run

**Development:**
```bash
cd "c:/Users/vijay/Desktop/Personal Projects/Portfolio"
npm run dev
```

**Production Build:**
```bash
cd "c:/Users/vijay/Desktop/Personal Projects/Portfolio"
npm run build
npm run preview
```

---

## How to Customize

### Change Personal Data
Edit `src/config.js` — all text, links, projects, skills, and contact info are in one file.

### Add New Projects
Add entries to `config.projects` array in `config.js`. Each project needs: `id`, `title`, `category`, `technologies`, `description`.

### Add New Tech Stack Icons
1. Add entry to `config.techStack` array with `name` and `icon` (react-icons/si component name)
2. Import the icon in `src/components/TechStack.jsx` and add to `iconMap`

### Change Colors
Edit CSS variables in `src/styles/index.css`:
```css
--accentColor: #c2a4ff;    /* Main purple */
--backgroundColor: #0b080c; /* Dark background */
```

---

## Potential Enhancements
- Add project images/screenshots to `public/images/`
- Add Lenis smooth scroll for buttery scrolling
- Add Three.js 3D model to hero section
- Add page transitions with React Router
- Add blog section
- Deploy to Vercel/Netlify
- Add resume download button
- Add dark/light mode toggle
