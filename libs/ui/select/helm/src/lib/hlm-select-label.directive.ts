import { Directive, Input, OnInit, computed, inject, signal } from '@angular/core';
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
	private selectContent = inject(HlmSelectContentDirective);
	private readonly classNames = signal<ClassValue>('');
	private stickyLabels = signal(false);

	private readonly baseClasses = 'px-2 py-1.5 text-sm font-semibold';
	private readonly stickyLabelsClassNames = `sticky top-0 bg-popover block z-[2]`;

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@Input({ alias: 'class' })
	set _class(classNames: ClassValue) {
		this.classNames.set(classNames);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(this.baseClasses, this.stickyLabels() ? this.stickyLabelsClassNames : '', this.classNames());
	}

	ngOnInit(): void {
		if (this.selectContent.stickyLabels) {
			this.stickyLabels.set(true);
		}
	}
}
