# 2D Pro System — Project Specification & System Architecture Document

**Document Version:** 1.1  
**Application Version:** 2.6  
**Last Updated:** June 13, 2026  
**Repository:** [nyi-nyi-lynn/profit_calculator](https://github.com/nyi-nyi-lynn/profit_calculator)

---

## 1. Executive Summary

The **2D Pro System** is a client-side web application for Myanmar-language users who operate **2D lottery (ဒိုင်စနစ်)** bookkeeping. It calculates daily profit across two sessions per day — **morning (မနက်ပိုင်း)** and **evening (ညနေပိုင်း)** — from sales turnover (T) and payout amounts (P), applies configurable commission and personal profit percentages, and persists records per authenticated user in **Supabase PostgreSQL**.

Version 2.6 adds **form validation**, **loading states**, **toast notifications**, and **MM/EN language toggle** while preserving all core business logic from v2.5.

Version 2.5 introduced a **multi-user authentication layer**: users sign in with email/password via Supabase Auth. Public self-registration is not offered in the UI; accounts are created administratively. Each user sees and saves only their own records, enforced by `user_id` filtering and Supabase Row Level Security (RLS).

The app has two primary tabs:

1. **Calculate (တွက်ချက်မည်)** — enter daily figures, compute results, optionally save to the database, and view the current ISO week's summary table.
2. **History (စာရင်းဟောင်းများ)** — browse saved records by current week, current month, or full year with drill-down navigation.

The UI is **Burmese-first** with English toggle, mobile-aware, and deployed as a static site (suitable for **GitHub Pages** or **Vercel**). There is no build step, bundler, or backend server beyond Supabase.

---

## 2. Tech Stack Architecture

### 2.1 Frontend

| Layer | Technology | Details |
|-------|------------|---------|
| Markup | **HTML5** | Single-page app in `index.html`; auth gate + main app sections |
| Styling | **CSS3** | `css/styles.css` + inline styles in `index.html` |
| Logic | **Vanilla JavaScript (ES6+)** | No frameworks; modular script loading |
| SDK | **Supabase JS SDK v2** | CDN (`@supabase/supabase-js@2` via jsDelivr) |
| i18n | **js/i18n.js** | MM/EN translation dictionary and `t()` helper |
| UI Utils | **js/ui-utils.js** | Toast notifications, loading overlay, input validation |

### 2.2 Backend / Data

| Layer | Technology | Details |
|-------|------------|---------|
| BaaS | **Supabase** | Auth + PostgreSQL REST API |
| Database | **PostgreSQL** (`daily_records` table) | Upsert on `(user_id, record_date)` composite key |
| Security | **Supabase Auth + RLS** | Session-based; client attaches `user_id` on save; reads filtered by `user_id` |

### 2.3 Hosting & Deployment

| Aspect | Details |
|--------|---------|
| Repo | GitHub: `https://github.com/nyi-nyi-lynn/profit_calculator.git` |
| Hosting (intended) | **GitHub Pages** and/or **Vercel** — static file hosting |
| Architecture pattern | **Jamstack / static SPA** → browser → Supabase cloud |

### 2.4 Script Load Order

```
1. @supabase/supabase-js@2  (CDN)
2. js/supabase-config.js    → creates supabaseClient
3. js/i18n.js               → translations, t(), applyLanguage()
4. js/ui-utils.js           → toast, loading, validation
5. js/db-service.js         → saveDailyRecord, getAllRecordsFromDB
6. js/app.js                → auth, UI, business logic
```

---

## 3. Core Feature Specifications

### 3.1 Authentication & Multi-User Isolation

| Feature | Behavior |
|---------|----------|
| Login-only flow | Email + password form; no sign-up UI |
| Admin-provisioned accounts | UI directs users to contact Telegram `@nyinyilynn` |
| Session persistence | On load, `getSession()` restores logged-in state |
| Logout | Clears session, resets auth form, hides result board |
| Loading states | Buttons disabled + global overlay during auth/DB ops |

### 3.2 Calculation Tab

| Feature | Behavior |
|---------|----------|
| Commission % | Default **18%** |
| Personal profit % | Default **2.5%** |
| Date picker | **Auto-selects today** on page load |
| Input validation | Non-negative numbers only; blocks invalid characters |
| Profit formulas | `sales × (1 − comm%) − payout × 80` per session |
| Conditional save | Auto-save checkbox (default on) vs manual save button |
| Weekly block table | ISO week table; weekends excluded from rows |

### 3.3 History Tab

| Filter | Scope |
|--------|-------|
| Current week | ISO week of current year |
| Current month | Weekly summary blocks |
| All | Year selector with month → week drill-down |

### 3.4 Version 2.6 Enhancements

| Feature | Implementation |
|---------|----------------|
| Form validation | `js/ui-utils.js` — sanitize on input, validate before calculate |
| Loading states | Global overlay + per-button spinner text |
| Toast notifications | Replaces all `alert()` calls |
| Localization | MM/EN toggle via `js/i18n.js`; persisted in `localStorage` |

---

## 4. Database & State Schema

### 4.1 `daily_records` Table

| Column | Description |
|--------|-------------|
| `user_id` | UUID from Supabase Auth |
| `record_date` | `YYYY-MM-DD` |
| `comm_percent` | Commission % at save time |
| `my_profit_percent` | Personal profit % at save time |
| `am_sales`, `am_payout` | Morning session inputs |
| `pm_sales`, `pm_payout` | Evening session inputs |
| `total_day_profit`, `total_my_profit` | Rounded computed totals |

**Unique constraint:** `(user_id, record_date)`

### 4.2 Client-Side State

| Variable | Purpose |
|----------|---------|
| `temporaryCalculatedRecord` | Last calculation payload for manual save |
| `dbCachedRecords` | In-memory cache after DB fetch |
| `currentFilter` | `"week"` \| `"month"` \| `"all"` |
| `selectedYear` | Year for "all" filter |
| `navigationState` | History drill-down state |
| `currentLang` | `"mm"` \| `"en"` (in `i18n.js`) |

---

## 5. Code File Mapping

```
2dprofit/
├── docs/
│   └── ARCHITECTURE.md      # This document
├── index.html               # SPA shell, DOM structure, data-i18n attributes
├── css/
│   └── styles.css           # Base + toast, loading, validation styles
└── js/
    ├── supabase-config.js   # Supabase client initialization
    ├── i18n.js              # MM/EN translations and language toggle
    ├── ui-utils.js          # Toast, loading overlay, input validation
    ├── db-service.js        # Database read/write abstraction
    └── app.js               # Auth, business logic, UI rendering
```

### Data Flow (Calculate + Save)

```
User Input → validateCalculationForm()
          → handleCalculateAndDecision() [business logic unchanged]
          → temporaryCalculatedRecord
          → renderResultsToUI()
          → [auto-save?] executeSaveProcess() → saveDailyRecord()
          → refreshWeeklyTableBlock() → getAllRecordsFromDB()
```

---

## 6. Security Considerations

| Area | Current State |
|------|---------------|
| API key | Anon/publishable key in client (RLS must protect data) |
| Auth | Password-based; admin-only account creation |
| Data isolation | Client `user_id` filter + server-side RLS |
| Input validation | Client-side sanitization before calculations |
