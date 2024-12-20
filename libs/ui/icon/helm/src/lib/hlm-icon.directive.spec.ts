import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { type RenderResult, render } from '@testing-library/angular';
import { HlmIconDirective } from './hlm-icon.directive';

@Component({
	selector: 'hlm-mock',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HlmIconDirective, NgIcon],
	providers: [provideIcons({ lucideCheck })],
	template: `
		<ng-icon hlm class="test" ngIconClass="test2" name="lucideCheck" [size]="size" color="red" strokeWidth="2" />
	`,
})
class HlmMockComponent {
	@Input() public size = 'base';
}

describe('HlmIconDirective', () => {
	let r: RenderResult<HlmMockComponent>;

	beforeEach(async () => {
		r = await render(HlmMockComponent);
	});

	it('should create', () => {
		expect(r).toBeTruthy();
	});

	it('should add the appropriate size variant class', () => {
		expect(r.container.querySelector('ng-icon')?.classList).toContain('h-6');
		expect(r.container.querySelector('ng-icon')?.classList).toContain('w-6');
	});

	it('should compose the user classes', () => {
		expect(r.container.querySelector('ng-icon')?.classList).toContain('inline-flex');
		expect(r.container.querySelector('ng-icon')?.classList).toContain('test');
	});

	it('should forward the size property if the size is not a pre-defined size', async () => {
		await r.rerender({ componentInputs: { size: '2rem' } });
		r.fixture.detectChanges();
		const debugEl = r.fixture.debugElement.query(By.directive(NgIcon));
		expect(debugEl.componentInstance.size()).toBe('2rem');
		expect(r.container.querySelector('ng-icon')?.classList).not.toContain('h-6');
		expect(r.container.querySelector('ng-icon')?.classList).not.toContain('w-6');
	});
});
