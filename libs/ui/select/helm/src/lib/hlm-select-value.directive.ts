import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSelectValueDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-select-value,[hlmSelectValue]',
	standalone: true,
	hostDirectives: [
		{
			directive: BrnSelectValueDirective,
			inputs: ['transformFn'],
		},
	],
	host: {
		'[id]': 'id()',
		'[class]': '_computedClass()',
	},
	template: `
		{{ value() || placeholder() }}
	`,
	styles: [
		`
			:host {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				white-space: nowrap;
				pointer-events: none;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSelectValueComponent {
	private readonly selectValueDirective = inject(BrnSelectValueDirective);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'!inline-block ltr:text-left rtl:text-right border-border w-[calc(100%)]] min-w-0 pointer-events-none truncate',
			this.userClass(),
		),
	);

	protected readonly id = this.selectValueDirective.id;
	protected readonly placeholder = this.selectValueDirective.placeholder;
	protected readonly value = this.selectValueDirective.value;
}
