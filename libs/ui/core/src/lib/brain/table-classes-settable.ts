import { inject, InjectionToken, InjectOptions } from '@angular/core';

export interface TableClassesSettable {
	setTableClasses: (classes: Partial<{ table: string; headerRow: string; bodyRow: string }>) => void;
}

export const SET_TABLE_CLASSES_TOKEN: InjectionToken<TableClassesSettable> = new InjectionToken<TableClassesSettable>(
	'@spartan-ng SET_TABLE_CLASSES_TOKEN',
);

export const injectTableClassesSettable = (options: InjectOptions) => inject(SET_TABLE_CLASSES_TOKEN, options);
