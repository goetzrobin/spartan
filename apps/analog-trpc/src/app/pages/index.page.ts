import { Component, OnInit } from '@angular/core';
import { injectTRPCClient } from '../../trpc-client';
import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { note } from '@prisma/client';
import { waitFor } from '../../wait-for';

const inputTw = 'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-0 block w-full appearance-none rounded-lg px-3 py-2 transition-colors text-base leading-tight md:text-sm bg-black/[.05] dark:bg-zinc-50/10 focus:bg-white dark:focus:bg-dark placeholder:text-zinc-500 dark:placeholder:text-zinc-400 contrast-more:border contrast-more:border-current';
const btnTw = 'focus-visible:ring-2 focus-visible:ring-zinc-50 focus-visible:outline-0 flex items-center justify-center rounded-lg px-2 py-1.5 text-sm font-bold tracking-tight shadow-xl shadow-red-500/20 bg-[#DD0031] hover:bg-opacity-70 text-zinc-800 hover:text-primary-darker';

@Component({
  selector: 'analog-trpc-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor, DatePipe, NgIf, JsonPipe],
  host: {
    class: 'block h-full p-4'
  },
  template: `
    <div class='justify-center flex mt-20 mb-8 items-center'>
      <h1 class='font-medium italic text-6xl text-[#DD0031] font-bold'>SPARTAN</h1>
      <img class='ml-2 block w-32' alt='Spartan Logo' src='/assets/spartan.svg' />
    </div>
    <h1 class='mb-4 italic font-medium text-xl text-zinc-300 text-center'>
      <span class='text-[#DD0031]'>S</span>upabase -
      <span class='text-[#DD0031]'>P</span>risma -
      <span class='text-[#DD0031]'>A</span>nalog -
      t<span class='text-[#DD0031]'>R</span>PC -
      <span class='text-[#DD0031]'>T</span>ailwind -
      <span class='text-[#DD0031]'>A</span>ngular -
      <span class='text-[#DD0031]'>N</span>x
    </h1>
    <form class='py-2 flex items-center' #f='ngForm' (ngSubmit)='addPost(f)'>
      <input required autocomplete='off' class='${inputTw}' name='newTitle' [(ngModel)]='newTitle' />
      <button class='ml-2 ${btnTw}'>+
      </button>
    </form>
    <div class='mt-4'>
      <div class='mb-4 p-4 font-normal border border-zinc-500/40 rounded-md'
           *ngFor='let note of notes ?? []; trackBy: noteTrackBy'>
        <div class='flex items-center justify-between'>
          <p class='text-sm text-zinc-400'>{{note.created_at | date}}</p>
          <button class='!text-xs h-6 !bg-opacity-10 hover:!bg-opacity-50 !text-zinc-50 ${btnTw}'
                  (click)='removePost(note.id)'>x
          </button>
        </div>
        <p class='mb-4'>{{ note.note }}</p>
      </div>

      <div class='text-center rounded-xl p-20 bg-zinc-950/40' *ngIf='!loadingPosts && notes.length === 0'>
        <h3 class='text-xl font-medium'>No notes yet!</h3>
        <p class='text-zinc-400'>Add a new one and see them appear here...</p>
      </div>
    </div>
  `
})
export default class HomeComponent implements OnInit {
  private _trpc = injectTRPCClient();
  public loadingPosts = false;
  public notes: note[] = [];
  public newTitle = '';

  public ngOnInit() {
    waitFor(this._trpc.note.list.query().then(notes => this.notes = notes));
  }

  public noteTrackBy = (index: number, note: note) => {
    return note.id;
  };

  public addPost(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.note.create.mutate({ title: this.newTitle }).then(() => this.fetchPosts());
    this.newTitle = '';
    form.form.reset();
  }

  public removePost(id: bigint) {
    this._trpc.note.remove.mutate({ id }).then(() => this.fetchPosts());
  }

  private fetchPosts() {
    this.loadingPosts = true;
    this._trpc.note.list.query().then(notes => {
      this.loadingPosts = false;
      this.notes = notes;
    });
  }
}
