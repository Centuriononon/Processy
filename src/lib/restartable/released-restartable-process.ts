import { AbstractObservableProcess } from '../abstract-observable-process';
import { OK } from '../constants';
import {
	IReleasedRestartableProcess,
	IReleasableProcess,
	IReleasedProcess
} from '../types';

export class ReleasedRestartableProcess<State>
	extends AbstractObservableProcess<State>
	implements IReleasedRestartableProcess<State>
{
	private current?: {
		state: State;
		process: IReleasedProcess<State>;
	};

	constructor(
		private readonly releasable: IReleasableProcess<State>,
		
	) {
		super();
	}

	working() {
		if (!this.current) throw new Error('Process is not initiated yet.');

		return this.current.process.working();
	}

	start(state: State) {
		if (this.current) throw new Error('Process is initiated already.');

		this.release(state);

		return this;
	}

	private release(state: State) {
		const process = (
			this.releasable
				.released()
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

		this.release(state || this.current.state);

		return OK;
	}
}
