import { Component } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui/card/helm';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';

@Component({
  selector: 'spartan-card-preview',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCardFooterDirective,
    HlmButtonDirective,
  ],
  template: `
    <section class="w-80" hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Create new project</h3>
        <p hlmCardDescription>Deploy your new project in one-click.</p>
      </div>
      <p hlmCardContent>
        <label class="block" hlmLabel
          >Name
          <input class="w-full mt-1.5" placeholder="Name of your project" hlmInput />
        </label>

        <label class="block my-4" hlmLabel
          >Framework
          <select class="w-full mt-1.5" hlmInput>
            <option>Angular</option>
            <option>React</option>
            <option>Vue</option>
          </select>
        </label>
      </p>
      <div hlmCardFooter class="justify-between">
        <button hlmBtn variant="ghost">Cancel</button>
        <button hlmBtn>Create</button>
      </div>
    </section>
  `,
})
export class CardPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui/card/helm';
import { HlmLabelDirective } from '@spartan-ng/ui/label/helm';
import { HlmInputDirective } from '@spartan-ng/ui/input/helm';
import { HlmButtonDirective } from '@spartan-ng/ui/button/helm';

@Component({
  selector: 'spartan-card-preview',
  standalone: true,
  imports: [
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardDescriptionDirective,
    HlmCardContentDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCardFooterDirective,
    HlmButtonDirective,
  ],
  template: \`
    <section class="w-80" hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Create new project</h3>
        <p hlmCardDescription>Deploy your new project in one-click.</p>
      </div>
      <p hlmCardContent>
        <label class="block" hlmLabel
          >Name
          <input class="w-full mt-1.5" placeholder="Name of your project" hlmInput />
        </label>

        <label class="block my-4" hlmLabel
          >Framework
          <select class="w-full mt-1.5" hlmInput>
            <option>Angular</option>
            <option>React</option>
            <option>Vue</option>
          </select>
        </label>
      </p>
      <div hlmCardFooter class="justify-between">
        <button hlmBtn variant="ghost">Cancel</button>
        <button hlmBtn>Create</button>
      </div>
    </section>
  \`,
})
export class CardPreviewComponent {}
`;

export const defaultImports = `
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui/card/helm';
`;

export const defaultSkeleton = `
<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Card Title</h3>
    <p hlmCardDescription>Card Description</p>
  </div>
  <p hlmCardContent>Card Content</p>
  <p hlmCardFooter>Card Footer</p>
</section>
`;
