# TechShop — AI-powered electronics store

Modern e-commerce MVP for selling smartphones and laptops in Kazakhstan, with a
built-in AI consultant powered by the OpenAI API. Fully bilingual — **Russian
(ru)** and **Kazakh (kz)** — with dark mode.

> Apple-style minimalistic UI · Framer Motion animations · Tailwind · React Router

---

## ✨ Features

- 🛍 **Catalog** — 12 demo products (6 smartphones, 6 laptops) with realistic specs and KZT prices
- 🔎 **Search**, category **filtering**, price/rating **sorting**
- 🧾 **Product details** page with full spec table and related items
- 🤖 **AI Assistant** — ChatGPT-style chat with typing indicator, runs on OpenAI API or a graceful demo fallback
- 🌐 **i18n** — instant language switch between Russian and Kazakh
- 🌗 **Dark mode** with `localStorage` persistence and system-pref detection
- 🛒 **Cart** counter with `localStorage` persistence
- 💀 **Loading skeletons** with shimmer
- 📱 Fully **responsive** (mobile menu, fluid grid)
- 🎯 Reusable components, clean folder layout, context-based state

---

## 🧱 Project structure

```
src/
├── components/        # Reusable UI (Navbar, ProductCard, ChatMessage, ...)
├── pages/             # Route-level pages (Home, Products, AI, About, ...)
├── layouts/           # MainLayout wrapper (Navbar + Outlet + Footer)
├── context/           # Theme, Language, Cart providers
├── hooks/             # useFormatPrice, useFakeLoading
├── data/              # products.js, translations.js
├── utils/             # openai.js (API wrapper + demo fallback)
├── App.jsx            # Router
├── main.jsx           # Entry, provider composition
└── index.css          # Tailwind layers + utility classes
```

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Add your OpenAI key

Copy the example env file and paste in your key:

```bash
cp .env.example .env
```

```env
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_OPENAI_MODEL=gpt-4o-mini   # optional, defaults to gpt-4o-mini
```

If you skip this step the AI page still works in **demo mode** with hand-tuned
templated replies — perfect for screenshots.

> ⚠️ The key is exposed to the browser when using `VITE_*` vars. This is fine
> for local demos / MVPs but for production you should proxy the request
> through your own backend.

### 3. Run the dev server

```bash
npm run dev
```

The site opens at <http://localhost:5173>.

### 4. Production build

```bash
npm run build
npm run preview
```

---

## 🧪 Routes

| Path                | Page              |
| ------------------- | ----------------- |
| `/`                 | Home              |
| `/products`         | Catalog + filters |
| `/products/:id`     | Product details   |
| `/ai`               | AI Assistant chat |
| `/about`            | About TechShop    |

`/products?category=smartphones` deep-links into a filtered view.

---

## 🖼 Replacing demo images

Product images come from Unsplash via direct URLs in `src/data/products.js`.
Swap the `image` field on each product with your own asset paths
(`/public/images/...`) and the cards will pick them up automatically.

---

## 🧠 How the AI consultant works

`src/utils/openai.js` wraps the **Chat Completions** API. The system prompt
embeds the full TechShop catalog as JSON so the model can recommend real
in-stock products with accurate prices and specs. The assistant replies in
whatever language the user wrote (Russian or Kazakh by default).

When `VITE_OPENAI_API_KEY` is missing, `demoReply()` returns a curated
hand-written answer matching the user's intent (gaming / programming /
budget). The UI is identical — typing indicator, bubbles, examples — so you
can demo without an API key.

---

## 🛠 Tech stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (custom palette + dark mode via `class`)
- **React Router 6**
- **Framer Motion 11** — entrance + hover animations
- **Lucide React** — icons
- **OpenAI Chat Completions** — AI consultant

---

## 📜 License

MIT — built as a startup-style MVP. Use freely for your own store.
