import { AbstractObservableProcess } from '../abstract-observable-process';
import { OK } from '../constants';
import {
	IStartedRestartableProcess,
	IStartableProcess,
	IStartedProcess
} from '../types';

export class RestartableStartedProcess<Ctx, State, Msg>
	extends AbstractObservableProcess<State>
	implements IStartedRestartableProcess<State, Msg>
{
	private current?: {
		state: State;
		process: IStartedProcess<State, Msg>;
	};

	constructor(
		private readonly startable: IStartableProcess<Ctx, State, Msg>,
		private readonly ctx: Ctx
	) {
		super();
	}

	working() {
		if (!this.current) throw new Error('Process is not initiated yet.');

		return this.current.process.working();
	}

	message(body: Msg) {
		if (!this.current) throw new Error('Process is not initiated yet.');

		return this.current.process.message(body);
	}

	init(state: State) {
		if (this.current) throw new Error('Process is initiated already.');

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
		if (!this.current) throw new Error('Process is not initiated yet.');

		this.current.process.stop(status);

		return OK;
	}

	restart(status: 'OK' | 'BAD', state?: State) {
		if (!this.current) throw new Error('Process is not initiated yet.');

		if (this.working()) this.stop(status);

		this.start(state || this.current.state);

		return OK;
	}
}
