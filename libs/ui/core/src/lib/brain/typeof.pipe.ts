import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'typeofString', standalone: true })
export class TypeOfStringPipe implements PipeTransform {
	transform(value: unknown): value is string {
		return typeof value === 'string';
	}
}
