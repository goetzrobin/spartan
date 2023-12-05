import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { BrnSelectImports } from './brain/src';
import { HlmSelectImports } from './helm/src';

const meta: Meta<{}> = {
	title: 'Select',
	args: {
		disabled: false,
		placeholder: 'Select a Fruit',
		multiple: false,
	},
	decorators: [
		moduleMetadata({
			imports: [CommonModule, FormsModule, ReactiveFormsModule, BrnSelectImports, HlmSelectImports],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl(), lel: new FormControl() }) },
		template: `
    <form [formGroup]="fruitGroup">
	<brn-select formControlName="lel" placeholder="Select a lel">
	<brn-select-trigger class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"> 
		<brn-select-value hlm />
	</brn-select-trigger>
	<div brnSelectContent class="top-[2px] relative z-50 min-w-[8rem] overflow-scroll rounded-md border bg-popover text-popover-foreground shadow-md p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56">
		<div brnOption value="Refresh">Refresh</div>
		<div brnOption value="Settings">Settings</div>
		<div brnOption value="Help">Help</div>
		<div brnOption value="Signout">Sign out</div>
  </div>
</brn-select>

		<brn-select formControlName="fruit" placeholder="Select a Fruit">
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
	
	<brn-select formControlName="fruit" placeholder="Select a Fruit">
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
		<pre>Form Control Value: {{ model.fruit }}</pre>
		</div>

		<brn-select ${argsToTemplate(args)} [(ngModel)]="model.fruit" name="fruit" placeholder="Select a Fruit">
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

export const MultiSelect: Story = {
	args: { multiple: true },
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
  <form [formGroup]="fruitGroup">
    <hlm-select ${argsToTemplate(args)} formControlName="fruit">
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

export const SelectWithLabel: Story = {
	args: {
		label: 'Fruit Selections',
	},
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
  <form [formGroup]="fruitGroup">
    <hlm-select formControlName="fruit" ${argsToTemplate(args)}>
	<hlm-label>{{label}}</hlm-label>
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

export const LargeOptionsList: Story = {
	render: (args) => ({
		props: { ...args, fruitGroup: new FormGroup({ fruit: new FormControl() }) },
		template: `
    <form [formGroup]="fruitGroup">
	<hlm-select formControlName="fruit" ${argsToTemplate(args)}>
		<hlm-select-trigger> 
			<hlm-select-value />
		</hlm-select-trigger>
    <hlm-select-content class="w-56 max-h-44">
      <hlm-option value="Refresh">Refresh</hlm-option>
      <hlm-option value="Settings">Settings</hlm-option>
      <hlm-option value="Help">Help</hlm-option>
      <hlm-option value="Signout">Sign out</hlm-option>

      <hlm-option value="Account">Account</hlm-option>
      <hlm-option value="Rewards">Rewards</hlm-option>
      <hlm-option value="Subscriptions">Subscriptions</hlm-option>
      <hlm-option value="Lending">Lending</hlm-option>

      <hlm-option value="Deposit">Deposit</hlm-option>
      <hlm-option value="Withdrawel">Withdrawel</hlm-option>
    </hlm-select-content>
	</hlm-select>
  <form>`,
	}),
};
