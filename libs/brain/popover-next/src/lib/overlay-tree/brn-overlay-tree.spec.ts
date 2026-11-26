import { TestBed } from '@angular/core/testing';
import { type BrnOutsidePress, BrnOverlayTree } from './brn-overlay-tree';

interface TestOverlay {
	popup: HTMLElement;
	trigger: HTMLElement;
	outside: BrnOutsidePress[];
	escapes: number;
	unregister: () => void;
}

function element(tag = 'div', parent: Element = document.body): HTMLElement {
	const node = document.createElement(tag);
	parent.append(node);
	return node;
}

function overlay(tree: BrnOverlayTree, log: string[] = [], name = 'overlay'): TestOverlay {
	const popup = element();
	const trigger = element('button');
	const result: TestOverlay = { popup, trigger, outside: [], escapes: 0, unregister: () => undefined };
	result.unregister = tree.register({
		elements: () => [popup, trigger],
		onOutsidePress: (press) => {
			result.outside.push(press);
			log.push(`${name} outside`);
		},
		onEscape: () => {
			result.escapes++;
			log.push(`${name} escape`);
		},
	});
	return result;
}

function press(target: Element, end: Element = target): void {
	target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
	end.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, detail: 1 }));
}

function escape(target: Element = document.body, init: KeyboardEventInit = {}): void {
	target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, ...init }));
}

describe('BrnOverlayTree', () => {
	let tree: BrnOverlayTree;

	beforeEach(() => {
		document.body.innerHTML = '';
		tree = TestBed.inject(BrnOverlayTree);
	});

	describe('outside presses', () => {
		it('reports a press outside, and not a press on the popup or its trigger', () => {
			const a = overlay(tree);
			press(a.popup);
			press(a.trigger);
			expect(a.outside).toEqual([]);
			press(element());
			expect(a.outside).toHaveLength(1);
		});

		it('base-ui root 37-38: closes on the click, not on pointer down', () => {
			const a = overlay(tree);
			element().dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
			expect(a.outside).toEqual([]);
		});

		it('base-ui root 70: a press that starts inside and ends outside is not outside', () => {
			const a = overlay(tree);
			press(a.popup, element());
			expect(a.outside).toEqual([]);
		});

		it('base-ui root 74-76: a press in an overlay opened later is inside; one opened earlier is outside', () => {
			const log: string[] = [];
			const first = overlay(tree, log, 'first');
			const later = overlay(tree, log, 'later');
			press(later.popup);
			expect(log).toEqual([]);
			press(first.popup);
			expect(log).toEqual(['later outside']);
		});

		it('ng-primitives 15: a press outside a nested pair closes the inner one first', () => {
			const log: string[] = [];
			overlay(tree, log, 'parent');
			overlay(tree, log, 'child');
			press(element());
			expect(log).toEqual(['child outside', 'parent outside']);
		});

		it('base-ui detached 13: a keyboard click outside, with no pointer down, is outside', () => {
			const a = overlay(tree);
			element('button').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
			expect(a.outside).toHaveLength(1);
		});

		it('ng-primitives 13: reports whether the press landed on something focusable', () => {
			const a = overlay(tree);
			const button = element('button');
			press(button.appendChild(document.createElement('span')));
			press(element());
			expect(a.outside.map((p) => p.onFocusable)).toEqual([true, false]);
		});

		it('base-ui root 39-40, ng-primitives 20: presses inside shadow content count by their real target', () => {
			const host = element();
			const shadow = host.attachShadow({ mode: 'open' });
			const popup = document.createElement('div');
			const outsideButton = document.createElement('button');
			shadow.append(popup, outsideButton);
			const outside: BrnOutsidePress[] = [];
			tree.register({ elements: () => [popup], onOutsidePress: (p) => outside.push(p), onEscape: () => undefined });
			press(popup);
			expect(outside).toEqual([]);
			press(outsideButton);
			expect(outside).toHaveLength(1);
			expect(outside[0]).toMatchObject({ target: outsideButton, onFocusable: true });
		});
	});

	describe('Escape', () => {
		it('goes only to the overlay on top, then to the one below once it is gone', () => {
			const log: string[] = [];
			overlay(tree, log, 'first');
			const later = overlay(tree, log, 'later');
			escape();
			later.unregister();
			escape();
			expect(log).toEqual(['later escape', 'first escape']);
		});

		it('base-ui conformance 2-3: an IME Escape is ignored', () => {
			const a = overlay(tree);
			escape(document.body, { isComposing: true });
			escape(document.body, { keyCode: 229 });
			expect(a.escapes).toBe(0);
		});

		it('base-ui conformance 1: Escape still works after a composition that never ended', () => {
			const a = overlay(tree);
			document.body.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
			escape();
			expect(a.escapes).toBe(1);
		});

		it('ng-primitives 6-8: a control inside can claim Escape, or decline it', () => {
			const a = overlay(tree);
			const input = element('input', a.popup);
			let claim = true;
			tree.claimEscape({ element: input, handles: () => claim });
			escape(input);
			expect(a.escapes).toBe(0);
			claim = false;
			escape(input);
			expect(a.escapes).toBe(1);
		});

		it('ignores other keys and does nothing with no overlay open', () => {
			const a = overlay(tree);
			document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			a.unregister();
			escape();
			expect(a.escapes).toBe(0);
		});
	});

	describe('listeners', () => {
		it('angular 26: after the last overlay leaves, presses and keys reach nobody', () => {
			const a = overlay(tree);
			a.unregister();
			const b = overlay(tree);
			b.unregister();
			press(element());
			escape();
			expect([a.outside, b.outside, a.escapes, b.escapes]).toEqual([[], [], 0, 0]);
		});
	});
});
