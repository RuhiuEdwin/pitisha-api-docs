# Pitisha API documentation

Guides, a full API reference and a simulated try-it for the Pitisha API. Built with Next.js (static export), TypeScript and Tailwind CSS.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## How it is organised

| Path | What it is |
| --- | --- |
| `src/content/api.ts` | The single source of truth for the API: resources, endpoints, parameters, examples and error codes |
| `src/content/guides/*.md` | The guides, one Markdown file each. Add one and list it in `GUIDE_ORDER` in `src/lib/docs.ts` |
| `src/lib/snippets.ts` | Generates the cURL, JavaScript and Python samples from each endpoint |
| `src/lib/simulate.ts` | The in-browser sandbox behind "Try it" |
| `src/lib/openapi.ts` | Builds `/openapi.json` (OpenAPI 3.1) from the same data |

Because the reference, the code samples and the OpenAPI file all come from `api.ts`, they cannot drift apart. Change an endpoint once and all three update.

## Notes on the content

- **The base URL is a placeholder.** Samples use `$PITISHA_API`, and the OpenAPI file has a `baseUrl` server variable. Fill in the real sandbox and live URLs when they exist.
- **"Try it" is simulated in the browser.** It sends nothing and needs no key. It checks required fields and amounts, and plays the sandbox scenarios.
- **The webhook signature scheme and the endpoints are a proposal.** They are written to be complete and consistent, and the backend should be built to match them, or this file updated to match the backend.
- **Nothing here says Pitisha is live, licensed or holds funds**, and it should not until that is true.

## Deploy

Import the repo in Vercel. Defaults work: framework Next.js, output is a static export.
