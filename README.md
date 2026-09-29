# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin Portfolio Content

To enable editing projects, experience, and skills from the admin page, run [`supabase/portfolio_content_policies.sql`](supabase/portfolio_content_policies.sql) in the Supabase SQL Editor. It creates separate `portfolio_projects`, `portfolio_experience`, and `portfolio_skills` tables, with one row per item and its fields in columns. If the previous `portfolio_content` JSON row exists, the script imports it once. Anyone can read the portfolio rows, but only users with the `admin` app metadata role can change them. Sign in to `/admin`, open the Portfolio tab, make changes, and select **Save changes**. Until the tables are available, the public portfolio uses the content bundled with the site.
