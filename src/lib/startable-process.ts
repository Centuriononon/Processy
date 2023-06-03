import { StartedProcess } from './started-process';
import { IStartableProcess, IInitializableProcess } from './types';

export class StartableProcess<Ctx, State, Msg>
	implements IStartableProcess<Ctx, State, Msg>
{
	constructor(
		private readonly process: IInitializableProcess<Ctx, State, Msg>
	) {}

	started(ctx: Ctx) {
		return new StartedProcess(this.process.initiated(ctx));
	}
}
