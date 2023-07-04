import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class CyclicalProcess<State>
	extends RestartableOnEventProcess<State>
	implements IRestartableProcess<State>
{
	constructor(
		process: IRestartableProcess<State>,
		{ cycles }: { cycles: number; }
	) {
		super(process, {
			event: 'complete',
			times: cycles
		});
	}
}