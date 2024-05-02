import { Component, EventEmitter, Input, Output, computed, input } from '@angular/core';
import {
	BrnTabsContentDirective,
	BrnTabsDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';

const tabBtn =
	'inline-flex items-center justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';
const tabContent =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';
@Component({
	selector: 'spartan-tabs',
	standalone: true,
	imports: [BrnTabsDirective, BrnTabsListDirective, BrnTabsTriggerDirective, BrnTabsContentDirective],
	host: {
		class: 'block',
	},
	template: `
		<div [brnTabs]="_tabValue()" class="block" (tabActivated)="onTabActivated($event)">
			<div
				brnTabsList
				class="inline-flex items-center justify-start w-full p-0 mb-4 bg-transparent border-b rounded-none border-border text-muted-foreground h-9"
				[attr.aria-label]="'Tablist showing ' + firstTab + ' and ' + secondTab"
			>
				<button class="${tabBtn}" [brnTabsTrigger]="firstTab">{{ firstTab }}</button>
				<button class="${tabBtn}" [brnTabsTrigger]="secondTab">{{ secondTab }}</button>
			</div>
			<div class="${tabContent}" [brnTabsContent]="firstTab">
				<ng-content select="[firstTab]" />
			</div>
			<div class="${tabContent}" [brnTabsContent]="secondTab">
				<ng-content select="[secondTab]" />
			</div>
		</div>
	`,
})
export class TabsComponent {
	@Input()
	firstTab = '';
	@Input()
	secondTab = '';
	public readonly value = input('');
	protected _tabValue = computed(() => (this.value() === '' ? this.firstTab : this.value()));
	@Output()
	tabActivated = new EventEmitter<string>();
	protected onTabActivated(value: string) {
		this.tabActivated.emit(value);
	}
}
