import { CdkListbox, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import {
	AfterViewInit,
	ContentChild,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	QueryList,
	effect,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { BrnSelectOptionDirective } from './brn-select-option.directive';
import { BrnSelectScrollDownDirective } from './brn-select-scroll-down.directive';
import { BrnSelectScrollUpDirective } from './brn-select-scroll-up.directive';
import { BrnSelectService } from './brn-select.service';

@Directive({
	selector: '[brnSelectContent]',
	standalone: true,
	hostDirectives: [CdkListbox],
})
export class BrnSelectContentDirective implements AfterViewInit {
	private readonly _el: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly _cdkListbox = inject(CdkListbox, { host: true });
	private readonly destroyRef = inject(DestroyRef);
	protected readonly _selectService = inject(BrnSelectService);

	readonly labelledBy = this._selectService.labelId;
	readonly id = this._selectService.id;
	readonly canScrollUp = signal(false);
	readonly canScrollDown = signal(false);
	readonly viewport = signal<ElementRef<HTMLElement> | undefined>(undefined);
	readonly viewport$ = toObservable(this.viewport);

	protected initialSelectedOptions$ = toObservable(this._selectService.initialSelectedOptions);

	@ContentChild(BrnSelectScrollUpDirective, { static: false })
	protected scrollUpBtn!: BrnSelectScrollUpDirective;

	@ContentChild(BrnSelectScrollDownDirective, { static: false })
	protected scrollDownBtn!: BrnSelectScrollDownDirective;

	@ContentChildren(BrnSelectOptionDirective, { descendants: true })
	protected _options!: QueryList<BrnSelectOptionDirective>;

	constructor() {
		this._cdkListbox.valueChange
			.asObservable()
			.pipe(takeUntilDestroyed())
			.subscribe((val: ListboxValueChangeEvent<unknown>) => this._selectService.listBoxValueChangeEvent$.next(val));

		effect(() => {
			this._cdkListbox.multiple = this._selectService.multiple();
			this._selectService.isExpanded() && setTimeout(() => this.updateArrowDisplay());
		});
	}

	ngAfterViewInit(): void {
		this.setInitiallySelectedOptions();
	}

	private setInitiallySelectedOptions() {
		this.initialSelectedOptions$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectedOptions) => {
			// Reapplying cdkLibstbox multiple because seems this is running before effect that
			// updates cdklistbox, reapplying multiple true so we can set the multiple initial options
			if (this._selectService.multiple()) {
				this._cdkListbox.multiple = true;
			}

			this._selectService.possibleOptions().forEach((cdkOption) => {
				if (selectedOptions.includes(cdkOption)) {
					cdkOption?.select();
				} else {
					cdkOption?.deselect();
				}
			});
			selectedOptions.forEach((cdkOption) => cdkOption?.select());
		});
	}

	public async updateArrowDisplay() {
		const viewport = await firstValueFrom(this.viewport$.pipe(filter(Boolean)));
		this.canScrollUp.set(viewport.nativeElement.scrollTop > 0);
		const maxScroll = viewport.nativeElement.scrollHeight - viewport.nativeElement.clientHeight;
		this.canScrollDown.set(Math.ceil(viewport.nativeElement.scrollTop) < maxScroll);
	}

	public handleScroll() {
		this.updateArrowDisplay();
	}

	public focusList(): void {
		this._cdkListbox.focus();
	}

	public moveFocusUp() {
		const viewport = this.viewport()!;
		viewport.nativeElement.scrollBy({ top: -100, behavior: 'smooth' });
		if (viewport.nativeElement.scrollTop === 0) {
			this.scrollUpBtn.stopEmittingEvents();
		}
	}

	public moveFocusDown() {
		const viewport = this.viewport()!;
		viewport.nativeElement.scrollBy({ top: 100, behavior: 'smooth' });
		const viewportSize = this._el.nativeElement.scrollHeight;
		const viewportScrollPosition = viewport.nativeElement.scrollTop;
		if (viewportSize + viewportScrollPosition + 100 > viewport.nativeElement.scrollHeight + 50) {
			this.scrollDownBtn.stopEmittingEvents();
		}
	}
}
