import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnAvatarImageDirective } from './brn-avatar-image.directive';

@Component({
  selector: 'brn-mock',
  standalone: true,
  imports: [BrnAvatarImageDirective],
  template: `
    <div id="bad">
      <img brnAvatarImage #bad="avatarImage" />
      <span>{{ bad.canShow() }}</span>
    </div>
    <div id="good">
      <img
        src="https://images.unsplash.com/photo-1686630079100-fbbe083d2bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
        brnAvatarImage
        #good="avatarImage"
      />
      <span>{{ good.canShow() }}</span>
    </div>
  `,
})
class BrnMockComponent {}

describe('BrnAvatarImageDirective', () => {
  let component: BrnMockComponent;
  let fixture: ComponentFixture<BrnMockComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BrnMockComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should return false when image has no src', () => {
    fixture.detectChanges();
    const bad = fixture.nativeElement.querySelector('#bad');
    expect(bad.querySelector('span').textContent).toEqual('false');
  });

  it('should return true when image has a valid src', () => {
    fixture.detectChanges();
    const good = fixture.nativeElement.querySelector('#good');
    expect(good.querySelector('span').textContent).toEqual('true');
  });
});
