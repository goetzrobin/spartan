import { RouteMeta } from '@analogjs/router';
import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { Note } from '../../../../../db';
import { InputErrorComponent } from '../../../../shared/input-error/input-error.component';
import { SpartanInputErrorDirective } from '../../../../shared/input-error/input-error.directive';
import { metaWith } from '../../../../shared/meta/meta.util';
import { NoteSkeletonComponent } from './components/note-skeleton.component';
import { NoteComponent } from './components/note.component';
import { NotesEmptyComponent } from './components/notes-empty.component';
import { injectCreateNoteMutation, injectDeleteNoteMutation } from './notes.mutations';
import { injectNotesQuery } from './notes.queries';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Notes', 'A notes example displaying the SPARTAN stack and new UI primitives'),
	title: 'spartan/examples - Notes',
};

@Component({
	selector: 'spartan-notes-example',
	standalone: true,
	imports: [
		FormsModule,
		SignalInputDirective,
		SpartanInputErrorDirective,

		RouterLink,

		HlmButtonDirective,
		HlmLabelDirective,
		HlmInputDirective,

		NoteComponent,
		NoteSkeletonComponent,
		NotesEmptyComponent,
		HlmSpinnerComponent,
		JsonPipe,
	],
	providers: [withErrorComponent(InputErrorComponent)],
	host: {
		class: 'block p-2 sm:p-4 pb-16',
	},
	template: `
		<form class="flex flex-col items-end py-2" (ngSubmit)="handleSubmit($event)">
			<label hlmLabel class="w-full">
				Title
				<input
					class="mt-1.5 w-full"
					placeholder="Buy groceries"
					hlmInput
					autocomplete="off"
					name="newTitle"
					ngModel
					[formField]="_form.controls.title"
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
					[formField]="_form.controls.content"
				></textarea>
			</label>

			<button hlmBtn variant="secondary">
				<span>{{ _createMutation.isPending() ? 'Creating' : 'Create' }} Note</span>
				@if (_createMutation.isPending()) {
					<hlm-spinner class="ml-2 h-5 w-5" size="sm" />
				}
			</button>
		</form>
		<div class="flex flex-col space-y-4 pb-12 pt-4">
			@for (note of _notesQ.data() ?? []; track note.id) {
				<analog-trpc-note
					[note]="note"
					[deletionInProgress]="_deleteMutation.isPending() && _noteBeingDeleted()?.id === note.id"
					(deleteClicked)="deleteNote(note)"
				/>
			} @empty {
				@if (!_notesQ.isLoading()) {
					<analog-trpc-notes-empty class="border-transparent shadow-none" />
				} @else {
					<analog-trpc-note-skeleton />
				}
			}
		</div>
	`,
})
export default class NotesExamplePageComponent {
	protected readonly _notesQ = injectNotesQuery();

	protected readonly _noteBeingDeleted = signal<Note | undefined>(undefined);
	protected readonly _deleteMutation = injectDeleteNoteMutation();

	protected readonly _createMutation = injectCreateNoteMutation();
	private readonly _sfb = inject(SignalFormBuilder);
	protected readonly _form = this._sfb.createFormGroup(() => ({
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

	public handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (!this._form.valid()) {
			this._form.markAllAsTouched();
			return;
		}
		void this._createMutation.mutate(this._form.value(), { onSuccess: () => this._form.reset() });
	}

	public deleteNote(note: Note) {
		this._noteBeingDeleted.set(note);
		this._deleteMutation.mutate(
			{ id: note.id },
			{
				onSuccess: () => this._noteBeingDeleted.set(undefined),
			},
		);
	}
}
