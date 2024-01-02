import { CdkListbox, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Component, ContentChild, ElementRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { tap } from 'rxjs';
import { BrnSelectScrollDownDirective } from './brn-select-scroll-down.directive';
import { BrnSelectScrollUpDirective } from './brn-select-scroll-up.directive';
import { BrnSelectService } from './brn-select.service';

// TODO: need to do logic for up and down arrows
@Component({
	selector: 'brn-select-content, hlm-select-content:not(noHlm)',
	standalone: true,
	imports: [BrnSelectScrollUpDirective, BrnSelectScrollDownDirective, HlmIconComponent],
	hostDirectives: [CdkListbox],
	host: {
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'-trigger'",
		class: 'flex flex-col',
		styles: `
		:host {
			scrollbar-width:"none";
			-ms-overflow-style:"none";
			-webkit-overflow-scrolling:"touch";
		}`,
	},
	template: `
		@if (canScrollUp()) {
			@if (scrollUpBtn) {
				<ng-content select="[brnSelectScrollUp]" />
			} @else {
				<div brnSelectScrollUp><hlm-icon class="ml-2 h-4 w-4" name="radixChevronUp" /></div>
			}
		}
		<div
			class="relative w-full overflow-auto"
			style="flex: 1 1 0%;
			scrollbar-width:none;
			-ms-overflow-style:none;
			-webkit-overflow-scrolling:touch;"
		>
			<ng-content />
		</div>
		@if (canScrollDown()) {
			@if (scrollDownBtn) {
				<ng-content select="[brnSelectScrollDown]" />
			} @else {
				<div brnSelectScrollDown><hlm-icon class="ml-2 h-4 w-4" name="radixChevronDown" /></div>
			}
		}
	`,
})
export class BrnSelectContentComponent implements OnInit {
	private _cdkListbox = inject(CdkListbox, { host: true });

	private _selectService = inject(BrnSelectService);

	private _el = inject(ElementRef);

	labelledBy = this._selectService.labelId;

	id = this._selectService.id;

	multiple$ = toObservable(this._selectService.multiple);

	canScrollUp = signal(false);
	canScrollDown = signal(false);

	@ContentChild(BrnSelectScrollUpDirective)
	protected scrollUpBtn!: BrnSelectScrollUpDirective;

	@ContentChild(BrnSelectScrollDownDirective)
	protected scrollDownBtn!: BrnSelectScrollDownDirective;

	@HostListener('scroll', ['event'])
	handleScroll() {
		this.canScrollUp.set(this._el.nativeElement.scrollTop > 0);
		const maxScroll = this._el.nativeElement.scrollHeight - this._el.nativeElement.clientHeight;
		this.canScrollDown.set(Math.ceil(this._el.nativeElement.scrollTop) < maxScroll);
	}

	// canScrollUp = this._selectService.canScrollUp;
	// canScrollDown = this._selectService.canScrollDown;

	constructor() {
		this._cdkListbox.valueChange
			.asObservable()
			.pipe(
				takeUntilDestroyed(),
				tap((val: ListboxValueChangeEvent<unknown>) => this._selectService.listBoxValueChangeEvent$.next(val)),
			)
			.subscribe();

		this.multiple$
			.pipe(
				takeUntilDestroyed(),
				tap((multiple) => (this._cdkListbox.multiple = multiple)),
			)
			.subscribe();
	}

	ngOnInit(): void {
		console.log('Init');
		// this._el.nativeElement.addEventListener('scroll', handleScroll);
	}

	focusList(): void {
		this._cdkListbox.focus();
	}
}
