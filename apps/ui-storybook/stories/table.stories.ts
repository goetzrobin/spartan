import { Component, signal } from '@angular/core';
import { HlmTable, HlmTableImports } from '@spartan-ng/helm/table';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const USERS = [
	{ name: 'Monica Gutmann', age: 18, height: 153 },
	{ name: 'Jacquelyn Johnston', age: 28, height: 202 },
	{ name: 'Mary MacGyver', age: 28, height: 196 },
	{ name: 'Enrique Terry Jr.', age: 13, height: 152 },
	{ name: 'Brad Williamson', age: 72, height: 162 },
	{ name: 'Mr. Ruben Rohan II', age: 81, height: 147 },
	{ name: 'Suzanne Green', age: 11, height: 188 },
	{ name: 'Ella Becker', age: 23, height: 181 },
	{ name: 'Bradley Powlowski', age: 14, height: 178 },
	{ name: 'Joey McGlynn Sr.', age: 22, height: 197 },
	{ name: 'Christina Heidenreich', age: 76, height: 202 },
	{ name: 'Pete Glover III', age: 97, height: 187 },
	{ name: 'Bruce Kirlin', age: 47, height: 156 },
	{ name: 'Kim Morissette', age: 57, height: 202 },
	{ name: 'Suzanne Armstrong MD', age: 100, height: 152 },
	{ name: 'Terry Bergstrom', age: 78, height: 205 },
	{ name: 'Calvin Balistreri', age: 32, height: 201 },
	{ name: 'Karl Casper', age: 63, height: 208 },
	{ name: 'Dr. Alejandro Feest', age: 88, height: 193 },
	{ name: 'Cary Cartwright', age: 19, height: 156 },
];

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
	protected readonly _data = signal(USERS);
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
