# Headscale admin

![issues](https://img.shields.io/github/issues/rickli-cloud/headscale-admin)
![checks](https://img.shields.io/github/actions/workflow/status/rickli-cloud/headscale-admin/check-frontend.yaml)
![release](https://img.shields.io/github/v/release/rickli-cloud/headscale-admin)
![commits_since](https://img.shields.io/github/commits-since/rickli-cloud/headscale-admin/latest)

A fully featured admin UI to manage your headscale instance. Built with sveltekit and [Shadcn-svelte](https://shadcn-svelte.com/).

## Features

Full implementation of the headscale API. This includes:

- Users
  - Create
  - Delete
  - Edit
    - Name
- Machines
  - Register
  - Delete
  - Expire session
  - Edit
    - Name
    - Tags
    - Assigned user
- Routes
  - Enable / Disable
  - Delete
- PreAuth keys
  - Create
  - Expire
- Api keys
  - Create
  - Expire
- ACL
  - Raw
    - Show
    - Edit
  - Hosts
    - Create
    - Delete
    - Edit
      - Name
      - Prefix
      - Comment
  - Groups
    - Create
    - Delete
    - Edit
      - name
      - members
      - Owned tags
      - Comment
  - Access rules
    - Create
    - Delete
    - Edit
      - From / to targets
      - Protocol
      - Comment

## Documentation

- [**Configuration**](https://github.com/rickli-cloud/headscale-admin/blob/main/docs/configuration.md)
- [**Deploy**](https://github.com/rickli-cloud/headscale-admin/blob/main/docs/deploy.md)

## Test it out

> [!WARNING]  
> This is just a demo configuration with **disabled authentication**!  
> Do NOT use this for production. Read the docs carefully and test your setup!

```sh
git clone https://github.com/rickli-cloud/headscale-admin
cd headscale-admin
docker compose up -d
```

The UI should be listening on [http://localhost:8000](http://localhost:8000).

## Todo's

- Better error handling
