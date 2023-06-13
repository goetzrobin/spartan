import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarComponent } from './brn-avatar.component';
import { BrnAvatarFallbackDirective } from './fallback/brn-avatar-fallback.directive';
import { BrnAvatarImageDirective } from './image/brn-avatar-image.directive';

@Component({
  selector: 'brn-mock',
  imports: [BrnAvatarImageDirective, BrnAvatarFallbackDirective, BrnAvatarComponent],
  template: `
    <brn-avatar id="empty">
      <p>empty</p>
    </brn-avatar>
    <brn-avatar id="fallbackOnly">
      <span *brnAvatarFallback>fallback</span>
    </brn-avatar>
    <brn-avatar id="noSrc">
      <img brnAvatarImage />
      <span *brnAvatarFallback>fallback</span>
    </brn-avatar>
    <brn-avatar id="good">
      <img brnAvatarImage src="anSrc" />
      <span *brnAvatarFallback>fallback</span>
    </brn-avatar>
  `,
  standalone: true,
})
class MockComponent {}

describe('BrnAvatarComponent', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });
  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should render the fallback when no image is provided', () => {
    const fallback = fixture.nativeElement.querySelector('#fallbackOnly span');
    expect(fallback.textContent).toEqual('fallback');
  });

  it('should not render anything when no image or fallback is provided', () => {
    const empty = fixture.nativeElement.querySelector('#empty p');
    expect(empty).toBeFalsy();
  });

  it('should render the fallback when provided and image with no src', () => {
    const fallback = fixture.nativeElement.querySelector('#noSrc span');
    expect(fallback.textContent).toEqual('fallback');
  });

  it('should not render the fallback, but rather the image when provided with a valid src', () => {
    const img = fixture.nativeElement.querySelector('#good img');
    expect(img).toBeTruthy();

    const fallback = fixture.nativeElement.querySelector('#good span');
    expect(fallback).toBeFalsy();
  });
});
