import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, booleanAttribute, computed, inject, input, model, output } from '@angular/core';
import { injectBrnToggleGroup } from './brn-toggle-group.token';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'button[hlmToggle], button[brnToggle]',
	standalone: true,
	host: {
		id: 'id()',
		'[attr.disabled]': 'disabled() || group?.disabled() ? true : null',
		'[attr.data-disabled]': 'disabled() || group?.disabled() ? true : null',
		'[attr.data-state]': 'state()',
		'[attr.aria-pressed]': 'isOn()',
		'(click)': 'toggle()',
	},
})
export class BrnToggleDirective<T> {
	private static uniqueId = 0;

	/** Access the change detector. */
	private readonly changeDetector = inject(ChangeDetectorRef);

	/** Access the toggle group if available. */
	protected readonly group = injectBrnToggleGroup<T>();

	readonly id = input(`brn-toggle-${BrnToggleDirective.uniqueId++}`);

	/** The value this toggle represents. */
	readonly value = input<T>();

	/** Whether the toggle is disabled. */
	readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The current state of the toggle. */
	readonly state = model<'on' | 'off'>('off');

	/** Whether the toggle is responds to click events. */
	readonly disableToggleClick = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the toggle is in the on state. */
	protected readonly isOn = computed(() => this.state() === 'on');

	/**
	 * @deprecated Use stateChange instead.
	 * Event emitted when the toggle is toggled on.
	 */
	readonly toggled = output<'on' | 'off'>();

	toggle(): void {
		if (this.disableToggleClick()) return;

		if (this.state() === 'on') {
			this.toggleOff();
		} else {
			this.toggleOn();
		}
	}

	toggleOff(): void {
		// if we are already off, do nothing
		if (this.state() === 'off' || !this.group?.canBeNullable(this.value())) return;

		this.state.set('off');
		this.toggled.emit('off');

		const value = this.value();

		if (value) {
			this.group?.deselect(value, this);
		}

		// this is required as this may be called from writeValue (via ngModel/formControl)
		// in the group which may not automatically run change detection
		this.changeDetector.detectChanges();
	}

	toggleOn(): void {
		// if we are already on, do nothing
		if (this.state() === 'on') return;

		this.state.set('on');
		this.toggled.emit('on');

		const value = this.value();

		if (value) {
			this.group?.select(value, this);
		}

		// this is required as this may be called from writeValue (via ngModel/formControl)
		// in the group which may not automatically run change detection
		this.changeDetector.detectChanges();
	}
}
