import { Component } from '@angular/core';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { HlmCheckboxCheckIconComponent, HlmCheckboxDirective } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-preview',
	standalone: true,
	imports: [HlmLabelDirective, BrnCheckboxComponent, HlmCheckboxDirective, HlmCheckboxCheckIconComponent],
	template: `
		<label class="flex items-center" hlmLabel>
			<brn-checkbox class="mr-2" hlm>
				<hlm-checkbox-checkicon />
			</brn-checkbox>
			Accept terms and conditions
		</label>
	`,
})
export class CheckboxPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { HlmCheckboxCheckIconComponent, HlmCheckboxDirective } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-checkbox-preview',
	standalone: true,
	imports: [HlmLabelDirective, BrnCheckboxComponent, HlmCheckboxDirective, HlmCheckboxCheckIconComponent],
	template: \`
		<label class="flex items-center" hlmLabel>
			<brn-checkbox class="mr-2" hlm>
				<hlm-checkbox-checkicon />
			</brn-checkbox>
			Accept terms and conditions
		</label>
	\`,
})
export class CheckboxPreviewComponent {}
`;

export const defaultImports = `
import { BrnCheckboxComponent} from '@spartan-ng/ui-checkbox-brain';
import { HlmCheckboxDirective, HlmCheckboxCheckIconComponent } from '@spartan-ng/ui-checkbox-helm';
`;
export const defaultSkeleton = `
<brn-checkbox hlm>
    <hlm-checkbox-checkicon />
</brn-checkbox>
`;
