import { Component, inject } from '@angular/core';
import { injectTRPCClient } from '../../trpc-client';
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { note } from '@prisma/client';
import { waitFor } from '../../wait-for';
import { SwitchHelmDirective, SwitchThumbDirective } from '@spartan/switch/helm';
import { SwitchComponent, SwitchThumbComponent } from '@ng-spartan/switch/brain';
import { ButtonDirective } from '@ng-spartan/button/helm';
import { InputDirective } from '@ng-spartan/input/helm';
import {
  CardContentDirective,
  CardDescriptionDirective,
  CardDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardTitleDirective
} from '@ng-spartan/card/helm';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../theme.service';
import { LabelDirective } from '@ng-spartan/label/helm';
import {
  SignalFormBuilder,
  SignalInputDirective,
  SignalInputErrorDirective,
  V,
  withErrorComponent
} from 'ng-signal-forms';
import { InputErrorComponent } from '../input-error.component';

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
    SignalInputErrorDirective,

    SwitchComponent,
    SwitchHelmDirective, SwitchThumbComponent, SwitchThumbDirective,
    ButtonDirective,
    LabelDirective,
    InputDirective,
    CardDirective, CardHeaderDirective, CardTitleDirective, CardContentDirective, CardFooterDirective, CardDescriptionDirective
  ],
  providers: [withErrorComponent(InputErrorComponent)],
  host: {
    class: 'block h-full p-4'
  },
  template: `
    <div class='flex justify-between pt-4 pb-6'>
      <div class='flex'>
        <span class='font-semibold italic text-xl'>SPARTAN</span>
        <img class='ml-2 w-14' src='/assets/spartan.svg'>
      </div>

      <label hlmLabel class='flex items-center space-x-4'>
        <span>Dark mode</span>
        <brn-switch id='airplane' [checked]='(theme$ | async) ==="dark"' (changed)='toggleTheme()' hlm>
          <brn-switch-thumb hlm />
        </brn-switch>
      </label>
    </div>

    <form class='py-2 flex flex-col items-end'>
      <label hlmLabel class='w-full'>
        Title
        <input class='mt-1.5 w-full' placeholder='Buy groceries' hlmInput autocomplete='off'
               name='newTitle'
               ngModel
               [formField]='form.controls.title'
        />
      </label>

      <label hlmLabel class='w-full'>
        Content
        <textarea class='mt-1.5 w-full h-fit' placeholder='2x eggs, 1x milk,...' hlmInput autocomplete='off'
                  name='newContent'
                  ngModel
                  rows='4'
                  [formField]='form.controls.content'></textarea>
      </label>

      <button
        hlmBtn
        variant='secondary'
        (click)='addPost()'
      >Create Note
      </button>
    </form>
    <div class='flex flex-col space-y-4 pt-4 pb-12'>
      <div
        hlmCard
        *ngFor='let note of notes ?? []; trackBy: noteTrackBy'
      >
        <div hlmCardHeader class='relative'>
          <h3 hlmCardTitle>{{note.title}}</h3>
          <p hlmCardDescription>{{ note.created_at | date }}</p>
          <button
            class='absolute top-2 right-2'
            hlmBtn
            size='sm'
            variant='ghost'
            (click)='removePost(note.id)'
          >
            x
          </button>
        </div>
        <p hlmCardContent>
          {{note.content}}
        </p>
        <div hlmCardFooter class='justify-end'>
          <a routerLink='/' hlmBtn variant='link'>Read more</a>
        </div>
      </div>

      <div hlmCard class='border-transparent shadow-none' *ngIf='!loadingPosts && notes.length === 0'>
        <div hlmCardContent class='h-52 flex flex-col items-center justify-center'>
          <h3 hlmCardTitle>No notes yet!</h3>
          <p hlmCardDescription>Add a new one and see them appear here...</p>
        </div>
      </div>
    </div>
  `
})
export default class HomeComponent {
  private _themeService = inject(ThemeService);
  private _trpc = injectTRPCClient();
  private _sfb = inject(SignalFormBuilder);

  public loadingPosts = false;
  public notes: note[] = [];

  public form = this._sfb.createFormGroup(() => ({
    title: this._sfb.createFormField<string>('', {
      validators: [{
        validator: V.required(),
        message: () => 'Make sure to give your note a title'
      }]
    }),
    content: this._sfb.createFormField('', {
      validators: [{
        validator: V.required(),
        message: () => 'Add some content to your note'
      }
      ]
    })
  }));

  public theme$ = this._themeService.theme$;

  constructor() {
    waitFor(this._trpc.note.list.query().then((notes) => (this.notes = notes)));
  }

  public noteTrackBy = (index: number, note: note) => {
    return note.id;
  };

  public toggleTheme() {
    this._themeService.toggle();
  }

  public addPost() {
    if (this.form.state() !== 'VALID') {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }
    const { title, content } = this.form.value();
    this._trpc.note.create
      .mutate({ title, content }).then(() => this.fetchPosts());
  }

  public removePost(id: bigint) {
    this._trpc.note.remove.mutate({ id }).then(() => this.fetchPosts());
  }

  private fetchPosts() {
    this.loadingPosts = true;
    this._trpc.note.list.query().then((notes) => {
      this.loadingPosts = false;
      this.notes = notes;
    });
  }
}
