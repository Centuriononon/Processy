import { AbstractObservableProcess } from '../abstract-observable-process';
import { IRestartableStartedProcess } from '../types';

export class StartedCyclicalProcess<State>
	extends AbstractObservableProcess<State>
	implements IRestartableStartedProcess<State>
{
	private count: number = 0;

	constructor(
		private readonly process: IRestartableStartedProcess<State>,
		private readonly cycles: number
	) {
		super();
	}

	init(state: State) {
		this.process
			.sub('complete', state => {
				if (++this.count < this.cycles) this.restart('OK');
				else this.pub('complete', state);
			})
			.sub('stop', status => this.pub('stop', status))
			.sub('fault', reason => this.pub('fault', reason))
			.init(state);

		return this;
	}

	stop = this.process.stop.bind(this.process);
	restart = this.process.restart.bind(this.process);
}
