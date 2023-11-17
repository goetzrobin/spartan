import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
	selector: 'spartan-root',
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	host: {
		class: 'text-foreground block antialiased',
	},
	template: `
		<spartan-header />
		<div class="mx-auto max-w-screen-xl">
			<router-outlet />
		</div>
		<spartan-footer />
	`,
})
export class AppComponent {}
