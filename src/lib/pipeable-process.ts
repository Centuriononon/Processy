import { AbstractProcess } from './abstract-process';
import { trampolineAsync } from './utils/trampoline-async';
import { CompleteHandler, IReleasableProcess, IReleasedProcess } from './types';
import { OK } from './constants';

export class PipeableProcess<Ctx, State> extends AbstractProcess<
	Ctx,
	State,
	IReleasableProcess<Ctx, State>[]
> {
	protected current?: IReleasedProcess<State>;

	constructor(ctx: Ctx, options: IReleasableProcess<Ctx, State>[]) {
		super(ctx, options);
	}

	run(state: State) {
		// Starting processes with the trampoline to avoid stack accumulation
		trampolineAsync(() => this.startProcess(this._options, 0, state));

		// Stopping pipeline emits stopping the current process
		this.sub('stop', status => this.current?.stop(status));

		return OK;
	}

	private startProcess(
		processes: IReleasableProcess<Ctx, State>[],
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
				.released(this._ctx)
				.sub('complete', startNext)
				.sub('fault', this.fault)
				.start(state);
		});
	}
}
