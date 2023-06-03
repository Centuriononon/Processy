import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class FaultToleranceProcess<Ctx, State, Msg>
	extends RestartableOnEventProcess<Ctx, State, Msg>
	implements IRestartableProcess<Ctx, State, Msg>
{
	constructor(
		process: IRestartableProcess<Ctx, State, Msg>,
		{ faults }: { faults: number }
	) {
		super(process, { event: 'fault', times: faults });
	}
}
