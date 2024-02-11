import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { AfterViewInit, Component, ViewChild, computed, inject, input } from '@angular/core';
import { Position } from './brn-toast.types';

@Component({
	selector: 'brn-toaster-position',
	imports: [OverlayModule, PortalModule],
	template: `
		<ng-template cdkPortal>
			<ng-content />
		</ng-template>
	`,
	standalone: true,
})
export class BrnToasterPositionComponent implements AfterViewInit {
	position = input.required<Position>();
	offset = input.required<string>();
	overlay = inject(Overlay);
	positionStrategies = computed(() => {
		return new Map([
			['top-left', this.overlay.position().global().top(this.offset()).start(this.offset())],
			['top-center', this.overlay.position().global().top(this.offset()).centerHorizontally(this.offset())],
			['top-right', this.overlay.position().global().top(this.offset()).end(this.offset())],
			['bottom-left', this.overlay.position().global().bottom(this.offset()).start(this.offset())],
			['bottom-center', this.overlay.position().global().bottom(this.offset()).centerHorizontally(this.offset())],
			['bottom-right', this.overlay.position().global().bottom(this.offset()).end(this.offset())],
		]);
	});

	positionStrategy = computed(() => this.positionStrategies().get(this.position()));
	@ViewChild(CdkPortal) toast!: CdkPortal;

	ngAfterViewInit(): void {
		const overlay = this.overlay.create({
			positionStrategy: this.positionStrategy(),
		});

		overlay.attach(this.toast);
	}
}
