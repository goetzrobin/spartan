export function createMissingDateImplError(provider: string) {
	return Error(
		`HlmDatepicker: No provider found for ${provider}. You must add one of the following ` +
			`to your app config: provideNativeDateAdapter, provideDateFnsAdapter, ` +
			`provideLuxonDateAdapter, provideMomentDateAdapter, or provide a custom implementation.`,
	);
}
