import { IRestartableProcess } from '../types';
import { 
	ReleasedRestartableOnEventProcess 
} from './released-restartable-on-event-process';

export class RestartableOnEventProcess<State>
	implements IRestartableProcess<State>
{
	constructor(
		protected readonly process: IRestartableProcess<State>,
		protected readonly args: {
			event: 'complete' | 'stop' | 'fault'
			times: number
		}
	) {}

	released() {
		return new ReleasedRestartableOnEventProcess(
			this.process.released(),
			this.args
		);
	}
}
