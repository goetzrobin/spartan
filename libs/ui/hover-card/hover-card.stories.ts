import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendarDays } from '@ng-icons/lucide';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmAvatarModule } from '../avatar/helm/src';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmCardDirective } from '../card/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { type BrnHoverCardComponent, BrnHoverCardModule } from './brain/src';
import { HlmHoverCardModule } from './helm/src';

@Component({
	selector: 'hover-card-example',
	standalone: true,
	imports: [BrnHoverCardModule, HlmHoverCardModule, HlmButtonDirective, HlmIconComponent, HlmAvatarModule],
	providers: [provideIcons({ lucideCalendarDays })],
	host: {
		class: 'flex w-full h-full justify-center py-80',
	},
	template: `
		<brn-hover-card>
			<button hlmBtn variant="link" brnHoverCardTrigger>&#64;analogjs</button>
			<hlm-hover-card-content *brnHoverCardContent class="w-80">
				<div class="flex justify-between space-x-4">
					<hlm-avatar variant="small" id="avatar-small">
						<img src="https://analogjs.org/img/logos/analog-logo.svg" alt="AnalogLogo" hlmAvatarImage />
						<span class="bg-sky-600 text-sky-50" hlmAvatarFallback>AN</span>
					</hlm-avatar>
					<div class="space-y-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
						<div class="flex items-center pt-2">
							<hlm-icon name="lucideCalendarDays" class="w-4 h-4 mr-2 opacity-70" />
							<span class="text-xs text-muted-foreground">Joined December 2021</span>
						</div>
					</div>
				</div>
			</hlm-hover-card-content>
		</brn-hover-card>
	`,
})
class HoverCardExampleComponent {}

const meta: Meta<BrnHoverCardComponent> = {
	title: 'Hover Card',
	component: HlmCardDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HoverCardExampleComponent],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnHoverCardComponent>;

export const Default: Story = {
	render: () => ({
		template: '<hover-card-example/>',
	}),
};
