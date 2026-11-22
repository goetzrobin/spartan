import { type ExistingProvider, inject, InjectionToken, type Type } from '@angular/core';
import type { BrnInputOtp } from './brn-input-otp';

export const BrnInputOtpToken = new InjectionToken<BrnInputOtp>('BrnInputOtpToken');

export function injectBrnInputOtp(): BrnInputOtp {
	return inject(BrnInputOtpToken);
}

export function provideBrnInputOtp(inputOtp: Type<BrnInputOtp>): ExistingProvider {
	return { provide: BrnInputOtpToken, useExisting: inputOtp };
}
