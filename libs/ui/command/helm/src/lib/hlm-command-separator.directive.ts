import { Directive } from '@angular/core';

@Directive({
	selector: 'cmdk-separator[hlm],brn-cmd-separator[hlm],[hlmCmdSeparator]',
	standalone: true,
	host: {
		class: '[&_hr]:border-border [&[cmdk-hidden="true"]]:hidden',
	},
})
export class HlmCommandSeparatorDirective {}
