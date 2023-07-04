import { AbstractObservableProcess } from '../abstract-observable-process';
import { OK } from '../constants';
import {
	IInitiatedRestartableProcess,
	IInitializableProcess,
	IInitiatedProcess
} from '../types';

export class InitiatedRestartableProcess<State>
	extends AbstractObservableProcess<State>
	implements IInitiatedRestartableProcess<State>
{
	private current?: {
		state: State;
		process: IInitiatedProcess<State>;
	};

	constructor(
		private readonly Initializable: IInitializableProcess<State>,
		
	) {
		super();
	}

	working() {
		if (!this.current) throw new Error('Process is not initiated yet.');

		return this.current.process.working();
	}

	start(state: State) {
		if (this.current) throw new Error('Process is initiated already.');

		this.initiate(state);

		return this;
	}

	private initiate(state: State) {
		const process = (
			this.Initializable
				.initiated()
				.sub('complete', state => this.pub('complete', state))
				.sub('stop', status => this.pub('stop', status))
				.sub('fault', reason => this.pub('fault', reason))
				.start(state)
		);

		this.current = { state, process };

		return OK;
	}

	stop(status: 'OK' | 'BAD') {
		if (!this.current) throw new Error('Process is not initiated yet.');

		this.current.process.stop(status);

		return OK;
	}

	restart(status: 'OK' | 'BAD', state?: State) {
		if (!this.current) throw new Error('Process is not initiated yet.');

		if (this.working()) this.stop(status);

		this.initiate(state || this.current.state);

		return OK;
	}
}
