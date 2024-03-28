/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HLM_SINGLE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { HlmDatepickerBaseDirective, HlmDatepickerControl } from './datepicker-content';

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
	selector: 'hlm-datepicker',
	template: '',
	exportAs: 'matDatepicker',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	providers: [
		HLM_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
		{ provide: HlmDatepickerBaseDirective, useExisting: HlmDatepickerComponent },
	],
	standalone: true,
})
export class HlmDatepickerComponent<D> extends HlmDatepickerBaseDirective<HlmDatepickerControl<D>, D | null, D> {}
