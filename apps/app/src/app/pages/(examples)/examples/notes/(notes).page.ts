import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { lastValueFrom } from 'rxjs';
import { injectTRPCClient } from '../../../../../trpc-client';
import { InputErrorComponent } from '../../../../shared/input-error/input-error.component';
import { SpartanInputErrorDirective } from '../../../../shared/input-error/input-error.directive';
import { metaWith } from '../../../../shared/meta/meta.util';
import { NoteSkeletonComponent } from './components/note-skeleton.component';
import { NoteComponent } from './components/note.component';
import { NotesEmptyComponent } from './components/notes-empty.component';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Notes', 'A notes example displaying the SPARTAN stack and new UI primitives'),
	title: 'spartan/examples - Notes',
};

@Component({
	selector: 'spartan-notes-example',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.Emulated,
	imports: [
		FormsModule,

		RouterLink,
		SignalInputDirective,
		SpartanInputErrorDirective,

		HlmButtonDirective,
		HlmLabelDirective,
		HlmInputDirective,

		NoteComponent,
		NoteSkeletonComponent,
		NotesEmptyComponent,
		HlmSpinnerComponent,
	],
	providers: [withErrorComponent(InputErrorComponent)],
	host: {
		class: 'block p-2 sm:p-4 pb-16',
	},
	template: `
		<form class="flex flex-col items-end py-2" (ngSubmit)="createNote()">
			<label hlmLabel class="w-full">
				Title
				<input
					class="mt-1.5 w-full"
					placeholder="Buy groceries"
					hlmInput
					autocomplete="off"
					name="newTitle"
					ngModel
					[formField]="form.controls.title"
				/>
			</label>

			<label hlmLabel class="w-full">
				Content
				<textarea
					class="mt-1.5 h-fit w-full"
					placeholder="2x eggs, 1x milk,..."
					hlmInput
					autocomplete="off"
					name="newContent"
					ngModel
					rows="4"
					[formField]="form.controls.content"
				></textarea>
			</label>

			<button hlmBtn [disabled]="_createMutation.isPending()" variant="secondary">
				@if (_createMutation.isPending()) {
					Creating Note
					<hlm-spinner class="ml-2" size="sm" />
				} @else {
					Create Note
				}
			</button>
		</form>
		<div class="flex flex-col space-y-4 pb-12 pt-4">
			@for (note of _notesQuery.data() ?? []; track note.id) {
				<analog-trpc-note
					[note]="note"
					[deletionInProgress]="_deleteMutation.isPending()"
					(deleteClicked)="_deleteMutation.mutate(note.id)"
				/>
			} @empty {
				<analog-trpc-notes-empty class="border-transparent shadow-none" />
			}
			@if (_notesQuery.isPending()) {
				<analog-trpc-note-skeleton />
			}
		</div>
	`,
})
export default class NotesExamplePageComponent {
	private readonly _sfb = inject(SignalFormBuilder);
	private readonly _trpc = injectTRPCClient();

	protected readonly _notesQuery = injectQuery(() => ({
		queryKey: ['notes'],
		queryFn: () => lastValueFrom(this._trpc.note.list.query()),
	}));

	protected readonly _createMutation = injectMutation((client) => ({
		mutationFn: (input: { title: string; content: string }) => lastValueFrom(this._trpc.note.create.mutate(input)),
		onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
	}));

	protected readonly _deleteMutation = injectMutation((client) => ({
		mutationFn: (id: number) => lastValueFrom(this._trpc.note.remove.mutate({ id })),
		onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
	}));

	protected readonly form = this._sfb.createFormGroup(() => ({
		title: this._sfb.createFormField<string>('', {
			validators: [
				{
					validator: V.required(),
					message: () => 'Make sure to give your note a title',
				},
			],
		}),
		content: this._sfb.createFormField('', {
			validators: [
				{
					validator: V.required(),
					message: () => 'Add some content to your note',
				},
			],
		}),
	}));

	createNote() {
		if (!this.form.valid()) {
			this.form.markAllAsTouched();
			return;
		}
		this._createMutation.mutate(this.form.value());
		this.form.reset();
	}
}
