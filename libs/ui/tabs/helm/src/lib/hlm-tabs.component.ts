import { Component, input } from '@angular/core';
import { BrnTabsDirective } from '@spartan-ng/ui-tabs-brain';

@Component({
	selector: 'hlm-tabs',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnTabsDirective,
			inputs: ['orientation', 'direction', 'activationMode', 'brnTabs: tab'],
			outputs: ['tabActivated'],
		},
	],
	template: '<ng-content/>',
})
export class HlmTabsComponent {
	public readonly tab = input.required<string>();
}
