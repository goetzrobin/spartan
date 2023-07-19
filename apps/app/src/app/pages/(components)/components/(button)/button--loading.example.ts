import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixSymbol } from '@ng-icons/radix-icons';

@Component({
  selector: 'spartan-button-loading',
  standalone: true,
  imports: [HlmButtonDirective, HlmSpinnerComponent, HlmIconComponent],
  providers: [provideIcons({ radixSymbol })],
  template: `
    <button disabled hlmBtn><hlm-icon name="radixSymbol" size="sm" class="mr-2 animate-spin" /> Please wait</button>
  `,
})
export class ButtonLoadingComponent {}

export const loadingCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'spartan-button-icon',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='icon'>Icon</button> \`,})
export class ButtonIconComponent {}
`;
