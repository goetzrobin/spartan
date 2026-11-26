import { fromClosing } from './brn-popover-closing';
import type {
	BrnPopoverChange,
	BrnPopoverCommand,
	BrnPopoverContext,
	BrnPopoverEvent,
	BrnPopoverOwner,
	BrnPopoverReason,
	BrnPopoverState,
	BrnPopoverStep,
} from './brn-popover-model';
import { closeFrom, openingCommands, ownerTrigger, programOwner, requestClose, unchanged } from './brn-popover-steps';

type ClosedState = Extract<BrnPopoverState, { kind: 'closed' }>;
type OpenState = Extract<BrnPopoverState, { kind: 'open' }>;

export function initialBrnPopoverState(open: boolean, context: BrnPopoverContext): BrnPopoverState {
	if (!open) {
		return { kind: 'closed', openRequested: null, lastReason: null, lastTrigger: null, kept: false };
	}
	return {
		kind: 'open',
		owner: { kind: 'program', trigger: context.triggerId, fallback: null },
		closeRequested: null,
		entering: false,
		switchedFrom: null,
	};
}

export function nextBrnPopoverState(
	state: BrnPopoverState,
	event: BrnPopoverEvent,
	context: BrnPopoverContext,
): BrnPopoverStep {
	switch (state.kind) {
		case 'closed': {
			return fromClosed(state, event, context);
		}
		case 'open': {
			return fromOpen(state, event, context);
		}
		case 'closing': {
			return fromClosing(state, event, context);
		}
		case 'destroyed': {
			return unchanged(state);
		}
	}
}

function openFromClosed(
	state: ClosedState,
	owner: BrnPopoverOwner,
	context: BrnPopoverContext,
	request: BrnPopoverChange | null,
): BrnPopoverStep {
	return {
		state: { kind: 'open', owner, closeRequested: null, entering: true, switchedFrom: null },
		commands: openingCommands(owner, state.kept ? 'show-view' : 'mount-view', context),
		request,
	};
}

function requestOpen(
	state: ClosedState,
	owner: BrnPopoverOwner,
	reason: BrnPopoverReason,
	context: BrnPopoverContext,
): BrnPopoverStep {
	const request: BrnPopoverChange = { open: true, reason, trigger: ownerTrigger(owner) };
	if (context.controlled) {
		return { state: { ...state, openRequested: owner }, commands: [], request };
	}
	return openFromClosed(state, owner, context, request);
}

function fromClosed(state: ClosedState, event: BrnPopoverEvent, context: BrnPopoverContext): BrnPopoverStep {
	switch (event.type) {
		case 'trigger-press': {
			if (context.disabledTriggers.has(event.trigger)) {
				return unchanged(state);
			}
			return requestOpen(
				state,
				{ kind: 'trigger', trigger: event.trigger, input: event.input },
				'trigger-press',
				context,
			);
		}
		case 'program-open': {
			return requestOpen(state, programOwner(event.trigger, state.lastTrigger), 'imperative-action', context);
		}
		case 'open-input': {
			if (!event.open) {
				return unchanged(state);
			}
			const owner = state.openRequested ?? programOwner(context.triggerId, state.lastTrigger);
			return openFromClosed(state, owner, context, null);
		}
		case 'destroyed': {
			return { state: { kind: 'destroyed' }, commands: state.kept ? [{ type: 'unmount-view' }] : [], request: null };
		}
		default: {
			return unchanged(state);
		}
	}
}

function teardown(context: BrnPopoverContext): BrnPopoverStep {
	const commands: BrnPopoverCommand[] = [{ type: 'leave-tree' }];
	if (context.modal === true) {
		commands.push({ type: 'unlock-scroll' });
	}
	commands.push({ type: 'stop-positioning' }, { type: 'unmount-view' });
	return { state: { kind: 'destroyed' }, commands, request: null };
}

function pressWhileOpen(
	state: OpenState,
	press: Extract<BrnPopoverEvent, { type: 'trigger-press' }>,
	context: BrnPopoverContext,
): BrnPopoverStep {
	const { trigger, input } = press;
	const current = ownerTrigger(state.owner);
	if (current === trigger || current === null) {
		return requestClose(state, 'trigger-press', 'final', context);
	}
	const request: BrnPopoverChange = { open: true, reason: 'trigger-press', trigger };
	if (context.controlled) {
		return { state, commands: [], request };
	}
	return {
		state: { ...state, owner: { kind: 'trigger', trigger, input }, switchedFrom: current },
		commands: [{ type: 'start-positioning', anchor: trigger }],
		request,
	};
}

function guardWhileOpen(
	state: OpenState,
	guard: Extract<BrnPopoverEvent, { type: 'focus-guard' }>['guard'],
	context: BrnPopoverContext,
): BrnPopoverStep {
	const trapped = context.modal === 'trap-focus' || (context.modal === true && context.closePart);
	switch (guard) {
		case 'after-trigger': {
			return {
				state,
				commands: [{ type: 'focus', target: 'popup-initial', trigger: null, input: 'keyboard' }],
				request: null,
			};
		}
		case 'before-popup': {
			return {
				state,
				commands: [{ type: 'focus', target: 'trigger', trigger: ownerTrigger(state.owner), input: 'keyboard' }],
				request: null,
			};
		}
		case 'after-popup': {
			return trapped ? unchanged(state) : requestClose(state, 'focus-out', 'after-trigger', context);
		}
		case 'before-trigger': {
			return requestClose(state, 'focus-out', 'before-trigger', context);
		}
	}
}

function fromOpen(state: OpenState, event: BrnPopoverEvent, context: BrnPopoverContext): BrnPopoverStep {
	switch (event.type) {
		case 'trigger-press': {
			return context.disabledTriggers.has(event.trigger) ? unchanged(state) : pressWhileOpen(state, event, context);
		}
		case 'escape-key': {
			return requestClose(state, 'escape-key', 'final', context);
		}
		case 'outside-press': {
			return requestClose(state, 'outside-press', event.onFocusable ? null : 'final', context);
		}
		case 'close-press': {
			return requestClose(state, 'close-press', 'final', context);
		}
		case 'focus-out': {
			return requestClose(state, 'focus-out', null, context);
		}
		case 'focus-guard': {
			return guardWhileOpen(state, event.guard, context);
		}
		case 'scroll': {
			return context.scrollBehavior === 'close' ? requestClose(state, 'scroll', null, context) : unchanged(state);
		}
		case 'program-close': {
			return requestClose(state, 'imperative-action', 'final', context);
		}
		case 'content-removed': {
			return requestClose(state, 'none', 'final', context);
		}
		case 'open-input': {
			if (event.open) {
				return unchanged(state);
			}
			const requested = state.closeRequested ?? { reason: 'none', focus: 'final' };
			return closeFrom(state, requested.reason, requested.focus, context, null);
		}
		case 'trigger-removed': {
			if (ownerTrigger(state.owner) !== event.trigger) {
				return unchanged(state);
			}
			return unchanged({ ...state, owner: programOwner(null, null) });
		}
		case 'trigger-id-input': {
			const current = ownerTrigger(state.owner);
			if (event.trigger === current) {
				return unchanged(state);
			}
			return {
				state: { ...state, owner: programOwner(event.trigger, null), switchedFrom: current },
				commands: [{ type: 'start-positioning', anchor: event.trigger }],
				request: null,
			};
		}
		case 'enter-started': {
			return unchanged({ ...state, entering: false });
		}
		case 'enter-finished': {
			return { state, commands: [{ type: 'emit-change-complete', open: true }], request: null };
		}
		case 'destroyed': {
			return teardown(context);
		}
		default: {
			return unchanged(state);
		}
	}
}
