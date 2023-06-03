import { PubSub } from './utils/pub-sub';

export abstract class AbstractObservableProcess<
	State
> extends PubSub<{ complete: State; fault: string; stop: 'OK' | 'BAD' }> {
	constructor() {
		super();
	}
}
