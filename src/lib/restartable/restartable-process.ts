import { ReleasedRestartableProcess } from './released-restartable-process';
import { IReleasableProcess } from '../types';

export class RestartableProcess<Ctx, State>
	implements IReleasableProcess<Ctx, State>
{
	constructor(
		private readonly startable: IReleasableProcess<Ctx, State>
	) {}

	released(ctx: Ctx) {
		return new ReleasedRestartableProcess(this.startable, ctx);
	}
}
