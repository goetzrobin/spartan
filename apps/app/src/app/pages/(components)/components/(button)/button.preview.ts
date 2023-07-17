import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-button-preview',
  standalone: true,
  imports: [HlmButtonDirective],
  template: ` <button hlmBtn>Button</button> `,
})
export class ButtonPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-button-preview',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \` <button hlmBtn>Button</button> \`,
})
export class ButtonPreviewComponent {}
`;

export const defaultImports = `
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';
`;

export const defaultSkeleton = `
<button hlmBtn>Button</button>
`;
