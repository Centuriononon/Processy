import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class CyclicalProcess<Ctx, State, Msg>
	extends RestartableOnEventProcess<Ctx, State, Msg>
	implements IRestartableProcess<Ctx, State, Msg>
{
	constructor(
		process: IRestartableProcess<Ctx, State, Msg>,
		{ cycles, countFaults }: { cycles: number; countFaults?: boolean }
	) {
		super(process, {
			event: countFaults ? 'stop' : 'complete',
			times: cycles
		});
	}
}
