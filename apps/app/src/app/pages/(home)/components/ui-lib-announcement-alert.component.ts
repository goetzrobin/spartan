import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective
} from '@ng-spartan/ui/alert/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'analog-trpc-ui-lib-announcement-alert',
  standalone: true,
  host: {
    class: 'block'
  },
  hostDirectives: [{
    directive: HlmAlertDirective,
    inputs: ['class']
  }],
  imports: [
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmButtonDirective
  ],
  template: `
    <svg
      hlmAlertIcon
      class='h-4 w-4'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke-width='1.5'
      stroke='currentColor'
    >
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z'
      />
    </svg>

    <h4 hlmAlertTitle>Introducing <span class='font-semibold italic text-[#DD0031]'>SPARTAN</span> helm & brain</h4>
    <p hlmAlertDesc>
      The components used on this page are also the intiial building blocks of a new UI library. It is made up of
      headless UI providers, the brain components/directives, which add ARIA compliant markup and interactions. On
      top of the brain we add helm(et) directives, which add
      <a hlmBtn variant='link' class='h-6 px-0.5' href='https://ui.shadcn.com' target='_blank'>shadcn</a>-like
      styles to our application.
    </p>
  `
})
export class UiLibAnnouncementAlertComponent {
}
