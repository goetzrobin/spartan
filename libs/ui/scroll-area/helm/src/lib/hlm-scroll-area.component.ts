import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'hlm-scroll-area',
	standalone: true,
	imports: [NgScrollbarModule],
	template: `
		<ng-scrollbar
			[visibility]="visibility"
			[autoHeightDisabled]="autoHeightDisabled"
			[autoWidthDisabled]="autoWidthDisabled"
			[track]="track"
			[style]="{
				'--scrollbar-border-radius': '100px',
				'--scrollbar-padding': '1px',
				'--scrollbar-thumb-color': 'hsl(var(--border)',
				'--scrollbar-thumb-hover-color': 'hsl(var(--border)',
				'--scrollbar-size': '7px'
			}"
		>
			<ng-content />
		</ng-scrollbar>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmScrollAreaComponent {
	private _userCls = signal<ClassValue>('');
	protected _computedClass = computed(() => this.generateClass());

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	@Input()
	public track: 'vertical' | 'horizontal' | 'all' = 'all';
	@Input()
	autoHeightDisabled = false;
	@Input()
	autoWidthDisabled = false;
	@Input()
	visibility: 'hover' | 'always' | 'native' = 'native';

	private generateClass() {
		return hlm('block', this._userCls());
	}
}
