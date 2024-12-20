import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateIconGenerator } from './generator';

// patch some imports to avoid running the actual code
jest.mock('enquirer');
jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		ensurePackage: (pkg: string) => jest.requireActual(pkg),
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

describe('migrate-icon generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();

		await applicationGenerator(tree, {
			name: 'app',
			directory: 'app',
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});
	});

	it('should add NgIcon import (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { HlmIconModule } from '@spartan-ng/hlm-icon';

			@NgModule({
				imports: [BrowserModule, HlmIconModule],
			})
			export class AppModule {}
			`,
		);

		await migrateIconGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).toContain(`import { NgIcon } from '@ng-icon/core';`);
		expect(content).toContain(`imports: [BrowserModule, NgIcon, HlmIconModule],`);
	});

	it('should replace HlmIconComponent (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { HlmIconComponent } from '@spartan-ng/hlm-icon';

			@NgModule({
				imports: [BrowserModule, HlmIconComponent],
			})
			export class AppModule {}
			`,
		);

		await migrateIconGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).toContain(`import { NgIcon } from '@ng-icon/core';`);
		expect(content).toContain(`imports: [BrowserModule, NgIcon, HlmIconDirective],`);
	});

	it('should add NgIcon import (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { HlmIconModule } from '@spartan-ng/hlm-icon';

			@Component({
				imports: [HlmIconModule],
				template: \`
					<hlm-icon size='xl' name="lucideChevronRight" />
				\`
			})
			export class AppModule {}

			`,
		);

		await migrateIconGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { NgIcon } from '@ng-icons/core';`);
		expect(content).toContain(`imports: [NgIcon, HlmIconModule],`);
		expect(content).toContain(`<ng-icon hlm size='xl' name="lucideChevronRight" />`);
	});

	it('should replace HlmIconComponent (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { HlmIconComponent } from '@spartan-ng/hlm-icon';

			@Component({
				imports: [HlmIconComponent],
				template: \`
					<hlm-icon size='xl' name="lucideChevronRight" />
				\`
			})
			export class AppModule {}

			`,
		);

		await migrateIconGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { NgIcon } from '@ng-icons/core';`);
		expect(content).toContain(`import { HlmIconDirective } from '@spartan-ng/hlm-icon';`);
		expect(content).toContain(`imports: [NgIcon, HlmIconDirective],`);
		expect(content).toContain(`<ng-icon hlm size='xl' name="lucideChevronRight" />`);
	});
});
