import { CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject, skip } from 'rxjs';
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
		initialSelectedOptions: Array<CdkOption | null>;
		value: string | string[];
		triggerWidth: number;
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
		initialSelectedOptions: [],
		value: '',
		triggerWidth: 0,
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
	public readonly initialSelectedOptions = computed(() => this.state().initialSelectedOptions);
	public readonly value = computed(() => this.state().value);
	public readonly triggerWidth = computed(() => this.state().triggerWidth);
	public readonly possibleOptions = computed(() => this._possibleOptions());

	private readonly _possibleOptions = signal<Array<CdkOption | null>>([]);
	private readonly multiple$ = toObservable(this.multiple);

	public readonly listBoxValueChangeEvent$ = new Subject<ListboxValueChangeEvent<unknown>>();

	private _selectTrigger?: BrnSelectTriggerDirective;
	get selectTrigger() {
		return this._selectTrigger;
	}

	constructor() {
		this.listBoxValueChangeEvent$.pipe(takeUntilDestroyed()).subscribe((listBoxChange) => {
			const updatedSelections = this.multiple() ? this.getUpdatedOptions(listBoxChange) : [listBoxChange.option];
			const value = this.multiple() ? listBoxChange.value : listBoxChange.value[0];
			this.state.update((state) => ({
				...state,
				selectedOptions: [...updatedSelections],
				value: value as string | string[],
			}));
		});

		// We need to skip the first value because we don't want to deselect all options when the component is initialized with a preselected value e.g. by the form control
		this.multiple$.pipe(skip(1), takeUntilDestroyed()).subscribe((multiple) => {
			if (!multiple && this.value().length > 1) {
				this.deselectAllOptions();
			}
		});
	}

	public setTriggerWidth(triggerWidth: number) {
		this.state.update((s) => ({ ...s, triggerWidth }));
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

	public registerOption(option: CdkOption | null) {
		this._possibleOptions.update((options) => [...options, option]);
	}

	public deregisterOption(option: CdkOption | null) {
		this._possibleOptions.update((options) => options.filter((o) => o !== option));
	}

	public setInitialSelectedOptions(value: unknown) {
		this.selectOptionByValue(value);
		this.state.update((state) => ({
			...state,
			initialSelectedOptions: this.selectedOptions(),
		}));
	}

	private selectOptionByValue(value: unknown) {
		if (value === null || value === undefined) {
			this.state.update((state) => ({
				...state,
				selectedOptions: [],
				value: this.multiple() ? [] : '',
			}));
			return;
		}

		const options = this._possibleOptions();

		if (this.multiple()) {
			const selectedOptions = options.filter((option) => {
				if (Array.isArray(value)) {
					return value.includes(option?.value as string);
				}
				return value === option?.value;
			});
			this.state.update((state) => ({
				...state,
				selectedOptions,
				value: value as string[],
			}));
		} else {
			const selectedOption = options.find((option) => option?.value === value);
			if (!selectedOption) {
				return;
			}
			this.state.update((state) => ({
				...state,
				selectedOptions: [selectedOption as CdkOption | null],
				value: selectedOption.value as string,
			}));
		}
	}
}
