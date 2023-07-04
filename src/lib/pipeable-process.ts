import { AbstractProcess } from './abstract-process';
import { trampolineAsync } from './utils/trampoline-async';
import { CompleteHandler, IInitializableProcess, IInitiatedProcess } from './types';
import { OK } from './constants';

export class PipeableProcess<State> extends AbstractProcess<
	State,
	IInitializableProcess<State>[]
> {
	protected current?: IInitiatedProcess<State>;

	constructor(options: IInitializableProcess<State>[]) {
		super(options);
	}

	run(state: State) {
		// Starting processes with the trampoline to avoid stack accumulation
		trampolineAsync(() => this.startProcess(this._options, 0, state));

		// Stopping pipeline emits stopping the current process
		this.sub('stop', status => this.current?.stop(status));

		return OK;
	}

	private startProcess(
		processes: IInitializableProcess<State>[],
		id: number,
		state: State
	): Promise<any> {
		return new Promise(resolve => {
			// It won't start the next process if the pipeline is stopped
			if (!this.__working) return resolve(undefined);

			const process = processes[id];

			const startNext: CompleteHandler<State> = state => {
				console.log('Process is completed, starting the next one');
				
				const isLast = id === processes.length - 1;

				// Pipeline stops at the last process
				if (isLast) resolve(undefined);
				else resolve(() => this.startProcess(processes, id + 1, state));
			};

			this.current = process
				.initiated()
				.sub('complete', startNext)
				.sub('fault', this.fault)
				.start(state);
		});
	}
}
