import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { radixCalendar } from '@ng-icons/radix-icons';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnHoverCardModule } from '@spartan-ng/ui-hovercard-brain';
import { HlmHoverCardModule } from '@spartan-ng/ui-hovercard-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-hover-card-preview',
	standalone: true,
	imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, HlmIconComponent, HlmAvatarModule],
	providers: [provideIcons({ radixCalendar })],
	template: `
		<brn-hover-card>
			<button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
			<div hlmHoverCardContent *brnHoverCardContent class="w-80">
				<div class="flex justify-between space-x-4">
					<hlm-avatar variant="small" id="avatar-small">
						<img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
						<span class="bg-red-600 text-red-800" hlmAvatarFallback>AN</span>
					</hlm-avatar>
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
						<div class="flex items-center pt-2">
							<hlm-icon name="radixCalendar" class="mr-2 h-4 w-4 opacity-70" />
							<span class="text-muted-foreground text-xs">Joined December 2021</span>
						</div>
					</div>
				</div>
			</div>
		</brn-hover-card>
	`,
})
export class HoverCardPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnHoverCardModule } from '@spartan-ng/ui-hovercard-brain';
import { HlmHoverCardModule } from '@spartan-ng/ui-hovercard-helm';
import { HlmAvatarModule } from '@spartan-ng/ui-avatar-helm';
import { provideIcons } from '@ng-icons/core';
import { radixCalendar } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-hover-card-preview',
  standalone: true,
  imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, HlmIconComponent, HlmAvatarModule],
  providers: [provideIcons({ radixCalendar })],
  template: \`
    <brn-hover-card>
      <button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
      <div hlmHoverCardContent *brnHoverCardContent class="w-80">
        <div class="flex justify-between space-x-4">
          <hlm-avatar variant="small" id="avatar-small">
            <img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
            <span class="bg-sky-600 text-sky-50" hlmAvatarFallback>AN</span>
          </hlm-avatar>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold">&#64;analogjs</h4>
            <p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
            <div class="flex items-center pt-2">
              <hlm-icon name="radixCalendar" class="mr-2 h-4 w-4 opacity-70" />
              <span class="text-xs text-muted-foreground"> Joined December 2021 </span>
            </div>
          </div>
        </div>
      </div>
    </brn-hover-card>
  \`,
})
export class HoverCardPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnHoverCardComponent,
  BrnHoverCardContentDirective,
  BrnHoverCardTriggerDirective,
} from '@spartan-ng/ui-hovercard-brain';

import {
  HlmHoverCardContentDirective
} from '@spartan-ng/ui-hovercard-helm';
`;

export const defaultSkeleton = `
<brn-hover-card>
  <button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
  <div hlmHoverCardContent *brnHoverCardContent>The Angular meta-framework.</div>
</brn-hover-card>
`;
