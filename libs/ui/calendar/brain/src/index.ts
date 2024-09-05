import { NgModule } from '@angular/core';
import { BrnCalendarCellDirective } from './lib/brn-calendar-cell.directive';
// import { provideSpartanDateLibrary } from './lib/agnostic-date-ops/default-provider';
import { BrnCalendarDaysOfTheWeekComponent } from './lib/brn-calendar-days-of-the-week.component';
import { BrnCalendarDisplayDirective } from './lib/brn-calendar-display.directive';
import { BrnCalendarHeaderDirective } from './lib/brn-calendar-header.directive';
import { BrnCalendarMonthDisplayComponent } from './lib/brn-calendar-month-display.component';
import { BrnCalendarMonthYearComponent } from './lib/brn-calendar-month-year.component';
import { BrnCalendarNextBtnDirective } from './lib/brn-calendar-next.directive';
import { BrnCalendarPreviousBtnDirective } from './lib/brn-calendar-previous.directive';
import { BrnCalendarTableBodyComponent } from './lib/brn-calendar-table-body';
import { BrnCalendarViewSwitcherComponent } from './lib/brn-calendar-view-switcher.component';
import { BrnCalendarYearDisplayComponent } from './lib/brn-calendar-year-display.component';
// import { BrnCalendarComponent } from './lib/brn-calendar.component';
import { BrnCalendarDirective } from './lib/brn-calendar.directive';

export * from './lib/brn-calendar-display.directive';
// export * from './lib/brn-calendar.component';
export * from './lib/brn-calendar.service';
export * from './lib/brn-calendar-header.directive';
export * from './lib/brn-calendar-next.directive';
export * from './lib/brn-calendar-previous.directive';
export * from './lib/brn-calendar-view-switcher.component';
export * from './lib/brn-calendar-year-display.component';
export * from './lib/brn-calendar-month-year.component';
export * from './lib/brn-calendar.directive';
export * from './lib/brn-calendar-table-body';
export * from './lib/brn-calendar-days-of-the-week.component';
export * from './lib/brn-calendar-cell.directive';
export * from './lib/brn-calendar-year-display.component';
export * from './lib/brn-calendar-month-display.component';

// export * from './lib/agnostic-date-ops/date.module';
export * from './lib/date.service';
// export * from './lib/agnostic-date-ops/default-provider';

export const BrnCalendarImports = [
	BrnCalendarDisplayDirective,
	BrnCalendarDirective,
	BrnCalendarHeaderDirective,
	BrnCalendarMonthYearComponent,
	BrnCalendarNextBtnDirective,
	BrnCalendarPreviousBtnDirective,
	BrnCalendarYearDisplayComponent,
	BrnCalendarViewSwitcherComponent,
	BrnCalendarDaysOfTheWeekComponent,
	BrnCalendarTableBodyComponent,
	BrnCalendarCellDirective,
	BrnCalendarMonthDisplayComponent,
] as const;

@NgModule({
	imports: [...BrnCalendarImports],
	exports: [...BrnCalendarImports],
	// providers: [provideSpartanDateLibrary()],
})
export class BrnCalendarModule {}
