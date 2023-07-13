import { RouteMeta } from '@analogjs/router';
import { metaWith } from '~/app/shared/meta/meta.util';
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { RouterLink } from '@angular/router';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@ng-spartan/ui/card/helm';
import { HlmIconComponent } from '@ng-spartan/ui/icon/helm';
import { provideIcons } from '@ng-icons/core';
import { radixLayers, radixMix } from '@ng-icons/radix-icons';

export const routeMeta: RouteMeta = {
  meta: metaWith(
    'spartan - Cutting-edge tools powering Angular full-stack development',
    'Build next level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look incredible with spartan/ui.'
  ),
};

const container = 'mx-auto flex flex-col items-center gap-4 text-center';
const subHeading = 'font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl';
const lead = 'leading-normal text-muted-foreground sm:text-xl sm:leading-8';

@Component({
  selector: 'spartan-home',
  standalone: true,
  imports: [
    HlmButtonDirective,
    RouterLink,
    HlmBadgeDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmIconComponent,
  ],
  host: {
    class: 'block p-4 pb-12 pt-6 sm:pb-24 sm:pt-12',
  },
  providers: [provideIcons({ radixLayers, radixMix })],
  template: `
    <section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div class="${container} max-w-[64rem]">
        <a target="_blank" href="https://github.com/goetzrobin/spartan" hlmBadge variant="destructive"
          >This is madness. This is spartan.</a
        >
        <h1 class="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Cutting-edge tools powering Angular full-stack development.
        </h1>
        <p class="max-w-[42rem] ${lead}">
          Build next level, full-stack applications with AnalogJs and the spartan/stack. Make them accessible and look
          incredible with spartan/ui.
        </p>
        <div class="space-x-4">
          <a hlmBtn size="lg" routerLink="/documentation">Get Started</a
          ><a
            hlmBtn
            size="lg"
            variant="outline"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/goetzrobin/spartan"
            >GitHub</a
          >
        </div>
      </div>
    </section>

    <section id="tools" class="space-y-6 py-8 md:py-12 lg:py-24">
      <div class="${container} max-w-[58rem]">
        <h2 class="${subHeading}">The Tools</h2>
        <p class="max-w-[42rem] ${lead}">
          spartan provides you with an opinionated stack set up with a single command and a set of accessible UI
          primitives.
        </p>
      </div>
      <div class="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
        <a routerLink="/stack" hlmCard class="group">
          <div hlmCardHeader>
            <hlm-icon class="transition-colors group-hover:text-destructive" name="radixLayers" size="xl" />
            <h3 hlmCardTitle>spartan/stack</h3>
            <p hlmCardDescription>
              Opinionated full-stack based on Supabase, Angular, tRPC, Tailwind, AnalogJs, Nx and Drizzle.
            </p>
          </div>
        </a>

        <a routerLink="/documentation" hlmCard class="group">
          <div hlmCardHeader>
            <hlm-icon class="transition-colors group-hover:text-destructive" name="radixMix" size="xl" />
            <h3 hlmCardTitle>spartan/ui</h3>
            <p hlmCardDescription>Accessible, composable UI primitives that come styled or unstyled.</p>
          </div>
        </a>
      </div>
    </section>
  `,
})
export default class HomePageComponent {}
