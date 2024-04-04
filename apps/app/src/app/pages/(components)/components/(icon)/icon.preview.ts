import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-icon-preview',
	standalone: true,
	imports: [HlmIconComponent],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<div>
			<hlm-icon size="xl" name="lucideChevronRight" />
		</div>
	`,
})
export class IconPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-icon-preview',
	standalone: true,
	imports: [HlmIconComponent],
  providers: [provideIcons({ lucideChevronRight })],
	template: \`
    <div>
      <hlm-icon size='xl' name="lucideChevronRight" />
    </div>
	\`,
})
export class IconPreviewComponent {}
`;

export const defaultImports = `
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
`;

export const defaultSkeleton = `
<hlm-icon size='sm' name="lucideChevronRight" />
`;
