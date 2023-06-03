import { RestartableStartedProcess } from './started-restartable-process';
import { IStartableProcess, IRestartableProcess } from '../types';

export class RestartableProcess<Ctx, State, Msg>
	implements IRestartableProcess<Ctx, State, Msg>
{
	constructor(
		private readonly startable: IStartableProcess<Ctx, State, Msg>
	) {}

	started(ctx: Ctx) {
		return new RestartableStartedProcess(this.startable, ctx);
	}
}
