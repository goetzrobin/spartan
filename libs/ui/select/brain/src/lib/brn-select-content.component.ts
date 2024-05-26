import { CdkListbox } from '@angular/cdk/listbox';
import { NgTemplateOutlet } from '@angular/common';
import {
	type AfterContentInit,
	type AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	contentChild,
	contentChildren,
	effect,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BrnSelectOptionDirective } from './brn-select-option.directive';
import { BrnSelectScrollDownDirective } from './brn-select-scroll-down.directive';
import { BrnSelectScrollUpDirective } from './brn-select-scroll-up.directive';
import { BrnSelectService } from './brn-select.service';

@Component({
	selector: 'brn-select-content, hlm-select-content:not(noHlm)',
	standalone: true,
	imports: [CdkListbox, BrnSelectScrollUpDirective, BrnSelectScrollDownDirective, NgTemplateOutlet],
	hostDirectives: [{ directive: CdkListbox, outputs: ['cdkListboxValueChange'] }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(cdkListboxValueChange)': 'this._selectService.listBoxValueChangeEvent$.next($event)',
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'--trigger'",
		'[id]': "id() + '--content'",
		'[attr.dir]': '_selectService.dir()',
	},
	styles: [
		`
			:host {
				display: flex;
				box-sizing: border-box;
				flex-direction: column;
				outline: none;
				pointer-events: auto;
			}

			[data-brn-select-viewport] {
				scrollbar-width: none;
				-ms-overflow-style: none;
				-webkit-overflow-scrolling: touch;
			}

			[data-brn-select-viewport]::-webkit-scrollbar {
				display: none;
			}
		`,
	],
	template: `
		<ng-template #scrollUp>
			<ng-content select="hlm-select-scroll-up" />
			<ng-content select="brnSelectScrollUp" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollUp() && scrollUpBtn ? scrollUp : null" />
		<div
			data-brn-select-viewport
			#viewport
			(scroll)="handleScroll()"
			style="flex: 1 1 0%;
			position: relative;
			width:100%;
			overflow:auto;
			min-height: 36px;
      padding-bottom: 2px;
      margin-bottom: -2px;"
		>
			<ng-content />
		</div>
		<ng-template #scrollDown>
			<ng-content select="brnSelectScrollDown" />
			<ng-content select="hlm-select-scroll-down" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollDown() && scrollDownBtn ? scrollDown : null" />
	`,
})
export class BrnSelectContentComponent implements AfterViewInit, AfterContentInit {
	private readonly _el: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _cdkListbox = inject(CdkListbox, { host: true });
	private readonly destroyRef = inject(DestroyRef);
	protected readonly _selectService = inject(BrnSelectService);

	protected readonly labelledBy = this._selectService.labelId;
	protected readonly id = this._selectService.id;
	protected readonly canScrollUp = signal(false);
	protected readonly canScrollDown = signal(false);

	protected initialSelectedOptions$ = toObservable(this._selectService.initialSelectedOptions);

	protected viewport = contentChild<ElementRef<HTMLElement>>('viewport');
	protected scrollUpBtn = contentChild(BrnSelectScrollUpDirective);
	protected scrollDownBtn = contentChild(BrnSelectScrollDownDirective);
	protected _options = contentChildren<BrnSelectOptionDirective>(BrnSelectOptionDirective, { descendants: true });

	constructor() {
		effect(() => {
			this._cdkListbox.multiple = this._selectService.multiple();
			this._selectService.isExpanded() && setTimeout(() => this.updateArrowDisplay());
		});
	}

	ngAfterViewInit(): void {
		this.setInitiallySelectedOptions();
	}

	ngAfterContentInit(): void {
		this._selectService.selectContentLoaded$.next(true);
	}

	private setInitiallySelectedOptions() {
		this.initialSelectedOptions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectedOptions) => {
			// Reapplying cdkLibstbox multiple because seems this is running before effect that
			// updates cdklistbox, reapplying multiple true so we can set the multiple initial options
			if (this._selectService.multiple()) {
				this._cdkListbox.multiple = true;
			}
			for (const cdkOption of this._selectService.possibleOptions()) {
				if (selectedOptions.includes(cdkOption)) {
					cdkOption?.select();
				} else {
					cdkOption?.deselect();
				}
			}
			for (const cdkOption of selectedOptions) {
				cdkOption?.select();
			}
		});
	}

	public updateArrowDisplay(): void {
		const viewport = this.viewport();
		if (viewport) {
			this.canScrollUp.set(viewport.nativeElement.scrollTop > 0);
			const maxScroll = viewport.nativeElement.scrollHeight - viewport.nativeElement.clientHeight;
			this.canScrollDown.set(Math.ceil(viewport.nativeElement.scrollTop) < maxScroll);
		}
	}

	public handleScroll() {
		this.updateArrowDisplay();
	}

	public focusList(): void {
		this._cdkListbox.focus();
	}

	public moveFocusUp() {
		const viewport = this.viewport();
		if (viewport) {
			viewport.nativeElement.scrollBy({ top: -100, behavior: 'smooth' });
			if (viewport.nativeElement.scrollTop === 0) {
				this.scrollUpBtn()?.stopEmittingEvents();
			}
		}
	}

	public moveFocusDown() {
		const viewport = this.viewport();
		if (viewport) {
			viewport.nativeElement.scrollBy({ top: 100, behavior: 'smooth' });
			const viewportSize = this._el.nativeElement.scrollHeight;
			const viewportScrollPosition = viewport.nativeElement.scrollTop;
			if (viewportSize + viewportScrollPosition + 100 > viewport.nativeElement.scrollHeight + 50) {
				this.scrollDownBtn()?.stopEmittingEvents();
			}
		}
	}
}
