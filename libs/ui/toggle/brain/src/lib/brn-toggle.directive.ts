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
		'[attr.data-state]': '_state()',
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

	/** The current state of the toggle when not used in a group. */
	readonly state = model<'on' | 'off'>('off');

	/** Whether the toggle is responds to click events. */
	readonly disableToggleClick = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the toggle is in the on state. */
	protected readonly isOn = computed(() => this._state() === 'on');

	/** The current state that reflects the group state or the model state. */
	protected readonly _state = computed(() => {
		if (this.group) {
			return this.group.isSelected(this.value() as T) ? 'on' : 'off';
		}
		return this.state();
	});

	toggle(): void {
		if (this.disableToggleClick()) return;

		if (this.group) {
			if (this.isOn()) {
				this.group.deselect(this.value() as T, this);
			} else {
				this.group.select(this.value() as T, this);
			}
		} else {
			this.state.set(this.isOn() ? 'off' : 'on');
		}
	}
}
