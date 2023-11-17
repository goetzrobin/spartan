import { Injectable } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumbs.component';

// The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
const getLabel = (data: Data | undefined): string => {
	if (!data) return '';
	return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
};

@Injectable({
	providedIn: 'root',
})
export class BreadcrumbService {
	private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

	// Observable exposing the breadcrumb hierarchy
	readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.router.events
			.pipe(
				// Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
				filter((event) => event instanceof NavigationEnd),
			)
			.subscribe(() => {
				// Construct the breadcrumb hierarchy
				const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
				// Emit the new hierarchy
				this._breadcrumbs$.next(breadcrumbs);
			});
	}

	public updateCurrentBreadcrumbData(newData: Partial<Breadcrumb>) {
		const newBreadcrumbs = [...this._breadcrumbs$.getValue()];
		newBreadcrumbs[newBreadcrumbs.length - 1] = {
			...newBreadcrumbs[newBreadcrumbs.length - 1],
			...newData,
		};
		this._breadcrumbs$.next(newBreadcrumbs);
	}

	private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
		//If no routeConfig is available we are on the root path
		const label = getLabel(route?.routeConfig?.data);
		let path = route?.routeConfig?.path ?? '';

		// If the route is dynamic route such as ':id', remove it
		const routeParts = path.split('/');
		routeParts.forEach((part) => {
			const isDynamicRoute = part.startsWith(':');
			if (isDynamicRoute && !!route.snapshot) {
				const paramName = part.split(':')[1];
				path = path.replace(part, route.snapshot.params[paramName]);
			}
		});

		// replace wildcard operators with empty string
		path = path.replace(/\*/g, '');

		//In the routeConfig the complete path is not available,
		//so we rebuild it each time
		const nextUrl = path ? `${url}/${path}` : url;

		const breadcrumb: Breadcrumb = {
			label: label,
			url: nextUrl,
			loading: !!route.snapshot.data['loading'],
			loadingLabel: route.snapshot.data['loadingLabel'] ?? 'Loading...',
		};
		// Only adding route with non-empty label
		const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
		if (route.firstChild) {
			//If we are not on our current path yet,
			//there will be more children to look after, to build our breadcrumb
			return this.buildBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
		}
		return newBreadcrumbs;
	}
}
