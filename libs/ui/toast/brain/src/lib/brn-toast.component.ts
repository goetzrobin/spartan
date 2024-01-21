import { NgComponentOutlet, NgIf } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	Type,
	ViewChild,
	computed,
	effect,
	inject,
	input,
	signal,
} from '@angular/core';
import { Position, ToastClassnames, ToastT } from './brn-toast.types';
import { BrnToasterService } from './brn-toaster.service';

const TIME_BEFORE_UNMOUNT = 200;
const SWIPE_THRESHOLD = 20;

@Component({
	selector: 'brn-toast',
	standalone: true,
	templateUrl: './brn-toast.component.html',
	imports: [NgComponentOutlet, NgIf],
})
export class BrnToastComponent implements AfterViewInit, OnInit {
	defaultClasses: ToastClassnames = {
		toast: '',
		title: '',
		description: '',
		loader: '',
		closeButton: '',
		cancelButton: '',
		actionButton: '',
		warning: '',
		error: '',
		success: '',
		default: '',
		info: '',
	};

	toasterService = inject(BrnToasterService);

	@ViewChild('toastRef') toastRef!: ElementRef<HTMLLIElement>;

	position = input.required<Position>();
	expandByDefault = input.required<boolean>();
	unstyled = input.required<boolean>();
	closeButton = input.required<boolean>();
	styles = input.required<Record<string, unknown>>();
	visibleToasts = input.required<number>();
	cancelButtonStyle = input.required<string>();
	actionButtonStyle = input.required<string>();
	descriptionClass = input.required<string>();
	index = input.required<number>();
	gap = input.required<number>();
	expanded = input.required<boolean>();
	interacting = input.required<boolean>();
	duration = input.required<number>();
	toast = input.required<ToastT>();
	_classes = input<ToastClassnames>({}, { alias: 'classes' });
	_invert = input.required<boolean>({ alias: 'invert' });

	offsetBeforeRemove = signal(0);
	mounted = signal(false);
	removed = signal(false);
	swiping = signal(false);
	swipeOut = signal(false);
	dismissible = signal(true);
	initialHeight = signal(0);
	pointerStartRef = signal<{ x: number; y: number } | null>(null);

	remainingTime = 0;
	closeTimerStartTimeRef = 0;
	lastCloseTimerStartTimeRef = 0;
	timeoutId!: ReturnType<typeof setTimeout>;

	invert = computed(() => this.toast().invert || this._invert());
	disabled = computed(() => this.toastType() === 'loading');
	classes = computed(() => ({ ...this.defaultClasses, ...this._classes() }));
	isFront = computed(() => this.index() === 0);
	isVisible = computed(() => this.index() + 1 <= this.visibleToasts());
	toastType = computed(() => this.toast().type ?? 'default');
	toastClass = computed(() => this.toast().class || '');
	toastDescriptionClass = computed(() => this.toast().descriptionClass || '');
	coords = computed(() => this.position().split('-'));
	isExpanded = computed(() => Boolean(this.expanded() || (this.expandByDefault() && this.mounted())));
	toastTitleIsComponent = computed(() => typeof this.toast().title !== 'string');
	// @todo: Figure out type narrowing signals
	toastTitleAsComponent = computed(() => this.toast().title as Type<any>);
	toastDescriptionIsComponent = computed(() => typeof this.toast().description !== 'string');
	offset = computed(() => this.heightIndex() * this.gap() + this.toastsHeightBefore());

	itemStyle = computed(() => {
		return {
			'--index': this.index(),
			'--toasts-before': this.index(),
			'--z-index': this.toasterService.toasts().length - this.index(),
			'--offset': `${this.removed() ? this.offsetBeforeRemove() : this.offset()}px`,
			'--initial-height': this.expandByDefault() ? 'auto' : `${this.initialHeight()}px`,
			...this.styles(),
			...this.toast().style,
		};
	});

	toastsHeightBefore = computed(() => {
		return this.toasterService.heights().reduce((prev, curr, reducerIndex) => {
			// Calculate offset up until current  toast
			if (reducerIndex >= this.heightIndex()) {
				return prev;
			}

			return prev + curr.height;
		}, 0);
	});

	toastClasses = computed(() => {
		return this.cn(
			this.toastClass(),
			this.classes()?.toast,
			this.toast()?.classes?.toast,
			this.classes()?.[this.toastType()],
			this.toast()?.classes?.[this.toastType()],
		);
	});

	titleClasses = computed(() => {
		return this.cn(this.classes()?.title, this.toast()?.classes?.title);
	});

	descriptionClasses = computed(() => {
		return this.cn(
			this.descriptionClass(),
			this.toastDescriptionClass(),
			this.classes()?.description,
			this.toast().classes?.description,
		);
	});

	closeButtonClasses = computed(() => {
		return this.cn(this.classes()?.closeButton, this.toast()?.classes?.closeButton);
	});

	cancelButtonClasses = computed(() => {
		return this.cn(this.classes()?.cancelButton, this.toast()?.classes?.cancelButton);
	});

	actionButtonClasses = computed(() => {
		return this.cn(this.classes()?.actionButton, this.toast()?.classes?.actionButton);
	});

	heightIndex = computed(() => {
		return this.toasterService.heights().findIndex((height) => height.toastId === this.toast().id) || 0;
	});

	isLoadingOrInfiniteDuration = computed(() => {
		return this.toastType() === 'loading' || this.toast().duration === Number.POSITIVE_INFINITY;
	});

	pauseTimer() {
		if (this.lastCloseTimerStartTimeRef < this.closeTimerStartTimeRef) {
			// Get the elapsed time since the timer started
			const elapsedTime = new Date().getTime() - this.closeTimerStartTimeRef;
			this.remainingTime = this.remainingTime - elapsedTime;
		}

		this.lastCloseTimerStartTimeRef = new Date().getTime();
	}

	startTimer() {
		this.closeTimerStartTimeRef = new Date().getTime();
		// Let the toast know it has started
		this.timeoutId = setTimeout(() => {
			this.toast().onAutoClose?.(this.toast());
			this.deleteToast();
		}, this.remainingTime);
	}

	deleteToast() {
		this.removed.set(true);
		// Save the offset for the exit swipe animation
		this.offsetBeforeRemove.set(this.offset());

		this.toasterService.heights.update((prev) => prev.filter((height) => height.toastId !== this.toast().id));

		setTimeout(() => {
			this.dismiss(this.toast().id);
		}, TIME_BEFORE_UNMOUNT);
	}

	dismiss(id?: number | string) {
		if (id === undefined) {
			this.toasterService.toasts.set([]);
			return;
		}
		this.toasterService.toasts.update((prev) => prev.filter((toast) => toast.id !== id));

		return id;
	}

	onPointerDown(event: PointerEvent) {
		if (this.disabled()) {
			return;
		}

		this.offsetBeforeRemove.set(this.offset());
		const target = event.target as HTMLElement;
		// Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
		target.setPointerCapture(event.pointerId);
		if (target.tagName === 'BUTTON') {
			return;
		}
		this.swiping.set(true);
		this.pointerStartRef.set({ x: event.clientX, y: event.clientY });
	}

	onPointerUp() {
		if (this.swipeOut()) {
			return;
		}

		this.pointerStartRef.set(null);
		const swipeAmount = Number(
			this.toastRef.nativeElement.style.getPropertyValue('--swipe-amount').replace('px', '') || 0,
		);

		// Remove only if treshold is met
		if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD) {
			this.offsetBeforeRemove.set(this.offset());
			this.toast().onDismiss?.(this.toast());
			this.deleteToast();
			this.swipeOut.set(true);
			return;
		}

		this.toastRef.nativeElement.style.setProperty('--swipe-amount', '0px');
		this.swiping.set(false);
	}

	onPointerMove(event: PointerEvent) {
		if (!this.pointerStartRef()) {
			return;
		}

		const yPosition = event.clientY - this.pointerStartRef()!.y;
		const xPosition = event.clientX - this.pointerStartRef()!.x;

		const clamp = this.coords()[0] === 'top' ? Math.min : Math.max;
		const clampedY = clamp(0, yPosition);
		const swipeStartThreshold = event.pointerType === 'touch' ? 10 : 2;
		const isAllowedToSwipe = Math.abs(clampedY) > swipeStartThreshold;

		if (isAllowedToSwipe) {
			this.toastRef.nativeElement.style.setProperty('--swipe-amount', `${yPosition}px`);
		} else if (Math.abs(xPosition) > swipeStartThreshold) {
			// User is swiping in wrong direction so we disable swipe gesture
			// for the current pointer down interaction
			this.pointerStartRef.set(null);
		}
	}

	closeToast() {
		if (!this.disabled()) {
			this.deleteToast();
			this.toast().onDismiss?.(this.toast());
		}
	}

	cancelToast() {
		this.deleteToast();
		if (this.toast().cancel?.onClick) {
			this.toast().cancel!.onClick!();
		}
	}

	actionToast(event: MouseEvent) {
		this.toast().action?.onClick(event);
		if (event.defaultPrevented) return;
		this.deleteToast();
	}

	cn(...classes: (string | undefined)[]) {
		return classes.filter(Boolean).join(' ');
	}

	e = effect((onCleanup) => {
		if (!this.isLoadingOrInfiniteDuration()) {
			if (this.expanded() || this.interacting()) {
				this.pauseTimer();
			} else {
				this.startTimer();
			}
		}

		onCleanup(() => {
			clearTimeout(this.timeoutId);
		});
	});

	ngOnInit(): void {
		this.remainingTime = this.toast().duration || this.duration();
	}

	ngAfterViewInit(): void {
		this.mounted.set(true);

		const toastNode = this.toastRef.nativeElement;
		const originalHeight = toastNode.style.height;
		toastNode.style.height = 'auto';
		const newHeight = toastNode.getBoundingClientRect().height;
		toastNode.style.height = originalHeight;

		this.initialHeight.set(newHeight);

		const alreadyExists = this.toasterService.heights().find((height) => height.toastId === this.toast().id);

		if (!alreadyExists) {
			this.toasterService.heights.set([
				{ toastId: this.toast().id, height: newHeight },
				...this.toasterService.heights(),
			]);
		} else {
			this.toasterService.heights.set(
				this.toasterService
					.heights()
					.map((height) => (height.toastId === this.toast().id ? { ...height, height: newHeight } : height)),
			);
		}
	}
}
