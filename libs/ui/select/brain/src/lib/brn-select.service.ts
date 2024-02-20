import { CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { BrnSelectTriggerDirective } from './brn-select-trigger.directive';

type BrnReadDirection = 'ltr' | 'rtl';

@Injectable()
export class BrnSelectService {
	public readonly state = signal<{
		id: string;
		labelId: string;
		panelId: string;
		placeholder: string;
		isExpanded: boolean;
		multiple: boolean;
		disabled: boolean;
		dir: BrnReadDirection;
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
		dir: 'ltr',
		selectedOptions: [],
		value: '',
	});

	public readonly id = computed(() => this.state().id);
	public readonly labelId = computed(() => this.state().labelId);
	public readonly panelId = computed(() => this.state().panelId);
	public readonly placeholder = computed(() => this.state().placeholder);
	public readonly disabled = computed(() => this.state().disabled);
	public readonly isExpanded = computed(() => this.state().isExpanded);
	public readonly multiple = computed(() => this.state().multiple);
	public readonly dir = computed(() => this.state().dir);
	public readonly selectedOptions = computed(() => this.state().selectedOptions);
	public readonly value = computed(() => this.state().value);

	private readonly multiple$ = toObservable(this.multiple);

	public readonly listBoxValueChangeEvent$ = new Subject<ListboxValueChangeEvent<unknown>>();

	private _selectTrigger?: BrnSelectTriggerDirective;
	get selectTrigger() {
		return this._selectTrigger;
	}

	constructor() {
		this.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe((listBoxChange) => {
			const updatedSelections = this.multiple() ? this.getUpdatedOptions(listBoxChange) : [listBoxChange.option];
			this.state.update((state) => ({
				...state,
				selectedOptions: [...updatedSelections],
				value: listBoxChange.value as string[],
			}));
		});

		this.multiple$.pipe(takeUntilDestroyed()).subscribe((multiple) => {
			if (!multiple && this.value().length > 1) {
				this.deselectAllOptions();
			}
		});
	}

	public getUpdatedOptions(latestListboxChange: ListboxValueChangeEvent<unknown>): Array<CdkOption | null> {
		const isNewSelection = latestListboxChange.value.findIndex((value) => value === latestListboxChange.option?.value);
		if (isNewSelection === -1) {
			const removedOptionIndex = this.selectedOptions().findIndex((option) => latestListboxChange.option === option);
			const options = this.selectedOptions();
			options.splice(removedOptionIndex, 1);
			return options;
		}
		return [...this.selectedOptions(), latestListboxChange.option];
	}

	public deselectAllOptions() {
		this.state.update((state) => ({
			...state,
			selectedOptions: [],
			value: [],
		}));
	}

	// Needed due to https://github.com/angular/angular/issues/20810
	public _setSelectTrigger(trigger: BrnSelectTriggerDirective) {
		this._selectTrigger = trigger;
	}
}
