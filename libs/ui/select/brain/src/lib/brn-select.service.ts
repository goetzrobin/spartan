import { CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
		selectedOptions: Array<CdkOption | null>;
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
				tap((listBoxChange) => {
					const updatedSelections = this.multiple() ? this.getUpdatedOptions(listBoxChange) : [listBoxChange.option];
					this.state.update((state) => ({
						...state,
						selectedOptions: [...updatedSelections],
						value: listBoxChange.value as string[],
					}));
				}),
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

	getUpdatedOptions(latestListboxChange: ListboxValueChangeEvent<unknown>): Array<CdkOption | null> {
		const isNewSelection = latestListboxChange.value.findIndex((value) => value === latestListboxChange.option?.value);
		if (isNewSelection === -1) {
			const removedOptionIndex = this.selectedOptions().findIndex((option) => latestListboxChange.option === option);
			const options = this.selectedOptions();
			options.splice(removedOptionIndex, 1);
			return options;
		}
		return [...this.selectedOptions(), latestListboxChange.option];
	}

	deselectAllOptions() {
		this.state.update((state) => ({
			...state,
			selectedOptions: [],
			value: [],
		}));
	}
}
