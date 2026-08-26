# Agent Guidelines & Rules

## File Reading & Context Rules

- **Do NOT read `/locales/` directory**: Unless explicitly instructed by the user, agents must **NEVER** inspect, read, view, or search inside the `/locales` folder (`/locales/*`) or any language localization files.
- **Do not load translations into context**: Avoid loading multiple locale files (`locales/*.js` / `locales/*.json`) to save context window and avoid unnecessary token consumption.
- **Localization changes**: Only inspect or modify specific locale files if the user explicitly requests changes to translation or language resources.
