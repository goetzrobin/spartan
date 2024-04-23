import { Directive, signal, type TemplateRef } from '@angular/core';

@Directive({
	selector: '[brnTooltip]',
	standalone: true,
})
export class BrnTooltipDirective {
	public readonly tooltipTemplate = signal<TemplateRef<unknown> | null>(null);
}
