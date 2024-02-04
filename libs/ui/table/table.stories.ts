import { NgForOf, TitleCasePipe } from '@angular/common';
import { Component, TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { faker } from '@faker-js/faker';
import { radixChevronDown } from '@ng-icons/radix-icons';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { debounceTime } from 'rxjs';
import { HlmButtonDirective, HlmButtonModule } from '../button/helm/src';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { BrnMenuModule } from '../menu/brain/src';
import { HlmMenuModule } from '../menu/helm/src';
import { BrnToggleGroupModule } from '../toggle/brain/src';
import { HlmToggleGroupModule } from '../toggle/helm/src';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from './brain/src';
import { HlmTableComponent, HlmTableModule } from './helm/src';

const createUsers = (numUsers = 5) => {
	return Array.from({ length: numUsers }, () => ({
		name: faker.person.fullName(),
		age: faker.number.int({ min: 10, max: 100 }),
		height: faker.number.int({ min: 140, max: 210 }),
	}));
};

@Component({
	selector: 'table-story',
	standalone: true,
	imports: [
		FormsModule,
		NgForOf,

		BrnTableModule,
		HlmTableModule,
		BrnMenuModule,
		HlmMenuModule,
		HlmInputDirective,
		HlmButtonDirective,
		HlmIconComponent,
		TitleCasePipe,
	],
	providers: [provideIcons({ radixChevronDown })],
	template: `
		<div class="flex justify-between">
			<input
				hlmInput
				placeholder="Filter by name"
				[ngModel]="_nameFilter()"
				(ngModelChange)="_rawFilterInput.set($event)"
			/>

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<hlm-icon name="radixChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-40">
					<button
						*ngFor="let column of _brnColumnManager.allColumns"
						hlmMenuItemCheckbox
						[disabled]="_brnColumnManager.isColumnDisabled(column.name)"
						[checked]="_brnColumnManager.isColumnVisible(column.name)"
						(triggered)="_brnColumnManager.toggleVisibility(column.name)"
					>
						<hlm-menu-item-check />
						<span>{{ column.label }}</span>
					</button>
				</hlm-menu>
			</ng-template>
		</div>

		<hlm-table
			stickyHeader
			class="border-border mt-4 block h-[337px] overflow-scroll rounded-md border"
			[dataSource]="_data()"
			[trackBy]="_trackBy"
		>
			<hlm-header-row *hlmHeaderRowDef="_brnColumnManager.displayedColumns()" />
			<hlm-row *hlmRowDef="let row; columns: _brnColumnManager.displayedColumns()" />

			<ng-container [hlmColumnDef]="'name'">
				<hlm-th truncate class="w-40" *hlmHeaderCellDef>Name</hlm-th>
				<hlm-td truncate class="w-40" *hlmCellDef="let element">
					{{ element.name }}
				</hlm-td>
			</ng-container>

			<ng-container [hlmColumnDef]="'age'">
				<hlm-th class="w-40 justify-end" *hlmHeaderCellDef>Age</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *hlmCellDef="let element">
					{{ element.age }}
				</hlm-td>
			</ng-container>
			<ng-container [hlmColumnDef]="'height'">
				<hlm-th class="w-40 justify-end tabular-nums" *hlmHeaderCellDef>Height</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *hlmCellDef="let element">
					{{ element.height }}
				</hlm-td>
			</ng-container>
		</hlm-table>
		<div
			class="mt-2 flex items-center justify-between"
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="text-sm tabular-nums">
				Showing entries {{ ctx.state().startIndex + 1 }} - {{ ctx.state().endIndex + 1 }} of {{ _totalElements() }}
			</span>
			<div class="flex">
				<select
					[ngModel]="_pageSize()"
					(ngModelChange)="_pageSize.set($event)"
					hlmInput
					size="sm"
					class="mr-1 inline-flex pr-8"
				>
					<option [value]="size" *ngFor="let size of _availablePageSizes">{{ size === 10000 ? 'All' : size }}</option>
				</select>

				<div class="flex space-x-1">
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.decrementable()" (click)="ctx.decrement()">
						Previous
					</button>
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.incrementable()" (click)="ctx.increment()">
						Next
					</button>
				</div>
			</div>
		</div>
		<button size="sm" variant="outline" hlmBtn (click)="_loadNewUsers()">Mix it up</button>
	`,
})
class TableStory {
	private readonly _startEndIndex = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [10, 20, 50, 100, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	protected readonly _brnColumnManager = useBrnColumnManager({
		name: { visible: true, label: 'Name' },
		age: { visible: false, label: 'Alter' },
		height: { visible: true, label: 'Größe' },
	});

	protected readonly _rawFilterInput = signal('');
	protected readonly _nameFilter = signal('');
	private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

	private readonly _users = signal(createUsers(20));
	private readonly _filteredUsers = computed(() =>
		this._users().filter((user) => {
			const nameFilter = this._nameFilter();
			return !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());
		}),
	);
	protected readonly _data = computed(() =>
		this._filteredUsers().slice(this._startEndIndex().start, this._startEndIndex().end + 1),
	);
	protected readonly _trackBy: TrackByFunction<{ name: string }> = (index: number, user: { name: string }) => user.name;
	protected readonly _totalElements = computed(() => this._filteredUsers().length);
	protected readonly _onStateChange = (state: PaginatorState) => {
		this._startEndIndex.set({ start: state.startIndex, end: state.endIndex });
	};

	constructor() {
		// needed to sync the debounced filter to the name filter, but being able to override the
		// filter when loading new users without debounce
		effect(() => this._nameFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
	}

	protected _loadNewUsers() {
		this._nameFilter.set('');
		this._users.set(createUsers(Math.random() * 200));
	}
}

@Component({
	selector: 'table-toggle-story',
	standalone: true,
	imports: [
		FormsModule,
		NgForOf,
		BrnTableModule,
		HlmTableModule,
		HlmButtonModule,
		BrnToggleGroupModule,
		HlmToggleGroupModule,
	],
	template: `
		<brn-toggle-group
			aria-label="Show selected or all "
			hlm
			class="mb-2.5 w-full sm:w-fit"
			[ngModel]="_onlyAbove180()"
			(ngModelChange)="_setOnlyAbove180($event)"
		>
			<button class="w-full sm:w-40" variant="outline" [value]="false" hlm brnToggle>All</button>
			<button class="w-full tabular-nums sm:w-40" variant="outline" [value]="true" hlm brnToggle>Above 150</button>
		</brn-toggle-group>
		<hlm-table
			stickyHeader
			class="border-border mt-4 block h-[337px] overflow-scroll rounded-md border"
			[dataSource]="_data()"
			[trackBy]="_trackBy"
		>
			<hlm-header-row *hlmHeaderRowDef="_brnColumnManager.displayedColumns()" />
			<hlm-row *hlmRowDef="let row; columns: _brnColumnManager.displayedColumns()" />

			<ng-container hlmColumnDef="name">
				<hlm-th truncate class="w-40" *hlmHeaderCellDef>Name</hlm-th>
				<hlm-td truncate class="w-40" *hlmCellDef="let element">
					{{ element.name }}
				</hlm-td>
			</ng-container>
			<ng-container hlmColumnDef="age">
				<hlm-th class="w-40 justify-end" *hlmHeaderCellDef>Age</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *hlmCellDef="let element">
					{{ element.age }}
				</hlm-td>
			</ng-container>
			<ng-container hlmColumnDef="height">
				<hlm-th class="w-40 justify-end" *hlmHeaderCellDef>Height</hlm-th>
				<hlm-td class="w-40 justify-end tabular-nums" *hlmCellDef="let element">
					{{ element.height }}
				</hlm-td>
			</ng-container>
		</hlm-table>
		<div
			class="mt-2 flex items-center justify-between"
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="text-sm tabular-nums">
				Showing entries {{ ctx.state().startIndex + 1 }} - {{ ctx.state().endIndex + 1 }} of {{ _totalElements() }}
			</span>
			<div class="flex">
				<select
					[ngModel]="_pageSize()"
					(ngModelChange)="_pageSize.set($event)"
					hlmInput
					size="sm"
					class="mr-1 inline-flex pr-8"
				>
					<option [value]="size" *ngFor="let size of _availablePageSizes">{{ size === 10000 ? 'All' : size }}</option>
				</select>

				<div class="flex space-x-1">
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.decrementable()" (click)="ctx.decrement()">
						Previous
					</button>
					<button size="sm" variant="outline" hlmBtn [disabled]="!ctx.incrementable()" (click)="ctx.increment()">
						Next
					</button>
				</div>
			</div>
		</div>
		<button size="sm" variant="outline" hlmBtn (click)="_loadNewUsers()">Mix it up</button>
	`,
})
class TableToggleStory {
	private readonly _startEndIndex = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [10, 20, 50, 100, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	protected readonly _onlyAbove180 = signal<boolean>(false);
	protected readonly _brnColumnManager = useBrnColumnManager({
		name: true,
		age: false,
		height: true,
	});

	private readonly _users = signal(createUsers(20));
	private readonly _filteredUsers = computed(() => {
		if (this._onlyAbove180()) return this._users().filter((u) => u.height > 180);
		return this._users();
	});
	protected readonly _data = computed(() =>
		this._filteredUsers().slice(this._startEndIndex().start, this._startEndIndex().end + 1),
	);
	protected readonly _trackBy: TrackByFunction<{ name: string }> = (index: number, user: { name: string }) => user.name;
	protected readonly _totalElements = computed(() => this._filteredUsers().length);
	protected readonly _onStateChange = (state: PaginatorState) => {
		this._startEndIndex.set({ start: state.startIndex, end: state.endIndex });
	};

	protected _loadNewUsers() {
		this._users.set(createUsers(Math.random() * 200));
	}

	protected _setOnlyAbove180(newVal: boolean) {
		if (newVal) {
			this._brnColumnManager.setInvisible('age');
		} else {
			this._brnColumnManager.setVisible('age');
		}
		this._onlyAbove180.set(newVal);
	}
}

@Component({
	selector: 'table-presentation-only-story',
	standalone: true,
	imports: [BrnTableModule, HlmTableModule, NgForOf],
	template: `
		<table hlmTable [dataSource]="_data()">
			<ng-container hlmColumnDef="username">
				<th hlmHeaderCell *hlmHeaderCellDef truncate class="w-40">Name</th>
				<td hlmCell *hlmCellDef="let row" truncate class="w-40">{{ row.name }}</td>
			</ng-container>

			<ng-container hlmColumnDef="age">
				<th hlmHeaderCell *hlmHeaderCellDef truncate class="w-40">Age</th>
				<td hlmCell *hlmCellDef="let row" truncate class="w-40">{{ row.age }}</td>
			</ng-container>

			<ng-container hlmColumnDef="height">
				<th hlmHeaderCell *hlmHeaderCellDef truncate class="w-40">Height</th>
				<td hlmCell *hlmCellDef="let row" truncate class="w-40">{{ row.height }}</td>
			</ng-container>

			<tr hlmHeaderRow *hlmHeaderRowDef="['username', 'age', 'height']"></tr>
			<tr hlmRow *hlmRowDef="let row; columns: ['username', 'age', 'height']"></tr>
		</table>
	`,
})
class TablePresentationOnlyStory {
	protected readonly _data = signal(createUsers(20));
}

const meta: Meta<HlmTableComponent<unknown>> = {
	title: 'Table',
	component: HlmTableComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [TableStory, TableToggleStory],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTableComponent<unknown>>;

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [TableStory],
		},
		template: `<table-story/>`,
	}),
};

export const PresentationOnly: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [TablePresentationOnlyStory],
		},
		template: `<table-presentation-only-story/>`,
	}),
};

export const Toggle: Story = {
	render: () => ({
		template: `<table-toggle-story/>`,
	}),
};
