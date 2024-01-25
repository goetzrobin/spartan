import { CdkListbox, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { BrnSelectScrollDownDirective } from './brn-select-scroll-down.directive';
import { BrnSelectScrollUpDirective } from './brn-select-scroll-up.directive';
import { BrnSelectService } from './brn-select.service';

// TODO: need to do logic for up and down arrows
@Component({
	selector: 'brn-select-content, hlm-select-content:not(noHlm)',
	standalone: true,
	imports: [BrnSelectScrollUpDirective, BrnSelectScrollDownDirective],
	hostDirectives: [CdkListbox],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'-trigger'",
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
		@if (canScrollUp() && scrollUpBtn) {
			<ng-content select="hlm-select-scroll-up" />
		}
		<div
			data-brn-select-viewport
			#viewport
			(scroll)="handleScroll()"
			style="flex: 1 1 0%;
			position: relative;
			width:100%;
			overflow:auto;
			min-height: 36px;"
		>
			<ng-content />
		</div>
		@if (canScrollDown() && scrollDownBtn) {
			<ng-content select="hlm-select-scroll-down" />
		}
	`,
})
export class BrnSelectContentComponent {
	private _cdkListbox = inject(CdkListbox, { host: true });
	private _selectService = inject(BrnSelectService);

	protected labelledBy = this._selectService.labelId;
	protected id = this._selectService.id;
	protected multiple$ = toObservable(this._selectService.multiple);
	protected canScrollUp = signal(false);
	protected canScrollDown = signal(false);

	@ViewChild('viewport')
	protected viewport!: ElementRef<HTMLElement>;

	@ContentChild(BrnSelectScrollUpDirective, { static: false })
	protected scrollUpBtn!: BrnSelectScrollUpDirective;

	@ContentChild(BrnSelectScrollDownDirective, { static: false })
	protected scrollDownBtn!: BrnSelectScrollDownDirective;

	handleScroll() {
		this.canScrollUp.set(this.viewport.nativeElement.scrollTop > 0);
		const maxScroll = this.viewport.nativeElement.scrollHeight - this.viewport.nativeElement.clientHeight;
		this.canScrollDown.set(Math.ceil(this.viewport.nativeElement.scrollTop) < maxScroll);
	}

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

	focusList(): void {
		this._cdkListbox.focus();
	}
}
