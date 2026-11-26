import type { BrnPopoverReason, BrnPopoverState, BrnTriggerId } from './brn-popover-model';
import { ownerTrigger } from './brn-popover-steps';

export type BrnPopoverInstant = 'click' | 'dismiss' | 'focus' | 'trigger-change';

export function brnPopoverActiveTrigger(state: BrnPopoverState): BrnTriggerId | null {
	return state.kind === 'open' ? ownerTrigger(state.owner) : null;
}

export function brnPopoverMounted(state: BrnPopoverState): boolean {
	switch (state.kind) {
		case 'open':
		case 'closing': {
			return true;
		}
		case 'closed': {
			return state.kept;
		}
		case 'destroyed': {
			return false;
		}
	}
}

function closeInstant(reason: BrnPopoverReason | null): BrnPopoverInstant | null {
	switch (reason) {
		case 'escape-key':
		case 'imperative-action':
		case 'none': {
			return 'dismiss';
		}
		case 'focus-out': {
			return 'focus';
		}
		default: {
			return null;
		}
	}
}

export function brnPopoverInstant(state: BrnPopoverState): BrnPopoverInstant | null {
	switch (state.kind) {
		case 'open': {
			if (state.switchedFrom !== null) {
				return 'trigger-change';
			}
			return state.owner.kind === 'trigger' && state.owner.input === 'keyboard' ? 'click' : null;
		}
		case 'closing': {
			return closeInstant(state.reason);
		}
		case 'closed': {
			return closeInstant(state.lastReason);
		}
		case 'destroyed': {
			return null;
		}
	}
}

export function brnPopoverLabelledBy(state: BrnPopoverState, titleId: string | null): string | null {
	return titleId ?? brnPopoverActiveTrigger(state);
}
