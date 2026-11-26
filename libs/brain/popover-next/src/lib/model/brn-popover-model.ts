declare const brand: unique symbol;
type Brand<T, Name extends string> = T & { readonly [brand]: Name };

export type BrnTriggerId = Brand<string, 'BrnTriggerId'>;

export type BrnPopoverInput = 'mouse' | 'touch' | 'pen' | 'keyboard';

export type BrnPopoverReason =
	| 'trigger-press'
	| 'outside-press'
	| 'escape-key'
	| 'close-press'
	| 'focus-out'
	| 'imperative-action'
	| 'none'
	| 'scroll';

export type BrnPopoverOwner =
	| { kind: 'trigger'; trigger: BrnTriggerId; input: BrnPopoverInput }
	| { kind: 'program'; trigger: BrnTriggerId | null; fallback: BrnTriggerId | null };

export type BrnPopoverState =
	| {
			kind: 'closed';
			openRequested: BrnPopoverOwner | null;
			lastReason: BrnPopoverReason | null;
			lastTrigger: BrnTriggerId | null;
			kept: boolean;
	  }
	| {
			kind: 'open';
			owner: BrnPopoverOwner;
			closeRequested: { reason: BrnPopoverReason; focus: BrnFocusTarget | 'final' | null } | null;
			entering: boolean;
			switchedFrom: BrnTriggerId | null;
	  }
	| { kind: 'closing'; owner: BrnPopoverOwner; reason: BrnPopoverReason; held: boolean }
	| { kind: 'destroyed' };

export type BrnFocusGuard = 'before-trigger' | 'after-trigger' | 'before-popup' | 'after-popup';

export type BrnPopoverEvent =
	| { type: 'trigger-press'; trigger: BrnTriggerId; input: BrnPopoverInput }
	| { type: 'outside-press'; onFocusable: boolean }
	| { type: 'escape-key' }
	| { type: 'close-press' }
	| { type: 'focus-out' }
	| { type: 'focus-guard'; guard: BrnFocusGuard }
	| { type: 'scroll' }
	| { type: 'trigger-removed'; trigger: BrnTriggerId }
	| { type: 'program-open'; trigger: BrnTriggerId | null }
	| { type: 'program-close' }
	| { type: 'open-input'; open: boolean }
	| { type: 'trigger-id-input'; trigger: BrnTriggerId | null }
	| { type: 'hold' }
	| { type: 'enter-started' }
	| { type: 'enter-finished' }
	| { type: 'exit-finished' }
	| { type: 'unmount' }
	| { type: 'content-removed' }
	| { type: 'destroyed' };

export type BrnFocusTarget = 'popup-initial' | 'trigger' | 'before-open' | 'after-trigger' | 'before-trigger';

export type BrnPopoverCommand =
	| { type: 'mount-view' }
	| { type: 'show-view' }
	| { type: 'hide-view' }
	| { type: 'unmount-view' }
	| { type: 'focus'; target: BrnFocusTarget; trigger: BrnTriggerId | null; input: BrnPopoverInput | null }
	| { type: 'lock-scroll' }
	| { type: 'unlock-scroll' }
	| { type: 'start-positioning'; anchor: BrnTriggerId | null }
	| { type: 'stop-positioning' }
	| { type: 'enter-tree' }
	| { type: 'leave-tree' }
	| { type: 'emit-change-complete'; open: boolean };

export interface BrnPopoverChange {
	open: boolean;
	reason: BrnPopoverReason;
	trigger: BrnTriggerId | null;
}

export interface BrnPopoverContext {
	controlled: boolean;
	triggerId: BrnTriggerId | null;
	modal: boolean | 'trap-focus';
	closePart: boolean;
	keepMounted: boolean;
	scrollBehavior: 'reposition' | 'block' | 'close';
	disabledTriggers: ReadonlySet<BrnTriggerId>;
}

export interface BrnPopoverStep {
	state: BrnPopoverState;
	commands: readonly BrnPopoverCommand[];
	request: BrnPopoverChange | null;
}

export function isBrnTriggerId(value: string): value is BrnTriggerId {
	return value.length > 0 && !/\s/.test(value);
}

export function toBrnTriggerId(value: string): BrnTriggerId {
	if (!isBrnTriggerId(value)) {
		throw new Error(`BrnPopover: trigger id "${value}" must be non-empty and contain no whitespace.`);
	}
	return value;
}
