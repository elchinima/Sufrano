# 🍷 Süfrano — Full-Stack Restaurant & Fine Dining Platform

**Süfrano** is a full-stack restaurant web application featuring an interactive catalog, multi-language interface (**AZ / EN / RU**), loyalty cashback & promo system, Wheel of Fortune, Stripe payments, Google OAuth, real-time order updates, and a comprehensive Admin Panel.

---

## 🎨 Design & Color Palette

The interface is styled in a **Burgundy & Gold** theme:
- **Primary Background (Burgundy):** `#4a0e1c`
- **Deep Surface Background (Dark Burgundy):** `#24050d`
- **Primary Accent (Gold):** `#d4af37` / `#e5c158` / `#f3cf7a`
- **Secondary Gold Accent:** `#b5892e`

---

## 🏗️ Project Structure

```text
Süfrano/
├── src/                      # Pure HTML5, CSS3, and Vanilla JS (ES Modules) frontend
│   ├── index.html            # Main entry point (links all CSS & /main.js)
│   ├── main.js               # Application bootstrapper
│   ├── App.js                # Root router and providers
│   ├── index.css             # Root CSS variables & global styles
│   ├── assets/               # Icons, SVGs (recolored to Gold/Burgundy), and images
│   ├── components/           # PublicPages, UserPages, AdminPages, Elements, Layout
│   ├── context/              # Auth, AdminAuth, Cart, Toast contexts
│   └── utils/                # Vanilla JS DOM runtime, router, motion animations, helpers
├── server/                   # .NET 10 Backend (Clean Architecture)
│   ├── Rednest.Core/         # Domain entities & interfaces
│   ├── Rednest.Application/  # DTOs & service contracts
│   ├── Rednest.Infrastructure/ # EF Core (PostgreSQL), Auth, Brevo Email, SignalR
│   └── Rednest.Api/          # REST API controllers & static file host for src/
├── secret/
│   └── .env                  # Environment variables (local development)
└── Dockerfile                # Production container for Render deployment
```

---

## ⚙️ Environment Variables (`secret/.env` & Render)

All configuration keys are loaded exclusively from environment variables (`secret/.env` locally, or Render Environment Variables in production):

- `ConnectionStrings__DefaultConnection` — PostgreSQL connection string (Neon / Render)
- `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE` — JWT authentication settings
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth 2.0 credentials
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe API keys
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` — Transactional & newsletter emails (`Süfrano`)
- `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD` — Initial SuperAdmin credentials
- `FRONTEND_URL` — Public URL for CORS & email links

---

## 🚀 Running Locally

Run the .NET 10 backend (which automatically loads `secret/.env` and serves the `src/` frontend at `http://localhost:5273`):

```powershell
cd server/Rednest.Api
dotnet run
```

Then open `http://localhost:5273` in your browser.
