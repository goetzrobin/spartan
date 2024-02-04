import { _DisposeViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import {
	CDK_TABLE,
	CdkTable,
	CdkTableDataSourceInput,
	DataRowOutlet,
	FooterRowOutlet,
	HeaderRowOutlet,
	NoDataRowOutlet,
	STICKY_POSITIONING_LISTENER,
	_COALESCED_STYLE_SCHEDULER,
	_CoalescedStyleScheduler,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

export type BrnTableDataSourceInput<T> = CdkTableDataSourceInput<T>;

@Component({
	selector: 'brn-table, table[brnTable]',
	standalone: true,
	imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
	providers: [
		{ provide: CDK_TABLE, useExisting: BrnTableComponent },
		{ provide: CdkTable, useExisting: BrnTableComponent },
		{ provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
		{ provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
		{ provide: STICKY_POSITIONING_LISTENER, useValue: null },
	],
	template: `
		<ng-content select="caption" />
		<ng-content select="colgroup, col" />

		<!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
		@if (_isServer) {
			<ng-content />
		}

		@if (_isNativeHtmlTable) {
			<thead role="rowgroup">
				<ng-container headerRowOutlet />
			</thead>
			<tbody role="rowgroup">
				<ng-container rowOutlet />
				<ng-container noDataRowOutlet />
			</tbody>
			<tfoot role="rowgroup">
				<ng-container footerRowOutlet />
			</tfoot>
		} @else {
			<ng-container headerRowOutlet />
			<ng-container rowOutlet />
			<ng-container noDataRowOutlet />
			<ng-container footerRowOutlet />
		}
	`,
	// See note on CdkTable for explanation on why this uses the default change detection strategy.
	// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
})
export class BrnTableComponent<T> extends CdkTable<T> {}
