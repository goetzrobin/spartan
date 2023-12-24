import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	HostBinding,
	Input,
	OnInit,
	ViewChild,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxHostPressedListener } from '@spartan-ng/ui-core';
import { fromEvent } from 'rxjs';
import { BrnAccordionItemDirective } from './brn-accordion-item.directive';
import { BrnAccordionDirective } from './brn-accordion.directive';

@Component({
	selector: 'brn-accordion-trigger, hlm-accordion-trigger',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style]': '"display:contents"',
		role: 'heading',
		'aria-level': '3',
	},
	template: `
		<button
			#btn
			[class]="_contentClass()"
			[attr.data-state]="state()"
			[attr.aria-expanded]="state() === 'open'"
			[attr.aria-controls]="ariaControls"
			[id]="id"
		>
			<ng-content />
		</button>
	`,
})
export class BrnAccordionTriggerComponent implements OnInit {
	private readonly _accordion = inject(BrnAccordionDirective);
	private readonly _item = inject(BrnAccordionItemDirective);
	private readonly _hostPressedListener = rxHostPressedListener();
	private readonly _destroyRef = inject(DestroyRef);

	public readonly state = this._item.state;
	public readonly id = 'brn-accordion-trigger-' + this._item.id;
	public readonly ariaControls = 'brn-accordion-content-' + this._item.id;

	protected readonly _contentClass = signal('');

	@ViewChild('btn', { static: true }) trigger!: ElementRef<HTMLButtonElement>;

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}

		if (!this._item) {
			throw Error('Accordion trigger can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}
		this._hostPressedListener.subscribe(() => {
			this._accordion.toggleItem(this._item.id);
		});
	}

	ngOnInit(): void {
		fromEvent(this.trigger.nativeElement, 'focus')
			.pipe(takeUntilDestroyed(this._destroyRef))
			.subscribe(() => this._accordion.setActiveItem(this));
	}

	public focus() {
		this.trigger.nativeElement.focus();
	}

	// eslint-disable-next-line @angular-eslint/no-input-rename
	@HostBinding('attr.class')
	@Input()
	set class(inputs: string) {
		this._contentClass.set(inputs);
	}
}
