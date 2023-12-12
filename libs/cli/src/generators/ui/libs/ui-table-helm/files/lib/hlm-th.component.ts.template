import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
	booleanAttribute,
	computed,
	signal,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-th',
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmThComponent {
	@Input({ transform: booleanAttribute })
	public truncate = false;

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(inputs: ClassValue) {
		this._userCls.set(inputs);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'flex flex-none h-12 px-4 text-sm items-center font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
			this._userCls(),
		);
	}
}
