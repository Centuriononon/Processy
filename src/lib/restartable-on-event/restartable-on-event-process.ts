import { IRestartableProcess } from '../types';
import { 
	InitiatedRestartableOnEventProcess 
} from './initiated-restartable-on-event-process';

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

	initiated() {
		return new InitiatedRestartableOnEventProcess(
			this.process.initiated(),
			this.args
		);
	}
}
