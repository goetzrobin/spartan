import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TrpcClient } from '../trpc-client';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: 'analog-trpc-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor],
  host: {
    class: 'block h-full p-4'
  },
  template: `
    <h1 class="mt-20 mb-8 text-5xl">SPARTAN</h1>
    <h1 class="mb-4 text-xl">Supabase + Prisma + Analog + tRpc + Tailwind + Angular + Nx </h1>
    <form class='py-2 flex items-center' #f="ngForm" (ngSubmit)="addPost(f)">
      <input required autocomplete="off" class="p-2 w-full border rounded-md" name="newTitle" [(ngModel)]="newTitle" />
      <button class="ml-2 w-12 border rounded-md border-sky-600/20 hover:bg-sky-600 bg-sky-500 text-sky-50 p-2">+</button>
    </form>
    <div>
      <p class="mb-4 p-2 font-normal border rounded-md flex items-center justify-between" *ngFor="let post of posts; let i = index">{{ post }}
        <button class="w-12 border rounded-md border-red-600/20 hover:bg-red-600 bg-red-500 text-red-50 p-2" (click)="removePost(i)">x</button></p>
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
