import { NgIf } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { DynamicViewModule } from '@ngneat/overview';
import { GroupComponent } from '@ngxpert/cmdk';

@Component({
	selector: 'brn-cmd-group',
	standalone: true,
	imports: [NgIf, DynamicViewModule],
	providers: [
		{
			provide: GroupComponent,
			useExisting: forwardRef(() => BrnCommandGroupComponent),
		},
	],
	template: `
		<div role="presentation" *ngIf="label" class="cmdk-group-label">
			<ng-container *dynamicView="label"></ng-container>
		</div>
		<div class="cmdk-group-content" role="group" [attr.aria-label]="ariaLabel">
			<ng-content></ng-content>
		</div>
	`,
})
export class BrnCommandGroupComponent extends GroupComponent {}
