import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrnToasterComponent } from './brn-toaster.component';

describe('BrainComponent', () => {
	let component: BrnToasterComponent;
	let fixture: ComponentFixture<BrnToasterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BrnToasterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(BrnToasterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
