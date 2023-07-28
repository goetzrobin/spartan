import { inject, InjectionToken, InjectOptions } from '@angular/core';

export interface CustomElementClassSettable {
  setClassToCustomElement: (newClass: string) => void;
}

export const SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN: InjectionToken<CustomElementClassSettable> =
  new InjectionToken<CustomElementClassSettable>('@spartan-ng SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN');

export const injectCustomClassSettable = (options: InjectOptions) => inject(SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN, options);
