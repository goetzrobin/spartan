import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { radixCaretSort, radixChevronDown, radixDotsHorizontal } from '@ng-icons/radix-icons';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { HlmCheckboxCheckIconComponent, HlmCheckboxDirective } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime, map } from 'rxjs';

export type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

const PAYMENT_DATA: Payment[] = [
	{
		id: 'm5gr84i9',
		amount: 316,
		status: 'success',
		email: 'ken99@yahoo.com',
	},
	{
		id: '3u1reuv4',
		amount: 242,
		status: 'success',
		email: 'Abe45@gmail.com',
	},
	{
		id: 'derv1ws0',
		amount: 837,
		status: 'processing',
		email: 'Monserrat44@gmail.com',
	},
	{
		id: '5kma53ae',
		amount: 874,
		status: 'success',
		email: 'Silas22@gmail.com',
	},
	{
		id: 'bhqecj4p',
		amount: 721,
		status: 'failed',
		email: 'carmella@hotmail.com',
	},
	{
		id: 'p0r8sd2f',
		amount: 123,
		status: 'failed',
		email: 'john.doe@example.com',
	},
	{
		id: '8uyv3n1x',
		amount: 589,
		status: 'processing',
		email: 'emma.smith@gmail.com',
	},
	{
		id: '2zqo6ptr',
		amount: 456,
		status: 'success',
		email: 'jackson78@hotmail.com',
	},
	{
		id: 'l7we9a3m',
		amount: 632,
		status: 'success',
		email: 'grace_22@yahoo.com',
	},
	{
		id: 'o9p2v3qk',
		amount: 987,
		status: 'failed',
		email: 'robert.adams@gmail.com',
	},
	{
		id: 'q1o8r7mz',
		amount: 321,
		status: 'processing',
		email: 'alexander34@gmail.com',
	},
	{
		id: 'i5n3s0tv',
		amount: 555,
		status: 'failed',
		email: 'olivia_morris@hotmail.com',
	},
	{
		id: '3xr7s2nl',
		amount: 789,
		status: 'success',
		email: 'michael_cole@yahoo.com',
	},
	{
		id: 'u9v2p1qy',
		amount: 234,
		status: 'success',
		email: 'lily.jones@gmail.com',
	},
	{
		id: 'b4q0e1cp',
		amount: 876,
		status: 'failed',
		email: 'ryan_14@hotmail.com',
	},
	{
		id: 's1z8m7op',
		amount: 456,
		status: 'success',
		email: 'sophia.green@gmail.com',
	},
	{
		id: 'n5a3v0lt',
		amount: 987,
		status: 'failed',
		email: 'david.miller@yahoo.com',
	},
	{
		id: '2qr7v9sm',
		amount: 654,
		status: 'processing',
		email: 'emma_jones@hotmail.com',
	},
	{
		id: 'y9b2h8qq',
		amount: 789,
		status: 'success',
		email: 'jacob_89@gmail.com',
	},
	{
		id: 'c4a0r1xp',
		amount: 123,
		status: 'failed',
		email: 'samantha.richards@yahoo.com',
	},
];

@Component({
	selector: 'spartan-data-table-preview',
	standalone: true,
	imports: [
		FormsModule,

		BrnMenuTriggerDirective,
		HlmMenuModule,

		BrnTableModule,
		HlmTableModule,

		HlmButtonModule,

		DecimalPipe,
		TitleCasePipe,
		HlmIconComponent,
		HlmInputDirective,

		BrnCheckboxComponent,
		HlmCheckboxCheckIconComponent,
		HlmCheckboxDirective,
	],
	providers: [provideIcons({ radixChevronDown, radixDotsHorizontal, radixCaretSort })],
	host: {
		class: 'w-full',
	},
	template: `
		<div class="flex flex-col justify-between gap-4 sm:flex-row">
			<input
				hlmInput
				class="w-full md:w-80"
				placeholder="Filter emails..."
				[ngModel]="_emailFilter()"
				(ngModelChange)="_rawFilterInput.set($event)"
			/>

			<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
				Columns
				<hlm-icon name="radixChevronDown" class="ml-2" size="sm" />
			</button>
			<ng-template #menu>
				<hlm-menu class="w-32">
					@for (columnName of _brnColumnManager.allColumns; track columnName) {
						<button
							hlmMenuItemCheckbox
							[disabled]="_brnColumnManager.isColumnDisabled(columnName)"
							[checked]="_brnColumnManager.isColumnVisible(columnName)"
							(triggered)="_brnColumnManager.toggleVisibility(columnName)"
						>
							<hlm-menu-item-check />
							<span>{{ columnName | titlecase }}</span>
						</button>
					}
				</hlm-menu>
			</ng-template>
		</div>

		<brn-table
			hlm
			stickyHeader
			class="border-border mt-4 block h-[335px] overflow-auto rounded-md border"
			[dataSource]="_filteredSortedPaginatedPayments()"
			[displayedColumns]="_allDisplayedColumns()"
			[trackBy]="_trackBy"
		>
			<brn-column-def name="select">
				<hlm-th class="w-12" *brnHeaderDef>
					<brn-checkbox hlm [checked]="_checkboxState()" (changed)="handleHeaderCheckboxChange()">
						<hlm-checkbox-checkicon />
					</brn-checkbox>
				</hlm-th>
				<hlm-td class="w-12" *brnCellDef="let element">
					<brn-checkbox hlm [checked]="_isPaymentSelected(element)" (changed)="togglePayment(element)">
						<hlm-checkbox-checkicon />
					</brn-checkbox>
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="status">
				<hlm-th truncate class="w-32 sm:w-40" *brnHeaderDef>Status</hlm-th>
				<hlm-td truncate class="w-32 sm:w-40" *brnCellDef="let element">
					{{ element.status | titlecase }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="email">
				<hlm-th class="w-60 lg:flex-1" *brnHeaderDef>
					<button hlmBtn size="sm" variant="ghost" (click)="handleEmailSortChange()">
						Email
						<hlm-icon class="ml-1" size="sm" name="radixCaretSort" />
					</button>
				</hlm-th>
				<hlm-td truncate class="w-60 lg:flex-1" *brnCellDef="let element">
					{{ element.email }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="amount">
				<hlm-th class="w-20 justify-end" *brnHeaderDef>Amount</hlm-th>
				<hlm-td class="w-20 justify-end font-medium tabular-nums" *brnCellDef="let element">
					\${{ element.amount | number: '1.2-2' }}
				</hlm-td>
			</brn-column-def>
			<brn-column-def name="actions">
				<hlm-th class="w-16" *brnHeaderDef></hlm-th>
				<hlm-td class="w-16" *brnCellDef="let element">
					<button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [brnMenuTriggerFor]="menu">
						<hlm-icon class="h-4 w-4" name="radixDotsHorizontal" />
					</button>

					<ng-template #menu>
						<hlm-menu>
							<hlm-menu-label>Actions</hlm-menu-label>
							<hlm-menu-separator />
							<hlm-menu-group>
								<button hlmMenuItem>Copy payment ID</button>
							</hlm-menu-group>
							<hlm-menu-separator />
							<hlm-menu-group>
								<button hlmMenuItem>View customer</button>
								<button hlmMenuItem>View payment details</button>
							</hlm-menu-group>
						</hlm-menu>
					</ng-template>
				</hlm-td>
			</brn-column-def>
			<div class="text-muted-foreground flex items-center justify-center p-20" brnNoDataRow>No data</div>
		</brn-table>
		<div
			class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center"
			*brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
		>
			<span class="${hlmMuted} text-sm">{{ _selected().length }} of {{ _totalElements() }} row(s) selected</span>
			<div class="mt-2 flex sm:mt-0">
				<select
					[ngModel]="_pageSize()"
					(ngModelChange)="_pageSize.set($event)"
					hlmInput
					size="sm"
					class="mr-1 inline-flex pr-8"
				>
					@for (size of _availablePageSizes; track size) {
						<option [value]="size">{{ size === 10000 ? 'All' : size }}</option>
					}
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
	`,
})
export class DataTablePreviewComponent {
	protected readonly _rawFilterInput = signal('');
	protected readonly _emailFilter = signal('');
	private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

	private readonly _displayedIndices = signal({ start: 0, end: 0 });
	protected readonly _availablePageSizes = [5, 10, 20, 10000];
	protected readonly _pageSize = signal(this._availablePageSizes[0]);

	private readonly _selectionModel = new SelectionModel<Payment>(true);
	protected readonly _isPaymentSelected = (payment: Payment) => this._selectionModel.isSelected(payment);
	protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
		initialValue: [],
	});

	protected readonly _brnColumnManager = useBrnColumnManager({
		status: true,
		email: true,
		amount: true,
	});
	protected readonly _allDisplayedColumns = computed(() => [
		'select',
		...this._brnColumnManager.displayedColumns(),
		'actions',
	]);

	private readonly _payments = signal(PAYMENT_DATA);
	private readonly _filteredPayments = computed(() => {
		const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
		if (emailFilter && emailFilter.length > 0) {
			return this._payments().filter((u) => u.email.toLowerCase().includes(emailFilter));
		}
		return this._payments();
	});
	private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
	protected readonly _filteredSortedPaginatedPayments = computed(() => {
		const sort = this._emailSort();
		const start = this._displayedIndices().start;
		const end = this._displayedIndices().end + 1;
		const payments = this._filteredPayments();
		if (!sort) {
			return payments.slice(start, end);
		}
		return [...payments]
			.sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
			.slice(start, end);
	});
	protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
		this._filteredSortedPaginatedPayments().every((payment) => this._selected().includes(payment)),
	);
	protected readonly _checkboxState = computed(() => {
		const noneSelected = this._selected().length === 0;
		const allSelectedOrIndeterminate = this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
		return noneSelected ? false : allSelectedOrIndeterminate;
	});

	protected readonly _trackBy: TrackByFunction<Payment> = (_: number, p: Payment) => p.id;
	protected readonly _totalElements = computed(() => this._filteredPayments().length);
	protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
		this._displayedIndices.set({ start: startIndex, end: endIndex });

	constructor() {
		// needed to sync the debounced filter to the name filter, but being able to override the
		// filter when loading new users without debounce
		effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
	}

	protected togglePayment(payment: Payment) {
		this._selectionModel.toggle(payment);
	}

	protected handleHeaderCheckboxChange() {
		const previousCbState = this._checkboxState();
		if (previousCbState === 'indeterminate' || !previousCbState) {
			this._selectionModel.select(...this._filteredSortedPaginatedPayments());
		} else {
			this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
		}
	}

	protected handleEmailSortChange() {
		const sort = this._emailSort();
		if (sort === 'ASC') {
			this._emailSort.set('DESC');
		} else if (sort === 'DESC') {
			this._emailSort.set(null);
		} else {
			this._emailSort.set('ASC');
		}
	}
}

export const defaultCode = `
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, TrackByFunction, computed, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { radixChevronDown, radixDotsHorizontal } from '@ng-icons/radix-icons';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { BrnMenuModule } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { BrnTableModule, PaginatorState, useBrnColumnManager } from '@spartan-ng/ui-table-brain';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';
import { debounceTime } from 'rxjs';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const PAYMENT_DATA: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
];

@Component({
  selector: 'spartan-data-table-preview',
  standalone: true,
  imports: [
    FormsModule,

    BrnMenuModule,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,
  ],
  providers: [provideIcons({ radixChevronDown, radixDotsHorizontal })],
  host: {
    class: 'w-full',
  },
  template: \`
    <div class="flex justify-between">
      <input
        hlmInput
        class="w-80"
        placeholder="Filter emails..."
        [ngModel]="_emailFilter()"
        (ngModelChange)="_rawFilterInput.set($event)"
      />

      <button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">
        Columns
        <hlm-icon name="radixChevronDown" class="ml-2" size="sm" />
      </button>
      <ng-template #menu>
        <div hlm brnMenu class="w-32">
          @for (columnName of _brnColumnManager.allColumns; track columnName) {
            <button
              hlm
              brnMenuItemCheckbox
              [disabled]="_brnColumnManager.isColumnDisabled(columnName)"
              [checked]="_brnColumnManager.isColumnVisible(columnName)"
              (triggered)="_brnColumnManager.toggleVisibility(columnName)"
            >
              <hlm-menu-item-check />
              <span>{{ columnName | titlecase }}</span>
            </button>
          }
        </div>
      </ng-template>
    </div>

    <brn-table
      hlm
      stickyHeader
      class="border-border mt-4 block h-[337px] overflow-scroll rounded-md border"
      [dataSource]="_filteredPaginatedPayments()"
      [displayedColumns]="_allDisplayedColumns()"
      [trackBy]="_trackBy"
    >
      <brn-column-def name="status">
        <hlm-th truncate class="w-40" *brnHeaderDef>Status</hlm-th>
        <hlm-td truncate class="w-40" *brnCellDef="let element">
          {{ element.status | titlecase }}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="email">
        <hlm-th class="flex-1" *brnHeaderDef>Email</hlm-th>
        <hlm-td class="flex-1" *brnCellDef="let element">
          {{ element.email }}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="amount">
        <hlm-th class="w-40 justify-end" *brnHeaderDef>Amount</hlm-th>
        <hlm-td class="w-40 justify-end font-medium tabular-nums" *brnCellDef="let element">
          $ {{ element.amount | number: '1.2-2'}}
        </hlm-td>
      </brn-column-def>
      <brn-column-def name="actions">
        <hlm-th class="w-16" *brnHeaderDef></hlm-th>
        <hlm-td class="w-16" *brnCellDef="let element">
          <button hlmBtn variant="ghost" class="h-6 w-6 p-0.5" align="end" [brnMenuTriggerFor]="menu">
            <hlm-icon class="h-4 w-4" name="radixDotsHorizontal" />
          </button>

          <ng-template #menu>
            <div hlm brnMenu>
              <hlm-menu-label>Actions</hlm-menu-label>
              <hlm-menu-separator />
              <div brnMenuGroup>
                <button hlm brnMenuItem>Copy payment ID</button>
              </div>
              <hlm-menu-separator />
              <div brnMenuGroup>
                <button hlm brnMenuItem>View customer</button>
                <button hlm brnMenuItem>View payment details</button>
              </div>
            </div>
          </ng-template>
        </hlm-td>
      </brn-column-def>
      <div class="text-muted-foreground flex items-center justify-center p-20" brnNoDataRow>No data</div>
    </brn-table>
    <div
      class="mt-2 flex items-center justify-between"
      *brnPaginator="let ctx; totalElements: _totalElements(); pageSize: _pageSize(); onStateChange: _onStateChange"
    >
      <span class="\${hlmMuted} text-sm">
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
          @for (size of _availablePageSizes; track size) {
            <option [value]="size">{{ size === 10000 ? 'All' : size }}</option>
          }
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
  \`,
})
export class DataTablePreviewComponent {
  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  protected readonly _brnColumnManager = useBrnColumnManager({
    status: true,
    email: true,
    amount: true,
  });
  protected readonly _allDisplayedColumns = computed(() => [...this._brnColumnManager.displayedColumns(), 'actions']);

  private readonly _payments = signal(PAYMENT_DATA);
  private readonly _filteredPayments = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._payments().filter((u) => u.email.toLowerCase().includes(emailFilter));
    }
    return this._payments();
  });
  protected readonly _filteredPaginatedPayments = computed(() =>
    this._filteredPayments().slice(this._displayedIndices().start, this._displayedIndices().end + 1),
  );
  protected readonly _trackBy: TrackByFunction<Payment> = (_: number, p: Payment) => p.id;
  protected readonly _totalElements = computed(() => this._filteredPayments().length);
  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), { allowSignalWrites: true });
  }
}
`;
