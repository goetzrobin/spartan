import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { AfterViewInit, Component, ViewChild, computed, inject, input, signal } from '@angular/core';
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
	overlay = inject(Overlay);
	positionStrategies = signal(
		new Map([
			['top-left', this.overlay.position().global().top().start()],
			['top-center', this.overlay.position().global().top().centerHorizontally()],
			['top-right', this.overlay.position().global().top().end()],
			['bottom-left', this.overlay.position().global().bottom().start()],
			['bottom-center', this.overlay.position().global().bottom().centerHorizontally()],
			['bottom-right', this.overlay.position().global().bottom().end()],
		]),
	);

	positionStrategy = computed(() => this.positionStrategies().get(this.position()));
	@ViewChild(CdkPortal) toast!: CdkPortal;

	ngAfterViewInit(): void {
		const overlay = this.overlay.create({
			positionStrategy: this.positionStrategy(),
		});

		overlay.attach(this.toast);
	}
}
