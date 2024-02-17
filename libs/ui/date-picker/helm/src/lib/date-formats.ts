/* eslint-disable @typescript-eslint/no-explicit-any */

import { InjectionToken } from '@angular/core';

export type HlmDateFormats = {
	parse: {
		dateInput: any;
	};
	display: {
		dateInput: any;
		monthLabel?: any;
		monthYearLabel: any;
		dateA11yLabel: any;
		monthYearA11yLabel: any;
	};
};

export const HLM_DATE_FORMATS = new InjectionToken<HlmDateFormats>('hlm-date-formats');
