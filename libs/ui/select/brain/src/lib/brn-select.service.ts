import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
		value: string | string[];
	}>({
		id: '',
		labelId: '',
		panelId: '',
		placeholder: '',
		isExpanded: false,
		multiple: false,
		disabled: false,
		value: '',
	});

	readonly id = computed(() => this.state().id);
	readonly labelId = computed(() => this.state().labelId);
	readonly panelId = computed(() => this.state().panelId);
	readonly placeholder = computed(() => this.state().placeholder);
	readonly disabled = computed(() => this.state().disabled);
	readonly isExpanded = computed(() => this.state().isExpanded);
	readonly multiple = computed(() => this.state().multiple);
	readonly value = computed(() => this.state().value);

	listBoxValueChangeEvent$ = new Subject<ListboxValueChangeEvent<unknown>>();

	constructor() {
		this.listBoxValueChangeEvent$
			.pipe(
				takeUntilDestroyed(),
				tap((listBoxChange) =>
					this.state.update((state) => ({
						...state,
						value: listBoxChange.value as string[],
					})),
				),
			)
			.subscribe();
	}
}
