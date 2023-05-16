import { Component, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { injectErrorField } from 'ng-signal-forms';

@Component({
  selector: 'analog-trpc-input-error',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <div class='mt-1 h-8 pt-1 font-normal opacity-60'
         [class.invisible]="touchedState() === 'UNTOUCHED'">
      <p *ngFor='let message of errorMessages()'>{{ message }}</p>
    </div>
  `
})
export class InputErrorComponent {
  private _formField = injectErrorField();
  public touchedState = this._formField.touchedState;
  public errors = this._formField.errors;

  public errorMessages = computed(() =>
    Object.values(this.errors() ?? {}).map(
      (error) => error.message ?? 'Field invalid'
    )
  );
}
