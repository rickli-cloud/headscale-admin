# Frontend

A sveltekit single page app built with [Shadcn-svelte](https://shadcn-svelte.com/).

## Configuration

### Environment variables

```sh
cp example.env .env
```

| key                   | description                                                                         | default GRPC | default REST |
| --------------------- | ----------------------------------------------------------------------------------- | ------------ | ------------ |
| `HEADSCALE_HOST`      | Headscale API host. In dev mode vite spins up a proxy to prevent CORS issues        |              |              |
| `BASE_PATH`           | Base path the UI gets served on. Used to run the UI on the same domain as Headscale | `/`          | `/admin`     |
| `PUBLIC_AUTH_ENABLED` |                                                                                     | `false`      | `true`       |

## Dependencies

```sh
npm install
```

## Develop

Run the dev server

```sh
npm run dev
```

## Test

This just runs basic typescript checks

```sh
npm run check
```

## Build

> You can download a archive containing the frontend build for each released version in the corresponding assets

```sh
npm run build
```
