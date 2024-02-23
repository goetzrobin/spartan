import { Component, computed, inject, input } from '@angular/core';
import { CLIModeService } from '../cli-mode.service';
import { CodeComponent } from '../code/code.component';
import { TabsComponent } from './tabs.component';

@Component({
	selector: 'spartan-cli-tabs',
	standalone: true,
	imports: [TabsComponent, CodeComponent],
	host: {
		class: 'block',
	},
	template: `
		{{ tabValue() }}
		<spartan-tabs
			class="mt-4"
			firstTab="Nx Plugin"
			secondTab="Angular CLI"
			[value]="tabValue()"
			(tabActivated)="onTabChanged($event)"
		>
			<spartan-code
				firstTab
				language="sh"
				[code]="firstCode()"
				activationMode="manual"
				(activated)="onTabChanged($event)"
			/>
			<spartan-code
				secondTab
				language="sh"
				[code]="secondCode()"
				activationMode="manual"
				(activated)="onTabChanged($event)"
			/>
		</spartan-tabs>
	`,
})
export class TabsCliComponent {
	private readonly _cliService = inject(CLIModeService);
	readonly firstCode = input('');
	readonly secondCode = input('');
	protected tabValue = computed(() => {
		return this._cliService.CliMode() === 'nx' ? 'Nx Plugin' : 'Angular CLI';
	});
	protected onTabChanged(value: string) {
		console.log('onTabChanged on TAB CLI COMP', value);
		const val = value === 'Nx Plugin' ? 'nx' : 'cli';
		this._cliService.setCliMode(val);
	}
}
