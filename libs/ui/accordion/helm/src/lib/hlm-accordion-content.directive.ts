import {
  computed,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ClassValue } from 'clsx';
import { hlm, injectCustomClassSettable } from '@spartan-ng/ui-core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
  standalone: true,
  host: {
    '[style.height]': 'cssHeight()',
  },
})
export class HlmAccordionContentDirective implements OnInit {
  private _host = injectCustomClassSettable({ optional: true });
  private _element = inject(ElementRef).nativeElement;
  private _injector = inject(Injector);
  public _platformId = inject(PLATFORM_ID);

  @HostBinding('class')
  private _class = this.generateClass();
  private _inputs: ClassValue = '';
  private _changes?: MutationObserver;

  protected initialHeight = 0;
  public height = signal(-1);
  public cssHeight = computed(() => (this.height() === -1 ? 'auto' : this.height() + 'px'));
  public state = signal('closed');

  @Input()
  set class(inputs: ClassValue) {
    this._inputs = inputs;
    this._class = this.generateClass();
  }

  public ngOnInit() {
    this._host?.setClassToCustomElement('pt-1 pb-4');

    if (isPlatformBrowser(this._platformId)) {
      this._changes = new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          if (mutation.attributeName !== 'data-state') return;
          // eslint-disable-next-line
          const state = (mutation.target as any).attributes.getNamedItem(mutation.attributeName)?.value;
          this.state.set(state);
        });
      });
    }

    Promise.resolve().then(() => {
      this.initialHeight = this._element.offsetHeight;
      this._changes?.observe(this._element, {
        attributes: true,
        childList: true,
        characterData: true,
      });
    });

    effect(
      () => {
        const isOpen = this.state() === 'open';
        Promise.resolve().then(() => this.height.set(isOpen ? this.initialHeight : 0));
      },
      {
        injector: this._injector,
        allowSignalWrites: true,
      }
    );
  }

  generateClass() {
    return hlm('overflow-hidden text-sm transition-all', this._inputs);
  }
}
