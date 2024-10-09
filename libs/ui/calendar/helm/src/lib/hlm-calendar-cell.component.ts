import { NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, computed, input, viewChild } from '@angular/core';
import { buttonVariants } from '@spartan-ng/ui-button-helm';
import { hlm, injectDateAdapter } from '@spartan-ng/ui-core';
import { injectCalendar } from './hlm-calendar.token';

@Component({
	standalone: true,
	selector: 'td[hlm-calendar-cell]',
	imports: [NgClass],
	host: {
		class:
			'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md data-[selected]:data-[outside]:bg-accent/50 data-[selected]:bg-accent first:data-[selected]:rounded-l-md last:data-[selected]:rounded-r-md focus-within:relative focus-within:z-20',
		role: 'presentation',
	},
	template: `
		<button
			#button
			[class]="btnClass()"
			role="gridcell"
			[tabindex]="focusable() ? 0 : -1"
			type="button"
			[attr.data-outside]="outside() ? '' : null"
			[attr.data-today]="today() ? '' : null"
			[attr.data-selected]="selected() ? '' : null"
			[attr.data-disabled]="disabled() ? '' : null"
			[attr.aria-selected]="selected() ? 'true' : null"
			[attr.aria-disabled]="disabled() ? 'true' : null"
			[disabled]="disabled()"
			(click)="calendar.selectDate(date())"
			(keydown.arrowLeft)="focusPrevious($event)"
			(keydown.arrowRight)="focusNext($event)"
			(keydown.arrowUp)="focusAbove($event)"
			(keydown.arrowDown)="focusBelow($event)"
			(keydown.home)="focusFirst($event)"
			(keydown.end)="focusLast($event)"
			(keydown.pageUp)="focusPreviousMonth($event)"
			(keydown.pageDown)="focusNextMonth($event)"
			>
			{{ dateAdapter.getDate(date()) }}
		</button>
	`,
})
export class HlmCalendarCellComponent<T> implements OnDestroy {
	/** Access the date adapter */
	protected readonly dateAdapter = injectDateAdapter<T>();

	/** Access the calendar component */
	protected readonly calendar = injectCalendar<T>();

	/** The date this cell represents */
	readonly date = input.required<T>();

	/** Access the button element */
	readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');

	/** Whether this date is disabled */
	readonly disabled = computed(() => this.calendar.isDateDisabled(this.date()));

	/** Whether this date is currently selected */
	readonly selected = computed(() => {
		const selectedDate = this.calendar.date();
		return selectedDate && this.dateAdapter.isSameDay(this.date(), selectedDate);
	});

	/** Whether this date is focusable */
	readonly focusable = computed(() => this.dateAdapter.isSameDay(this.calendar.state().focusedDate(), this.date()));

	protected readonly btnClass = computed(() =>
		hlm(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 p-0 font-normal aria-selected:opacity-100', {
			'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30':
				this.outside(),
			'bg-accent text-accent-foreground': this.today(),
			'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground':
				this.selected(),
			'text-muted-foreground opacity-50': this.disabled(),
		}),
	);

	/** Whether this date is outside the current month */
	readonly outside = computed(() => {
		const focusedDate = this.calendar.state().focusedDate();
		return !this.dateAdapter.isSameMonth(this.date(), focusedDate);
	});

	/** Whether this date is today */
	readonly today = computed(() => this.dateAdapter.isSameDay(this.date(), this.dateAdapter.now()));

	constructor() {
		this.calendar.registerCell(this);
	}

	ngOnDestroy(): void {
		this.calendar.unregisterCell(this);
	}

	/**
	 * Focus the previous cell.
	 */
	protected focusPrevious(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		// in rtl, the arrow keys are reversed.
		const targetDate = this.dateAdapter.add(this.calendar.state().focusedDate(), {
			days: this.getDirection() === 'rtl' ? 1 : -1,
		});

		this.calendar.setFocusedDate(targetDate);
	}

	/**
	 * Focus the next cell.
	 */
	protected focusNext(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const targetDate = this.dateAdapter.add(this.calendar.state().focusedDate(), {
			days: this.getDirection() === 'rtl' ? -1 : 1,
		});

		this.calendar.setFocusedDate(targetDate);
	}

	/**
	 * Focus the above cell.
	 */
	protected focusAbove(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.subtract(this.calendar.state().focusedDate(), { days: 7 }));
	}

	/**
	 * Focus the below cell.
	 */
	protected focusBelow(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.add(this.calendar.state().focusedDate(), { days: 7 }));
	}

	/**
	 * Focus the first date of the month.
	 */
	protected focusFirst(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.startOfMonth(this.calendar.state().focusedDate()));
	}

	/**
	 * Focus the last date of the month.
	 */
	protected focusLast(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.calendar.setFocusedDate(this.dateAdapter.endOfMonth(this.calendar.state().focusedDate()));
	}

	/**
	 * Focus the same date in the previous month.
	 */
	protected focusPreviousMonth(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const date = this.dateAdapter.getDate(this.calendar.state().focusedDate());

		let previousMonthTarget = this.dateAdapter.startOfMonth(this.calendar.state().focusedDate());
		previousMonthTarget = this.dateAdapter.subtract(previousMonthTarget, { months: 1 });

		const lastDay = this.dateAdapter.endOfMonth(previousMonthTarget);

		// if we are on a date that does not exist in the previous month, we should focus the last day of the month.
		if (date > this.dateAdapter.getDate(lastDay)) {
			this.calendar.setFocusedDate(lastDay);
		} else {
			this.calendar.setFocusedDate(this.dateAdapter.set(previousMonthTarget, { day: date }));
		}
	}

	/**
	 * Focus the same date in the next month.
	 */
	protected focusNextMonth(event: Event): void {
		event.preventDefault();
		event.stopPropagation();

		const date = this.dateAdapter.getDate(this.calendar.state().focusedDate());

		let nextMonthTarget = this.dateAdapter.startOfMonth(this.calendar.state().focusedDate());
		nextMonthTarget = this.dateAdapter.add(nextMonthTarget, { months: 1 });

		const lastDay = this.dateAdapter.endOfMonth(nextMonthTarget);

		// if we are on a date that does not exist in the next month, we should focus the last day of the month.
		if (date > this.dateAdapter.getDate(lastDay)) {
			this.calendar.setFocusedDate(lastDay);
		} else {
			this.calendar.setFocusedDate(this.dateAdapter.set(nextMonthTarget, { day: date }));
		}
	}

	/**
	 * Get the direction of the element.
	 */
	private getDirection(): 'ltr' | 'rtl' {
		return getComputedStyle(this.button().nativeElement).direction === 'rtl' ? 'rtl' : 'ltr';
	}

	focus(): void {
		this.button().nativeElement.focus();
	}
}
