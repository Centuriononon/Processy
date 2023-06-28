import { AbstractObservableProcess } from './abstract-observable-process';
import { IProcess, IReleasedProcess } from './types';

export class ReleasedProcess<State>
	extends AbstractObservableProcess<State>
	implements IReleasedProcess<State>
{
	constructor(private readonly process: IProcess<State>) {
		super();
	}

	start(state: State) {
		this.process
			.sub('complete', state => this.pub('complete', state))
			.sub('stop', status => this.pub('stop', status))
			.sub('fault', reason => this.pub('fault', reason))
			.start(state);

		return this;
	}

	working = this.process.working.bind(this.process);
	stop = this.process.stop.bind(this.process);
}
