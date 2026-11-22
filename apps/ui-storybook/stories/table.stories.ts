import { Component, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { HlmTable, HlmTableImports } from '@spartan-ng/helm/table';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const createUsers = (numUsers = 5) => {
	// The same people on every load, so a screenshot of this story can be compared with the last one.
	faker.seed(1);
	return Array.from({ length: numUsers }, () => ({
		name: faker.person.fullName(),
		age: faker.number.int({ min: 10, max: 100 }),
		height: faker.number.int({ min: 140, max: 210 }),
	}));
};

@Component({
	selector: 'table-story',
	standalone: true,
	imports: [...HlmTableImports],
	template: `
		<table hlmTable>
			<thead hlmTHead>
				<tr hlmTr>
					<th hlmTh truncate>Name</th>
					<th hlmTh class="justify-end">Age</th>
					<th hlmTh class="justify-center">Height</th>
				</tr>
			</thead>
			<tbody hlmTBody>
				@for (row of _data(); track row) {
					<tr hlmTr>
						<td hlmTd truncate>{{ row.name }}</td>
						<td hlmTd class="justify-end">{{ row.age }}</td>
						<td hlmTd class="justify-center">{{ row.height }}</td>
					</tr>
				}
			</tbody>
		</table>
	`,
})
class TableStory {
	protected readonly _data = signal(createUsers(20));
}

const meta: Meta<HlmTable> = {
	title: 'Table',
	component: HlmTable,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [TableStory],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmTable>;

export const Default: Story = {
	render: () => ({
		moduleMetadata: {
			imports: [TableStory],
		},
		template: '<table-story/>',
	}),
};
