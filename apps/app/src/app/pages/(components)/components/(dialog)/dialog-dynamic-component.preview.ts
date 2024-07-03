import { Component, HostBinding, inject } from '@angular/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import {
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogService,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/ui-table-helm';

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'spartan-dialog-dynamic-component-preview',
	standalone: true,
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	`,
})
export class DialogDynamicComponentPreviewComponent {
	private readonly _hlmDialogService = inject(HlmDialogService);

	private readonly _users: ExampleUser[] = [
		{
			name: 'Helena Chambers',
			email: 'helenachambers@chorizon.com',
			phone: '+1 (812) 588-3759',
		},
		{
			name: 'Josie Crane',
			email: 'josiecrane@hinway.com',
			phone: '+1 (884) 523-3324',
		},
		{
			name: 'Lou Hartman',
			email: 'louhartman@optyk.com',
			phone: '+1 (912) 479-3998',
		},
		{
			name: 'Lydia Zimmerman',
			email: 'lydiazimmerman@ultrasure.com',
			phone: '+1 (944) 511-2111',
		},
	];

	public openDynamicComponent() {
		const dialogRef = this._hlmDialogService.open(SelectUserComponent, {
			context: {
				users: this._users,
			},
			contentClass: 'sm:!max-w-[750px]',
		});

		dialogRef.closed$.subscribe((user) => {
			if (user) {
				console.log('Selected user:', user);
			}
		});
	}
}

@Component({
	selector: 'dynamic-content',
	standalone: true,
	imports: [
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmTableComponent,
		HlmThComponent,
		HlmTrowComponent,
		HlmTdComponent,
		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ lucideCheck })],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<hlm-table>
			<hlm-trow>
				<hlm-th class="w-44">Name</hlm-th>
				<hlm-th class="w-60">Email</hlm-th>
				<hlm-th class="w-48">Phone</hlm-th>
			</hlm-trow>
			@for (user of users; track user.name) {
				<button class="text-left" (click)="selectUser(user)">
					<hlm-trow>
						<hlm-td truncate class="font-medium w-44">{{ user.name }}</hlm-td>
						<hlm-td class="w-60">{{ user.email }}</hlm-td>
						<hlm-td class="w-48">{{ user.phone }}</hlm-td>
					</hlm-trow>
				</button>
			}
		</hlm-table>
	`,
})
class SelectUserComponent {
	@HostBinding('class') private readonly _class: string = 'flex flex-col gap-4';

	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._dialogRef.close(user);
	}
}

export const dynamicComponentCode = `
import {
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogService,
	HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/ui-table-helm';

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'spartan-dialog-dynamic-component-preview',
	standalone: true,
	imports: [HlmButtonDirective],
	template: \`
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	\`,
})
export class DialogDynamicComponentPreviewComponent {
	private readonly _hlmDialogService = inject(HlmDialogService);

	private readonly _users: ExampleUser[] = [
		{
			name: 'Helena Chambers',
			email: 'helenachambers@chorizon.com',
			phone: '+1 (812) 588-3759',
		},
		{
			name: 'Josie Crane',
			email: 'josiecrane@hinway.com',
			phone: '+1 (884) 523-3324',
		},
		{
			name: 'Lou Hartman',
			email: 'louhartman@optyk.com',
			phone: '+1 (912) 479-3998',
		},
		{
			name: 'Lydia Zimmerman',
			email: 'lydiazimmerman@ultrasure.com',
			phone: '+1 (944) 511-2111',
		},
	];

	public openDynamicComponent() {
		const dialogRef = this._hlmDialogService.open(SelectUserComponent, {
			context: {
				users: this._users,
			},
			contentClass: 'sm:!max-w-[750px]',
		});

		dialogRef.closed$.subscribe((user) => {
			if (user) {
				console.log('Selected user:', user);
			}
		});
	}
}

@Component({
	selector: 'dynamic-content',
	standalone: true,
	imports: [
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmTableComponent,
		HlmThComponent,
		HlmTrowComponent,
		HlmTdComponent,
		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ lucideCheck })],
	template: \`
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<hlm-table>
			<hlm-trow>
				<hlm-th class="w-44">Name</hlm-th>
				<hlm-th class="w-60">Email</hlm-th>
				<hlm-th class="w-48">Phone</hlm-th>
			</hlm-trow>
			@for (user of users; track user.name) {
				<button class="text-left" (click)="selectUser(user)">
					<hlm-trow>
						<hlm-td truncate class="font-medium w-44">{{ user.name }}</hlm-td>
						<hlm-td class="w-60">{{ user.email }}</hlm-td>
						<hlm-td class="w-48">{{ user.phone }}</hlm-td>
					</hlm-trow>
				</button>
			}
		</hlm-table>
	\`,
})
class SelectUserComponent {
	@HostBinding('class') private readonly _class: string = 'flex flex-col gap-4';

	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectBrnDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._dialogRef.close(user);
	}
}
`;
