import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input, booleanAttribute, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-td',
	standalone: true,
	imports: [NgTemplateOutlet, NgIf],
	host: {
		'[class]': '_computedClass()',
	},
	template: `
		<ng-template #content>
			<ng-content />
		</ng-template>
		<span *ngIf="truncate" class="flex-1 truncate">
			<ng-container [ngTemplateOutlet]="content" />
		</span>
		<ng-container *ngIf="!truncate" [ngTemplateOutlet]="content" />
	`,
})
export class HlmTdComponent {
	@Input({ transform: booleanAttribute })
	public truncate = false;

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('flex flex-none p-2 items-center [&:has([role=checkbox])]:pr-0', this._userCls());
	}
}
