import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-input-button',
  standalone: true,
  imports: [HlmInputDirective, HlmButtonDirective],
  template: `
    <div class="flex w-full max-w-sm items-center space-x-2">
      <input aria-label="Email" class="w-80" hlmInput type="email" placeholder="Email" />
      <button hlmBtn>Subscribe</button>
    </div>
  `,
})
export class InputButtonPreviewComponent {}

export const buttonCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@ng-spartan/ui/input/helm';
import { HlmLabelDirective } from '@ng-spartan/ui/label/helm';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-input-button',
  standalone: true,
  imports: [HlmInputDirective, HlmButtonDirective],
  template: \`
    <div class='flex w-full max-w-sm items-center space-x-2'>
      <input aria-label='Email' class='w-80' hlmInput type='email' placeholder='Email' />
      <button hlmBtn>Subscribe</button>
    </div>
  \`,
})
export class InputButtonPreviewComponent {}

`;
