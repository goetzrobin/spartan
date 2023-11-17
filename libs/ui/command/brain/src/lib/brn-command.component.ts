import { Component } from '@angular/core';
import { CmdkService, CommandComponent } from '@ngneat/cmdk';

@Component({
	selector: 'brn-cmd',
	standalone: true,
	providers: [CmdkService],
	template: `
		<ng-content />
	`,
})
export class BrnCommandComponent extends CommandComponent {}
