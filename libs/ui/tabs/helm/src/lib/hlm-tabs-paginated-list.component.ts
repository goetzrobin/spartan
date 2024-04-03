import { CdkObserveContent } from '@angular/cdk/observers';
import { NgClass } from '@angular/common';
import { Component, ContentChildren, ElementRef, QueryList, ViewChild, computed, input } from '@angular/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlm } from '@spartan-ng/ui-core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnTabsPaginatedListDirective, BrnTabsTriggerDirective } from '@spartan-ng/ui-tabs-brain';
import { ClassValue } from 'clsx';
import { listVariants } from './hlm-tabs-list.component';

@Component({
	selector: 'hlm-paginated-tab-list',
	standalone: true,
	imports: [HlmButtonDirective, CdkObserveContent, NgClass, HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
	template: `
		<button
			#previousPaginator
			type="button"
			aria-hidden="true"
			hlmBtn
			variant="ghost"
			size="icon"
			tabindex="-1"
			[class]="{
				flex: _showPaginationControls,
				hidden: !_showPaginationControls
			}"
			class="relative z-[2] select-none items-center justify-center pl-1 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
			[class.flex]="_showPaginationControls"
			[disabled]="_disableScrollBefore || null"
			(click)="_handlePaginatorClick('before')"
			(mousedown)="_handlePaginatorPress('before', $event)"
			(touchend)="_stopInterval()"
		>
			<hlm-icon size="base" name="lucideChevronLeft" />
		</button>

		<div #tabListContainer class="z-[1] flex grow overflow-hidden " (keydown)="_handleKeydown($event)">
			<div class="relative grow transition-transform" #tabList role="tablist" (cdkObserveContent)="_onContentChanges()">
				<div #tabListInner [class]="_tabListClass()">
					<ng-content></ng-content>
				</div>
			</div>
		</div>

		<button
			#nextPaginator
			type="button"
			aria-hidden="true"
			tabindex="-1"
			hlmBtn
			variant="ghost"
			size="icon"
			[ngClass]="{
				flex: _showPaginationControls,
				hidden: !_showPaginationControls
			}"
			class="relative z-[2] select-none items-center justify-center pr-1 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50"
			[disabled]="_disableScrollAfter || null"
			(click)="_handlePaginatorClick('after')"
			(mousedown)="_handlePaginatorPress('after', $event)"
			(touchend)="_stopInterval()"
		>
			<hlm-icon size="base" name="lucideChevronRight" />
		</button>
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmTabsPaginatedListComponent extends BrnTabsPaginatedListDirective {
	@ContentChildren(BrnTabsTriggerDirective, { descendants: false })
	_items!: QueryList<BrnTabsTriggerDirective>;
	@ViewChild('tabListContainer', { static: true })
	_tabListContainer!: ElementRef;
	@ViewChild('tabList', { static: true }) _tabList!: ElementRef;
	@ViewChild('tabListInner', { static: true }) _tabListInner!: ElementRef;
	@ViewChild('nextPaginator') _nextPaginator!: ElementRef<HTMLElement>;
	@ViewChild('previousPaginator') _previousPaginator!: ElementRef<HTMLElement>;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('flex overflow-hidden relative flex-shrink-0', this.userClass()));

	public readonly tabLisClass = input<ClassValue>('', { alias: 'class' });
	protected _tabListClass = computed(() => hlm(listVariants(), this.tabLisClass()));

	protected _itemSelected(event: KeyboardEvent) {
		event.preventDefault();
	}
}
