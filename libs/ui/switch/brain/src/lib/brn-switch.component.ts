import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxHostPressedListener } from '@ng-spartan/ui/core/brain';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';

export const BRN_SWITCH_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BrnSwitchComponent),
  multi: true
};

@Component({
  selector: 'brn-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      #checkBox
      tabindex="-1"
      type="checkbox"
      role="switch"
      [id]="childId"
      [ngStyle]='{
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: -"1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: "0",
    }'
      [checked]="checked"
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledby"
      [attr.aria-describedby]="ariaDescribedby"
      [attr.aria-required]="required || null"
    />
    <ng-content select="brn-switch-thumb" />
  `,
  host: {
    tabindex: '0',
    '[attr.data-state]': 'checked ? "checked" : "unchecked"',
    '[attr.data-focus-visible]': 'focusVisible()',
    '[attr.data-focus]': 'focused()',
    '[attr.data-disabled]': 'disabled'
  },
  providers: [BRN_SWITCH_VALUE_ACCESSOR]
})
export class BrnSwitchComponent implements AfterContentInit, OnDestroy {
  private _elementRef = inject(ElementRef);
  private _focusMonitor = inject(FocusMonitor);
  private _cdr = inject(ChangeDetectorRef);

  public _checked = signal(false);

  public focusVisible = signal(false);
  public focused = signal(false);

  @HostBinding('id')
  public ownId = '';
  public childId = '';

  @Input()
  public set id(value: string) {
    this.ownId = value + '-switch';
    this.childId = value;
  }

  @Input()
  set checked(value: BooleanInput) {
    this._checked.set(coerceBooleanProperty(value));
  }

  get checked() {
    return this._checked();
  }

  /** Used to set the aria-label attribute on the underlying input element. */
  @Input('aria-label')
  ariaLabel: string | null = null;

  /** Used to set the aria-labelledby attribute on the underlying input element. */
  @Input('aria-labelledby')
  ariaLabelledby: string | null = null;

  /** Used to set the aria-describedby attribute on the underlying input element. */
  @Input('aria-describedby')
  ariaDescribedby: string | null = null;

  private _required = false;
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  private _disabled = false;
  @Input()
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  get disabled() {
    return this._disabled;
  }

  protected _onChange = (_: any) => {
  };
  private _onTouched = () => {
  };

  @ViewChild('checkBox', { static: true })
  public checkbox?: ElementRef<HTMLInputElement>;

  @Output()
  public changed = new EventEmitter<boolean>();

  constructor() {
    rxHostPressedListener().subscribe(() => this.handleChange());
  }

  public handleChange() {
    if (!this.checkbox) return;
    this.checkbox.nativeElement.value = this.checkbox?.nativeElement.value === 'on' ? 'off' : 'on';
    this.checkbox.nativeElement.dispatchEvent(new Event('change'));
    this._checked.set(this.checkbox.nativeElement.value === 'on');
    this._onChange(this._checked());
    this.changed.emit(this._checked());
  }

  ngAfterContentInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (focusOrigin) this.focused.set(true);
      if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
        this.focusVisible.set(true);
        this._cdr.markForCheck();
      }
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state
        // change (such as a form control's ng-touched) will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this.focusVisible.set(false);
          this.focused.set(false);
          this._onTouched();
          this._cdr.markForCheck();
        });
      }
    });

    if (!this.checkbox) return;
    this.checkbox.nativeElement.value = this._checked() ? 'on' : 'off';
    this.checkbox.nativeElement.dispatchEvent(new Event('change'));
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /** Implemented as a part of ControlValueAccessor. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.markForCheck();
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
