import { Injectable, signal } from '@angular/core';

export type CLIMode = 'cli' | 'nx';

@Injectable({
	providedIn: 'root',
})
export class CLIModeService {
	private _CliMode = signal<CLIMode>('nx');

	public setCliMode(value: CLIMode): void {
		this._CliMode.set(value);
	}

	public CliMode = this._CliMode.asReadonly();
}
