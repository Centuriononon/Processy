import { RestartableStartedProcess } from './restartable-started-process';
import { IStartableProcess, IRestartableProcess } from './types';

export class RestartableProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	constructor(private readonly startable: IStartableProcess<Ctx, State>) {}

	started(ctx: Ctx) {
		return new RestartableStartedProcess(this.startable, ctx);
	}
}
