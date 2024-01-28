import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
// import { connect } from 'ngxtension/connect';
import { Subject, tap } from 'rxjs';

@Injectable()
export class BrnSelectService {
	state = signal<{
		id: string;
		labelId: string;
		panelId: string;
		placeholder: string;
		isExpanded: boolean;
		multiple: boolean;
		disabled: boolean;
		selectedOptions: Array<ListboxValueChangeEvent<unknown>>;
		value: string | string[];
	}>({
		id: '',
		labelId: '',
		panelId: '',
		placeholder: '',
		isExpanded: false,
		multiple: false,
		disabled: false,
		selectedOptions: [],
		value: '',
	});

	readonly id = computed(() => this.state().id);
	readonly labelId = computed(() => this.state().labelId);
	readonly panelId = computed(() => this.state().panelId);
	readonly placeholder = computed(() => this.state().placeholder);
	readonly disabled = computed(() => this.state().disabled);
	readonly isExpanded = computed(() => this.state().isExpanded);
	readonly multiple = computed(() => this.state().multiple);
	readonly selectedOptions = computed(() => this.state().selectedOptions);
	readonly value = computed(() => this.state().value);

	private multiple$ = toObservable(this.multiple);

	listBoxValueChangeEvent$ = new Subject<ListboxValueChangeEvent<unknown>>();

	constructor() {
		this.listBoxValueChangeEvent$
			.pipe(
				takeUntilDestroyed(),
				tap((listBoxChange) =>
					this.state.update((state) => ({
						...state,
						selectedOptions: this.multiple() ? [...state.selectedOptions, listBoxChange] : [listBoxChange],
						value: listBoxChange.value as string[],
					})),
				),
			)
			.subscribe();

		this.multiple$
			.pipe(
				takeUntilDestroyed(),
				tap((multiple) => {
					// If the value switches from true to false, and more than one option is selected,
					// all options are deselected.
					if (!multiple && this.value().length > 1) {
						this.deselectAllOptions();
					}
				}),
			)
			.subscribe();
	}

	deselectAllOptions() {
		this.state.update((state) => ({
			...state,
			value: [],
		}));
	}
}
