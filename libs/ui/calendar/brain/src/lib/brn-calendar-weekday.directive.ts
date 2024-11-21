import { Directive, EmbeddedViewRef, OnDestroy, TemplateRef, ViewContainerRef, computed, inject } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/ui-date-time';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	standalone: true,
	selector: '[brnCalendarWeekday]',
})
export class BrnCalendarWeekdayDirective<T> implements OnDestroy {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar<T>();

	/** Access the date time adapter */
	private readonly _dateAdapter = injectDateAdapter<T>();

	/** Access the view container ref */
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Access the template ref */
	private readonly _templateRef = inject<TemplateRef<BrnWeekdayContext>>(TemplateRef);

	/** Get the days of the week to display in the header. */
	protected readonly weekdays = computed(() => this._calendar.days().slice(0, 7));

	/** Store the view refs */
	private readonly _viewRefs: EmbeddedViewRef<BrnWeekdayContext>[] = [];

	// Make sure the template checker knows the type of the context with which the
	// template of this directive will be rendered
	static ngTemplateContextGuard<T>(_: BrnCalendarWeekdayDirective<T>, ctx: unknown): ctx is BrnWeekdayContext {
		return true;
	}

	constructor() {
		// Create a new view for each day
		for (const day of this.weekdays()) {
			const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, {
				$implicit: this._dateAdapter.getDay(day),
			});
			this._viewRefs.push(viewRef);
		}
	}

	ngOnDestroy(): void {
		// Destroy all the views when the directive is destroyed
		for (const viewRef of this._viewRefs) {
			viewRef.destroy();
		}
	}
}

interface BrnWeekdayContext {
	$implicit: number;
}
