import { LoaderDirective } from '@ngneat/cmdk';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector: '[brnCmdLoader]',
  standalone: true,
  providers: [
    {
      provide: LoaderDirective,
      useExisting: forwardRef(() => BrnCommandLoaderDirective),
    },
  ],
  host: {
    class: 'cmdk-loader',
  },
})
export class BrnCommandLoaderDirective extends LoaderDirective {}
