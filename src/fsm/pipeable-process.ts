import { AbstractProcess } from './abstract-process';
import { trampolineAsync } from '../utils/trampoline-async';
import { CompleteHandler, IStartableProcess, IStartedProcess } from './types';
import { OK } from './constants';

export class PipeableProcess<Ctx, State> extends AbstractProcess<
	Ctx,
	State,
	IStartableProcess<Ctx, State>[]
> {
	protected _current?: IStartedProcess<State>;

	constructor(ctx: Ctx, options: IStartableProcess<Ctx, State>[]) {
		super(ctx, options);
	}

	run(state: State) {
		trampolineAsync(
			// Ids how to type it ;)
			() => this.startProcess(this._options, 0, state) as Promise<any>
		);

		return OK;
	}

	private startProcess(
		processes: IStartableProcess<Ctx, State>[],
		id: number,
		state: State
	) {
		return new Promise(resolve => {
			const process = processes[id];

			const isLast = id === processes.length - 1;
			const nextID = isLast ? 0 : id + 1;

			const startNext: CompleteHandler<State> = nextState =>
				resolve(() => this.startProcess(processes, nextID, nextState));

			this._current = process
				.started(this._ctx)
				.sub('complete', startNext)
				.sub('crash', this.crash)
				.init(state);
		});
	}
}
