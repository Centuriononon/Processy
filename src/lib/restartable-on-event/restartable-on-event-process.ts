import { IRestartableProcess } from '../types';
import { 
	StartedRestartableOnEventProcess 
} from './started-restartable-on-event-process';

export class RestartableOnEventProcess<Ctx, State, Msg>
	implements IRestartableProcess<Ctx, State, Msg>
{
	constructor(
		protected readonly process: IRestartableProcess<Ctx, State, Msg>,
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
