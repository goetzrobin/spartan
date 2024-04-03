import { Injector, runInInjectionContext } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { assertInjector } from 'ngxtension/assert-injector';
import { lastValueFrom } from 'rxjs';
import { injectTRPCClient } from '../../../../../trpc-client';
import { notesKeys } from './notes.keys';

export interface CreateNoteParams {
	title: string;
	content: string;
}
export const injectCreateNoteMutation = ({ injector }: { injector?: Injector } = {}) => {
	injector = assertInjector(injectCreateNoteMutation, injector);
	return runInInjectionContext(injector, () => {
		const trpc = injectTRPCClient();
		return injectMutation((client) => ({
			mutationFn: ({ title, content }: CreateNoteParams) => lastValueFrom(trpc.note.create.mutate({ title, content })),
			// Invalidate and refetch by using the client directly
			onSuccess: () => client.invalidateQueries({ queryKey: notesKeys.list }),
		}));
	});
};

export interface DeleteNoteParams {
	id: number;
}
export const injectDeleteNoteMutation = ({ injector }: { injector?: Injector } = {}) => {
	injector = assertInjector(injectDeleteNoteMutation, injector);
	return runInInjectionContext(injector, () => {
		const trpc = injectTRPCClient();
		return injectMutation((client) => ({
			mutationFn: ({ id }: DeleteNoteParams) => lastValueFrom(trpc.note.remove.mutate({ id })),
			// Invalidate and refetch by using the client directly
			onSuccess: () => client.invalidateQueries({ queryKey: notesKeys.list }),
		}));
	});
};
