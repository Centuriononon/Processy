import { OK } from '../constants';
import { AbstractObservableProcess } from '../abstract-observable-process';
import { IStartedRestartableProcess } from '../types';

export class StartedRestartableOnEventProcess<State, Msg>
	extends AbstractObservableProcess<State>
	implements IStartedRestartableProcess<State, Msg>
{
	protected count: number = 0;
	protected stopped: boolean = false;

	constructor(
		protected readonly process: IStartedRestartableProcess<State, Msg>,
		protected readonly args: {
			event: 'complete' | 'stop' | 'fault';
			times: number;
		}
	) {
		super();
	}

	working = this.process.working.bind(this.process);
	message = this.process.message.bind(this.process);
	stop(status: 'OK' | 'BAD') {
		this.stopped = true;
		return this.process.stop(status);
	}
	restart = this.process.restart.bind(this.process);

	init(state: State) {
		if (this.args.times <= 0)
			throw new Error(
				`Bad "times" arg to start process: ${this.args.times}.` +
					`Only numbers greater than zero or Infinity are allowed.`
			);

		this.process
			.sub(this.args.event, value => {
				if (!this.stopped) {
					const isLoop = this.args.times === Infinity;
					const isLast = ++this.count === this.args.times;
	
					isLoop || !isLast
						? this.restart('OK')
						: this.pub(this.args.event, value);
				}
			})
			.init(state);

		return this;
	}
}
