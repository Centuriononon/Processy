import { IRestartableProcess } from 'fsm/types';
import { 
	StartedRestartableOnEventProcess 
} from './started-restartable-on-event-process';

export class RestartableOnEventProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	constructor(
		protected readonly process: IRestartableProcess<Ctx, State>,
		protected readonly args: {
			event: 'complete' | 'stop' | 'fault'
			times: number
		}
	) {}

	started(ctx: Ctx) {
		return new StartedRestartableOnEventProcess(
			this.process.started(ctx),
			this.args
		);
	}
}
