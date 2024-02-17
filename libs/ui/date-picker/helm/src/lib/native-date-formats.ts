/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { HlmDateFormats } from './date-formats';

export const HLM_NATIVE_DATE_FORMATS: HlmDateFormats = {
	parse: {
		dateInput: null,
	},
	display: {
		dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
		monthYearLabel: { year: 'numeric', month: 'short' },
		dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'long' },
	},
};
