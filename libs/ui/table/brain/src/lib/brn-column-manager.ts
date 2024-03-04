import { computed, Signal, signal } from '@angular/core';

export type BrnColumnVisibility = Record<string, boolean | { visible: boolean }>;
export class BrnColumnManager<T extends BrnColumnVisibility> {
	private readonly _initialColumnVisibility: T;
	private readonly _columnVisibility;

	public readonly allColumns: (keyof T)[] | { name: string; visible: boolean }[];
	public readonly columnVisibility;
	public readonly displayedColumns: Signal<(keyof T)[]> = computed(() => {
		return Object.entries(this._columnVisibility())
			.filter(([, value]) => (typeof value === 'boolean' ? value : value.visible))
			.map(([key]) => key);
	});

	constructor(initialColumnVisibility: T) {
		this._initialColumnVisibility = initialColumnVisibility;
		const initialEntries = Object.entries(this._initialColumnVisibility);
		this.allColumns =
			typeof initialEntries[0][1] === 'boolean'
				? Object.keys(this._initialColumnVisibility)
				: initialEntries.map((e) => ({ name: e[0], ...(e[1] as { visible: boolean }) }));
		this._columnVisibility = signal(this._initialColumnVisibility);
		this._columnVisibility.set(this._initialColumnVisibility);
		this.columnVisibility = this._columnVisibility.asReadonly();
	}

	public readonly isColumnVisible = (columnName: string) => {
		const visibilityMap = this.columnVisibility();
		const columnEntry = visibilityMap[columnName];
		console.log(visibilityMap, columnEntry, columnName);
		return typeof columnEntry === 'boolean' ? columnEntry : columnEntry.visible;
	};
	public readonly isColumnDisabled = (columnName: string) =>
		this.isColumnVisible(columnName) && this.displayedColumns().length === 1;

	public toggleVisibility(columnName: keyof T) {
		const visibilityMap = this._columnVisibility();
		const columnEntry = visibilityMap[columnName];
		const newVisibilityState = typeof columnEntry === 'boolean' ? !columnEntry : { visible: !columnEntry.visible };
		this._columnVisibility.set({ ...visibilityMap, [columnName]: newVisibilityState });
	}
	public setVisible(columnName: keyof T) {
		const visibilityMap = this._columnVisibility();
		const columnEntry = visibilityMap[columnName];
		const newVisibilityState = typeof columnEntry === 'boolean' ? true : { visible: true };
		this._columnVisibility.set({ ...visibilityMap, [columnName]: newVisibilityState });
	}
	public setInvisible(columnName: keyof T) {
		const visibilityMap = this._columnVisibility();
		const columnEntry = visibilityMap[columnName];
		const newVisibilityState = typeof columnEntry === 'boolean' ? false : { visible: false };
		this._columnVisibility.set({ ...visibilityMap, [columnName]: newVisibilityState });
	}
}

export const useBrnColumnManager = <T extends BrnColumnVisibility>(initialColumnVisibility: T) =>
	new BrnColumnManager(initialColumnVisibility);
