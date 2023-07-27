import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarFallbackDirective } from './hlm-avatar-fallback.directive';
import { hexColorFor, isBright } from '@spartan-ng/ui-avatar-brain';

@Component({
  selector: 'hlm-mock',
  standalone: true,
  imports: [HlmAvatarFallbackDirective],
  template: `<span hlmAvatarFallback [class]="userCls" [autoColor]="false">fallback2</span>`,
})
class HlmMockComponent {
  userCls = '';
  autoColor = false;
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

  describe('autoColor', () => {
    beforeEach(() => {
      component.autoColor = true;
      fixture.detectChanges();
    });

    it('should remove the bg-muted class from the component', () => {
      setTimeout(() => {
        expect(fixture.nativeElement.querySelector('span').className).not.toContain('bg-muted');
      });
    });

    it('should remove add a text color class and hex backgroundColor style depending on its content', () => {
      const hex = hexColorFor('fallback2');
      const textCls = isBright(hex) ? 'text-black' : 'text-white';
      setTimeout(() => {
        expect(fixture.nativeElement.querySelector('span').className).toContain(textCls);
        expect(fixture.nativeElement.querySelector('span').style.backgroundColor).toBe(hex);
      });
    });
  });
});
