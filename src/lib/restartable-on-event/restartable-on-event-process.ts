import { IRestartableProcess } from '../types';
import { 
	ReleasedRestartableOnEventProcess 
} from './released-restartable-on-event-process';

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

	released(ctx: Ctx) {
		return new ReleasedRestartableOnEventProcess(
			this.process.released(ctx),
			this.args
		);
	}
}
