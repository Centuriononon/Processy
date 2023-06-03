import { AbstractObservableProcess } from '../abstract-observable-process';
import { IRestartableStartedProcess } from '../types';

export class StartedRestartableOnEventProcess<State>
	extends AbstractObservableProcess<State>
	implements IRestartableStartedProcess<State>
{
	protected count: number = 0;

	constructor(
		protected readonly process: IRestartableStartedProcess<State>,
		protected readonly args: {
			event: 'complete' | 'stop' | 'fault';
			times: number;
		}
	) {
		super();
	}

	init(state: State) {
		if (this.args.times <= 0)
			throw new Error(
				`Bad "times" arg to start process: ${this.args.times}.` +
					`Only numbers greater than zero or Infinity are allowed.`
			);

		this.process
			.sub(this.args.event, value => {
				const isLoop = this.args.times === Infinity;
				const isLast = ++this.count === this.args.times;

				isLoop || !isLast
					? this.restart('OK')
					: this.pub(this.args.event, value);
			})
			.init(state);

		return this;
	}

	stop = this.process.stop.bind(this.process);
	restart = this.process.restart.bind(this.process);
}
