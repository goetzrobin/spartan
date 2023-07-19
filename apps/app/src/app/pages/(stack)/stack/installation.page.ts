import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui/typography/helm';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { CodeComponent } from '~/app/shared/code/code.component';
import { TabsComponent } from '~/app/shared/layout/tabs.component';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui/alert/helm';
import { HlmIconComponent } from '@spartan-ng/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixExclamationTriangle } from '@ng-icons/radix-icons';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';

export const routeMeta: RouteMeta = {
  data: { breadcrumb: 'Installation' },
  meta: metaWith('spartan/stack - Installation', 'Get up and running with the spartan/stack.'),
  title: 'spartan/ui - Installation',
};

@Component({
  selector: 'spartan-stack-installation',
  standalone: true,
  imports: [
    MainSectionDirective,
    SectionIntroComponent,
    SectionSubHeadingComponent,
    PageBottomNavComponent,
    PageBottomNavLinkComponent,
    PageNavComponent,
    PageNavLinkComponent,
    CodeComponent,
    TabsComponent,
    HlmAlertDescriptionDirective,
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconComponent,
    HlmButtonDirective,
  ],
  providers: [provideIcons({ radixExclamationTriangle })],
  template: `
    <section spartanMainSection>
      <spartan-section-intro name="Installation" lead="Get up and running with the spartan/stack." />

      <spartan-section-sub-heading first id="nx">Setting up your Nx workspace</spartan-section-sub-heading>

      <p class="${hlmP}">
        As mentioned before, the spartan/stack starts with an Nx workspace. Even better, AnalogJs comes with first class
        Nx support and a preset, which will set up our favorite meta-framework for you out of the box!
      </p>

      <p class="${hlmP}">Simply enter the following command:</p>

      <spartan-code class="my-6" language="sh" code="npx create-nx-workspace@latest --preset=@analogjs/platform" />

      <p class="${hlmP}">You will be prompted to answer the following questions:</p>
      <spartan-code
        disableCopy
        class="my-6"
        language="sh"
        code="What name would you like to use for your AnalogJs app?<br>Add TailwindCSS for styling?<br>Add tRPC for typesafe client/server interaction?"
      />
      <p class="${hlmP}">
        Give your application a meaningful name (we will refer to this as
        <code class="${hlmCode}">[YOUR_APP_NAME]</code> in this guide) and press <code class="${hlmCode}">y/Y</code> to
        add both TailwindCSS and tRPC to your application.
      </p>

      <spartan-section-sub-heading id="analogjs">AnalogJs, Angular, TailwindCSS, and tRPC</spartan-section-sub-heading>

      <p class="${hlmP}">
        With this simple command you will have a working Nx workspace that includes an example AnalogJs application,
        with TailwindCSS and tRPC already set up!
      </p>

      <!-- TODO: add exploration of set up workspace here -->

      <spartan-section-sub-heading id="drizzle">Drizzle</spartan-section-sub-heading>
      <p class="${hlmP}">
        Currently, we use an in memory array to store the notes of our example application. Let's persist our data in an
        actual database. We will use the Drizzle ORM for that. Let's first install the dependency:
      </p>
      <spartan-code class="mt-6" language="sh" code="npm install drizzle-orm postgres" />
      <p class="${hlmP}">
        Then, we need to set up our DB connection and create a typescript schema that matches our database structure. We
        will add a <code class="${hlmCode}">apps/[YOUR_APP_NAME]/src/db.ts</code> file with the following content:
      </p>
      <spartan-code
        class="my-6"
        language="ts"
        code="
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import postgres from 'postgres';

export const notes = pgTable('note', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Note = InferModel<typeof notes>;
export type NewNote = InferModel<typeof notes, 'insert'>;

const client = postgres(process.env['DATABASE_URL'] ?? '');
export const db = drizzle(client);"
      />

      <p class="${hlmP}">
        We first declare our notes table and make Drizzle aware of all its columns and their respective types. We then
        declare some helper types, that we will use when we retrieve and create our Notes. Finally, we initialize our
        Postgres client and pass it to Drizzle
      </p>

      <p class="${hlmP}">
        Let's now use drizzle to read, create, and delete our notes. We adjust the
        <code class="${hlmCode}">apps/[YOUR_APP_NAME]/src/server/trpc/routers/notes.ts</code> file like so:
      </p>
      <spartan-code
        class="my-6"
        language="ts"
        code="
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db, notes } from '../../../db';
import { eq } from 'drizzle-orm';

export const noteRouter = router({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(
      async ({ input }) => await db.insert(notes).values({ content: input.content, title: input.title }).returning()
    ),
  list: publicProcedure.query(async () => {
    const selectedNotes = await db.select().from(notes);
    return selectedNotes.map((note) => ({ ...note, id: +note.id }));
  }),
  remove: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => await db.delete(notes).where(eq(notes.id, input.id)).returning()),
});"
      />

      <p class="${hlmP}">
        Awesome! This is all we need to persist our data. Now that we are using type-safe database interactions only one
        thing is missing: A database!
      </p>

      <spartan-section-sub-heading id="supabase">Supabase</spartan-section-sub-heading>
      <p class="${hlmP}">
        We will use Supabase as our database infrastructure provider. There are two ways to get up and running with
        Supabase:
      </p>

      <ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
        <li>Connecting directly to your managed instance on supabase.com</li>
        <li>Locally using Docker</li>
      </ol>

      <h3 class="${hlmH4}">Option 1: Connecting to supabase.com instance</h3>
      <p class="${hlmP}">
        This way is super easy! Simply by creating your account, you will also have set up your first project. This
        means that you are ready to connect to your projects database already! Let's connect our application to our
        Supabase Postgres instance: Add a .env file at the root of your Nx workspace and add the following code snippet:
      </p>

      <spartan-code
        class="my-6"
        code='DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-REFERENCE-ID].supabase.co:5432/postgres"'
      />
      <h3 class="mt-6 ${hlmH4}">Option 2: Connecting to local Supabase instance</h3>
      <p class="${hlmP}">
        Supabase also allows you to run a version of their system locally! To get up and running you can follow this
        guide! They do a great job explaining how to get started and there is plenty of resources to help you if you get
        stuck. If you want the quick and dirty way and are on a Mac. Here is what I did to get up and running:
      </p>
      <h4 class="${hlmH4} !text-sm mt-6 mb-2">Install supabase CLI</h4>
      <spartan-code code="brew install supabase" />
      <h4 class="${hlmH4} !text-sm mt-6 mb-2">Log into CLI</h4>
      <spartan-code code="supabase login" />
      <p class="${hlmP}">
        Create your access token from
        <a hlmBtn class="px-1 text-base" variant="link" href="https://app.supabase.com/account/tokens">
          https://app.supabase.com/account/tokens
        </a>
        and paste it into your terminal window.
      </p>

      <h4 class="${hlmH4} !text-sm mt-6 mb-2">Create Supabase project</h4>
      <spartan-code
        code="
        # if you are in the spartan directory move UP!!!
cd ..

# create your project folder
mkdir spartan-supabase

# move into the new folder
cd spartan-supabase

# start a new git repository — important, dont skip this step
git init"
      >
      </spartan-code>

      <h4 class="${hlmH4} mt-6 mb-2 !text-sm">Start Supabase services</h4>
      <spartan-code code="supabase init" />
      <spartan-code class="mt-2" code="supabase start" />

      <div class="mt-8" hlmAlert variant="destructive">
        <hlm-icon hlmAlertIcon name="radixExclamationTriangle" />
        <h4 hlmAlertTitle>Important: Make sure Docker is running</h4>
        <p hlmAlertDesc>
          Make sure Docker is running and configured correctly! I had Docker already installed and running. However, my
          setup is not compatible with the config Supabase expects by default.
        </p>
      </div>

      <p class="${hlmP} mb-2">To get it to work for now I ran:</p>
      <spartan-code code="DOCKER_HOST=unix:///Users/[YOUR_USER_ACCOUNT_NAME]/.docker/run/docker.sock supabase start" />
      <p class="${hlmP} mb-2">
        The previous step can take a while as all the docker images have to be downloaded first. However, once
        everything completes you will see a console output that looks like this:
      </p>

      <spartan-code
        disableCopy
        code="
Started supabase local development setup.

API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
anon key: eyJh......
service_role key: eyJh......"
      />
      <p class="${hlmP}">
        Take your cyber-security hat off for a minute (we are working locally after all) and copy the connection string:
      </p>

      <spartan-code code="postgresql://postgres:postgres@localhost:54322/postgres" />

      <p class="${hlmP} mb-2">
        Add a .env file at the root of your Nx workspace and add the connection string like so:
      </p>

      <spartan-code code='DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres' />
      <p class="${hlmP}">Perfect! You should be able to connect to your local Supabase Postgres instance now!</p>

      <spartan-section-sub-heading id="db-schema">Setting up the Schema</spartan-section-sub-heading>
      <p class="${hlmP}">
        While Drizzle is adding support for automatic database migrations, I like to keep them explicit and run the
        commands directly against the DB. Until spartan/stack comes with an automated solution like liquibase, let's
        manually run the following command in the SQL-Editor to create our notes table:
      </p>
      <spartan-code
        class="mt-6"
        code="
create table note (
    id bigint not null default nextval('note_id_seq'::regclass),
    title text not null,
    content text null,
    created_at timestamp with time zone null default current_timestamp,
    constraint notes_pkey primary key (id)
);
"
      />

      <spartan-section-sub-heading id="local-dev">Local Development</spartan-section-sub-heading>
      <spartan-code class="mt-6" language="sh" code="npx nx serve [YOUR_APP_NAME]" />
      <p class="${hlmP}">You can now serve the local development server by running the above command.</p>

      <spartan-section-sub-heading id="production">Build for Production</spartan-section-sub-heading>
      <spartan-code class="mt-6" language="sh" code="npx nx build [YOUR_APP_NAME]" />
      <p class="${hlmP}">
        Finally, let's build a production bundle of our application. Run the command above. By default Analog will build
        a NodeJs compatible output, which you can run with the following command:
      </p>
      <spartan-code class="mt-6" language="sh" code="node dist/apps/[YOUR_APP_NAME]/analog/index.mjs" />
      <p class="${hlmP}">
        Analog also supports multiple build presets, which makes it easy to deploy your application to most of the major
        cloud providers. This includes Vercel, Cloudflare, Azure, AWS, and more.
      </p>

      <spartan-section-sub-heading id="next-steps">Next Steps</spartan-section-sub-heading>
      <p class="${hlmP}">
        Now that you know how to develop and build your application for production, you are ready to take it to the next
        level. Why don't you make it beautiful and accessible for everyone with spartan/ui?
      </p>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="/components/accordion" label="spartan/ui" />
        <spartan-page-bottom-nav-link direction="previous" href="technologies" label="Technologies" />
      </spartan-page-bottom-nav>
    </section>
    <spartan-page-nav>
      <spartan-page-nav-link fragment="nx" label="Setting up your Nx workspace" />
      <spartan-page-nav-link fragment="analogjs" label="AnalogJs, Angular, TailwindCSS, and tRPC" />
      <spartan-page-nav-link fragment="drizzle" label="Drizzle" />
      <spartan-page-nav-link fragment="supabase" label="Supabase" />
      <spartan-page-nav-link fragment="db-schema" label="Setting up the Schema" />
      <spartan-page-nav-link fragment="local-dev" label="Local Development" />
      <spartan-page-nav-link fragment="production" label="Build for Production" />
      <spartan-page-nav-link fragment="next-steps" label="Next Steps" />
    </spartan-page-nav>
  `,
})
export default class InstallationPageComponent {}
