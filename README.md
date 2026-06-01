# Nuxt Lusion — Nuxt 4.4.4

## Project Structure

In Nuxt 4 the default **srcDir** is `app/` (no more top-level `pages/`, `components/`, etc.).

```
nuxt-lusion/
├── nuxt.config.ts             # future.compatibilityVersion: 4
├── package.json               # nuxt 4.4.4
└── app/                       # ← srcDir (Nuxt 4 default)
    ├── app.vue                # Root shell
    ├── assets/
    │   └── css/main.css       # All global styles
    ├── layouts/
    │   └── default.vue        # Wraps every page with <TheNavbar />
    ├── pages/
    │   ├── index.vue          # Home (Hero + Featured Work + NextPage + Footer)
    │   └── about.vue          # About Us
    └── components/
        ├── TheNavbar.vue
        ├── TheFooter.vue
        └── NextPage.vue
```

## Nuxt 4 changes vs Nuxt 3

| Area | Nuxt 3 | Nuxt 4 |
|---|---|---|
| Source dir | project root | `app/` |
| `~` alias | project root | `app/` |
| `asyncData` deduplication | per-component | shared by default |
| `useAsyncData` key | auto-generated | must be explicit for shared requests |
| `compatibilityDate` | optional | required |

## Hero Visual

The `HomeHeroVisual` animation wasn't in the uploaded files.
Replace the placeholder `<div>` in `app/pages/index.vue` with your component.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
