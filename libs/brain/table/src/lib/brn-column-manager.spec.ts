import { useBrnColumnManager } from './brn-column-manager';

describe('BrnColumnManager', () => {
	it('should initialize with a Record of column names to booleans', () => {
		const columnManager = useBrnColumnManager({
			name: true,
			age: false,
		});

		expect(columnManager.allColumns).toEqual(['name', 'age']);
		expect(columnManager.displayedColumns()).toEqual(['name']);
		expect(columnManager.isColumnVisible('name')).toBe(true);
		expect(columnManager.isColumnVisible('age')).toBe(false);
	});

	it('should initialize with a Record of column names to objects', () => {
		const columnManager = useBrnColumnManager({
			name: { visible: true },
			age: { visible: false },
		});

		expect(columnManager.allColumns).toEqual([
			{ name: 'name', visible: true },
			{ name: 'age', visible: false },
		]);
		expect(columnManager.displayedColumns()).toEqual(['name']);
		expect(columnManager.isColumnVisible('name')).toBe(true);
		expect(columnManager.isColumnVisible('age')).toBe(false);
	});
});
