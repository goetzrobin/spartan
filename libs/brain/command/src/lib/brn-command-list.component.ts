import { Component, forwardRef } from '@angular/core';
import { ListComponent } from '@ngxpert/cmdk';

@Component({
	selector: 'brn-cmd-list',
	standalone: true,
	providers: [
		{
			provide: ListComponent,
			useExisting: forwardRef(() => BrnCommandListComponent),
		},
	],
	template: `
		<div class="cmdk-list-content" role="listbox" [attr.aria-label]="ariaLabel" #height>
			<ng-content></ng-content>
		</div>
	`,
})
export class BrnCommandListComponent extends ListComponent {}
