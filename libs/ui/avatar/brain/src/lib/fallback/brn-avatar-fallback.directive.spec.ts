import { NgIf } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarFallbackDirective } from './brn-avatar-fallback.directive';

@Component({
  selector: 'brn-mock',
  standalone: true,
  imports: [BrnAvatarFallbackDirective, NgIf],
  template: `<span *brnAvatarFallback>fallback</span><span brnAvatarFallback>fallback2</span>`,
})
class BrnMockComponent {}

describe('BrnAvatarFallback', () => {
  let component: BrnMockComponent;
  let fixture: ComponentFixture<BrnMockComponent>;

  beforeEach(() => {
    fixture = TestBed.overrideProvider(PLATFORM_ID, { useValue: 'browser' }).createComponent(BrnMockComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
