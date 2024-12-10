import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	forwardRef,
	input,
	numberAttribute,
	ViewEncapsulation,
} from '@angular/core';
import { BrnDialogComponent } from '@spartan-ng/ui-dialog-brain';

export type BrnPopoverAlign = 'start' | 'center' | 'end';

@Component({
	selector: 'brn-popover',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnPopoverComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnPopover',
})
export class BrnPopoverComponent extends BrnDialogComponent {
	public readonly align = input<BrnPopoverAlign>('center');
	public readonly sideOffset = input(0, { transform: numberAttribute });

	private readonly _state = computed(() => ({
		align: this.align(),
		sideOffset: this.sideOffset(),
	}));

	constructor() {
		super();
		this.hasBackdropState().set(false);
		this.ariaDescribedByState().set('');
		this.ariaLabelledByState().set('');
		this.scrollStrategyState().set(this.ssos.reposition());

		effect(
			() => {
				const { align, sideOffset } = this._state();
				this.attachPositionsState().set([
					{
						originX: align,
						originY: 'bottom',
						overlayX: align,
						overlayY: 'top',
						offsetY: sideOffset,
					},
					{
						originX: align,
						originY: 'top',
						overlayX: align,
						overlayY: 'bottom',
						offsetY: -sideOffset,
					},
				]);
			},
			{ allowSignalWrites: true },
		);
	}
}
