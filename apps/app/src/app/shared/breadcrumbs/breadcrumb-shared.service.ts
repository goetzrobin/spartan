// breadcrumb-shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
	label: string;
	url: string;
	loading: boolean;
	loadingLabel?: string;
}

@Injectable({
	providedIn: 'root',
})
export class BreadcrumbSharedService {
	private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

	// Observable exposing the breadcrumb hierarchy
	readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

	updateBreadcrumbs(breadcrumbs: Breadcrumb[]) {
		this._breadcrumbs$.next(breadcrumbs);
	}

	updateCurrentBreadcrumbData(newData: Partial<Breadcrumb>) {
		const currentBreadcrumbs = [...this._breadcrumbs$.getValue()];
		const lastBreadcrumb = currentBreadcrumbs[currentBreadcrumbs.length - 1];

		if (!lastBreadcrumb) {
			return;
		}

		// Ensure label and url are defined before updating
		if (newData.label === undefined || newData.url === undefined) {
			throw new Error('label and url are required fields.');
		}

		currentBreadcrumbs[currentBreadcrumbs.length - 1] = {
			...lastBreadcrumb,
			...newData,
		};

		this._breadcrumbs$.next(currentBreadcrumbs);
	}
}
