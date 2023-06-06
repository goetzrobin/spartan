import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective
} from '@ng-spartan/ui/card/helm';
import { HlmSpinnerComponent } from '@ng-spartan/ui/spinner/helm';
import { RouterLink } from '@angular/router';
import { Note } from '~/db';
import { HlmBadgeDirective } from '@ng-spartan/ui/badge/helm';

@Component({
  selector: 'analog-trpc-note',
  standalone: true,
  hostDirectives: [HlmCardDirective],
  host: {
    class: 'block'
  },
  imports: [
    DatePipe,
    HlmButtonDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmSpinnerComponent,
    NgForOf,
    NgIf,
    RouterLink,
    HlmBadgeDirective
  ],
  template: `
    <div hlmCardHeader class='relative'>
      <h3 hlmCardTitle>{{ note.title }}</h3>
      <p hlmCardDescription>Created at: <span hlmBadge variant='secondary'
                                              class='px-2'>{{ note.createdAt | date }}</span></p>
      <button
        [disabled]='deletionInProgress'
        class='absolute top-2 right-2'
        hlmBtn
        size='sm'
        variant='ghost'
        (click)='deleteClicked.emit()'
      >
        <hlm-spinner *ngIf='deletionInProgress' size='xs' />
        <span class='sr-only'>Delete note with title: {{note.title}}</span>
        <svg
          *ngIf='!deletionInProgress'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-4 h-4'
        >
          <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>
    </div>
    <p hlmCardContent>
      {{ note.content }}
    </p>
    <div hlmCardFooter class='justify-end'>
      <a routerLink='/' hlmBtn variant='link'>Read more</a>
    </div>
  `
})
export class NoteComponent {
  @Input() deletionInProgress = false;
  @Input({ required: true }) note!: Note;
  @Output() deleteClicked = new EventEmitter<void>();
}
