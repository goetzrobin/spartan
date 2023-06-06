import { Component } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective
} from '@ng-spartan/ui/card/helm';
import { HlmSkeletonComponent } from '@ng-spartan/ui/skeleton/helm';

@Component({
  selector: 'analog-trpc-note-skeleton',
  standalone: true,
  host: {
    class: 'block'
  },
  hostDirectives: [HlmCardDirective],
  imports: [
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmSkeletonComponent
  ],
  template: `
    <div hlmCardHeader>
      <hlm-skeleton class='h-[25px] w-[150px]' />
      <hlm-skeleton hlmCardDescription class='h-[20px] w-[100px]' />
    </div>
    <div hlmCardContent class='flex flex-col space-y-2'>
      <hlm-skeleton class='h-[25px] w-full' />
      <hlm-skeleton class='h-[25px] w-full' />
    </div>
    <div hlmCardFooter class='justify-end'>
      <hlm-skeleton class='h-[40px] w-[110px]' />
    </div>
  `
})
export class NoteSkeletonComponent {
}
