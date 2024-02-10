import { Component } from '@angular/core';
import { BrnToasterComponent } from '@spartan-ng/ui-toast-brain';

@Component({
	selector: 'hlm-toaster',
	standalone: true,
	imports: [BrnToasterComponent],
	template: `
		<brn-toaster
			[closeButton]="true"
			[toastOptions]="{
				class:
					'group p-4 bg-white border border-gray-200 text-gray-800 rounded-md text-sm flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] relative',
				classes: {
					description: 'font-normal leading-snug text-inherit',
					title: 'font-medium leading-normal text-inherit',
					actionButton:
						'rounded px-2 h-6 text-xs text-white bg-gray-800 ml-auto border-none cursor-pointer outline-none focus-visible:shadow-[0_0_0_2_rgba(0,0,0,0.4) first-of-type:ml-auto',
					cancelButton:
						'rounded px-2 h-6 text-xs text-white bg-gray-800 ml-auto border-none cursor-pointer outline-none focus-visible:shadow-[0_0_0_2_rgba(0,0,0,0.4)] first-of-type:ml-auto',
					closeButton:
						'opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-hover:bg-gray-200 group-hover:border-gray-500 absolute left-0 top-0 h-5 w-5 flex justify-center items-center p-0 bg-gray-100 text-gray-900 border border-gray-400 -translate-x-[35%] -translate-y-[35%] rounded-[50%] cursor-pointer z-0 {transition}'
				}
			}"
		/>
	`,
})
export class HlmToasterComponent {}
