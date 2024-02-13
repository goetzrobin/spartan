# spartan

<a href="https://spartan.ng" target="_blank">
<img alt="A spartan shield" width="200px" src="./spartan.svg" title="Spartan logo"/>
</a>

[![Discord server](https://dcbadge.vercel.app/api/server/EqHnxQ4uQr?style=flat-square)](https://discord.gg/EqHnxQ4uQr) [![Twitter](https://img.shields.io/twitter/follow/goetzrobin?color=%23DD0031&style=flat-square)](https://twitter.com/goetzrobin)

Welcome to the spartan mono-repo. This Nx repository holds both the
spartan/stack and spartan/ui libraries.

##### Important: This is a work in progress, and we update the README as major development efforts are started.

## The 300 spartans

All of spartan is an MIT-licensed open source project with its ongoing development made possible by contributors and sponsors.

Our initial 300 contributors and sponsors are featured here and on the front page of [spartan.ng](https://spartan.ng)

1. [goetzrobin](https://github.com/goetzrobin)
2. [elite-benni](https://github.com/elite-benni)
3. [thatsamsonkid](https://github.com/thatsamsonkid)
4. [mihajm](https://github.com/mihajm)
5. [ajitzero](https://github.com/ajitzero)
6. [arturgawlik](https://github.com/arturgawlik)
7. [deepakrudrapaul](https://github.com/deepakrudrapaul)
8. [evanfuture](https://github.com/evanfuture)
9. [AdditionAddict](https://github.com/AdditionAddict)
10. [Altamimi-Dev](https://github.com/Altamimi-Dev)
11. [ferat](https://github.com/ferat)
12. [jeremy-js-devweb](https://github.com/jeremy-js-devweb)
13. [heddendorp](https://github.com/heddendorp)
14. [tutkli](https://github.com/tutkli)
15. [Pascalmh](https://github.com/Pascalmh)
16. [okkindel](https://github.com/okkindel)
17. [marcjulian](https://github.com/marcjulian)
18. [oidre](https://github.com/oidre)
19. [nartc](https://github.com/nartc)
20. [santoshyadavdev](https://github.com/santoshyadavdev)
21. [markostanimirovic](https://github.com/markostanimirovic)
22. [theo-matzavinos](https://github.com/theo-matzavinos)
23. [jkuri](https://github.com/jkuri)
24. [dongphuong0905](https://github.com/dongphuong0905)
25. [DominikPieper](https://github.com/DominikPieper)
26. [brandonroberts](https://github.com/brandonroberts)
27. [izikd-](https://github.com/izikd-)
28. [ryancraigmartin](https://github.com/ryancraigmartin)
29. [gaetanBloch](https://github.com/gaetanBloch)
30. [gergobergo](https://github.com/gergobergo)
31. [rpacheco124](https://github.com/rpacheco124)
32. [benjaminforras](https://github.com/benjaminforras)
33. [jstnjs](https://github.com/jstnjs)
34. [r3ps4J](https://github.com/r3ps4J)

[Become a spartan today!](https://github.com/sponsors/goetzrobin)

## spartan/ui

spartan/ui is our effort to port the incredible shadcn/ui project over to the Angular ecosystem.

The idea is to create un-styled primitives similar to Radix with the help of the Angular CDK and other proven community solutions
And then add the beautiful shadcn styles with primitives (and components where necessary).

You can find all UI primitives in the `libs/ui` folder.

Each primitive is made up off an un-styled `brain` library, which provides all functionality and a `helm` library, which adds the styles.

There's also a `libs/cli` folder, which contains the Nx-plugin & Angular CLI code that allows users to add spartan/ui to their Nx or Angular workspace in a simple way.

#### Install Dependencies

Run `pnpm install` to install the dependencies of this project.

### Development with storybook

A storybook project is set up and is the primary way to develop UI components. You can run it with:

```
pnpm storybook
```

At the root of each primitive's folder, e.g. `libs/ui/accordion` you will find a stories file, e.g, `accordion.stories.ts`.

Use these files to add stories and drive development of the primitives.

### Testing

spartan uses [Jest](https://jestjs.io) for tests. To test all projects locally, run the following command from the root
folder:

```shell
pnpm test
```

### e2e testing

Cypress e2e testing is set up to run on the storybook. You can run it with:

```
pnpm e2e
```

To add your own `e2e` tests add them to the `apps/ui-storybook-e2e` application.

### Progress (34/41)

We finished porting over 33/41 UI primitives. See a more detailed breakdown [here!](./libs/ui/README.md)

## spartan/stack

An example application running
on [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/), [Analog](https://analogjs.org/),
[tRPC](https://trpc.io/), [Tailwind](https://tailwindcss.com/), [Angular](https://angular.io/),
and [Nx](https://nx.dev/). It also serves as the documentation page introducing the stack and UI library.

Follow the directions in the official documentation to set up your own project:
https://www.spartan.ng/stack/overview

### Example App

In the `apps` folder of this repository, you can also find an example application of the spartan stack.
It also serves as the documentation page for this project.

For now. The goal is to move the docs to Astro.

Follow the directions below to get it up and running:

#### Prerequisites

- You will need `pnpm` (or a different package manager) installed.
- You will need to set up a [Supabase](https://supabase.com/) account (it's free)
- You will need [NodeJs](https://nodejs.org/en) installed. The version I have working is `18.13.0`.

#### Development server

Then you can run the following command:

```shell
pnpm nx serve app
```

or

```shell
pnpm dev
```

for a dev server. Navigate to http://localhost:4200/. The app will automatically reload
if you change any of the source files.

#### Database

We use Drizzle to connect to a Supabase instance for the example app.

Add an `.env` file to your repo with the following contents:

Add a `.env` file at the root of your Nx workspace and add the connection string like so:

```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-REFERENCE-ID].supabase.co:5432/postgres?schema=public"
```

And make sure to run the following script in your Supabase editor to set up the necessary tables:

```sql
create table
  public.note (
    id bigserial,
    title text not null,
    content text null,
    created_at timestamp with time zone null default current_timestamp,
    constraint notes_pkey primary key (id)
  ) tablespace pg_default;
```

> [!NOTE] > `.env` should be added to `.gitignore`

## Understand this workspace

Run `pnpm nx graph` to see a diagram of the dependencies of the projects.

## Further help

Reach out to me on [Twitter](https://twitter.com/goetzrobin/) or [GitHub](https://github.com/goetzrobin) if you run into
any issues.
