import { computed, Signal, signal } from '@angular/core';

type BrnColumnVisibility = Record<string, boolean> | Record<string, { visible: boolean }>;

type AllColumnsPropertyType<T> =
	T extends Record<string, boolean>
		? keyof T[]
		: T extends Record<string, infer R>
			? (R extends { visible: boolean } ? { name: keyof T } & R : never)[]
			: never;

export class BrnColumnManager<T extends BrnColumnVisibility> {
	private readonly _initialColumnVisibility: T;
	private readonly _columnVisibility;

	public readonly allColumns: AllColumnsPropertyType<T>;
	public readonly columnVisibility;
	public readonly displayedColumns: Signal<(keyof T)[]> = computed(() => {
		return Object.entries(this._columnVisibility())
			.filter(([, value]) => (typeof value === 'boolean' ? value : value.visible))
			.map(([key]) => key);
	});

	constructor(initialColumnVisibility: T) {
		this._initialColumnVisibility = initialColumnVisibility;
		this._columnVisibility = signal(this._initialColumnVisibility);
		this._columnVisibility.set(this._initialColumnVisibility);
		this.columnVisibility = this._columnVisibility.asReadonly();
		this.allColumns = this.createAllColumns(this._initialColumnVisibility);
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

	private createAllColumns(initialColumnVisibility: T): AllColumnsPropertyType<T> {
		const keys = Object.keys(initialColumnVisibility) as (keyof T)[];
		if (this.isBooleanConfig(initialColumnVisibility)) {
			return keys as unknown as AllColumnsPropertyType<T>;
		} else {
			return keys.map((key) => {
				const values = initialColumnVisibility[key] as { visible: boolean };
				return {
					name: key,
					...values,
				};
			}) as AllColumnsPropertyType<T>;
		}
	}

	private isBooleanConfig(config: any): config is Record<string, boolean> {
		return typeof Object.values(config)[0] === 'boolean';
	}
}

export const useBrnColumnManager = <T extends BrnColumnVisibility>(initialColumnVisibility: T) =>
	new BrnColumnManager(initialColumnVisibility);
