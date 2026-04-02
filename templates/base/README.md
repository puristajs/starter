# PURISTA Application

Welcome to your PURISTA based application. The template already contains a `ping` service with

- a synchronous `POST /api/v1/ping` command
- an asynchronous `POST /api/v1/ping/async` command that enqueues work
- a queue (`pingJob`) plus worker processing jobs sequentially

Run `npm start` (or `pnpm start`, etc.) to boot the DefaultEventBridge, start the ping service, and expose the HTTP endpoints through the Hono HTTP server (if you selected it during scaffolding).

The official documentation can be found at **[purista.dev](https://purista.dev)**.

## Reliability defaults in this template

- queue workers start conservatively (`sequential`, `prefetch: 1`) for predictable local behavior
- queue retries are bounded and dead-lettered automatically once retry budget/window is exhausted
- startup validation is strict for requested broker guarantees, so unsupported semantics fail fast
- you can explicitly dead-letter from workers with `context.job.moveToDeadLetter(reason?)`

You can install the PURISTA CLI globally:

```sh
npm i -g @purista/cli
```

Or run it with `npx @purista/cli`.

In the root of this project:

- run `purista add service` to add another service
- run `purista add command` to add additional commands to an existing service
- run `purista add subscription` to react to additional events
- run `purista add queue` whenever you need another pull-based worker

---

- Official Website: **[purista.dev](https://purista.dev)**
- Follow on Twitter **[@purista_js](https://twitter.com/purista_js)**
- Join the **[Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---
