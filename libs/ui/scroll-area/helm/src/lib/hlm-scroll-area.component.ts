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
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('block', this._userCls());
	}

	@Input()
	public track: 'vertical' | 'horizontal' | 'all' = 'all';
	@Input()
	autoHeightDisabled = false;
	@Input()
	autoWidthDisabled = false;
	@Input()
	visibility: 'hover' | 'always' | 'native' = 'native';
}
