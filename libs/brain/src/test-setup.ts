// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
	testEnvironmentOptions: {
		errorOnUnknownElements: true,
		errorOnUnknownProperties: true,
	},
};

import '@testing-library/jest-dom';
import 'jest-preset-angular/setup-jest';

import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
