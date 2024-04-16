import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	ContentChild,
	effect,
	ElementRef,
	inject,
	input,
	Input,
	signal,
	viewChild,
} from '@angular/core';
import { hlm, injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/ui-core';
import {
	BrnSelectContentDirective,
	BrnSelectScrollDownDirective,
	BrnSelectScrollUpDirective,
	BrnSelectService,
} from '@spartan-ng/ui-select-brain';
import { ClassValue } from 'clsx';

@Component({
	selector: '[hlmSelectContent], hlm-select-content',
	standalone: true,
	imports: [BrnSelectScrollUpDirective, BrnSelectScrollDownDirective, NgTemplateOutlet],
	hostDirectives: [BrnSelectContentDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': '_stateProvider?.state() ?? "open"',
		'[attr.data-side]': '_sideProvider?.side() ?? "bottom"',
		'[attr.aria-labelledBy]': 'labelledBy()',
		'[attr.aria-controlledBy]': "id() +'--trigger'",
		'[id]': "id() + '--content'",
		'[attr.dir]': '_selectService.dir()',
	},
	styles: [
		`
			:host {
				display: flex;
				box-sizing: border-box;
				flex-direction: column;
				outline: none;
				pointer-events: auto;
			}

			[data-brn-select-viewport] {
				scrollbar-width: none;
				-ms-overflow-style: none;
				-webkit-overflow-scrolling: touch;
			}

			[data-brn-select-viewport]::-webkit-scrollbar {
				display: none;
			}
		`,
	],
	template: `
		<ng-template #scrollUp>
			<ng-content select="hlm-select-scroll-up" />
			<ng-content select="brnSelectScrollUp" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollUp() && scrollUpBtn ? scrollUp : null" />
		<div
			data-brn-select-viewport
			#viewport
			(scroll)="handleScroll()"
			style="flex: 1 1 0%;
			position: relative;
			width:100%;
			overflow:auto;
			min-height: 36px;
      padding-bottom: 2px;
      margin-bottom: -2px;"
		>
			<ng-content />
		</div>
		<ng-template #scrollDown>
			<ng-content select="brnSelectScrollDown" />
			<ng-content select="hlm-select-scroll-down" />
		</ng-template>
		<ng-container *ngTemplateOutlet="canScrollDown() && scrollDownBtn ? scrollDown : null" />
	`,
})
export class HlmSelectContentComponent {
	constructor() {
		effect(
			() => {
				this.brnSelectContent.viewport.set(this.viewport());
			},
			{
				// TODO figure out how to do this more elegantly?
				allowSignalWrites: true,
			},
		);
	}

	private readonly brnSelectContent = inject(BrnSelectContentDirective);
	protected readonly _selectService = inject(BrnSelectService);

	protected readonly labelledBy = this.brnSelectContent.labelledBy;
	protected readonly id = this.brnSelectContent.id;
	protected readonly canScrollUp = this.brnSelectContent.canScrollUp;
	protected readonly canScrollDown = this.brnSelectContent.canScrollDown;

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _stateProvider = injectExposesStateProvider({ optional: true });
	protected readonly _sideProvider = injectExposedSideProvider({ optional: true });

	protected readonly _computedClass = computed(() =>
		hlm(
			'w-full relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 data-[side=bottom]:top-[2px] data-[side=top]:bottom-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			this.userClass(),
		),
	);

	private readonly _stickyLabels = signal(false);
	@Input()
	set stickyLabels(value: boolean) {
		this._stickyLabels.set(value);
	}
	get stickyLabels() {
		return this._stickyLabels();
	}

	protected readonly viewport = viewChild<ElementRef<HTMLElement>>('viewPort');

	@ContentChild(BrnSelectScrollUpDirective, { static: false })
	protected scrollUpBtn!: BrnSelectScrollUpDirective;

	@ContentChild(BrnSelectScrollDownDirective, { static: false })
	protected scrollDownBtn!: BrnSelectScrollDownDirective;

	public handleScroll() {
		this.brnSelectContent.updateArrowDisplay();
	}
}
