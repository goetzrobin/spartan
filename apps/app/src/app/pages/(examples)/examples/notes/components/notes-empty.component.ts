import { Component } from '@angular/core';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
	selector: 'analog-trpc-notes-empty',
	standalone: true,
	host: {
		class: 'block',
	},
	hostDirectives: [
		{
			directive: HlmCardDirective,
			inputs: ['class'],
		},
	],
	imports: [HlmCardContentDirective, HlmCardDescriptionDirective, HlmCardHeaderDirective, HlmCardTitleDirective],
	template: `
		<div hlmCardContent class="flex h-52 flex-col items-center justify-center">
			<h3 hlmCardTitle>No notes yet!</h3>
			<p hlmCardDescription>Add a new one and see them appear here...</p>
		</div>
	`,
})
export class NotesEmptyComponent {}
