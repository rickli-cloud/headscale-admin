# Headscale admin

![issues](https://img.shields.io/github/issues/rickli-cloud/headscale-admin)
![checks](https://img.shields.io/github/actions/workflow/status/rickli-cloud/headscale-admin/check-frontend.yaml)
![release](https://img.shields.io/github/v/release/rickli-cloud/headscale-admin)
![commits_since](https://img.shields.io/github/commits-since/rickli-cloud/headscale-admin/latest)

A fully featured admin UI to manage your headscale instance over the GRPC API unix socket. Built with sveltekit and [Shadcn-svelte](https://shadcn-svelte.com/).

> If you rather want to manage your headscale instance using api keys over the REST API check out [@rickli-cloud/headscale-static-admin](https://www.github.com/rickli-cloud/headscale-static-admin).

## Features

Full implementation of the headscale GRPC API. This includes:

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

## Documentation

> [!WARNING]  
> There is no authentication built in.
> Read the docs carefully and test your setup!
> A faulty configuration could allow everyone with network access to control your headscale instance!

- [**Configuration**](https://github.com/rickli-cloud/headscale-admin/blob/main/docs/configuration.md)
- [**Deploy**](https://github.com/rickli-cloud/headscale-admin/blob/main/docs/deploy.md)
- [**FAQ**](https://github.com/rickli-cloud/headscale-admin/blob/main/docs/faq.md)

## Test it out

This launches a very basic configuration with the UI listening on [http://localhost:8000](http://localhost:8000).

```sh
git clone https://github.com/rickli-cloud/headscale-admin
cd headscale-admin
docker compose up -d
```
