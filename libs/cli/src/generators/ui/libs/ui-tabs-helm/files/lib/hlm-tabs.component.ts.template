import { Component, input } from '@angular/core';
import { BrnTabsDirective } from '@spartan-ng/ui-tabs-brain';

@Component({
	selector: 'hlm-tabs',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTabsDirective,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
		},
	],
	template: '<ng-content/>',
})
export class HlmTabsComponent {
	tab = input.required<string>();
}
