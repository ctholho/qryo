# Qryo – brainfreezingly simple offline-first apps

Qryo helps you build offline-first web apps. It concerns itself with server requests. To make assets (js, css, html) available offline you should rely on different technologies like PWAs or hybrid mobile apps.

However, Qryo is not yet functional. This is a proof of concept and public lab and I'm playing around with tanstack/query, Nuxt and Directus.

## Running example

Easiest way is to open this project in Gitpod. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ctholho/qryo)

If the main terminal doesn't run automatically, run `make start`.
This starts a Nuxt example, Directus Instance and Vitepress for the docs.
Making changes to `packages/qryo` will trigger a build and should be reflected in the Nuxt example.

See which JS scripts are running with `pm2 ps`. Get the build logs for the packages by running `pm2 logs packages`
or run `make logs`.

Run `make help` for all available commands.

## Roadmap

1. Handle authentication and offer tools for offline authentication (if offline data is available)
2. Encrypt user data
  * Consider putting encryption logic into web worker for client performance
  * The query persister needs to have access to app context like user credentials.
3. Find the best way to prefetch "all necessary" data on app initialization. E.g.:
  * Require devs to handle it themselves
  * Offer global config, this still requires duplicated explicit naming of the endpoints (in component and in config)
  * Parse codebase during build process and prefetch data if queries satisfy a prefetch signal. How should that look? What about paginated queries? How to handle dynamic useQuery calls? This is impossible:
  ```
  { prefetch, ...someQuery } = useQuery({
    queryKey: ['todos', todoId],
    queryFn: async () => await fetchTodoById(todoId)
  })
  ```
4. 
