import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TrpcClient } from '../trpc-client';
import { AsyncPipe, DatePipe, NgFor } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { note } from "@prisma/client";

const inputTw = 'focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-0 block w-full appearance-none rounded-lg px-3 py-2 transition-colors text-base leading-tight md:text-sm bg-black/[.05] dark:bg-zinc-50/10 focus:bg-white dark:focus:bg-dark placeholder:text-zinc-500 dark:placeholder:text-zinc-400 contrast-more:border contrast-more:border-current'
@Component({
  selector: 'analog-trpc-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor, DatePipe],
  host: {
    class: 'block h-full p-4'
  },
  template: `
    <div class="flex flex-col-reverse mt-20 mb-8 items-center">
      <h1 class="font-medium italic text-6xl text-[#DD0031] font-semibold">SPARTAN
      </h1>
        <img class="block rotate-45 h-40 w-40" alt="Spartan Logo" src="/assets/spartan.svg" />
    </div>
    <h1 class="mb-4 text-center">
      <span class="text-[#DD0031]">S</span>upabase -
      <span class="text-[#DD0031]">P</span>risma -
      <span class="text-[#DD0031]">A</span>nalog -
      t<span class="text-[#DD0031]">R</span>pc -
      <span class="text-[#DD0031]">T</span>ailwind -
      <span class="text-[#DD0031]">A</span>ngular -
      <span class="text-[#DD0031]">N</span>x
    </h1>
    <form class="py-2 flex items-center" #f="ngForm" (ngSubmit)="addPost(f)">
      <input required autocomplete="off" class="${inputTw}" name="newTitle" [(ngModel)]="newTitle" />
      <button class="ml-2 w-10 text-base leading-tight text-sm border rounded-md border-red-600/20 hover:bg-red-900 bg-red-800 text-red-50 p-2">+
      </button>
    </form>
    <div>
      <div class="mb-4 p-4 font-normal border border-zinc-500/40 rounded-md" *ngFor="let post of posts">
        <div class="flex items-center justify-between">
        <p class="text-sm text-zinc-400">{{post.created_at | date}}</p>
        <button class="text-xs h-6 flex items-center border rounded-md border-red-600/20 hover:bg-red-950 bg-zinc-900 p-2"
                (click)="removePost(post.id)">x
        </button>
        </div>

        <p class="mb-4">{{ post.note }}</p>

      </div>

    </div>
  `,
})
export default class HomeComponent implements OnInit {
  private _trpc = inject(TrpcClient);
  public posts: note[] = [];
  public newTitle = '';

  public ngOnInit() {
    this.fetchPosts();
  }

  public addPost(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.post.create.mutate({ title: this.newTitle }).then(() => this.fetchPosts())
    this.newTitle = '';
    form.form.reset();
  }

  public removePost(id: bigint) {
    this._trpc.post.remove.mutate({id}).then(() => this.fetchPosts())
  }

  private fetchPosts() {
    this._trpc.post.list.query().then((posts) => (this.posts = posts));
  }
}
