import { InjectionToken } from '@angular/core';

export interface CustomElementClassSettable {
  setClassToCustomElement: (newClass: string) => void;
}

export const SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN = new InjectionToken<CustomElementClassSettable>(
  '@ng-spartan SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN'
);
