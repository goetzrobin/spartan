import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';

export interface BrnOutsidePress {
	target: EventTarget | null;
	onFocusable: boolean;
}

export interface BrnOverlayRegistration {
	elements: () => readonly Element[];
	onOutsidePress: (press: BrnOutsidePress) => void;
	onEscape: () => void;
}

export interface BrnEscapeClaim {
	element: Element;
	handles: (event: KeyboardEvent) => boolean;
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
const IME_KEY_CODE = 229;

function pathElements(event: Event): Element[] {
	return event.composedPath().filter((node): node is Element => node instanceof Element);
}

function contains(overlay: BrnOverlayRegistration, path: readonly Element[]): boolean {
	const elements = overlay.elements();
	return path.some((node) => elements.includes(node));
}

@Injectable({ providedIn: 'root' })
export class BrnOverlayTree {
	private readonly _document = inject(DOCUMENT);
	private readonly _zone = inject(NgZone);
	private readonly _stack: BrnOverlayRegistration[] = [];
	private readonly _claims = new Set<BrnEscapeClaim>();
	private _pressStart: Element[] | null = null;

	private readonly _onPointerDown = (event: Event) => {
		this._pressStart = pathElements(event);
	};

	private readonly _onClick = (event: MouseEvent) => {
		const start = this._pressStart;
		this._pressStart = null;
		const path = pathElements(event);
		const press: BrnOutsidePress = {
			target: path[0] ?? null,
			onFocusable: path.some((node) => node.matches(FOCUSABLE)),
		};
		const outside = this._stack.filter((_, index) => {
			const family = this._stack.slice(index);
			const inFamily = (nodes: readonly Element[]) => family.some((member) => contains(member, nodes));
			return !inFamily(path) && !(start && inFamily(start));
		});
		for (const overlay of outside.reverse()) {
			overlay.onOutsidePress(press);
		}
	};

	private readonly _onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || event.isComposing || event.keyCode === IME_KEY_CODE) {
			return;
		}
		const top = this._stack.at(-1);
		if (!top) {
			return;
		}
		const path = pathElements(event);
		const claimed = [...this._claims].some((claim) => path.includes(claim.element) && claim.handles(event));
		if (!claimed) {
			top.onEscape();
		}
	};

	register(overlay: BrnOverlayRegistration): () => void {
		if (this._stack.length === 0) {
			this._listen();
		}
		this._stack.push(overlay);
		return () => {
			this._unregister(overlay);
		};
	}

	claimEscape(claim: BrnEscapeClaim): () => void {
		this._claims.add(claim);
		return () => this._claims.delete(claim);
	}

	private _unregister(overlay: BrnOverlayRegistration): void {
		const index = this._stack.indexOf(overlay);
		if (index === -1) {
			return;
		}
		this._stack.splice(index, 1);
		if (this._stack.length === 0) {
			this._unlisten();
		}
	}

	private _listen(): void {
		this._zone.runOutsideAngular(() => {
			this._document.addEventListener('pointerdown', this._onPointerDown, true);
			this._document.addEventListener('click', this._onClick, true);
			this._document.addEventListener('keydown', this._onKeyDown);
		});
	}

	private _unlisten(): void {
		this._pressStart = null;
		this._document.removeEventListener('pointerdown', this._onPointerDown, true);
		this._document.removeEventListener('click', this._onClick, true);
		this._document.removeEventListener('keydown', this._onKeyDown);
	}
}
