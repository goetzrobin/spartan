import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarFallbackDirective } from './hlm-avatar-fallback.directive';

@Component({
  selector: 'hlm-mock',
  standalone: true,
  imports: [HlmAvatarFallbackDirective],
  template: `<span [hlmAvatarFallback]="userCls">fallback2</span>`,
})
class HlmMockComponent {
  userCls = '';
}

describe('HlmAvatarFallbackDirective', () => {
  let component: HlmMockComponent;
  let fixture: ComponentFixture<HlmMockComponent>;

  beforeEach(() => {
    fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(HlmMockComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the default classes if no inputs are provided', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span').className).toBe(
      'bg-muted flex h-full items-center justify-center rounded-full w-full'
    );
  });

  it('should add any user defined classes', async () => {
    component.userCls = 'test-class';
    fixture.detectChanges();

    // fallback uses Promise.resolve().then() so we need to wait for the next tick
    setTimeout(() => {
      expect(fixture.nativeElement.querySelector('img').className).toContain('test-class');
    });
  });
});
