import { computed, Signal, signal } from '@angular/core';

export class BrnColumnManager<T extends Record<string, boolean>> {
  private readonly _initialColumnVisibility: T;
  public readonly allColumns: (keyof T)[];
  private readonly _columnVisibility;
  public readonly columnVisibility;
  public readonly displayedColumns: Signal<(keyof T)[]> = computed(() => {
    return Object.entries(this._columnVisibility())
      .filter(([, value]) => value)
      .map(([key]) => key);
  });

  constructor(initialColumnVisibility: T) {
    this._initialColumnVisibility = initialColumnVisibility;
    this.allColumns = Object.keys(this._initialColumnVisibility);
    this._columnVisibility = signal(this._initialColumnVisibility);
    this._columnVisibility.set(this._initialColumnVisibility);
    this.columnVisibility = this._columnVisibility.asReadonly();
  }

  public readonly isColumnVisible = (name: string) => this.columnVisibility()[name];
  public readonly isColumnDisabled = (name: string) =>
    this.columnVisibility()[name] && this.displayedColumns().length === 1;

  public toggleVisibility(columnName: keyof T) {
    const columnVisibility = this._columnVisibility();
    this._columnVisibility.set({ ...columnVisibility, [columnName]: !columnVisibility[columnName] });
  }
  public setVisible(columnName: keyof T) {
    const columnVisibility = this._columnVisibility();
    this._columnVisibility.set({ ...columnVisibility, [columnName]: true });
  }
  public setInvisible(columnName: keyof T) {
    const columnVisibility = this._columnVisibility();
    this._columnVisibility.set({ ...columnVisibility, [columnName]: false });
  }
}

export const useBrnColumnManager = <T extends Record<string, boolean>>(initialColumnVisibility: T) =>
  new BrnColumnManager(initialColumnVisibility);
