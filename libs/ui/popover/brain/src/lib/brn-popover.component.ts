import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
	effect,
	forwardRef,
	numberAttribute,
	signal,
	untracked,
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
	private readonly _sideOffset = signal(0);
	@Input({ transform: numberAttribute })
	public set sideOffset(value: number) {
		this._sideOffset.set(value);
	}

	private readonly _align = signal<BrnPopoverAlign>('center');
	@Input()
	public set align(value: BrnPopoverAlign) {
		this._align.set(value);
	}

	constructor() {
		super();
		this.hasBackdrop = false;
		this.ariaDescribedBy = '';
		this.ariaLabelledBy = '';
		this.scrollStrategy = this.ssos.reposition();

		effect(() => {
			const align = this._align();
			this.attachPositions = [
				{
					originX: align,
					originY: 'bottom',
					overlayX: align,
					overlayY: 'top',
				},
				{
					originX: align,
					originY: 'top',
					overlayX: align,
					overlayY: 'bottom',
				},
			];
			this.applySideOffset(untracked(this._sideOffset));
		});

		effect(() => {
			this.applySideOffset(this._sideOffset());
		});
	}

	private applySideOffset(sideOffset: number) {
		this.attachPositions = (this._options.attachPositions ?? []).map((position) => ({
			...position,
			offsetY: position.originY === 'top' ? -sideOffset : sideOffset,
		}));
	}
}
