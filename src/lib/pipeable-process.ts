import { AbstractProcess } from './abstract-process';
import { trampolineAsync } from './utils/trampoline-async';
import { CompleteHandler, IStartableProcess, IStartedProcess } from './types';
import { OK } from './constants';

export class PipeableProcess<Ctx, State, Msg> extends AbstractProcess<
	Ctx,
	State,
	IStartableProcess<Ctx, State, Msg>[],
	Msg
> {
	protected current?: IStartedProcess<State, Msg>;

	constructor(ctx: Ctx, options: IStartableProcess<Ctx, State, Msg>[]) {
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
		processes: IStartableProcess<Ctx, State, Msg>[],
		id: number,
		state: State
	): Promise<any> {
		return new Promise(resolve => {
			// It won't start the next process if the pipeline is stopped
			if (!this.__working) return resolve(undefined);

			const process = processes[id];

			const startNext: CompleteHandler<State> = state => {
				console.log(
					'Process stopped, starting the next in the pipeline'
				);
				
				const isLast = id === processes.length - 1;

				// Pipeline stops at the last process
				if (isLast) resolve(undefined);
				else resolve(() => this.startProcess(processes, id + 1, state));
			};

			this.current = process
				.started(this._ctx)
				.sub('complete', startNext)
				.sub('fault', this.fault)
				.init(state);
		});
	}

	protected msg(body: Msg) {
		if (this.current) this.current?.message(body);

		return OK;
	}
}
