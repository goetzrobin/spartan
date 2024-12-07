import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	forwardRef,
	input,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { BrnDialogComponent } from '@spartan-ng/ui-dialog-brain';

@Component({
	selector: 'brn-sheet',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnSheetComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnSheet',
})
export class BrnSheetComponent extends BrnDialogComponent {
	public readonly sideInput = input<'top' | 'bottom' | 'left' | 'right'>('top', { alias: 'side' });
	public readonly sideInputState = computed(() => signal(this.sideInput()));
	public readonly side = computed(() => this.sideInputState().asReadonly()());
	private readonly _sideEffect = effect(
		() => {
			const side = this.side();
			if (side === 'top') {
				this.positionStrategyState().set(this.positionBuilder.global().top());
			}
			if (side === 'bottom') {
				this.positionStrategyState().set(this.positionBuilder.global().bottom());
			}
			if (side === 'left') {
				this.positionStrategyState().set(this.positionBuilder.global().left());
			}
			if (side === 'right') {
				this.positionStrategyState().set(this.positionBuilder.global().right());
			}
		},
		{ allowSignalWrites: true },
	);
}
