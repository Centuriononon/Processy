import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class FaultToleranceProcess<State>
	extends RestartableOnEventProcess<State>
	implements IRestartableProcess<State>
{
	constructor(
		process: IRestartableProcess<State>,
		{ faults }: { faults: number }
	) {
		super(process, { event: 'fault', times: faults });
	}
}
