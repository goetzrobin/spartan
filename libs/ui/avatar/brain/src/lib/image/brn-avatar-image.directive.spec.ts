import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    <div id="unloaded">
      <img src="https://picsum.photos/200/300" brnAvatarImage #unloaded="avatarImage" />
      <span>{{ unloaded.canShow() }}</span>
    </div>
    <div id="loaded">
      <img src="https://picsum.photos/200/300" brnAvatarImage #good="avatarImage" />
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

  it('should return false when image has a valid src but isnt loaded', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const unloaded = fixture.nativeElement.querySelector('#unloaded');
    expect(unloaded.querySelector('span').textContent).toEqual('false');
  });

  it('should return true when the image is loaded without error', async () => {
    fixture.debugElement.query(By.css('#loaded img')).triggerEventHandler('load', null);
    fixture.detectChanges();
    const unloaded = fixture.nativeElement.querySelector('#loaded');
    expect(unloaded.querySelector('span').textContent).toEqual('true');
  });
});
