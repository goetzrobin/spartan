import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { radixChevronRight, radixExclamationTriangle } from '@ng-icons/radix-icons';
import { HlmAlertModule } from '@spartan-ng/ui-alert-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';
import { CodeComponent } from '~/app/shared/code/code.component';
import { MainSectionDirective } from '~/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '~/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavLinkComponent } from '~/app/shared/layout/page-nav/page-nav-link.component';
import { PageNavComponent } from '~/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '~/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '~/app/shared/layout/section-sub-heading.component';
import { metaWith } from '~/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Installation' },
	meta: metaWith('spartan - Installation', 'Getting up and running with spartan'),
	title: 'spartan - Installation',
};

@Component({
	selector: 'spartan-installation',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		SectionSubHeadingComponent,
		CodeComponent,
		HlmButtonDirective,
		HlmIconComponent,
		RouterLink,
		PageNavLinkComponent,
		HlmAlertModule,
	],
	providers: [provideIcons({ radixChevronRight, radixExclamationTriangle })],
	template: `
    <section spartanMainSection>
      <spartan-section-intro name="Installation" lead="Getting up and running with spartan." />
      <section>
        <p class="${hlmP}">
          Adding <code class="${hlmCode}">spartan/ui</code> to your project requires only a couple steps!
        </p>
        <p class="${hlmP}">If you are already using Nx, start with installing our plugin:</p>
        <spartan-code class="mt-4" code="npm i -D @spartan-ng/nx" />
      </section>
      <spartan-section-sub-heading id="prerequisites">Prerequisites</spartan-section-sub-heading>
      <section>
        <p class="${hlmP}">
          <code class="${hlmCode}">spartan/ui</code> is built on top of TailwindCSS. Make sure your application has a
          working TailwindCSS setup before you continue.
        </p>
      </section>
      <spartan-section-sub-heading id="installing-ui-core">Installing ui-core</spartan-section-sub-heading>
      <section>
        <p class="${hlmP}">
          <code class="${hlmCode}">spartan/ui</code> comes with a core package. To get started install this package with
          the command below:
        </p>
        <spartan-code class="mt-4" code="npm i @spartan-ng/ui-core" />
      </section>
      <spartan-section-sub-heading id="setting-up-tailwind">Setting up tailwind.config.js</spartan-section-sub-heading>
      <section>
        <p class="${hlmP}">
          You now have to add our spartan-specific configuration to your TailwindCSS setup. To make the setup of your
          <code class="${hlmCode}">tailwind.config.js</code> as easy as possible, the
          <code class="${hlmCode}">@spartan-ng/ui-core</code> package comes with it own preset.
        </p>
        <p class="${hlmP}">Simply add it to the presets array of your config file:</p>
        <spartan-code
          class="mt-4 mb-6"
          code="
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
"
        />
      </section>

      <spartan-section-sub-heading id="adding-css-vars">Adding CSS variables</spartan-section-sub-heading>
      <section>
        <p class="${hlmP}">
          To complete your TailwindCSS setup, you need to add our spartan-specific CSS variables to your style
          entrypoint. This is most likely a <code class="${hlmCode}">styles.css</code> in the
          <code class="${hlmCode}">src</code> folder of your application.
        </p>
        <p class="${hlmP}">
          Again, if you are using Nx, we have written a plugin that will take care of the heavy lifting:
        </p>
        <spartan-code class="mt-4" code="npx nx g @spartan-ng/nx:ui-theme" />
        <p class="${hlmP}">To learn more about the Nx plugin check out the CLI docs below.</p>
        <div class="flex items-center justify-end my-2">
          <a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline=""
            >CLI documentation
            <hlm-icon name="radixChevronRight" class="ml-2" size="sm" />
          </a>
        </div>
        <p class="${hlmP}">
          If you are not using Nx (yet) you can copy the variables of the default theme below and manually add them to
          your style entrypoint, such as
          <code class="${hlmCode}">styles.css</code>:
        </p>
        <spartan-code
          class="mt-4 mb-6"
          code="
:root {
  --font-sans: '';
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}
"
        />
        <p class="${hlmP}">
          Also, make sure to check out the theming section to better understand the convention behind them and learn how
          to customize your theme.
        </p>
      </section>

      <spartan-section-sub-heading id="adding-primitives">Adding primitives</spartan-section-sub-heading>
      <section>
        <p class="${hlmP}">
          With the Nx plugin, adding primitives is as simple as running a single command. It will allow you to pick and
          choose which primitives to add to your project. It will add all brain dependencies and copy helm code into its
          own library:
        </p>
        <spartan-code class="mt-4" code="npx nx g @spartan-ng/nx:ui" />
        <p class="${hlmP}">To learn more about the Nx plugin check out the CLI docs below.</p>
        <div class="flex items-center justify-end my-2">
          <a routerLink="/documentation/cli" variant="outline" size="sm" hlmBtn outline=""
            >CLI documentation
            <hlm-icon name="radixChevronRight" class="ml-2" size="sm" />
          </a>
        </div>
        <div class="mt-4" hlmAlert variant="destructive">
          <hlm-icon name="radixExclamationTriangle" hlmAlertIcon />
          <p hlmAlertTitle>
            Known issue: Dependencies are added to package.json, but their peer dependencies are not automatically
            installed
          </p>
          <p hlmAlertDescription>
            It seems like the Nx generator does not install the peer dependencies for new dependencies added to the
            package.json of the project when running the "install dependencies" task inside its execution context.
            <span class="block mt-2 font-medium">
              Workaround: Manually run <span class="font-semibold">npm i</span> after the plugin adds the primtives.
            </span>
          </p>
        </div>
        <p class="${hlmP}">
          If you are not using Nx (yet) you can follow the guide on how to manually install the primitive on the
          respective documentation page.
        </p>
      </section>

      <spartan-page-bottom-nav>
        <spartan-page-bottom-nav-link href="theming" label="Theming" />
        <spartan-page-bottom-nav-link direction="previous" href="/stack" label="Stack" />
      </spartan-page-bottom-nav>
    </section>

    <spartan-page-nav>
      <spartan-page-nav-link fragment="prerequisites" label="Prerequisites" />
      <spartan-page-nav-link fragment="installing-ui-core" label="Installing ui-core" />
      <spartan-page-nav-link fragment="setting-up-tailwind" label="Setting up tailwind.config.js" />
      <spartan-page-nav-link fragment="adding-css-vars" label="Adding CSS variables" />
      <spartan-page-nav-link fragment="adding-primitives" label="Adding primitives" />
    </spartan-page-nav>
  `,
})
export default class InstallationPageComponent {}
