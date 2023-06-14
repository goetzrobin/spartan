import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Input, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';

const firstAddingIn = (mutations: MutationRecord[]) => {
  const addedNodes = mutations.find(({ addedNodes }) => addedNodes.length > 0)?.addedNodes;

  if (!addedNodes) return [];
  return Array.from(addedNodes);
};

const addedTextContentIn = (mutations: MutationRecord[]) =>
  firstAddingIn(mutations).find(({ textContent }) => !!textContent)?.textContent || '';

@Directive({
  selector: '[brnAvatarFallback]',
  standalone: true,
  exportAs: 'avatarFallback',
})
export class BrnAvatarFallbackDirective implements OnInit, OnDestroy {
  private readonly platform = inject(PLATFORM_ID);
  private readonly parent = inject(ElementRef, { skipSelf: true, optional: true });

  protected readonly autoColor = signal(false);
  protected readonly text = signal('');

  private mutation$?: MutationObserver;

  @Input() set brnAvatarFallback(value: boolean | string) {
    this.autoColor.set(typeof value === 'boolean' && value);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platform)) this.changeTextAfterRender();
  }

  ngOnDestroy() {
    this.mutation$?.disconnect();
  }

  private changeTextAfterRender() {
    if (!this.parent) return;
    this.mutation$?.disconnect();

    this.mutation$ = new MutationObserver((mutations) => {
      const content = addedTextContentIn(mutations);

      if (content) this.text.set(content);
      this.mutation$?.disconnect();
    });

    this.mutation$.observe(this.parent.nativeElement, { childList: true });
  }
}
