# SPARTAN

<img alt="The tip of a spear with the Angular A inside" width="350px" src="./spartan.svg" title="Spartan logo"/>

Example application running
on [Supabase](https://supabase.com/), [Drizzle](https://orm.drizzle.team/), [Analog](https://analogjs.org/),
[tRPC](https://trpc.io/), [Tailwind](https://tailwindcss.com/), [Angular](https://angular.io/),
and [Nx](https://nx.dev/).

## Prerequisites

- You will need `yarn` (or a different package manager) installed.
- You will need to set up a [Supabase](https://supabase.com/) account (it's free)
- You will need [NodeJs](https://nodejs.org/en) installed. The version I have working is `v16.16.0`.

## Install Dependencies

Run `yarn` or `yarn install` to install the dependencies of this project

## Set up DB

Your dependencies include Prisma, which is a great tool to manage your application's database.
As a database provider we will use Supabase an open source Firebase alternative that comes with
a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.

### Connect to DB

There are two ways to get up and running with Supabase:

1. Connecting directly to your managed instance on [supabase.com](https://supabase.com/)
2. Locally using [Docker](https://www.docker.com/)

### Option 1: Connecting to supabase.com instance

This way is super easy! Simply by creating your account, you will also have set up your first project.
This means that you are ready to connect to your projects database already!

Let's connect our application to our Supabase Postgres instance:

Add a `.env` file at the root of your Nx workspace and add the following code snippet

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-REFERENCE-ID].supabase.co:5432/postgres?schema=public"

```

### Option 2: Connecting to local supabase instance

Supabase also allows you to run a version of their system locally!
To get up and running you can follow [this guide](https://supabase.com/docs/guides/cli/local-development)!
They do a great job explaining how to get started and there is plenty of resources to help you if you get stuck.

If you want the quick and dirty way and are on a Mac. Here is what I did to get up and running:

#### Install supabase CLI

```shell
brew install supabase/tap/supabase
```

#### Log into CLI

```shell
supabase login
```

Create your access token from https://app.supabase.com/account/tokens and paste it into your
terminal window.

#### Create Supabase project

```shell
# if you are in the spartan directory move UP!!!
cd ..
# create your project folder
mkdir spartan-supabase

# move into the new folder
cd spartan-supabase

# start a new git repository — important, don't skip this step
git init
```

#### Start Supabase services

```shell
supabase init
```

and

```shell
supabase start
```

##### Important: Make sure Docker is running and configured correctly!

I had Docker already installed and running. However, my setup is not compatible with the config Supabase expects by
default.
I ran the following command to get it to work for now:

```shell
DOCKER_HOST=unix:///Users/[YOUR_USER_ACCOUNT_NAME]/.docker/run/docker.sock supabase start
```

For more info see [this issue on GitHub.](https://github.com/supabase/cli/issues/167)

#### Connect to local DB

The previous step can take a while as all the docker images have to be downloaded first.
However, once everything completes you will see a console output that looks like this:

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

Take your cyber-security hat off for a minute (we are working locally after all) and copy the connection string:

```
postgresql://postgres:postgres@localhost:54322/postgres
```

Add a `.env` file at the root of your Nx workspace and add the connection string like so:

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres?schema=public"

```

Perfect! You should be able to connect to your local Supabase Postgres instance now!

#### Important: Stop at Database Migrations

You can stop the guide when you get to "Database Migrations". We will take care of this in the next step!

### Initializing the DB

Now that we have successfully set up our DB we need to set up our database schema.
Primsa makes this super easy!!

- We can push the schema defined in our `schema.prisma` file to our DB running

```shell
yarn prisma db push
```

- Finally, we create our prisma client by running

```shell
yarn prisma generate
```

That's it! Now our DB should be all set up and ready to go!

## Development server

Run

```shell
yarn nx serve analog-trpc
```

for a dev server. Navigate to http://localhost:4200/. The app will automatically reload
if you change any of the source files.

## Understand this workspace

Run `yarn nx graph` to see a diagram of the dependencies of the projects.

## Further help

Reach out to me on [Twitter](https://twitter.com/goetzrobin/) or [GitHub](https://github.com/goetzrobin) if you run into
any issues.
