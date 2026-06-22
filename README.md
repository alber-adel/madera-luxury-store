# ⚜️ Madera Home — Luxury Handcrafted Furniture

> **Madera Home** is a premium, high-end landing page and custom e-commerce solution showcasing luxury handcrafted furniture. Designed with a sleek dark-gold aesthetic, integrated serverless real-time analytics, and automated testing.

---

## ✨ Features

* **💎 Premium Luxury UI:** Styled with a curated, harmonious dark-gold color palette, smooth animations, and optimized typography for high-end branding.
* **📱 Fully Responsive Sale Banner:** Dynamic discount strip featuring a real-time countdown timer that is fully mobile-responsive (auto-scales and hides secondary text on mobile to avoid cutting off).
* **📊 Serverless Analytics Engine:** Built-in custom analytics tracking:
  * Deduplicated page views (15-minute window).
  * Anti-bot human interaction tracking (scanners and crawlers are ignored automatically).
  * Device, country, and referrer statistics.
  * Product interaction/click tracking.
* **🛡️ Secure Admin Dashboard:** Protected portal to manage live sales, update site banners, and monitor real-time audience metrics.
* **⚡ Modern Tech Stack:** Fast, lightweight, and completely serverless architecture.
* **🧪 Automated Test Suite:** Integrated unit tests validating the precision of all calculations, device detections, and bot filters.

---

## 🛠️ Technology Stack

* **Frontend:** [React](https://react.dev/) + [Vite](https://vite.dev/) (Lightning-fast build tool)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & Auth:** [Supabase](https://supabase.com/) (Serverless Postgres database, Realtime presence channels, and Auth)
* **Testing:** [Vitest](https://vitest.dev/) (Unit testing framework)

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alber-adel/madera-luxury-store.git
   cd madera-luxury-store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory (or configure them in your deployment platform):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Run the automated unit tests:**
   ```bash
   npm run test
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔒 License & Copyright

**Proprietary License — All Rights Reserved.**

Copyright (c) 2026 Madera Home. 

The source code, assets, styling, and design systems contained in this repository are proprietary. Unauthorized copying, redistribution, modification, or publication of this code, via any medium, is strictly prohibited without the express written permission of the copyright owner.
