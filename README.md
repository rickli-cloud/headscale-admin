# Headscale adm

![issues](https://img.shields.io/github/issues/rickli-cloud/headscale-admin)
![checks](https://img.shields.io/github/actions/workflow/status/rickli-cloud/headscale-admin/check-frontend.yaml)
![release](https://img.shields.io/github/v/release/rickli-cloud/headscale-admin)
![commits_since](https://img.shields.io/github/commits-since/rickli-cloud/headscale-admin/latest)

> [!NOTE]  
> This project is currently undergoing a complete makeover and still needs some work before its finished.

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
