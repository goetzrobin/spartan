import {
	brnPopoverActiveTrigger,
	brnPopoverInstant,
	brnPopoverLabelledBy,
	brnPopoverMounted,
} from './brn-popover-derived';
import {
	type BrnPopoverContext,
	type BrnPopoverEvent,
	type BrnPopoverInput,
	type BrnPopoverState,
	type BrnPopoverStep,
	type BrnTriggerId,
	toBrnTriggerId,
} from './brn-popover-model';
import { initialBrnPopoverState, nextBrnPopoverState } from './brn-popover-transition';

const T1 = toBrnTriggerId('t1');
const T2 = toBrnTriggerId('t2');

function context(overrides: Partial<BrnPopoverContext> = {}): BrnPopoverContext {
	return {
		controlled: false,
		triggerId: null,
		modal: false,
		closePart: false,
		keepMounted: false,
		scrollBehavior: 'reposition',
		disabledTriggers: new Set(),
		...overrides,
	};
}

function press(trigger: BrnTriggerId = T1, input: BrnPopoverInput = 'mouse'): BrnPopoverEvent {
	return { type: 'trigger-press', trigger, input };
}

function run(events: BrnPopoverEvent[], ctx = context(), start = initialBrnPopoverState(false, ctx)) {
	let state: BrnPopoverState = start;
	const steps: BrnPopoverStep[] = [];
	for (const event of events) {
		const step = nextBrnPopoverState(state, event, ctx);
		steps.push(step);
		state = step.state;
	}
	return { state, steps, commands: steps.flatMap((step) => step.commands.map((command) => command.type)) };
}

function lastStep(steps: BrnPopoverStep[]): BrnPopoverStep {
	const step = steps.at(-1);
	if (!step) throw new Error('no steps');
	return step;
}

const openedByT1 = (ctx = context()) => run([press(T1)], ctx).state;

describe('BrnPopover model', () => {
	describe('base-ui root', () => {
		it('1-2: a controlled close before the first render finishes waits for the exit, then completes once', () => {
			const ctx = context({ controlled: true });
			const { state, steps } = run(
				[{ type: 'open-input', open: false }, { type: 'exit-finished' }],
				ctx,
				initialBrnPopoverState(true, ctx),
			);
			expect(state.kind).toBe('closed');
			expect(steps[0].commands).not.toContainEqual({ type: 'emit-change-complete', open: false });
			expect(lastStep(steps).commands).toContainEqual({ type: 'emit-change-complete', open: false });
		});

		it('3: a controlled open applied then closed at once unmounts and completes', () => {
			const ctx = context({ controlled: true });
			const { state, steps } = run(
				[press(), { type: 'open-input', open: true }, { type: 'open-input', open: false }, { type: 'exit-finished' }],
				ctx,
			);
			expect(steps[0].request).toEqual({ open: true, reason: 'trigger-press', trigger: T1 });
			expect(steps[0].state.kind).toBe('closed');
			expect(steps[1].state).toMatchObject({ kind: 'open', owner: { kind: 'trigger', trigger: T1 } });
			expect(state.kind).toBe('closed');
			expect(lastStep(steps).commands).toContainEqual({ type: 'unmount-view' });
		});

		it('7: closes when the trigger is pressed twice', () => {
			const { state, steps } = run([press(), press()]);
			expect(state).toMatchObject({ kind: 'closing', reason: 'trigger-press' });
			expect(lastStep(steps).request).toEqual({ open: false, reason: 'trigger-press', trigger: T1 });
		});

		it('8: enters the overlay tree on every open and leaves it on every close', () => {
			const { commands } = run([
				press(),
				{ type: 'escape-key' },
				{ type: 'exit-finished' },
				press(),
				{ type: 'outside-press', onFocusable: false },
			]);
			expect(commands.filter((type) => type === 'enter-tree')).toHaveLength(2);
			expect(commands.filter((type) => type === 'leave-tree')).toHaveLength(2);
		});

		it('9: a controlled popover reports an open and a close request', () => {
			const ctx = context({ controlled: true });
			const { steps } = run([press(), { type: 'open-input', open: true }, press()], ctx);
			expect(steps.map((step) => step.request?.open)).toEqual([true, undefined, false]);
		});

		it('10: a held close keeps the view until a later normal close unmounts it', () => {
			const { state, steps } = run([
				press(),
				press(),
				{ type: 'hold' },
				{ type: 'exit-finished' },
				{ type: 'program-open', trigger: null },
				press(),
				{ type: 'exit-finished' },
			]);
			expect(steps[3].state).toMatchObject({ kind: 'closing', held: true });
			expect(brnPopoverActiveTrigger(steps[3].state)).toBeNull();
			expect(state.kind).toBe('closed');
			expect(lastStep(steps).commands).toContainEqual({ type: 'unmount-view' });
		});

		it('16: defaultOpen stays uncontrolled, so a trigger press closes it', () => {
			const ctx = context();
			const { state } = run([press()], ctx, initialBrnPopoverState(true, ctx));
			expect(state).toMatchObject({ kind: 'closing', reason: 'trigger-press' });
		});

		it('21: cancelling a close press is the runner dropping the step; the state names the request first', () => {
			const opened = openedByT1();
			const step = nextBrnPopoverState(opened, { type: 'close-press' }, context());
			expect(step.request).toEqual({ open: false, reason: 'close-press', trigger: T1 });
			expect(opened).toMatchObject({ kind: 'open', owner: { trigger: T1 } });
		});

		it('23: with keepMounted, a close press returns focus to the trigger and hides the view', () => {
			const ctx = context({ keepMounted: true });
			const { steps } = run([press(), { type: 'close-press' }, { type: 'exit-finished' }], ctx);
			expect(steps[1].commands).toContainEqual({ type: 'focus', target: 'trigger', trigger: T1, input: 'mouse' });
			expect(steps[2].commands).toContainEqual({ type: 'hide-view' });
		});

		it('24: reopening a kept view shows it before moving focus into it', () => {
			const ctx = context({ keepMounted: true });
			const { steps } = run(
				[press(), { type: 'focus-guard', guard: 'after-popup' }, { type: 'exit-finished' }, press()],
				ctx,
			);
			const types = lastStep(steps).commands.map((command) => command.type);
			expect(types.indexOf('show-view')).toBeGreaterThanOrEqual(0);
			expect(types.indexOf('show-view')).toBeLessThan(types.indexOf('focus'));
			expect(types).not.toContain('mount-view');
		});

		it('27, 32, 35: tabbing out after the popup closes it and focuses the element after the trigger', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'focus-guard', guard: 'after-popup' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'focus-out' });
			expect(step.commands).toContainEqual({ type: 'focus', target: 'after-trigger', trigger: T1, input: 'mouse' });
		});

		it('30, 33, 36: Shift+Tab from the popup focuses the trigger and keeps it open; Tab goes back in', () => {
			const { steps, state } = run([
				press(),
				{ type: 'focus-guard', guard: 'before-popup' },
				{ type: 'focus-guard', guard: 'after-trigger' },
			]);
			expect(state.kind).toBe('open');
			expect(steps[1].commands).toContainEqual({ type: 'focus', target: 'trigger', trigger: T1, input: 'keyboard' });
			expect(steps[2].commands).toContainEqual({
				type: 'focus',
				target: 'popup-initial',
				trigger: null,
				input: 'keyboard',
			});
		});

		it('31, 34: Shift+Tab from the trigger closes it and focuses the element before the trigger', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'focus-guard', guard: 'before-trigger' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'focus-out' });
			expect(step.commands).toContainEqual({ type: 'focus', target: 'before-trigger', trigger: T1, input: 'mouse' });
		});

		it('41: focus leaving a non-modal popup closes it without moving focus', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'focus-out' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'focus-out' });
			expect(step.commands.some((command) => command.type === 'focus')).toBe(false);
		});

		it('43: during the exit, a guard after the trigger does not reopen or focus the popup', () => {
			const { steps } = run([press(), { type: 'escape-key' }, { type: 'focus-guard', guard: 'after-trigger' }]);
			expect(lastStep(steps).state.kind).toBe('closing');
			expect(lastStep(steps).commands).toEqual([]);
		});

		it('47, 55: unmount after a held close removes the view and completes once', () => {
			const { steps } = run([
				press(),
				{ type: 'program-close' },
				{ type: 'hold' },
				{ type: 'unmount' },
				{ type: 'unmount' },
			]);
			expect(steps[3].commands).toEqual([
				{ type: 'stop-positioning' },
				{ type: 'unmount-view' },
				{ type: 'emit-change-complete', open: false },
			]);
			expect(steps[4].commands).toEqual([]);
		});

		it('48: unmount after the automatic unmount does nothing', () => {
			const { steps } = run([press(), press(), { type: 'exit-finished' }, { type: 'unmount' }]);
			expect(lastStep(steps).commands).toEqual([]);
		});

		it('50, 53: unmount while open is ignored and leaves no flag behind', () => {
			const { steps, state } = run([
				press(),
				{ type: 'enter-started' },
				{ type: 'unmount' },
				press(),
				{ type: 'exit-finished' },
			]);
			expect(steps[2].state).toEqual(steps[1].state);
			expect(state.kind).toBe('closed');
		});

		it('52: a controlled close with a hold, then unmount', () => {
			const ctx = context({ controlled: true });
			const { steps, state } = run(
				[{ type: 'program-close' }, { type: 'open-input', open: false }, { type: 'hold' }, { type: 'unmount' }],
				ctx,
				initialBrnPopoverState(true, ctx),
			);
			expect(steps[0].request).toEqual({ open: false, reason: 'imperative-action', trigger: null });
			expect(steps[0].state.kind).toBe('open');
			expect(state.kind).toBe('closed');
		});

		it('54: unmount and a reopen, then a normal close completes a second time', () => {
			const { commands } = run([
				press(),
				press(),
				{ type: 'hold' },
				{ type: 'unmount' },
				{ type: 'program-open', trigger: null },
				press(),
				{ type: 'exit-finished' },
			]);
			expect(commands.filter((type) => type === 'emit-change-complete')).toHaveLength(2);
		});

		it('56: close() closes with reason imperative-action', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'program-close' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'imperative-action' });
		});

		it('57: after a controlled close and unmount, a later open by the parent has no active trigger', () => {
			const ctx = context({ controlled: true });
			const { state } = run(
				[
					press(),
					{ type: 'open-input', open: true },
					{ type: 'open-input', open: false },
					{ type: 'unmount' },
					{ type: 'open-input', open: true },
				],
				ctx,
			);
			expect(state).toMatchObject({ kind: 'open', owner: { kind: 'program', trigger: null } });
			expect(brnPopoverActiveTrigger(state)).toBeNull();
		});

		it('61: modal without a Close part: tabbing out closes', () => {
			const step = nextBrnPopoverState(
				openedByT1(context({ modal: true })),
				{ type: 'focus-guard', guard: 'after-popup' },
				context({ modal: true }),
			);
			expect(step.state.kind).toBe('closing');
		});

		it('60: modal with a Close part traps focus, so the guard does not close', () => {
			const ctx = context({ modal: true, closePart: true });
			const step = nextBrnPopoverState(openedByT1(ctx), { type: 'focus-guard', guard: 'after-popup' }, ctx);
			expect(step.state.kind).toBe('open');
		});

		it('69: a popover opened by code returns focus to what was focused before it opened', () => {
			const { steps } = run([{ type: 'program-open', trigger: null }, { type: 'close-press' }]);
			expect(lastStep(steps).commands).toContainEqual({
				type: 'focus',
				target: 'before-open',
				trigger: null,
				input: null,
			});
		});

		it('77: a hold belongs to its close: a later close without one unmounts', () => {
			const { state, steps } = run([
				press(),
				{ type: 'program-close' },
				{ type: 'hold' },
				{ type: 'program-open', trigger: null },
				{ type: 'program-close' },
				{ type: 'exit-finished' },
			]);
			expect(state.kind).toBe('closed');
			expect(lastStep(steps).commands).toContainEqual({ type: 'unmount-view' });
		});

		it('78: destroying a held popover removes the view; the next instance starts open with defaultOpen', () => {
			const { state, steps } = run([press(), press(), { type: 'hold' }, { type: 'destroyed' }]);
			expect(state.kind).toBe('destroyed');
			expect(lastStep(steps).commands).toContainEqual({ type: 'unmount-view' });
			expect(initialBrnPopoverState(true, context()).kind).toBe('open');
		});

		it('79: an outside press reports the active trigger', () => {
			const opened = run([press(T2)]).state;
			const step = nextBrnPopoverState(opened, { type: 'outside-press', onFocusable: false }, context());
			expect(step.request).toEqual({ open: false, reason: 'outside-press', trigger: T2 });
		});

		it('80-81: a close without a reason is a dismissal; the next open has no instant', () => {
			const { steps, state } = run([press(), { type: 'program-close' }, { type: 'exit-finished' }, press()]);
			expect(brnPopoverInstant(steps[1].state)).toBe('dismiss');
			expect(brnPopoverInstant(steps[2].state)).toBe('dismiss');
			expect(brnPopoverInstant(state)).toBeNull();
		});

		it('83: after a controlled open without a trigger, pressing a trigger asks to close', () => {
			const ctx = context({ controlled: true });
			const { steps } = run([{ type: 'open-input', open: true }, press()], ctx);
			expect(lastStep(steps).request).toEqual({ open: false, reason: 'trigger-press', trigger: null });
		});

		it('84: an open by code after a trigger closed it returns focus to that trigger when nothing else had focus', () => {
			const { steps } = run([
				press(),
				press(),
				{ type: 'exit-finished' },
				{ type: 'program-open', trigger: null },
				{ type: 'escape-key' },
			]);
			expect(lastStep(steps).commands).toContainEqual({
				type: 'focus',
				target: 'before-open',
				trigger: T1,
				input: null,
			});
		});
	});

	describe('base-ui detached triggers', () => {
		it('9: pressing another trigger moves the popup and reports the new trigger', () => {
			const { steps, state } = run([press(T1), press(T2)]);
			expect(state).toMatchObject({ kind: 'open', owner: { trigger: T2 }, switchedFrom: T1 });
			expect(lastStep(steps).request).toEqual({ open: true, reason: 'trigger-press', trigger: T2 });
			expect(brnPopoverActiveTrigger(state)).toBe(T2);
			expect(nextBrnPopoverState(state, press(T2), context()).state.kind).toBe('closing');
		});

		it('14: opened by the parent with a triggerId from body focus, focus returns to that trigger', () => {
			const ctx = context({ controlled: true, triggerId: T2 });
			const { steps } = run(
				[{ type: 'open-input', open: true }, { type: 'close-press' }, { type: 'open-input', open: false }],
				ctx,
			);
			expect(lastStep(steps).commands).toContainEqual({
				type: 'focus',
				target: 'before-open',
				trigger: T2,
				input: null,
			});
		});

		it('15: removing the owning trigger keeps it open; the close then reports no trigger', () => {
			const { steps, state } = run([press(T1), { type: 'trigger-removed', trigger: T1 }, { type: 'escape-key' }]);
			expect(steps[1].state.kind).toBe('open');
			expect(lastStep(steps).request).toEqual({ open: false, reason: 'escape-key', trigger: null });
			expect(state.kind).toBe('closing');
		});

		it('16-20: the trigger-change instant shows only while open after a switch', () => {
			const { steps } = run([press(T1), press(T2), { type: 'close-press' }, { type: 'exit-finished' }, press(T2)]);
			expect(brnPopoverInstant(steps[1].state)).toBe('trigger-change');
			expect(steps.slice(2).map((step) => brnPopoverInstant(step.state))).not.toContain('trigger-change');
		});

		it('conformance 8-9: the parent moves the open popup with triggerId, and closing keeps that trigger', () => {
			const ctx = context({ controlled: true, triggerId: T1 });
			const { steps } = run(
				[
					{ type: 'open-input', open: true },
					{ type: 'trigger-id-input', trigger: T2 },
					{ type: 'escape-key' },
					{ type: 'open-input', open: false },
				],
				ctx,
			);
			expect(steps[1].state).toMatchObject({ kind: 'open', switchedFrom: T1 });
			expect(steps[1].commands).toEqual([{ type: 'start-positioning', anchor: T2 }]);
			expect(steps[2].request).toEqual({ open: false, reason: 'escape-key', trigger: T2 });
			expect(lastStep(steps).state).toMatchObject({ kind: 'closing', owner: { trigger: T2 } });
		});
	});

	describe('base-ui trigger, close, backdrop, transitions', () => {
		it('trigger 3: a disabled trigger does not open', () => {
			const { state, steps } = run([press()], context({ disabledTriggers: new Set([T1]) }));
			expect(state.kind).toBe('closed');
			expect(steps[0].request).toBeNull();
		});

		it('trigger 20: keyboard activation opens like a press, with the click instant', () => {
			const { state } = run([press(T1, 'keyboard')]);
			expect(state.kind).toBe('open');
			expect(brnPopoverInstant(state)).toBe('click');
		});

		it('close 3: the Close part closes', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'close-press' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'close-press' });
		});

		it('close 6: with no trigger the close reports none', () => {
			const ctx = context();
			const step = nextBrnPopoverState(initialBrnPopoverState(true, ctx), { type: 'close-press' }, ctx);
			expect(step.request).toEqual({ open: false, reason: 'close-press', trigger: null });
		});

		it('backdrop 2-3: open from the start has no entry phase', () => {
			const state = initialBrnPopoverState(true, context());
			expect(state).toMatchObject({ kind: 'open', entering: false });
		});

		it('transition 1: a kept view opens with one entry phase and is reused', () => {
			const ctx = context({ keepMounted: true });
			const { steps } = run(
				[press(), { type: 'enter-started' }, { type: 'escape-key' }, { type: 'exit-finished' }, press()],
				ctx,
			);
			expect(steps[0].state).toMatchObject({ entering: true });
			expect(steps[1].state).toMatchObject({ entering: false });
			expect(brnPopoverMounted(steps[3].state)).toBe(true);
			expect(lastStep(steps).commands.map((command) => command.type)).toContain('show-view');
		});

		it('reopening during the exit animation shows it open again without an entry phase', () => {
			const { state, commands } = run([press(), { type: 'escape-key' }, press()]);
			expect(state).toMatchObject({ kind: 'open', entering: false });
			expect(commands.filter((type) => type === 'mount-view')).toHaveLength(1);
		});
	});

	describe('base-ui popup conformance', () => {
		it('4: the open input opens it', () => {
			const ctx = context({ controlled: true });
			expect(run([{ type: 'open-input', open: true }], ctx).state.kind).toBe('open');
		});

		it('5: with open held true, every close request is reported and it stays open', () => {
			const ctx = context({ controlled: true });
			const { steps, state } = run(
				[{ type: 'escape-key' }, { type: 'escape-key' }],
				ctx,
				initialBrnPopoverState(true, ctx),
			);
			expect(steps.map((step) => step.request?.reason)).toEqual(['escape-key', 'escape-key']);
			expect(state.kind).toBe('open');
		});

		it('9: changes carry the reason and the trigger', () => {
			const { steps } = run([press(), { type: 'escape-key' }]);
			expect(steps.map((step) => step.request)).toEqual([
				{ open: true, reason: 'trigger-press', trigger: T1 },
				{ open: false, reason: 'escape-key', trigger: T1 },
			]);
		});

		it('11-12: close() while closed reports nothing', () => {
			expect(run([{ type: 'program-close' }]).steps[0]).toMatchObject({ request: null, commands: [] });
		});

		it('15-17: a hold that arrives after the close started still keeps the view', () => {
			const { state, commands } = run([press(), { type: 'escape-key' }, { type: 'hold' }, { type: 'exit-finished' }]);
			expect(state).toMatchObject({ kind: 'closing', held: true });
			expect(commands).not.toContain('emit-change-complete');
		});

		it('24-26: completion on open once entered, and on close once exited', () => {
			const { steps } = run([press(), { type: 'enter-finished' }, press(), { type: 'exit-finished' }]);
			expect(steps[1].commands).toEqual([{ type: 'emit-change-complete', open: true }]);
			expect(steps[3].commands).toContainEqual({ type: 'emit-change-complete', open: false });
		});
	});

	describe('ng-primitives', () => {
		it('1: without a Title the popover is labelled by its trigger', () => {
			const opened = openedByT1();
			expect(brnPopoverLabelledBy(opened, null)).toBe(T1);
			expect(brnPopoverLabelledBy(opened, 'title-1')).toBe('title-1');
		});

		it('13: an outside press on a focusable control leaves focus there', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'outside-press', onFocusable: true }, context());
			expect(step.commands.some((command) => command.type === 'focus')).toBe(false);
		});

		it('22: opening by code while open does nothing', () => {
			expect(nextBrnPopoverState(openedByT1(), { type: 'program-open', trigger: null }, context())).toMatchObject({
				request: null,
				commands: [],
			});
		});

		it('24-25, 35: destroyed while open tears down silently and ignores later events', () => {
			const { steps } = run([
				press(),
				{ type: 'destroyed' },
				{ type: 'program-open', trigger: null },
				{ type: 'exit-finished' },
			]);
			expect(steps[1].request).toBeNull();
			expect(steps[1].commands.map((command) => command.type)).toEqual([
				'leave-tree',
				'stop-positioning',
				'unmount-view',
			]);
			expect(steps.slice(2)).toEqual([
				{ state: { kind: 'destroyed' }, commands: [], request: null },
				{ state: { kind: 'destroyed' }, commands: [], request: null },
			]);
		});

		it('42: clearing the content closes with reason none', () => {
			const step = nextBrnPopoverState(openedByT1(), { type: 'content-removed' }, context());
			expect(step.state).toMatchObject({ kind: 'closing', reason: 'none' });
		});

		it('60: scroll closes only when scroll behavior is close', () => {
			expect(nextBrnPopoverState(openedByT1(), { type: 'scroll' }, context()).state.kind).toBe('open');
			const ctx = context({ scrollBehavior: 'close' });
			expect(nextBrnPopoverState(openedByT1(ctx), { type: 'scroll' }, ctx).state).toMatchObject({
				kind: 'closing',
				reason: 'scroll',
			});
		});
	});

	describe('modal scroll lock', () => {
		it('locks scroll on open and unlocks on close only when modal is true', () => {
			const modal = run([press(), press()], context({ modal: true })).commands;
			expect(modal).toContain('lock-scroll');
			expect(modal).toContain('unlock-scroll');
			expect(run([press(), press()], context({ modal: 'trap-focus' })).commands).not.toContain('lock-scroll');
		});
	});

	describe('trigger ids', () => {
		it('throws on an empty id or one with whitespace', () => {
			expect(() => toBrnTriggerId('')).toThrow('must be non-empty');
			expect(() => toBrnTriggerId('user menu')).toThrow('contain no whitespace');
		});
	});
});
