import { AbstractObservableProcess } from './abstract-observable-process';
import { OK } from './constants';
import {
	IRestartableStartedProcess,
	IStartableProcess,
	IStartedProcess
} from './types';

export class RestartableStartedProcess<Ctx, State>
	extends AbstractObservableProcess<State>
	implements IRestartableStartedProcess<State>
{
	private current?: {
		state: State;
		process: IStartedProcess<State>;
	};

	constructor(
		private readonly startable: IStartableProcess<Ctx, State>,
		private readonly ctx: Ctx
	) {
		super();
	}

	init(state: State) {
		if (this.current)
            throw new Error(
				'It is not possible to run this process more than once.'
			);

		console.log('Initiated RestartableStartedProcess!');

        this.start(state);

		return this;
	}

	private started(state: State) {
		return this.startable
			.started(this.ctx)
			.sub('complete', state => this.pub('complete', state))
			.sub('stop', status => this.pub('stop', status))
			.sub('fault', reason => this.pub('fault', reason))
			.init(state);
	}

    private start(state: State) {
		this.current = { state, process: this.started(state) };

        return OK;
    }

	stop(status: 'OK' | 'BAD') {
		if (!this.current)
			throw new Error(
				'It is not possible to stop a not initiated process.'
			);

		this.current.process.stop(status);

		return OK;
	}

	restart(status: 'OK' | 'BAD', state?: State) {
		if (!this.current)
			throw new Error('Cannot restart due to no working process.');

		console.log('Restarted RestartableStartedProcess!');

        this.stop(status);
		this.start(state || this.current.state);

		return OK;
	}
}
