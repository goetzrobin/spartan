import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
	computed,
	inject,
	input,
	signal,
} from '@angular/core';
import { BrnToastComponent } from './brn-toast.component';
import { Position, ToastOptions } from './brn-toast.types';
import { BrnToasterPositionComponent } from './brn-toaster-position.component';
import { BrnToasterService } from './brn-toaster.service';

type OListFocusEvent = FocusEvent & {
	currentTarget: EventTarget & HTMLOListElement;
};

const TOAST_WIDTH = 356;
const VIEWPORT_OFFSET = '32px';
const GAP = 14;
const VISIBLE_TOASTS_AMOUNT = 3;

@Component({
	selector: 'brn-toaster',
	standalone: true,
	imports: [CommonModule, BrnToastComponent, BrnToasterPositionComponent],
	templateUrl: './brn-toaster.component.html',
	encapsulation: ViewEncapsulation.None,
	styles: `
	[data-sonner-toaster] {
	/* position: fixed; */
	width: var(--width);
	font-family:
		ui-sans-serif,
		system-ui,
		-apple-system,
		BlinkMacSystemFont,
		Segoe UI,
		Roboto,
		Helvetica Neue,
		Arial,
		Noto Sans,
		sans-serif,
		Apple Color Emoji,
		Segoe UI Emoji,
		Segoe UI Symbol,
		Noto Color Emoji;
	--gray1: hsl(0, 0%, 99%);
	--gray2: hsl(0, 0%, 97.3%);
	--gray3: hsl(0, 0%, 95.1%);
	--gray4: hsl(0, 0%, 93%);
	--gray5: hsl(0, 0%, 90.9%);
	--gray6: hsl(0, 0%, 88.7%);
	--gray7: hsl(0, 0%, 85.8%);
	--gray8: hsl(0, 0%, 78%);
	--gray9: hsl(0, 0%, 56.1%);
	--gray10: hsl(0, 0%, 52.3%);
	--gray11: hsl(0, 0%, 43.5%);
	--gray12: hsl(0, 0%, 9%);
	--border-radius: 8px;
	box-sizing: border-box;
	padding: 0;
	margin: 0;
	list-style: none;
	outline: none;
	z-index: 999999999;
}

[data-sonner-toaster][data-x-position='right'] {
	right: max(var(--offset), env(safe-area-inset-right));
}

[data-sonner-toaster][data-x-position='left'] {
	left: max(var(--offset), env(safe-area-inset-left));
}

[data-sonner-toaster][data-x-position='center'] {
	left: 50%;
	transform: translateX(-50%);
}

[data-sonner-toaster][data-y-position='top'] {
	top: max(var(--offset), env(safe-area-inset-top));
}

[data-sonner-toaster][data-y-position='bottom'] {
	bottom: max(var(--offset), env(safe-area-inset-bottom));
}

[data-sonner-toast] {
	--y: translateY(100%);
	--lift-amount: calc(var(--lift) * var(--gap));
	z-index: var(--z-index);
	position: absolute;
	opacity: 0;
	transform: var(--y);
	/* https://stackoverflow.com/questions/48124372/pointermove-event-not-working-with-touch-why-not */
	touch-action: none;
	will-change: transform, opacity, height;
	transition:
		transform 400ms,
		opacity 400ms,
		height 400ms,
		box-shadow 200ms;
	box-sizing: border-box;
	outline: none;
	overflow-wrap: anywhere;
}

[data-sonner-toast]:focus-visible {
	box-shadow:
		0px 4px 12px rgba(0, 0, 0, 0.1),
		0 0 0 2px rgba(0, 0, 0, 0.2);
}

[data-sonner-toast][data-y-position='top'] {
	top: 0;
	--y: translateY(-100%);
	--lift: 1;
	--lift-amount: calc(1 * var(--gap));
}

[data-sonner-toast][data-y-position='bottom'] {
	bottom: 0;
	--y: translateY(100%);
	--lift: -1;
	--lift-amount: calc(var(--lift) * var(--gap));
}

[data-sonner-toast] [data-description] {
	font-weight: 400;
	line-height: 1.4;
	color: inherit;
}

[data-sonner-toast] [data-title] {
	font-weight: 500;
	line-height: 1.5;
	color: inherit;
}

[data-sonner-toast] [data-icon] {
	display: flex;
	height: 16px;
	width: 16px;
	position: relative;
	justify-content: flex-start;
	align-items: center;
	flex-shrink: 0;
	margin-left: var(--toast-icon-margin-start);
	margin-right: var(--toast-icon-margin-end);
}

[data-sonner-toast][data-promise='true'] [data-icon] > svg {
	opacity: 0;
	transform: scale(0.8);
	transform-origin: center;
	animation: sonner-fade-in 300ms ease forwards;
}

[data-sonner-toast] [data-icon] > * {
	flex-shrink: 0;
}

[data-sonner-toast] [data-icon] svg {
	margin-left: var(--toast-svg-margin-start);
	margin-right: var(--toast-svg-margin-end);
}

[data-sonner-toast] [data-content] {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

[data-sonner-toast] [data-button] {
	border-radius: 4px;
	padding-left: 8px;
	padding-right: 8px;
	height: 24px;
	font-size: 12px;
	color: var(--normal-bg);
	background: var(--normal-text);
	margin-left: var(--toast-button-margin-start);
	margin-right: var(--toast-button-margin-end);
	border: none;
	cursor: pointer;
	outline: none;
	display: flex;
	align-items: center;
	flex-shrink: 0;
	transition:
		opacity 400ms,
		box-shadow 200ms;
}

[data-sonner-toast] [data-button]:focus-visible {
	box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.4);
}

[data-sonner-toast] [data-button]:first-of-type {
	margin-left: var(--toast-button-margin-start);
	margin-right: var(--toast-button-margin-end);
}

[data-sonner-toast] [data-cancel] {
	color: var(--normal-text);
	background: rgba(0, 0, 0, 0.08);
}

[data-sonner-toast][data-theme='dark'] [data-cancel] {
	background: rgba(255, 255, 255, 0.3);
}

[data-sonner-toast] [data-close-button] {
	position: absolute;
	left: var(--toast-close-button-start);
	right: var(--toast-close-button-end);
	top: 0;
	height: 20px;
	width: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	background: var(--gray1);
	color: var(--gray12);
	border: 1px solid var(--gray4);
	transform: var(--toast-close-button-transform);
	border-radius: 50%;
	cursor: pointer;
	z-index: 1;
	transition:
		opacity 100ms,
		background 200ms,
		border-color 200ms;
}

[data-sonner-toast] [data-close-button]:focus-visible {
	box-shadow:
		0px 4px 12px rgba(0, 0, 0, 0.1),
		0 0 0 2px rgba(0, 0, 0, 0.2);
}

[data-sonner-toast] [data-disabled='true'] {
	cursor: not-allowed;
}

[data-sonner-toast]:hover [data-close-button]:hover {
	background: var(--gray2);
	border-color: var(--gray5);
}

/* Leave a ghost div to avoid setting hover to false when swiping out */
[data-sonner-toast][data-swiping='true']:before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	height: 100%;
	z-index: -1;
}

[data-sonner-toast][data-y-position='top'][data-swiping='true']:before {
	/* y 50% needed to distribute height additional height evenly */
	bottom: 50%;
	transform: scaleY(3) translateY(50%);
}

[data-sonner-toast][data-y-position='bottom'][data-swiping='true']:before {
	/* y -50% needed to distribute height additional height evenly */
	top: 50%;
	transform: scaleY(3) translateY(-50%);
}

/* Leave a ghost div to avoid setting hover to false when transitioning out */
[data-sonner-toast][data-swiping='false'][data-removed='true']:before {
	content: '';
	position: absolute;
	inset: 0;
	transform: scaleY(2);
}

/* Needed to avoid setting hover to false when inbetween toasts */
[data-sonner-toast]:after {
	content: '';
	position: absolute;
	left: 0;
	height: calc(var(--gap) + 1px);
	bottom: 100%;
	width: 100%;
}

[data-sonner-toast][data-mounted='true'] {
	--y: translateY(0);
	opacity: 1;
}

[data-sonner-toast][data-expanded='false'][data-front='false'] {
	--scale: var(--toasts-before) * 0.05 + 1;
	--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));
	height: var(--front-toast-height);
}

[data-sonner-toast] > * {
	transition: opacity 400ms;
}

[data-sonner-toast][data-expanded='false'][data-front='false'][data-styled='true'] > * {
	opacity: 0;
}

[data-sonner-toast][data-visible='false'] {
	opacity: 0;
	pointer-events: none;
}

[data-sonner-toast][data-mounted='true'][data-expanded='true'] {
	--y: translateY(calc(var(--lift) * var(--offset)));
	height: var(--initial-height);
}

[data-sonner-toast][data-removed='true'][data-front='true'][data-swipe-out='false'] {
	--y: translateY(calc(var(--lift) * -100%));
	opacity: 0;
}

[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='true'] {
	--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));
	opacity: 0;
}

[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='false'] {
	--y: translateY(40%);
	opacity: 0;
	transition:
		transform 500ms,
		opacity 200ms;
}

/* Bump up the height to make sure hover state doesn't get set to false */
[data-sonner-toast][data-removed='true'][data-front='false']:before {
	height: calc(var(--initial-height) + 20%);
}

[data-sonner-toast][data-swiping='true'] {
	transform: var(--y) translateY(var(--swipe-amount, 0px));
	transition: none;
}

[data-sonner-toast][data-swipe-out='true'][data-y-position='bottom'],
[data-sonner-toast][data-swipe-out='true'][data-y-position='top'] {
	animation: swipe-out 200ms ease-out forwards;
}

@keyframes swipe-out {
	from {
		transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));
		opacity: 1;
	}

	to {
		transform: translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));
		opacity: 0;
	}
}

@keyframes sonner-fade-in {
	0% {
		opacity: 0;
		transform: scale(0.8);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes sonner-fade-out {
	0% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0.8);
	}
}

@keyframes sonner-spin {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0.15;
	}
}

@media (prefers-reduced-motion) {
	[data-sonner-toast],
	[data-sonner-toast] > *,
	.sonner-loading-bar {
		transition: none !important;
		animation: none !important;
	}
}

.sonner-loader {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transform-origin: center;
	transition:
		opacity 200ms,
		transform 200ms;
}

.sonner-loader[data-visible='false'] {
	opacity: 0;
	transform: scale(0.8) translate(-50%, -50%);
}


	`,
})
export class BrnToasterComponent implements OnDestroy, OnInit {
	toasterService = inject(BrnToasterService);

	@ViewChild('listRef') listRef!: ElementRef<HTMLOListElement>;

	_class = input('');
	style = input({});
	invert = input(false);
	theme = input<'light' | 'dark' | 'system'>('light');
	position = input<Position>('bottom-right');
	hotkey = input(['altKey', 'KeyT']);
	richColors = input(false);
	expand = input(false);
	visibleToasts = input(VISIBLE_TOASTS_AMOUNT);
	closeButton = input(false);
	toastOptions = input<ToastOptions>({});
	duration = input(4000);
	gap = input<number>(); // @todo: figure out gap bug
	offset = input<string | number>();
	dir = input<'rtl' | 'ltr' | 'auto'>();
	loadingIcon = input<string>(); // @todo: implement icon
	containerAriaLabel = input<string>();

	toasts = this.toasterService.toasts;
	heights = this.toasterService.heights;
	expanded = signal(false);
	interacting = signal(false);
	isFocusWithinRef = signal(false);
	lastFocusedElementRef = signal<HTMLElement | null>(null);

	possiblePositions = computed(() => {
		return Array.from(
			new Set(
				[
					this.position(),
					...this.toasts()
						.filter((toast) => toast.position)
						.map((toast) => toast.position),
				].filter(Boolean),
			),
		) as Position[];
	});

	actualOffset = computed(() => {
		return (typeof this.offset() === 'number' ? `${this.offset()}px` : this.offset() || VIEWPORT_OFFSET) as string;
	});

	toasterStyles = computed(() => {
		return {
			'--front-toast-height': `${this.heights()[0]?.height}px`,
			'--offset': this.actualOffset(),
			'--width': `${TOAST_WIDTH}px`,
			'--gap': `${GAP}px`,
			...this.style(),
		};
	});

	hotkeyLabel = computed(() => this.hotkey().join('+').replace(/Key/g, '').replace(/Digit/g, ''));

	// @todo: Remove this function. (Restructure toasts?)
	tempFunc(index: number, possiblePosition: string) {
		return this.toasts().filter((toast) => (!toast.position && index === 0) || toast.position === possiblePosition);
	}

	handleBlur(_event: FocusEvent) {
		const event = _event as OListFocusEvent;
		if (this.isFocusWithinRef() && !event.currentTarget.contains(event.relatedTarget as HTMLElement)) {
			this.isFocusWithinRef.set(false);
			if (this.lastFocusedElementRef()) {
				this.lastFocusedElementRef()!.focus({ preventScroll: true });
				this.lastFocusedElementRef.set(null);
			}
		}
	}

	handleFocus(_event: FocusEvent) {
		const event = _event as OListFocusEvent;
		if (!this.isFocusWithinRef()) {
			this.isFocusWithinRef.set(true);
			this.lastFocusedElementRef.set(event.relatedTarget as HTMLElement);
		}
	}

	handleMouseLeave() {
		if (!this.interacting()) {
			this.expanded.set(false);
		}
	}

	reset() {
		this.toasts.set([]);
		this.heights.set([]);
	}

	handleKeydown = (event: KeyboardEvent) => {
		const isHotkeyPressed = this.hotkey().every(
			(key) =>
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(event as any)[key] || event.code === key,
		);

		if (isHotkeyPressed) {
			this.expanded.set(true);
			this.listRef?.nativeElement.focus();
		}

		if (
			event.code === 'Escape' &&
			(document.activeElement === this.listRef?.nativeElement ||
				this.listRef?.nativeElement?.contains(document.activeElement))
		) {
			this.expanded.set(false);
		}
	};

	ngOnInit(): void {
		this.reset();
		document.addEventListener('keydown', this.handleKeydown);
	}

	ngOnDestroy() {
		if (this.listRef.nativeElement && this.lastFocusedElementRef()) {
			this.lastFocusedElementRef()!.focus({ preventScroll: true });
			this.lastFocusedElementRef.set(null);
			this.isFocusWithinRef.set(false);
			document.removeEventListener('keydown', this.handleKeydown);
		}
	}
}
