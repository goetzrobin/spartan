import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, input, signal } from '@angular/core';
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

	toasterStyles = computed(() => {
		return {
			'--front-toast-height': `${this.heights()[0]?.height}px`,
			'--offset': typeof this.offset() === 'number' ? `${this.offset()}px` : this.offset() || VIEWPORT_OFFSET,
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
