import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnRadioComponent, BrnRadioGroupComponent } from '@spartan-ng/ui-radiogroup-brain';
import { HlmRadioDirective, HlmRadioGroupDirective, HlmRadioIndicatorComponent } from '@spartan-ng/ui-radiogroup-helm';
import { HlmSmallDirective } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-radio-group-preview',
	standalone: true,
	imports: [
		FormsModule,
		BrnRadioGroupComponent,
		BrnRadioComponent,
		HlmRadioIndicatorComponent,
		HlmRadioDirective,
		HlmRadioGroupDirective,
		HlmSmallDirective,
	],
	template: `
		<small hlmSmall class="font-semibold">Choose a version</small>
		<brn-radio-group class="mb-4 space-y-1 font-mono text-sm font-medium" hlm [(ngModel)]="version">
			<brn-radio hlm value="16.1.4">
				<hlm-radio-indicator indicator />
				v16.1.4
			</brn-radio>
			<brn-radio hlm value="16.0.0">
				<hlm-radio-indicator indicator />
				v16.0.0
			</brn-radio>
			<brn-radio hlm value="15.8.0">
				<hlm-radio-indicator indicator />
				v15.8.0
			</brn-radio>
			<brn-radio disabled hlm value="15.2.0">
				<hlm-radio-indicator indicator />
				v15.2.0
			</brn-radio>
		</brn-radio-group>
	`,
})
export class RadioGroupPreviewComponent {
	public version: string | null = '16.1.4';
}

export const defaultCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnRadioComponent, BrnRadioGroupComponent } from '@spartan-ng/ui-radiogroup-brain';
import { HlmRadioDirective, HlmRadioGroupDirective, HlmRadioIndicatorComponent } from '@spartan-ng/ui-radiogroup-helm';
import { HlmSmallDirective } from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'spartan-radio-group-preview',
  standalone: true,
  imports: [
    FormsModule,
    BrnRadioGroupComponent,
    BrnRadioComponent,
    HlmRadioIndicatorComponent,
    HlmRadioDirective,
    HlmRadioGroupDirective,
    HlmSmallDirective,
  ],
  template: \`
    <small hlmSmall class="font-semibold">Choose a version</small>
    <brn-radio-group class="mb-4 font-mono text-sm font-medium space-y-1" hlm [(ngModel)]="version">
      <brn-radio hlm value="16.1.4">
        <hlm-radio-indicator indicator />
        v16.1.4
      </brn-radio>
      <brn-radio hlm value="16.0.0">
        <hlm-radio-indicator indicator />
        v16.0.0
      </brn-radio>
      <brn-radio hlm value="15.8.0">
        <hlm-radio-indicator indicator />
        v15.8.0
      </brn-radio>
      <brn-radio disabled hlm value="15.2.0">
        <hlm-radio-indicator indicator />
        v15.2.0
      </brn-radio>
    </brn-radio-group>
  \`,
})
export class RadioGroupPreviewComponent {
  version: string | null = '16.1.4';
}
`;

export const defaultImports = `
import { BrnRadioComponent, BrnRadioGroupComponent } from '@spartan-ng/ui-radiogroup-brain';
import {
  HlmRadioDirective,
  HlmRadioGroupDirective,
  HlmRadioIndicatorComponent,
} from '@spartan-ng/ui-radiogroup-helm';
`;
export const defaultSkeleton = `
<brn-radio-group hlm>
  <brn-radio hlm value="16.1.4">
    <hlm-radio-indicator indicator />
    v16.1.4
  </brn-radio>
</brn-radio-group>
`;
