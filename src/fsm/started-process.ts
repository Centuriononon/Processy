import { AbstractObservableProcess } from './abstract-observable-process';
import { IProcess, IStartedProcess } from './types';

export class StartedProcess<State>
	extends AbstractObservableProcess<State>
	implements IStartedProcess<State>
{
	constructor(private readonly process: IProcess<State>) {
		super();
	}

	init(state: State) {
		this.process
			.sub('complete', state => this.pub('complete', state))
			.sub('stop', status => this.pub('stop', status))
			.sub('crash', reason => this.pub('crash', reason))
			.start(state);

		return this;
	}

	stop = this.process.stop.bind(this.process);
}
