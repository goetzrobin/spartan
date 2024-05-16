import { Component, Input } from '@angular/core';
import {
	HlmTabsComponent,
	HlmTabsContentDirective,
	HlmTabsPaginatedListComponent,
	HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

@Component({
	selector: 'spartan-tabs-example-paginated',
	standalone: true,
	imports: [HlmTabsComponent, HlmTabsPaginatedListComponent, HlmTabsTriggerDirective, HlmTabsContentDirective],
	host: {
		class: 'block w-full max-w-lg min-h-[150px]',
	},
	template: `
		<hlm-tabs [tab]="activeTab" class="w-full">
			<hlm-paginated-tabs-list>
				@for (tab of lotsOfTabs; track tab) {
					<button [hlmTabsTrigger]="tab">{{ tab }}</button>
				}
			</hlm-paginated-tabs-list>
			@for (tab of lotsOfTabs; track tab) {
				<div [hlmTabsContent]="tab">{{ getContent(tab) }}</div>
			}
		</hlm-tabs>
	`,
})
export class TabsPaginatedExamplePageComponent {
	@Input() activeTab = 'Introduction';

	lotsOfTabs = [
		'Introduction',
		'Chapter 1',
		'Chapter 2',
		'Chapter 3',
		'Chapter 4',
		'Chapter 5',
		'Chapter 6',
		'Chapter 7',
		'Chapter 8',
		'Chapter 9',
		'Chapter 10',
	];

	getContent(tab: string): string {
		const contentMap: { [key: string]: string } = {
			Introduction: 'Welcome to the Introduction. This section provides an overview of the content.',
			'Chapter 1': 'Chapter 1 covers the basics of our topic.',
			'Chapter 2': 'Chapter 2 goes into more detail about the first concept.',
			'Chapter 3': 'Chapter 3 discusses advanced topics and techniques.',
			'Chapter 4': 'Chapter 4 provides case studies and real-world examples.',
			'Chapter 5': 'Chapter 5 introduces new methodologies.',
			'Chapter 6': 'Chapter 6 focuses on practical applications.',
			'Chapter 7': 'Chapter 7 covers common challenges and solutions.',
			'Chapter 8': 'Chapter 8 includes interviews with experts in the field.',
			'Chapter 9': 'Chapter 9 presents a summary of key points.',
			'Chapter 10': 'Chapter 10 provides further reading and resources.',
		};
		return contentMap[tab] || 'Content not available.';
	}
}
