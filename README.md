# Bryllupsside — Miriam & Gjermund

Bryllupsside bygget med [Next.js](https://nextjs.org) (App Router), publisert som statiske filer på GitHub Pages.

## Kjøre lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Bygge statisk versjon

```bash
npm run build
```

Lager en statisk eksport i `out/`-mappen (`output: 'export'` i `next.config.mjs`).

## Deploy til GitHub Pages

Deploy skjer automatisk via GitHub Actions hver gang det pushes til `main`
(se `.github/workflows/deploy.yml`).

**Engangsoppsett** etter første push:

1. Gå til **Settings → Pages** i repoet.
2. Under **Build and deployment → Source**, velg **GitHub Actions**.

Siden blir da tilgjengelig på `https://folk-hub.github.io/m-g-bryllup/`.

### Egen domene (valgfritt)

Legger man til et eget domene under **Settings → Pages**, tilpasser bygget seg
automatisk: workflowen leser `base_path` fra Pages-konfigurasjonen, så
`NEXT_PUBLIC_BASE_PATH` blir tom og lenker/bilder peker mot roten i stedet for
`/m-g-bryllup/`. Ingen kodeendringer nødvendig.

## Bilder og video

Statiske filer ligger i `public/` og refereres med base-prefiks
(`${BASE}/foto4.jpg`) slik at de fungerer både lokalt og under prosjektstien på
GitHub Pages.
