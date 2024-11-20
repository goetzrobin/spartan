import { RouterTestingModule } from '@angular/router/testing';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmBreadCrumbImports, HlmBreadcrumbDirective } from '@spartan-ng/ui-breadcrumb-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmBreadcrumbDirective> = {
	title: 'Breadcrumb',
	component: HlmBreadcrumbDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmBreadCrumbImports, HlmIconComponent, RouterTestingModule],
			providers: [provideIcons({ lucideSlash })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmBreadcrumbDirective>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<nav hlmBreadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/home">Home</a>
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-ellipsis />
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink hlmL href="/components">Components</a>
					</li>
					<li hlmBreadcrumbSeparator></li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</nav>
		`,
	}),
};

export const Custom: Story = {
	render: () => ({
		template: /* HTML */ `
			<nav hlmBreadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/home">Home</a>
					</li>
					<li hlmBreadcrumbSeparator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/components">Components</a>
					</li>
					<li hlmBreadcrumbSeparator>
						<hlm-icon name="lucideSlash" class="h-4 w-4" />
					</li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</nav>
		`,
	}),
};
