import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, booleanAttribute, computed, inject, input, model } from '@angular/core';
import { injectBrnToggleGroup } from './brn-toggle-group.token';

@Directive({
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

	private readonly changeDetector = inject(ChangeDetectorRef);

	/** Access the toggle group if available. */
	protected readonly group = injectBrnToggleGroup<T>();

	/** The id of the toggle. */
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

	toggle(): void {
		if (this.disableToggleClick()) return;

		if (this.state() === 'on') {
			this.toggleOff();
		} else {
			this.toggleOn();
		}
	}

	/**
	 * @internal
	 */
	toggleOff(): void {
		// if we are already off, do nothing
		if (this.state() === 'off' || (this.group && !this.group.canDeselect(this.value()))) return;

		this.state.set('off');

		const value = this.value();

		if (value) {
			this.group?.deselect(value, this);
		}

		// this is required as this may be called from writeValue (via ngModel/formControl)
		// in the group which may not automatically run change detection
		this.changeDetector.detectChanges();
	}

	/**
	 * @internal
	 */
	toggleOn(): void {
		// if we are already on, do nothing
		if (this.state() === 'on') return;

		this.state.set('on');

		const value = this.value();

		if (value) {
			this.group?.select(value, this);
		}

		// this is required as this may be called from writeValue (via ngModel/formControl)
		// in the group which may not automatically run change detection
		this.changeDetector.detectChanges();
	}
}
