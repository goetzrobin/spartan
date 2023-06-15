import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HlmAvatarComponent } from './hlm-avatar.component';

describe('HlmAvatarComponent', () => {
  let component: HlmAvatarComponent;
  let fixture: ComponentFixture<HlmAvatarComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HlmAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should add the default classes if no inputs are provided', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.className).toBe('flex h-10 overflow-hidden relative rounded-full shrink-0 w-10');
  });

  it('should add any user defined classes', () => {
    component.setUserCls = 'test-class';
    fixture.detectChanges();
    expect(fixture.nativeElement.className).toContain('test-class');
  });

  it('should change the size when the variant is changed', () => {
    component.setVariant = 'small';
    fixture.detectChanges();
    expect(fixture.nativeElement.className).toContain('h-6');
    expect(fixture.nativeElement.className).toContain('w-6');

    component.setVariant = 'large';
    fixture.detectChanges();
    expect(fixture.nativeElement.className).toContain('h-14');
    expect(fixture.nativeElement.className).toContain('w-14');
  });
});
