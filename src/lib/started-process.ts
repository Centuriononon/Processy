import { AbstractObservableProcess } from './abstract-observable-process';
import { IProcess, IStartedProcess } from './types';

export class StartedProcess<State, Msg>
	extends AbstractObservableProcess<State>
	implements IStartedProcess<State, Msg>
{
	constructor(private readonly process: IProcess<State, Msg>) {
		super();
	}

	init(state: State) {
		this.process
			.sub('complete', state => this.pub('complete', state))
			.sub('stop', status => this.pub('stop', status))
			.sub('fault', reason => this.pub('fault', reason))
			.start(state);

		return this;
	}

	working = this.process.working.bind(this.process);
	message = this.process.message.bind(this.process);
	stop = this.process.stop.bind(this.process);
}
