import { Injector, runInInjectionContext } from '@angular/core';
import { injectQuery, keepPreviousData } from '@tanstack/angular-query-experimental';
import { assertInjector } from 'ngxtension/assert-injector';
import { lastValueFrom } from 'rxjs';
import { Note } from '../../../../../db';
import { injectTRPCClient } from '../../../../../trpc-client';
import { notesKeys } from './notes.keys';

export const injectNotesQuery = ({ injector }: { injector?: Injector } = {}) => {
	injector = assertInjector(injectNotesQuery, injector);
	return runInInjectionContext(injector, () => {
		const trpc = injectTRPCClient();
		return injectQuery(() => ({
			queryKey: notesKeys.list,
			queryFn: () => lastValueFrom<Note[]>(trpc.note.list.query()),
			placeholderData: keepPreviousData,
		}));
	});
};
