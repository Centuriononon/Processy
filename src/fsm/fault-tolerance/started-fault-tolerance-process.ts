import { AbstractObservableProcess } from '../abstract-observable-process';
import { IRestartableStartedProcess } from '../types';

export class StartedFaultToleranceProcess<State>
	extends AbstractObservableProcess<State>
	implements IRestartableStartedProcess<State>
{
	private count: number = 0;

	constructor(
		private readonly process: IRestartableStartedProcess<State>,
		private readonly faults: number
	) {
		super();
	}

	init(state: State) {
		this.process
			.sub('complete', state => this.pub('complete', state))
			.sub('stop', status => this.pub('stop', status))
			.sub('fault', reason => {
				if (++this.count < this.faults) this.restart('OK');
				else this.pub('fault', reason);
			})
			.init(state);

		return this;
	}

	stop = this.process.stop.bind(this.process);
	restart = this.process.restart.bind(this.process);
}
