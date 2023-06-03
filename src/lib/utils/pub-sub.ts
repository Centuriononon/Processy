export class PubSub<T> {
	private handlers: {
		[eventName in keyof T]?: ((value: T[eventName]) => void)[];
	};

	constructor() {
		this.handlers = {};
	}

	protected pub<K extends keyof T>(event: K, value: T[K]): void {
		this.handlers[event]?.forEach(h => h(value));
	}

	sub<K extends keyof T>(event: K, handler: (value: T[K]) => void): this {
		this.handlers[event] = [...(this.handlers[event] || []), handler];

		return this;
	}
}
