import { RouterTestingModule } from '@angular/router/testing';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmPaginationDirective, HlmPaginationImports } from './helm/src';

const meta: Meta<HlmPaginationDirective> = {
	title: 'Pagination',
	component: HlmPaginationDirective,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmPaginationImports, RouterTestingModule],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmPaginationDirective>;

export const Default: Story = {
	render: () => ({
		template: `
    <nav hlmPagination>
      <ul hlmPaginationContent>
        <li hlmPaginationItem>
          <hlm-pagination-previous href="#" />
        </li>
        <li hlmPaginationItem>
          <a routerLink="#" hlmPaginationLink>1</a>
        </li>
        <li hlmPaginationItem>
          <a routerLink="#" hlmPaginationLink isActive>2</a>
        </li>
        <li hlmPaginationItem>
          <a routerLink="#" hlmPaginationLink>3</a>
        </li>
        <li hlmPaginationItem>
          <hlm-pagination-ellipsis />
        </li>
        <li hlmPaginationItem>
          <hlm-pagination-next href="#" />
        </li>
      </ul>
    </nav>
    `,
	}),
};
