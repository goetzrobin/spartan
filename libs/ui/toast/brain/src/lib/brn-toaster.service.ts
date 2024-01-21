import { Injectable, Type, signal } from '@angular/core';
import { ExternalToast, HeightT, ToastT, ToastTypes } from './brn-toast.types';

@Injectable({ providedIn: 'root' })
export class BrnToasterService {
	toasts = signal<ToastT[]>([]);
	heights = signal<HeightT[]>([]);
	toastsCounter = signal(1);

	addToast(data: ToastT) {
		this.toasts.update((prev) => [data, ...prev]);
	}

	create(
		data: ExternalToast & {
			message?: string | Type<any>;
			type?: ToastTypes;
		},
	) {
		const { message, ...rest } = data;
		let id: number | string;

		if (typeof data.id === 'number' || (typeof data.id === 'string' && data.id.length > 0)) {
			id = data.id;
		} else {
			this.toastsCounter.set(this.toastsCounter() + 1);
			id = this.toastsCounter();
		}

		const alreadyExists = this.toasts().find((toast) => {
			return toast.id === id;
		});
		const dismissable = data.dismissable === undefined ? true : data.dismissable;

		if (alreadyExists) {
			this.toasts.set(
				this.toasts().map((toast) => {
					if (toast.id === id) {
						return {
							...toast,
							...data,
							id,
							dismissable,
							title: message,
						};
					}

					return toast;
				}),
			);
		} else {
			this.addToast({ title: message, ...rest, dismissable, id });
		}

		return id;
	}

	message(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, message });
	}

	error(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, message, type: 'error' });
	}

	success(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, type: 'success', message });
	}

	info(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, type: 'info', message });
	}

	warning(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, type: 'warning', message });
	}

	loading(message: string | Type<any>, data?: ExternalToast) {
		return this.create({ ...data, type: 'loading', message });
	}
}
