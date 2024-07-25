import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmSliderInputDirective } from 'libs/ui/slider/helm/src/lib/hlm-slider-input.directive';
import { HlmSliderThumbDirective } from 'libs/ui/slider/helm/src/lib/hlm-slider-thumb.directive';
import { HlmSliderTrackComponent } from 'libs/ui/slider/helm/src/lib/hlm-slider-track.component';
import { HlmSliderComponent } from 'libs/ui/slider/helm/src/lib/hlm-slider.component';

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<pre data-testid="value-indicator-pre">Temperature: {{ temperature() }}</pre>
		</div>
		<form ngForm>
			<hlm-slider [ariaLabel]="'fallback-label'">
				<hlm-slider-track>
					<input data-testid="input" hlmSliderInput [(ngModel)]="temperature" name="temperature" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [FormsModule, HlmSliderComponent, HlmSliderThumbDirective, HlmSliderTrackComponent, HlmSliderInputDirective],
})
export class TemplateDrivenFormSliderComponent {
	public readonly temperature = model<number | string>('0');

	changeValue(value: number) {
		this.temperature.set(value);
	}
}

@Component({
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<pre data-testid="value-indicator-pre">
				Temperature: {{ temperatureGroup.controls.temperature.getRawValue() }}
			</pre
			>
		</div>
		<form [formGroup]="temperatureGroup">
			<hlm-slider [ariaLabel]="'fallback-label'">
				<hlm-slider-track>
					<input data-testid="input" hlmSliderInput formControlName="temperature" />
				</hlm-slider-track>
				<hlm-slider-thumb></hlm-slider-thumb>
			</hlm-slider>
		</form>
		<button data-testid="change-value-btn" (click)="changeValue(24)">Change temperature value</button>
	`,
	imports: [
		ReactiveFormsModule,
		HlmSliderComponent,
		HlmSliderThumbDirective,
		HlmSliderTrackComponent,
		HlmSliderInputDirective,
		AsyncPipe,
		JsonPipe,
	],
})
export class ReactiveFormSliderComponent {
	public readonly temperature = model<number | string>('46');

	protected readonly temperatureGroup = new FormGroup({
		temperature: new FormControl<string | number>(this.temperature()),
	});

	changeValue(value: number | string) {
		this.temperatureGroup.controls.temperature.patchValue(value);
	}
}
