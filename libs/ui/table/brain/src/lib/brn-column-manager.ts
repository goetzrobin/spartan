import { computed, signal } from '@angular/core';

export class BrnColumnManager {
  private readonly _initialColumnVisibility: { [key: string]: boolean } = {};
  public readonly allColumns: string[] = [];
  private readonly _columnVisibility = signal(this._initialColumnVisibility);
  public readonly columnVisibility = this._columnVisibility.asReadonly();
  public readonly displayedColumns = computed(() =>
    Object.entries(this._columnVisibility())
      .filter(([, value]) => value)
      .map(([key]) => key)
  );

  constructor(initialColumnVisibility: { [key: string]: boolean }) {
    this._initialColumnVisibility = initialColumnVisibility;
    this.allColumns = Object.keys(this._initialColumnVisibility);
    this._columnVisibility.set(this._initialColumnVisibility);
  }

  public readonly isColumnVisible = (name: string) => this.columnVisibility()[name];
  public readonly isColumnDisabled = (name: string) =>
    this.columnVisibility()[name] && this.displayedColumns().length === 1;

  public toggleVisibility(columnName: string) {
    const columnVisibility = this._columnVisibility();
    columnVisibility[columnName] = !columnVisibility[columnName];
    this._columnVisibility.set(columnVisibility);
  }
}

export const useBrnColumnManager = (initialColumnVisibility: { [key: string]: boolean }) =>
  new BrnColumnManager(initialColumnVisibility);
