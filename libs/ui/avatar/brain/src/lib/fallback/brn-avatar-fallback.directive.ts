import { booleanAttribute, Directive, ElementRef, inject, Input, signal } from '@angular/core';
import { ClassValue } from 'clsx';

@Directive({
  selector: '[brnAvatarFallback]',
  standalone: true,
  exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective {
  readonly userCls = signal<ClassValue>('');
  readonly useAutoColor = signal(false);
  readonly textContent = inject(ElementRef).nativeElement.textContent;

  @Input() set class(cls: ClassValue | string) {
    this.userCls.set(cls);
  }

  @Input({ transform: booleanAttribute })
  set autoColor(value: boolean) {
    this.useAutoColor.set(value);
  }
}
