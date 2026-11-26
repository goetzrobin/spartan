import type {
	BrnPopoverChange,
	BrnPopoverContext,
	BrnPopoverEvent,
	BrnPopoverOwner,
	BrnPopoverState,
	BrnPopoverStep,
} from './brn-popover-model';
import { finishClose, openingCommands, ownerTrigger, programOwner, unchanged } from './brn-popover-steps';

type ClosingState = Extract<BrnPopoverState, { kind: 'closing' }>;

function reopen(owner: BrnPopoverOwner, context: BrnPopoverContext, request: BrnPopoverChange | null): BrnPopoverStep {
	return {
		state: { kind: 'open', owner, closeRequested: null, entering: false, switchedFrom: null },
		commands: openingCommands(owner, null, context),
		request,
	};
}

export function fromClosing(state: ClosingState, event: BrnPopoverEvent, context: BrnPopoverContext): BrnPopoverStep {
	switch (event.type) {
		case 'exit-finished': {
			return finishClose(state, context, false);
		}
		case 'unmount': {
			return finishClose(state, context, true);
		}
		case 'hold': {
			return unchanged({ ...state, held: true });
		}
		case 'trigger-press': {
			if (context.disabledTriggers.has(event.trigger)) {
				return unchanged(state);
			}
			const owner: BrnPopoverOwner = { kind: 'trigger', trigger: event.trigger, input: event.input };
			const request: BrnPopoverChange = { open: true, reason: 'trigger-press', trigger: event.trigger };
			return context.controlled ? { state, commands: [], request } : reopen(owner, context, request);
		}
		case 'program-open': {
			const owner = programOwner(event.trigger, ownerTrigger(state.owner));
			const request: BrnPopoverChange = { open: true, reason: 'imperative-action', trigger: event.trigger };
			return context.controlled ? { state, commands: [], request } : reopen(owner, context, request);
		}
		case 'open-input': {
			return event.open
				? reopen(programOwner(context.triggerId, ownerTrigger(state.owner)), context, null)
				: unchanged(state);
		}
		case 'trigger-id-input': {
			return unchanged({ ...state, owner: programOwner(event.trigger, null) });
		}
		case 'destroyed': {
			return {
				state: { kind: 'destroyed' },
				commands: [{ type: 'stop-positioning' }, { type: 'unmount-view' }],
				request: null,
			};
		}
		default: {
			return unchanged(state);
		}
	}
}
