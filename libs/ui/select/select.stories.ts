import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { radixChevronDown, radixChevronUp } from '@ng-icons/radix-icons';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmIconModule } from '../icon/helm/src';
import { BrnSelectImports } from './brain/src';
import { HlmSelectImports } from './helm/src';

const meta: Meta<{}> = {
	title: 'Select',
	args: {
		disabled: false,
		placeholder: 'Select a timezone',
		multiple: false,
	},
	decorators: [
		moduleMetadata({
			imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports, HlmSelectImports, HlmIconModule],
			providers: [provideIcons({ radixChevronUp, radixChevronDown })],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

// <brn-select class="inline-block mr-5" ${argsToTemplate(args)} formControlName="brnFruit">
// <button brnSelectTrigger class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
// 	<brn-select-value hlm />
// </button>
// <div brnSelectContent class="top-[2px] relative z-50 min-w-[8rem] overflow-scroll rounded-md border bg-popover text-popover-foreground shadow-md p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56">
// 	<div brnOption value="Refresh">Refresh</div>
// 	<div brnOption value="Settings">Settings</div>
// 	<div brnOption value="Help">Help</div>
// 	<div brnOption value="Signout">Sign out</div>
// </div>
// </brn-select>

export const Default: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(), brnFruit: new FormControl() }) },
		template: `
    <form [formGroup]="fruitGroup">
		<brn-select class="inline-block" ${argsToTemplate(args)} formControlName="fruit">
			<hlm-select-trigger> 
				<brn-select-value hlm />
			</hlm-select-trigger>
			<hlm-select-content class="w-56">
				<hlm-option value="Refresh">Refresh</hlm-option>
				<hlm-option value="Settings">Settings</hlm-option>
				<hlm-option value="Help">Help</hlm-option>
				<hlm-option value="Signout">Sign out</hlm-option>
		  </hlm-select-content>
		</brn-select>
  <form>`,
	}),
};

export const ReactiveFormControl: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
		<div class="mb-3">
		<pre>Form Control Value: {{ fruitGroup.controls.fruit.valueChanges | async | json }}</pre>
		</div>
    <form [formGroup]="fruitGroup">
	
	<brn-select ${argsToTemplate(args)} formControlName="fruit" placeholder="Select a Fruit">
	<hlm-select-trigger> 
		<brn-select-value hlm />
	</hlm-select-trigger>
	<hlm-select-content class="w-56">
		<hlm-option value="Refresh">Refresh</hlm-option>
		<hlm-option value="Settings">Settings</hlm-option>
		<hlm-option value="Help">Help</hlm-option>
		<hlm-option value="Signout">Sign out</hlm-option>
  </hlm-select-content>
</brn-select>
  <form>`,
	}),
};

export const NgModelFormControl: Story = {
	render: (args) => ({
		props: args,
		template: `
		<form #model="ngForm">
		<div class="mb-3">
		<pre>Form Control Value: {{ model.fruit | json }}</pre>
		</div>

		<brn-select ${argsToTemplate(args)} [(ngModel)]="model.fruit" name="fruit">
		<hlm-select-trigger> 
			<brn-select-value hlm />
		</hlm-select-trigger>
		<hlm-select-content class="w-56">
			<hlm-option value="Refresh">Refresh</hlm-option>
			<hlm-option value="Settings">Settings</hlm-option>
			<hlm-option value="Help">Help</hlm-option>
			<hlm-option value="Signout">Sign out</hlm-option>
	  </hlm-select-content>
	</brn-select>
	</form>`,
	}),
};

export const SelectWithLabel: Story = {
	args: {
		label: 'Fruit Selections',
	},
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
  <form [formGroup]="fruitGroup">
    <brn-select formControlName="fruit" ${argsToTemplate(args)}>
	<label hlmLabel>{{label}}</label>
      <hlm-select-trigger> 
        <brn-select-value />
      </hlm-select-trigger>
      <hlm-select-content class="w-56">
        <hlm-option value="Refresh">Refresh</hlm-option>
        <hlm-option value="Settings">Settings</hlm-option>
        <hlm-option value="Help">Help</hlm-option>
        <hlm-option value="Signout">Sign out</hlm-option>
      </hlm-select-content>
    </brn-select>
  <form>`,
	}),
};

export const autocomplete: Story = {
	args: {
		label: 'Fruit Selections',
	},
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
  <form [formGroup]="fruitGroup">
    <hlm-select formControlName="fruit" ${argsToTemplate(args)}>
		<label hlmLabel>{{label}}</label>
		<hlm-select-trigger> 
			<hlm-select-value />
		</hlm-select-trigger>
		<hlm-select-content class="w-56">
			<hlm-option value="Refresh">Refresh</hlm-option>
			<hlm-option value="Settings">Settings</hlm-option>
			<hlm-option value="Help">Help</hlm-option>
			<hlm-option value="Signout">Sign out</hlm-option>
		</hlm-select-content>
    </hlm-select>
  <form>`,
	}),
};

export const Scrollable: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: `
    <form [formGroup]="myform">
	<hlm-select formControlName="timezone" ${argsToTemplate(args)}>
		<hlm-select-trigger class="w-[280px]">
			<hlm-select-value />
		</hlm-select-trigger>
    	<hlm-select-content class="min-w-content max-h-96">
		<hlm-select-scroll-up>
			<hlm-icon class="ml-2 h-4 w-4" name="radixChevronUp" /></hlm-select-scroll-up>

			<hlm-select-group>
				<hlm-select-label>North America</hlm-select-label>
				<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
				<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
				<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
				<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
				<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
				<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Europe & Africa</hlm-select-label>
				<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
				<hlm-option value="cet">Central European Time (CET)</hlm-option>
				<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
				<hlm-option value="west">
				  Western European Summer Time (WEST)
				</hlm-option>
				<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
				<hlm-option value="eat">East Africa Time (EAT)</hlm-option>


			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Asia</hlm-select-label>
				<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
				<hlm-option value="ist">India Standard Time (IST)</hlm-option>
				<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
				<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
				<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
				<hlm-option value="ist_indonesia">
				  Indonesia Central Standard Time (WITA)
				</hlm-option>
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Australia & Pacific</hlm-select-label>
				<hlm-option value="awst">
				Australian Western Standard Time (AWST)
			  </hlm-option>
			  <hlm-option value="acst">
				Australian Central Standard Time (ACST)
			  </hlm-option>
			  <hlm-option value="aest">
				Australian Eastern Standard Time (AEST)
			  </hlm-option>
			  <hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
			  <hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
	
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>South America</hlm-select-label>
				<hlm-option value="art">Argentina Time (ART)</hlm-option>
				<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
				<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
				<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
			</hlm-select-group>

			<hlm-select-scroll-down><hlm-icon class="ml-2 h-4 w-4" name="radixChevronDown" /></hlm-select-scroll-down>
		</hlm-select-content>
	</hlm-select>
  <form>`,
	}),
};

export const ScrollableWithStickyLabels: Story = {
	render: (args) => ({
		props: { ...args, myform: new FormGroup({ timezone: new FormControl() }) },
		template: `
    <form [formGroup]="myform">
	<hlm-select formControlName="timezone" ${argsToTemplate(args)}>
		<hlm-select-trigger class="w-[280px]">
			<hlm-select-value />
		</hlm-select-trigger>
    	<hlm-select-content class="min-w-content max-h-96" [stickyLabels]="true">
		<hlm-select-scroll-up>
			<hlm-icon class="ml-2 h-4 w-4" name="radixChevronUp" /></hlm-select-scroll-up>

			<hlm-select-group>
				<hlm-select-label>North America</hlm-select-label>
				<hlm-option value="est">Eastern Standard Time (EST)</hlm-option>
				<hlm-option value="cst">Central Standard Time (CST)</hlm-option>
				<hlm-option value="mst">Mountain Standard Time (MST)</hlm-option>
				<hlm-option value="pst">Pacific Standard Time (PST)</hlm-option>
				<hlm-option value="akst">Alaska Standard Time (AKST)</hlm-option>
				<hlm-option value="hst">Hawaii Standard Time (HST)</hlm-option>
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Europe & Africa</hlm-select-label>
				<hlm-option value="gmt">Greenwich Mean Time (GMT)</hlm-option>
				<hlm-option value="cet">Central European Time (CET)</hlm-option>
				<hlm-option value="eet">Eastern European Time (EET)</hlm-option>
				<hlm-option value="west">
				  Western European Summer Time (WEST)
				</hlm-option>
				<hlm-option value="cat">Central Africa Time (CAT)</hlm-option>
				<hlm-option value="eat">East Africa Time (EAT)</hlm-option>


			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Asia</hlm-select-label>
				<hlm-option value="msk">Moscow Time (MSK)</hlm-option>
				<hlm-option value="ist">India Standard Time (IST)</hlm-option>
				<hlm-option value="cst_china">China Standard Time (CST)</hlm-option>
				<hlm-option value="jst">Japan Standard Time (JST)</hlm-option>
				<hlm-option value="kst">Korea Standard Time (KST)</hlm-option>
				<hlm-option value="ist_indonesia">
				  Indonesia Central Standard Time (WITA)
				</hlm-option>
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>Australia & Pacific</hlm-select-label>
				<hlm-option value="awst">
				Australian Western Standard Time (AWST)
			  </hlm-option>
			  <hlm-option value="acst">
				Australian Central Standard Time (ACST)
			  </hlm-option>
			  <hlm-option value="aest">
				Australian Eastern Standard Time (AEST)
			  </hlm-option>
			  <hlm-option value="nzst">New Zealand Standard Time (NZST)</hlm-option>
			  <hlm-option value="fjt">Fiji Time (FJT)</hlm-option>
	
			</hlm-select-group>

			<hlm-select-group>
				<hlm-select-label>South America</hlm-select-label>
				<hlm-option value="art">Argentina Time (ART)</hlm-option>
				<hlm-option value="bot">Bolivia Time (BOT)</hlm-option>
				<hlm-option value="brt">Brasilia Time (BRT)</hlm-option>
				<hlm-option value="clt">Chile Standard Time (CLT)</hlm-option>
			</hlm-select-group>

			<hlm-select-scroll-down><hlm-icon class="ml-2 h-4 w-4" name="radixChevronDown" /></hlm-select-scroll-down>
		</hlm-select-content>
	</hlm-select>
  <form>`,
	}),
};
