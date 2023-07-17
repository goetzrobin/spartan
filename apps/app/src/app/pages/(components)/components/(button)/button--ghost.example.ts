import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-button-ghost',
  standalone: true,
  imports: [HlmButtonDirective],
  template: ` <button hlmBtn variant="ghost">Ghost</button> `,
})
export class ButtonGhostComponent {}

export const ghostCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@ng-spartan/ui/button/helm';

@Component({
  selector: 'spartan-button-ghost',
  standalone: true,
  imports: [HlmButtonDirective],
  template: \`
    <button hlmBtn variant='ghost'>Ghost</button> \`,})
export class ButtonGhostComponent {}
`;
