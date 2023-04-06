# SPARTAN

<img alt="The tip of a spear with the Angular A inside" width="350px" src="./spartan.svg" title="Spartan logo"/>

Example application running on [Supabase](https://supabase.com/), [Prisma](https://www.prisma.io/), [Analog](https://analogjs.org/), 
[tRPC](https://trpc.io/), [Tailwind](https://tailwindcss.com/), [Angular](https://angular.io/), and [Nx](https://nx.dev/).

## Prerequisites

- You will need `yarn` (or a different package manager) installed.
- You will need to set up a [Supabase](https://supabase.com/) account (it's free)
- You will need [NodeJs](https://nodejs.org/en) installed. The version I have working is `v16.16.0`.

## Install Dependencies

Run `yarn` or `yarn install` to install the dependencies of this project

## Set up DB

Your dependencies include Prisma, which is a great tool to manage your application's database.
We need two things to connect our application to our Supabase postgres instance:
- Add a  `.env` file at the root of your Nx workspace and add the following code snippet
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-REFERENCE-ID].supabase.co:5432/postgres?schema=public"

```
- Alternatively, you can also run a postgres instance locally and pass the URL the same way!
- We can push the schema defined in our `schema.prisma` file to our DB running `yarn prisma db push`.
- Finally, we create our prisma client by running `yarn prisma generate`.

Now our DB should be all set up and ready to go!

## Building the tRPC and analog integration

Run `yarn nx build trpc` to create the `@spartan/trpc` integration.

Note: This should happen automatically since the `analog-trpc` app depends on the `trpc` lib, but it does not currently.

## Development server

Run `yarn nx serve analog-trpc` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `yarn nx graph` to see a diagram of the dependencies of the projects.

## Further help

Reach out to me on [Twitter](https://twitter.com/goetzrobin/) or [GitHub](https://github.com/goetzrobin) if you run into any issues.
