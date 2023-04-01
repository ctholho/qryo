# Qryo

Playing around with offline-first queries with tanstack/query, Nuxt and Directus.

## Running example

Easiest way is to open this project in Gitpod. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ctholho/qryo)

If the main terminal doesn't run automatically, run `make start`.
This starts a Nuxt example, Directus Instance and Vitepress for the docs.
Making changes to `packages/qryo` will trigger a build and should be reflected in the Nuxt example.

See which JS scripts are running with `pm2 ps`. Get the build logs for the packages by running `pm2 logs packages`
or run `make logs`.

Run `make help` for all available commands.
