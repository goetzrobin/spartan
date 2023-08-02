import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { HlmToggleDirective, HlmToggleGroupModule } from './helm/src';
import { BrnToggleDirective, BrnToggleGroupModule } from './brain/src';
import { HlmIconComponent, provideIcons } from '../icon/helm/src';
import { radixFontItalic } from '@ng-icons/radix-icons';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { HlmButtonDirective } from '../button/helm/src';
import { hlmP } from '../typography/helm/src';

const meta: Meta<{}> = {
  title: 'Toggle',
  decorators: [
    moduleMetadata({
      imports: [HlmToggleDirective, BrnToggleDirective, HlmIconComponent],
      providers: [provideIcons({ radixFontItalic })],
    }),
  ],
};

export default meta;
type Story = StoryObj<{}>;
export const Default: Story = {
  render: () => ({
    template: `
    <div class='space-x-3'>
    <button aria-label='Italic Toggle' size='sm' hlmToggle><hlm-icon name='radixFontItalic'/></button>
    <button aria-label='Italic Toggle' hlmToggle><hlm-icon name='radixFontItalic'/></button>
    <button aria-label='Italic Toggle' size='lg' hlmToggle><hlm-icon name='radixFontItalic'/></button>
    <button aria-label='Italic Toggle' variant='outline' hlmToggle><hlm-icon name='radixFontItalic'/></button>
    <button aria-label='Italic Toggle' disabled hlmToggle><hlm-icon name='radixFontItalic'/></button>
    </div>
    `,
  }),
};

export const WithText: Story = {
  name: 'With Text',
  render: () => ({
    template: `
    <div class='space-x-3'>
    <button size='sm' hlmToggle><hlm-icon name='radixFontItalic'/> <span class='ml-2'>Italic</span></button>
    <button hlmToggle><hlm-icon name='radixFontItalic'/> <span class='ml-2'>Italic</span></button>
    <button size='lg' hlmToggle><hlm-icon name='radixFontItalic'/> <span class='ml-2'>Italic</span></button>
    <button variant='outline' hlmToggle><hlm-icon name='radixFontItalic'/> <span class='ml-2'>Italic</span></button>
    <button disabled hlmToggle><hlm-icon name='radixFontItalic'/> <span class='ml-2'>Italic</span></button>
    </div>
`,
  }),
};

type City = { name: string; population: number };

@Component({
  selector: 'hlm-toggle-group-story',
  standalone: true,
  imports: [BrnToggleGroupModule, HlmToggleGroupModule, HlmButtonDirective, FormsModule, NgForOf, NgIf],
  template: `
    <div class="flex space-x-4">
      <brn-toggle-group hlm [multiple]="multiple" [(ngModel)]="selected">
        <button variant="outline" *ngFor="let city of cities; let last = last" [value]="city" hlm brnToggle>
          {{ city.name }}
        </button>
      </brn-toggle-group>
      <button hlmBtn size="sm" (click)="setToSyracuse()">Set to Syracuse</button>
    </div>

    <p class="${hlmP}">{{ multiple ? 'Cities' : 'City' }} selected: {{ selectedCities }}</p>
  `,
})
class HlmToggleGroupStoryComponent {
  @Input()
  multiple = false;
  public readonly cities: City[] = [
    {
      name: 'Sparta',
      population: 23234233,
    },
    {
      name: 'Athens',
      population: 989889,
    },
    {
      name: 'Corinth',
      population: 988989,
    },
    {
      name: 'Syracuse',
      population: 998889,
    },
  ];
  public selected?: City | City[];

  get selectedCities() {
    if (!this.selected) return 'No city selected';

    if (Array.isArray(this.selected)) {
      if (this.selected.length === 0) return 'No cities selected';
      return this.selected.map((c) => c.name).join(',');
    }
    return this.selected.name;
  }

  setToSyracuse() {
    console.log(this.multiple);
    this.selected = this.multiple ? [this.cities[3]] : this.cities[3];
  }
}

export const ToggleGroupSingle: Story = {
  name: 'Toggle Group - Single',
  decorators: [
    moduleMetadata({
      imports: [HlmToggleGroupStoryComponent],
    }),
  ],
  render: () => ({
    template: '<hlm-toggle-group-story/>',
  }),
};

export const ToggleGroupMultiple: Story = {
  name: 'Toggle Group - Multiple',
  decorators: [
    moduleMetadata({
      imports: [HlmToggleGroupStoryComponent],
    }),
  ],
  render: () => ({
    template: '<hlm-toggle-group-story multiple="true"/>',
  }),
};
