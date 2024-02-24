import { Injectable, signal } from '@angular/core';

export type CLIMode = 'cli' | 'nx';

@Injectable({
	providedIn: 'root',
})
export class CLIModeService {
	private _cliMode = signal<CLIMode>('nx');

	public setCliMode(value: CLIMode): void {
		this._cliMode.set(value);
	}

	public cliMode = this._cliMode.asReadonly();
}
