import { Component, computed, inject, signal } from '@angular/core';
import { injectTRPCClient } from '../../trpc-client';
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmSwitchThumbDirective, UiSwitchHelmDirective } from '@ng-spartan/ui/switch/helm';
import { BrnSwitchComponent, BrnSwitchThumbComponent } from '@ng-spartan/ui/switch/brain';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective
} from '@ng-spartan/ui/card/helm';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { InputErrorComponent } from '../input-error.component';
import {
  BrnAccordionComponent,
  BrnAccordionContentComponent,
  BrnAccordionItemComponent,
  BrnAccordionTriggerComponent
} from '@ng-spartan/ui/accordion/brain';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconComponent,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective
} from '@ng-spartan/ui/accordion/helm';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective
} from '@ng-spartan/ui/alert/helm';
import { catchError, Observable, of, Subject, switchMap, take, tap } from 'rxjs';
import { SpartanInputErrorDirective } from '~/app/input-error.directive';
import { HlmSpinnerComponent } from '@ng-spartan/ui/spinner/helm';
import { HlmSkeletonComponent } from '@ng-spartan/ui/skeleton/helm';
import { Note } from '~/db';
import { waitFor } from '@analogjs/trpc';

@Component({
  selector: 'analog-trpc-home',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgFor,
    DatePipe,
    NgIf,
    JsonPipe,

    RouterLink,
    SignalInputDirective,
    SpartanInputErrorDirective,

    BrnSwitchComponent,
    UiSwitchHelmDirective,
    BrnSwitchThumbComponent,
    HlmSwitchThumbDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardContentDirective,
    HlmCardFooterDirective,
    HlmCardDescriptionDirective,

    BrnAccordionComponent,
    BrnAccordionItemComponent,
    BrnAccordionTriggerComponent,
    BrnAccordionContentComponent,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionContentDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionIconComponent,
    HlmAlertDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmAlertDescriptionDirective,
    HlmSpinnerComponent,
    HlmSkeletonComponent,
    HlmSkeletonComponent
  ],
  providers: [withErrorComponent(InputErrorComponent)],
  host: {
    class: 'block px-4 pt-4 pb-16'
  },
  template: `
    <div class='flex justify-between pt-4 pb-6'>
      <div class='flex'>
        <span class='font-semibold italic text-xl'>SPARTAN</span>
        <img alt='Spartan Logo. A red arrowhead with the Angular A inside of it' class='ml-2 w-14'
             src='/assets/spartan.svg' />
      </div>

      <label hlmLabel class='flex items-center space-x-4'>
        <span>Dark mode</span>
        <brn-switch id='airplane' [checked]="(theme$ | async) === 'dark'" (changed)='toggleTheme()' hlm>
          <brn-switch-thumb hlm />
        </brn-switch>
      </label>
    </div>

    <form class='py-2 flex flex-col items-end'>
      <label hlmLabel class='w-full'>
        Title
        <input
          class='mt-1.5 w-full'
          placeholder='Buy groceries'
          hlmInput
          autocomplete='off'
          name='newTitle'
          ngModel
          [formField]='form.controls.title'
        />
      </label>

      <label hlmLabel class='w-full'>
        Content
        <textarea
          class='mt-1.5 w-full h-fit'
          placeholder='2x eggs, 1x milk,...'
          hlmInput
          autocomplete='off'
          name='newContent'
          ngModel
          rows='4'
          [formField]='form.controls.content'
        ></textarea>
      </label>

      <button hlmBtn [disabled]='createLoad()' variant='secondary' (click)='addPost()'>
        <span>{{ createLoad() ? 'Creating' : 'Create' }} Note</span>
        <hlm-spinner *ngIf='createLoad()' class='ml-2' size='sm' />
      </button>
    </form>
    <div class='flex flex-col space-y-4 pt-4 pb-12'>
      <ng-container *ngIf='showNotesArray()'>
        <div hlmCard *ngFor='let note of state().notes ?? []; trackBy: noteTrackBy'>
          <div hlmCardHeader class='relative'>
            <h3 hlmCardTitle>{{ note.title }}</h3>
            <p hlmCardDescription>{{ note.createdAt | date }}</p>
            <button
              [disabled]='deleteIdInProgress() === note.id'
              class='absolute top-2 right-2'
              hlmBtn
              size='sm'
              variant='ghost'
              (click)='removePost(note.id)'
            >
              <hlm-spinner *ngIf='deleteIdInProgress() === note.id' size='xs' />
              <svg
                *ngIf='deleteIdInProgress() !== note.id'
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
        </div>

        <div hlmCard class='border-transparent shadow-none' *ngIf='noNotes()'>
          <div hlmCardContent class='h-52 flex flex-col items-center justify-center'>
            <h3 hlmCardTitle>No notes yet!</h3>
            <p hlmCardDescription>Add a new one and see them appear here...</p>
          </div>
        </div>
      </ng-container>

      <div hlmCard *ngIf='initialLoad() || createLoad()'>
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
      </div>
    </div>

    <brn-accordion hlm>
      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>What is SPARTAN</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm>
          It is a collection of full-stack technologies that provide end-to-end type-safety.
        </brn-accordion-content>
      </brn-accordion-item>

      <brn-accordion-item hlm>
        <brn-accordion-trigger hlm>
          <span>What technologies are used</span>
          <hlm-accordion-icon />
        </brn-accordion-trigger>
        <brn-accordion-content hlm> Supabase, Prisma, Angular, tRPC, Tailwind, Analog, and Nx.</brn-accordion-content>
      </brn-accordion-item>
    </brn-accordion>

    <div class='mt-12' hlmAlert>
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
    </div>
  `
})
export default class HomeComponent {
  private _themeService = inject(ThemeService);
  private _trpc = injectTRPCClient();
  private _sfb = inject(SignalFormBuilder);
  private _refreshNotes$ = new Subject<void>();
  private _notes$ = this._refreshNotes$.pipe(
    switchMap(() => this._trpc.note.list.query()),
    tap((result) =>
      this.state.mutate((state) => {
        state.status = 'success';
        state.notes = result;
        state.error = null;
      })
    ),
    catchError((err) => {
      this.state.mutate((state) => {
        state.notes = [];
        state.status = 'error';
        state.error = err;
      });
      return of([]);
    })
  );

  public state = signal<{
    status: 'idle' | 'loading' | 'success' | 'error';
    notes: Note[];
    error: any | null;
    updatedFrom: 'initial' | 'create' | 'delete';
    idBeingDeleted?: number;
  }>({
    status: 'idle',
    notes: [],
    error: null,
    updatedFrom: 'initial'
  });
  public initialLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'initial');
  public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');
  public deleteIdInProgress = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'delete' ? this.state().idBeingDeleted : undefined);
  public noNotes = computed(() => this.state().notes.length === 0);
  public showNotesArray = computed(() => this.state().updatedFrom !== 'initial' || this.state().status === 'success');

  public form = this._sfb.createFormGroup(() => ({
    title: this._sfb.createFormField<string>('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Make sure to give your note a title'
        }
      ]
    }),
    content: this._sfb.createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: () => 'Add some content to your note'
        }
      ]
    })
  }));

  public theme$ = this._themeService.theme$;

  constructor() {
    this._notes$.subscribe();
    void waitFor(this._notes$);
    this.updateNotes('initial');
  }

  public noteTrackBy = (index: number, note: Note) => {
    return note.id;
  };

  public toggleTheme() {
    this._themeService.toggle();
  }

  public addPost() {
    if (this.form.state() !== 'VALID') {
      this.form.markAllAsTouched();
      return;
    }
    const { title, content } = this.form.value();
    this.updateNotes('create', this._trpc.note.create.mutate({ title, content }));
    this.form.reset();
  }

  public removePost(id: number) {
    this.updateNotes('delete', this._trpc.note.remove.mutate({ id }), id);
  }

  private updateNotes(
    updatedFrom: 'initial' | 'create' | 'delete',
    operation?: Observable<Note | Note[]>,
    idBeingDeleted?: number
  ) {
    this.state.update((state) => ({
      status: 'loading',
      notes: state.notes,
      error: null,
      updatedFrom,
      idBeingDeleted
    }));
    if (!operation) {
      this._refreshNotes$.next();
      return;
    }
    operation.pipe(take(1)).subscribe(() => this._refreshNotes$.next());
  }
}
