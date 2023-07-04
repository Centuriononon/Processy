import { IInitiatedRestartableProcess } from 'lib/types';
import { AbstractObservableProcess } from '../abstract-observable-process';

export class InitiatedRestartableOnEventProcess<State>
	extends AbstractObservableProcess<State>
	implements IInitiatedRestartableProcess<State>
{
	protected count: number = 0;
	protected stopped: boolean = false;

	constructor(
		protected readonly process: IInitiatedRestartableProcess<State>,
		protected readonly args: {
			event: 'complete' | 'stop' | 'fault';
			times: number;
		}
	) {
		super();
	}

	working = this.process.working.bind(this.process);
	// message = this.process.message.bind(this.process);
	restart = this.process.restart.bind(this.process);

	stop(status: 'OK' | 'BAD') {
		this.stopped = true;
		return this.process.stop(status);
	}
	
	start(state: State) {
		if (this.args.times < 0) {
			throw new Error('Incorrect number of restarts: ' + this.args.times);
		}

		const handleEvent = (value: string | State) => {
			if (!this.stopped) {
				const isLoop = this.args.times === Infinity;
				const isLast = ++this.count === this.args.times;

				isLoop || !isLast
					? this.restart('OK')
					: this.pub(this.args.event, value);
			}
		}

		this.process
			.sub(this.args.event, handleEvent)
			.start(state);

		return this;
	}
}