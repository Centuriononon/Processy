import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class FaultToleranceProcess<Ctx, State>
	extends RestartableOnEventProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	constructor(
		process: IRestartableProcess<Ctx, State>,
		{ faults }: { faults: number }
	) {
		super(process, { event: 'fault', times: faults });
	}
}
