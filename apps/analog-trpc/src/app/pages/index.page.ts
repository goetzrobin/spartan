import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TrpcClient } from '../../libs/trpc/client';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: 'analog-trpc-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <h1 class="trpcH1">Angular + Analog + tRPC</h1>
    <form class='form' #f="ngForm" (ngSubmit)="addPost(f)">
      <input required autocomplete="off" class="trpcInput" name="newTitle" [(ngModel)]="newTitle" /><button>Add</button>
    </form>
    <div>
      <p class="trpcPost" *ngFor="let post of posts; let i = index">{{ post }} <button (click)="removePost(i)">x</button></p>
    </div>
  `,
  styles: [`
    :host {
      height: 100%;
    }
    .trpcH1 {
      margin-top: 10rem;
    }
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .trpcInput {
      font-size: 2rem;
      display: block;
      margin-right: 0.5rem;
      border: 1px solid rgba(0,0,0,0.4);
      border-radius: 0.25rem;
    }

    .trpcInput.ng-touched.ng-invalid {
      background-color: rgba(246, 71, 71,0.4);
      border-color: rgba(246, 71, 71,0.4);
    }
    .trpcPost {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.5rem;
      text-align: left;
      padding: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .trpcPost > button {
      font-size: 1rem;
    }
    `]
})
export default class HomeComponent implements OnInit {
  private _trpc = inject(TrpcClient);
  public posts: string[] = [];
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

  public removePost(index: number) {
    this._trpc.post.remove.mutate({id: index}).then(() => this.fetchPosts())
  }

  private fetchPosts() {
    this._trpc.post.list.query().then((posts) => (this.posts = posts));
  }
}
