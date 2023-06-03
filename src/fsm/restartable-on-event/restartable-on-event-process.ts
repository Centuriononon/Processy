import { IRestartableProcess } from 'fsm/types';
import { Args } from './types';
import { 
	StartedRestartableOnEventProcess 
} from './started-restartable-on-event-process';

export class RestartableOnEventProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	constructor(
		protected readonly process: IRestartableProcess<Ctx, State>,
		protected readonly args: Args
	) {}

	started(ctx: Ctx) {
		return new StartedRestartableOnEventProcess(
			this.process.started(ctx),
			this.args
		);
	}
}
