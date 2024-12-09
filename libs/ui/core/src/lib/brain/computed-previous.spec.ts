import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { computedPrevious } from './computed-previous';

describe(computedPrevious.name, () => {
	@Component({ standalone: true, template: '{{previous()}}' })
	class TestComponent {
		public readonly value = signal(0);
		public readonly previous = computedPrevious(this.value);
	}

	function setup() {
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		return fixture.componentInstance;
	}

	it('should work properly', () => {
		const cmp = setup();

		expect(cmp.value()).toEqual(0);
		expect(cmp.previous()).toEqual(0);

		cmp.value.set(1);

		expect(cmp.value()).toEqual(1);
		expect(cmp.previous()).toEqual(0);

		cmp.value.set(2);

		expect(cmp.value()).toEqual(2);
		expect(cmp.previous()).toEqual(1);

		cmp.value.set(2);

		expect(cmp.value()).toEqual(2);
		expect(cmp.previous()).toEqual(1);

		cmp.value.set(3);

		expect(cmp.value()).toEqual(3);
		expect(cmp.previous()).toEqual(2);
	});
});
