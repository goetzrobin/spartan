import { computed, Directive, inject, Input, OnInit, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { BrnSelectLabelDirective } from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';
import { HlmSelectContentDirective } from './hlm-select-content.directive';

@Directive({
	selector: '[hlmSelectLabel], hlm-select-label',
	hostDirectives: [BrnSelectLabelDirective],
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSelectLabelDirective implements OnInit {
	private readonly selectContent = inject(HlmSelectContentDirective);
	private readonly _stickyLabels = signal(false);

	private readonly _classNames = signal<ClassValue>('');
	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this._classNames.set(classNames);
	}
	protected _computedClass = computed(() =>
		hlm(
			'px-2 py-1.5 text-sm font-semibold',
			this._stickyLabels() ? 'sticky top-0 bg-popover block z-[2]' : '',
			this._classNames(),
		),
	);

	ngOnInit(): void {
		if (this.selectContent.stickyLabels) {
			this._stickyLabels.set(true);
		}
	}
}
