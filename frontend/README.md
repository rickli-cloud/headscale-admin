# Headscale admin

![issues](https://img.shields.io/github/issues/rickli-cloud/headscale-admin)
![checks](https://img.shields.io/github/actions/workflow/status/rickli-cloud/headscale-admin/check.yaml)
![release](https://img.shields.io/github/v/release/rickli-cloud/headscale-admin)
![commits_since](https://img.shields.io/github/commits-since/rickli-cloud/headscale-admin/latest)

A sveltekit single page app to manage your headscale instance over the REST API with a beautiful UI built with [Shadcn-svelte](https://shadcn-svelte.com/).

## Features

Full implementation of the headscale REST API. This includes:

- Users
  - Create
  - Rename
  - Delete
- Machines
  - Register
  - Rename
  - Edit tags
  - Delete
  - Expire session
  - Reassign
- Routes
  - Enable / Disable
  - Delete
- PreAuth keys
  - Create
  - Expire
- Api keys
  - Create
  - Expire

## Install

The app is only served on the `/admin` path. If you want another path you need to build the app from source.

### Docker

For a full example using traefik as reverse proxy see `docker-compose.yaml`.

```yaml
version: '3.8'

services:
  headscale-admin:
    image: ghcr.io/rickli-cloud/headscale-admin
    container_name: headscale-admin
    pull_policy: always
    restart: always
    ports:
      - 80:80/tcp
```

### Static content

You can download a archive containing the static content for each version on the release page.

### Build your own

Configure environment

> If you do not want to serve the app on the `/admin` path you need to change `BASE_PATH`.

```sh
cp example.env .env
```

Install & build

```sh
npm install
npm run build
```

### Just want it running

Requires nodejs & npm.

> In dev mode vite will spin up a proxy to work around CORS issues. Do not change the API host on the login page.

```sh
git clone https://github.com/rickli-cloud/headscale-admin/
cd headscale-admin
npm install
export HEADSCALE_HOST=https://your.headscale.instance
npm run dev
```
