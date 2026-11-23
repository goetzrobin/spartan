import { registryItemSchema, workspaceConfigSchema } from './schema';

describe('registryItemSchema', () => {
	const base = { name: 'vega', type: 'registry:base' };

	it('accepts a base item whose config sets nothing', () => {
		expect(registryItemSchema.safeParse({ ...base, config: {} }).success).toBe(true);
	});

	it('accepts a config that sets part of a nested object', () => {
		expect(registryItemSchema.safeParse({ ...base, config: { tailwind: { css: 'styles.css' } } }).success).toBe(true);
	});

	it('rejects an unknown config key', () => {
		expect(registryItemSchema.safeParse({ ...base, config: { unknown: 1 } }).success).toBe(false);
	});

	it('rejects a config value of the wrong type', () => {
		expect(registryItemSchema.safeParse({ ...base, config: { style: 1 } }).success).toBe(false);
	});
});

describe('workspaceConfigSchema', () => {
	it('accepts an empty workspace', () => {
		expect(workspaceConfigSchema.safeParse({}).success).toBe(true);
	});
});
