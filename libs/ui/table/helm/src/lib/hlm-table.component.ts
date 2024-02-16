import { Directionality } from '@angular/cdk/bidi';
import { _VIEW_REPEATER_STRATEGY, _ViewRepeater } from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
	DataRowOutlet,
	FooterRowOutlet,
	HeaderRowOutlet,
	NoDataRowOutlet,
	RenderRow,
	RowContext,
	STICKY_POSITIONING_LISTENER,
	_COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
	Attribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	IterableDiffers,
	NgZone,
	ViewEncapsulation,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import {
	BRN_TABLE_TEMPLATE,
	BrnTableComponent,
	BrnTableDataSourceInput,
	applyTableProviders,
} from '@spartan-ng/ui-table-brain';
import { cva } from 'class-variance-authority';
import { ClassValue } from 'clsx';

export type HlmTableDataSourceInput<T> = BrnTableDataSourceInput<T>;

export const tableVariants = cva('text-sm [&_hlm-trow:last-child]:border-0', {
	variants: {
		variant: {
			table: '',
			flex: 'flex flex-col',
		},
	},
	defaultVariants: {
		variant: 'table',
	},
});

@Component({
	selector: 'hlm-table, table[hlmTable]',
	standalone: true,
	imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
	providers: applyTableProviders(HlmTableComponent),
	template: BRN_TABLE_TEMPLATE,
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
		role: 'table',
		'[attr.aria-labelledby]': 'labeledBy()',
	},
})
export class HlmTableComponent<T> extends BrnTableComponent<T> {
	readonly variant = input<'table' | 'flex'>(this._isNativeHtmlTable ? 'table' : 'flex');

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(tableVariants({ variant: this.variant() }), this._userClass()),
	);

	// we aria-labelledby to be settable from outside but use the input by default.
	private readonly _labeledByInput = input<string | null | undefined>(undefined, { alias: 'aria-labelledby' });
	public readonly labeledBy = signal<string | null | undefined>(undefined);

	constructor(@Attribute('role') role: string) {
		super(
			inject(IterableDiffers),
			inject(ChangeDetectorRef),
			inject(ElementRef),
			role,
			inject(Directionality),
			inject(DOCUMENT),
			inject(Platform),
			inject<_ViewRepeater<T, RenderRow<T>, RowContext<T>>>(_VIEW_REPEATER_STRATEGY),
			inject(_COALESCED_STYLE_SCHEDULER),
			inject(ViewportRuler),
			inject(STICKY_POSITIONING_LISTENER),
			inject(NgZone),
		);

		effect(() => this.labeledBy.set(this._labeledByInput()), { allowSignalWrites: true });
	}
}
