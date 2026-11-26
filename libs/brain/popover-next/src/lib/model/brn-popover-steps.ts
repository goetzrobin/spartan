import type {
	BrnFocusTarget,
	BrnPopoverChange,
	BrnPopoverCommand,
	BrnPopoverContext,
	BrnPopoverInput,
	BrnPopoverOwner,
	BrnPopoverReason,
	BrnPopoverState,
	BrnPopoverStep,
	BrnTriggerId,
} from './brn-popover-model';

type OpenState = Extract<BrnPopoverState, { kind: 'open' }>;
type ClosingState = Extract<BrnPopoverState, { kind: 'closing' }>;

export type BrnCloseFocus = BrnFocusTarget | 'final' | null;

export function unchanged(state: BrnPopoverState): BrnPopoverStep {
	return { state, commands: [], request: null };
}

export function ownerTrigger(owner: BrnPopoverOwner): BrnTriggerId | null {
	return owner.trigger;
}

export function ownerInput(owner: BrnPopoverOwner): BrnPopoverInput | null {
	return owner.kind === 'trigger' ? owner.input : null;
}

function locksScroll(context: BrnPopoverContext): boolean {
	return context.modal === true;
}

export function openingCommands(
	owner: BrnPopoverOwner,
	view: 'mount-view' | 'show-view' | null,
	context: BrnPopoverContext,
): BrnPopoverCommand[] {
	const commands: BrnPopoverCommand[] = [];
	if (view) {
		commands.push({ type: view }, { type: 'start-positioning', anchor: ownerTrigger(owner) });
	}
	commands.push({ type: 'enter-tree' });
	if (locksScroll(context)) {
		commands.push({ type: 'lock-scroll' });
	}
	commands.push({ type: 'focus', target: 'popup-initial', trigger: ownerTrigger(owner), input: ownerInput(owner) });
	return commands;
}

function finalFocus(owner: BrnPopoverOwner): BrnPopoverCommand {
	if (owner.kind === 'trigger') {
		return { type: 'focus', target: 'trigger', trigger: owner.trigger, input: owner.input };
	}
	return { type: 'focus', target: 'before-open', trigger: owner.trigger ?? owner.fallback, input: null };
}

function focusCommand(owner: BrnPopoverOwner, focus: BrnCloseFocus): BrnPopoverCommand[] {
	if (focus === null) {
		return [];
	}
	if (focus === 'final') {
		return [finalFocus(owner)];
	}
	return [{ type: 'focus', target: focus, trigger: ownerTrigger(owner), input: ownerInput(owner) }];
}

export function closeFrom(
	state: OpenState,
	reason: BrnPopoverReason,
	focus: BrnCloseFocus,
	context: BrnPopoverContext,
	request: BrnPopoverChange | null,
): BrnPopoverStep {
	const commands: BrnPopoverCommand[] = [{ type: 'leave-tree' }];
	if (locksScroll(context)) {
		commands.push({ type: 'unlock-scroll' });
	}
	commands.push(...focusCommand(state.owner, focus));
	return { state: { kind: 'closing', owner: state.owner, reason, held: false }, commands, request };
}

export function requestClose(
	state: OpenState,
	reason: BrnPopoverReason,
	focus: BrnCloseFocus,
	context: BrnPopoverContext,
): BrnPopoverStep {
	const request: BrnPopoverChange = { open: false, reason, trigger: ownerTrigger(state.owner) };
	if (context.controlled) {
		return { state: { ...state, closeRequested: { reason, focus } }, commands: [], request };
	}
	return closeFrom(state, reason, focus, context, request);
}

export function finishClose(state: ClosingState, context: BrnPopoverContext, force: boolean): BrnPopoverStep {
	if (state.held && !force) {
		return unchanged(state);
	}
	const keep = context.keepMounted && !force;
	return {
		state: {
			kind: 'closed',
			openRequested: null,
			lastReason: state.reason,
			lastTrigger: ownerTrigger(state.owner) ?? (state.owner.kind === 'program' ? state.owner.fallback : null),
			kept: keep,
		},
		commands: [
			{ type: 'stop-positioning' },
			{ type: keep ? 'hide-view' : 'unmount-view' },
			{ type: 'emit-change-complete', open: false },
		],
		request: null,
	};
}

export function programOwner(trigger: BrnTriggerId | null, fallback: BrnTriggerId | null): BrnPopoverOwner {
	return { kind: 'program', trigger, fallback };
}
