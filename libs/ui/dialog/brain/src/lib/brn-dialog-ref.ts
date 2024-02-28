import { DialogRef } from '@angular/cdk/dialog';
import { Signal, WritableSignal } from '@angular/core';
import { Subject, take } from 'rxjs';
import { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogState } from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog.service';

export class BrnDialogRef<DialogResult = any> {
	private readonly _closing$ = new Subject<void>();
	public readonly closing$ = this._closing$.asObservable();

	public readonly closed$ = this._cdkDialogRef.closed.pipe(take(1));

	private _previousTimeout: ReturnType<typeof setTimeout> | undefined;

	public get open() {
		return this.state() === 'open' ? true : false;
	}

	constructor(
		private readonly _cdkDialogRef: DialogRef<DialogResult>,
		private readonly _open: WritableSignal<boolean>,
		public readonly state: Signal<BrnDialogState>,
		public readonly dialogId: number,
		private readonly _options?: BrnDialogOptions,
	) {}

	public close(result?: DialogResult, delay: number = this._options?.closeDelay ?? 0) {
		if (!this.open || this._options?.disableClose) return;

		this._closing$.next();
		this._open.set(false);

		if (this._previousTimeout) {
			clearTimeout(this._previousTimeout);
		}

		this._previousTimeout = setTimeout(() => {
			this._cdkDialogRef.close(result);
		}, delay);
	}

	public setPanelClass(paneClass: string | null | undefined) {
		this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
	}

	public setOverlayClass(overlayClass: string | null | undefined) {
		this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
	}

	public setAriaLabel(ariaLabel: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabel = ariaLabel;
	}
}
