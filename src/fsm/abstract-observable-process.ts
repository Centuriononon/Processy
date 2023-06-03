import { PubSub } from '../utils/pub-sub';

export abstract class AbstractObservableProcess<
	State,
	Reason = string,
	Status = string
> extends PubSub<{ complete: State; fault: Reason; stop: Status }> {
	constructor() {
		super();
	}
}
