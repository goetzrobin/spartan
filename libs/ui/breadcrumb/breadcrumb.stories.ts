import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { HlmBreadcrumbComponent, HlmBreadCrumbImports } from './helm/src';

const meta: Meta<HlmBreadcrumbComponent> = {
	title: 'Breadcrumb',
	component: HlmBreadcrumbComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmBreadCrumbImports, HlmIconComponent],
			providers: [provideIcons({ lucideSlash })],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmBreadcrumbComponent>;

export const Default: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-breadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/home">Home</a>
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-separator />
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-ellipsis />
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-separator />
					</li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink hlmL href="/components">Components</a>
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-separator />
					</li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</hlm-breadcrumb>
		`,
	}),
};

export const Custom: Story = {
	render: () => ({
		template: /* HTML */ `
			<hlm-breadcrumb>
				<ol hlmBreadcrumbList>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/home">Home</a>
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-separator>
							<hlm-icon name="lucideSlash" class="h-4 w-4" />
						</hlm-breadcrumb-separator>
					</li>
					<li hlmBreadcrumbItem>
						<a hlmBreadcrumbLink href="/components">Components</a>
					</li>
					<li hlmBreadcrumbItem>
						<hlm-breadcrumb-separator>
							<hlm-icon name="lucideSlash" class="h-4 w-4" />
						</hlm-breadcrumb-separator>
					</li>
					<li hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</li>
				</ol>
			</hlm-breadcrumb>
		`,
	}),
};
