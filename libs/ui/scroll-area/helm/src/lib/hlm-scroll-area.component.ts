import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	Input,
	signal,
	ViewEncapsulation,
} from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'hlm-scroll-area',
	standalone: true,
	imports: [NgScrollbarModule],
	template: `
		<ng-scrollbar
			[visibility]="_visibility()"
			[autoHeightDisabled]="_autoHeightDisabled()"
			[autoWidthDisabled]="_autoWidthDisabled()"
			[track]="_track()"
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
	protected readonly _computedClass = computed(() => hlm('block', this._class()));

	@Input()
	set class(value: ClassValue) {
		this._class.set(value);
	}

	private readonly _class = signal<ClassValue>('');

	@Input()
	set track(value: 'vertical' | 'horizontal' | 'all') {
		this._track.set(value);
	}

	protected readonly _track = signal<'vertical' | 'horizontal' | 'all'>('all');

	@Input({ transform: booleanAttribute })
	set autoHeightDisabled(value: boolean) {
		this._autoHeightDisabled.set(value);
	}

	protected readonly _autoHeightDisabled = signal(true);

	@Input({ transform: booleanAttribute })
	set autoWidthDisabled(value: boolean) {
		this._autoWidthDisabled.set(value);
	}

	protected readonly _autoWidthDisabled = signal(true);

	@Input()
	set visibility(value: 'hover' | 'always' | 'native') {
		this._visibility.set(value);
	}

	protected readonly _visibility = signal<'hover' | 'always' | 'native'>('native');
}
