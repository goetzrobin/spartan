import { Directive, ElementRef, booleanAttribute, inject, input } from '@angular/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[brnAvatarFallback]',
	standalone: true,
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective {
	private readonly element = inject(ElementRef).nativeElement;

	public readonly userCls = input<ClassValue>('', { alias: 'class' });
	public readonly useAutoColor = input(false, { alias: 'autoColor', transform: booleanAttribute });

	getTextContent(): string {
		return this.element.textContent;
	}
}
