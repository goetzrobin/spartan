import { computed, Directive, inject, Input, OnInit, signal } from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionContentDirective implements OnInit {
	private readonly _host = injectCustomClassSettable({ optional: true });
	private readonly _brn = inject(BrnAccordionContentComponent, { optional: true });

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		const gridstate = this._brn?.state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
		return hlm('text-sm transition-all grid', gridstate, this._userCls());
	}

	public ngOnInit() {
		this._host?.setClassToCustomElement('pt-1 pb-4');
	}
}
