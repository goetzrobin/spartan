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
  template: `<hlm-icon class="test" name="radixCheck" size="24px" color="red" strokeWidth="2" />`,
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
    expect(component.size).toBe('24px');
    expect(component.color).toBe('red');
    expect(component.strokeWidth).toBe('2');
    expect(debugEl.classes['test']).toBe(true);
  });
});
