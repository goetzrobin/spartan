import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCheck } from '@ng-icons/radix-icons';
import { RenderResult, render } from '@testing-library/angular';
import { HlmIconComponent } from './hlm-icon.component';

@Component({
  selector: 'hlm-mock',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ radixCheck })],
  template: `<hlm-icon class="test" name="radixCheck" size="medium" color="red" strokeWidth="2" />`,
})
class HlmMockComponent {}

describe('HlmIconComponent', () => {
  let r: RenderResult<HlmMockComponent>;

  beforeEach(async () => {
    r = await render(HlmMockComponent);
  });

  it('should create', () => {
    expect(r).toBeTruthy();
  });

  it('should render the icon', () => {
    expect(r.container.querySelector('svg')).toBeTruthy();
  });

  it('should pass the size, color and strokeWidth props and the classes to the ng-icon component', () => {
    const debugEl = r.fixture.debugElement.query(By.directive(NgIconComponent));
    const component = debugEl.componentInstance as NgIconComponent;
    expect(component.color).toBe('red');
    expect(component.strokeWidth).toBe('2');
  });

  it('should add the appropriate size variant class', () => {
    expect(r.container.querySelector('hlm-icon')?.classList).toContain('h-6');
    expect(r.container.querySelector('hlm-icon')?.classList).toContain('w-6');
  });

  it('should compose the user classes', () => {
    expect(r.container.querySelector('hlm-icon')?.classList).toContain('inline-flex');
    expect(r.container.querySelector('hlm-icon')?.classList).toContain('test');
  });
});
