import { Directive, ElementRef, Input, booleanAttribute, inject, signal } from '@angular/core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: '[brnAvatarFallback]',
	standalone: true,
	exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective {
	private readonly element = inject(ElementRef).nativeElement;
	readonly userCls = signal<ClassValue>('');
	readonly useAutoColor = signal(false);
	readonly textContent = inject(ElementRef).nativeElement.textContent;

	getTextContent(): string {
		return this.element.textContent;
	}

	@Input() set class(cls: ClassValue | string) {
		this.userCls.set(cls);
	}

	@Input({ transform: booleanAttribute })
	set autoColor(value: boolean) {
		this.useAutoColor.set(value);
	}
}
