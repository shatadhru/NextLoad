# create-next-load

CLI to quickly create a new application powered by [NextLoad](https://github.com/shatadhru/NextLoad).

## Quick Start

Run the command in your terminal:

```bash
npx create-next-load
```

Or pass the project directory directly:

```bash
npx create-next-load my-app
```

## Interactive Prompts

The CLI will guide you with simple questions:

1. **Project name** — Directory name for your new project
2. **Use MongoDB?** — `Yes` or `No` (default: `Yes`)
3. **MongoDB URL** — (if Yes) Database connection string (default: `mongodb://localhost:27017/nextload`)
4. **Base URL** — Base URL for your app (default: `http://localhost:3000`)

## What it does

- Clones the official NextLoad repository directly from GitHub.
- Removes the previous git history.
- Preconfigures your `.env` file with your MongoDB URL, Base URL, and generated secure secrets (`PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`).
- Installs dependencies using `npm install`.
- Displays immediate instructions to start developing.

## Publishing to npm

To publish this CLI so anyone can use `npx create-next-load`:

```bash
cd packages/create-next-load
npm login
npm publish --access public
```
