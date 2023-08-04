import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import {
  BrnTabsComponent,
  BrnTabsContentDirective,
  BrnTabsListComponent,
  BrnTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-brain';
import { HlmTabsContentDirective } from '@spartan-ng/ui-tabs-helm';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';

import 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import { HlmScrollAreaComponent } from '@spartan-ng/ui-scrollarea-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { radixCheck, radixClipboard } from '@ng-icons/radix-icons';
import { Clipboard } from '@angular/cdk/clipboard';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';

declare const Prism: typeof import('prismjs');

@Component({
  selector: 'spartan-code',
  standalone: true,
  imports: [
    BrnTabsComponent,
    BrnTabsListComponent,
    BrnTabsTriggerDirective,
    HlmTabsContentDirective,
    BrnTabsContentDirective,
    HlmScrollAreaComponent,
    HlmButtonDirective,
    HlmIconComponent,
    NgIf,
  ],
  providers: [provideIcons({ radixClipboard, radixCheck })],
  host: {
    class: 'spartan-scroll relative block font-mono rounded-md text-sm text-white bg-zinc-950 dark:bg-zinc-900',
  },
  template: `
    <button
      *ngIf="!_disableCopy"
      (click)="copyToClipBoard()"
      hlmBtn
      variant="ghost"
      class="h-6 w-6 p-1 absolute top-2 right-2"
    >
      <hlm-icon size="xs" [name]="copied ? 'radixCheck' : 'radixClipboard'" />
    </button>
    <div class="w-full whitespace-nowrap overflow-auto p-4 max-h-[650px]">
      <div class="max-w-full max-w-screen" [innerHTML]="_content"></div>
    </div>
  `,
  styles: [
    `
      .spartan-scroll .token.class-name {
        opacity: 1;
      }

      .spartan-scroll .token.property,
      .spartan-scroll .token.tag,
      .spartan-scroll .token.boolean,
      .spartan-scroll .token.number,
      .spartan-scroll .token.constant,
      .spartan-scroll .token.symbol,
      .spartan-scroll .token.deleted,
      .spartan-scroll .token.selector,
      .spartan-scroll .token.attr-name,
      .spartan-scroll .token.string,
      .spartan-scroll .token.char,
      .spartan-scroll .token.builtin,
      .spartan-scroll .token.inserted,
      .spartan-scroll .token.atrule,
      .spartan-scroll .token.attr-value,
      .spartan-scroll .token.function,
      .spartan-scroll .token.regex,
      .spartan-scroll .token.important,
      .spartan-scroll .token.variable {
        opacity: 0.533;
      }

      .spartan-scroll .token.operator,
      .spartan-scroll .token.entity,
      .spartan-scroll .token.url,
      .spartan-scroll .token.keyword,
      .spartan-scroll .language-css .token.string,
      .spartan-scroll .style .token.string {
        opacity: 0.733;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CodeComponent {
  private readonly _clipboard = inject(Clipboard);
  private readonly marked: typeof marked;
  protected _content = '';
  protected copied = false;

  protected _disableCopy = false;
  @Input()
  set disableCopy(value: BooleanInput) {
    this._disableCopy = coerceBooleanProperty(value);
  }

  private _language: 'ts' | 'sh' = 'ts';
  @Input()
  set language(value: 'ts' | 'sh') {
    this._language = value;
  }

  private _code: string | null | undefined;
  @Input()
  set code(value: string | null | undefined) {
    this._code = value;
    (this._language === 'sh'
      ? this.marked.parse(value?.trim() ?? '')
      : (this.marked.parse(`\`\`\`typescript\n${value?.trim() ?? ''}\n\`\`\``) as any)
    ).then((content: string) => {
      this._content = content;
    });
  }

  constructor() {
    const renderer = new marked.Renderer();
    renderer.code = (code, lang) => {
      if (!lang) {
        return '<pre><code>' + code + '</code></pre>';
      }
      const langClass = 'language-' + lang;
      return '<pre class="' + langClass + '"><code class="' + langClass + '">' + code + '</code></pre>';
    };

    marked.use(
      gfmHeadingId(),
      markedHighlight({
        async: true,
        highlight: (code, lang) => {
          lang = lang || 'typescript';
          if (!Prism.languages[lang]) {
            console.warn(`Notice:
    ---------------------------------------------------------------------------------------
    The requested language '${lang}' is not available with the provided setup.
    To enable, import your main.ts as:
      import  'prismjs/components/prism-${lang}';
    ---------------------------------------------------------------------------------------
        `);
            return code;
          }
          return Prism.highlight(code, Prism.languages[lang], lang);
        },
      }),
      {
        renderer,
        pedantic: false,
        gfm: true,
        breaks: false,
        mangle: false,
      },
    );

    this.marked = marked;
  }

  copyToClipBoard() {
    if (!this._code) return;
    this._clipboard.copy(this._code);
    this.copied = true;
    setTimeout(() => (this.copied = false), 3000);
  }
}
