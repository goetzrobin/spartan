import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { BrnAvatarImageDirective } from './image';

@Component({
	selector: 'brn-avatar',
	standalone: true,
	imports: [NgIf],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<ng-container *ngIf="image?.canShow(); else fallback">
			<ng-content select="[brnAvatarImage]" />
		</ng-container>
		<ng-template #fallback>
			<ng-content select="[brnAvatarFallback]" />
		</ng-template>
	`,
})
export class BrnAvatarComponent {
	@ContentChild(BrnAvatarImageDirective, { static: true })
	protected readonly image: BrnAvatarImageDirective | null = null;
}
