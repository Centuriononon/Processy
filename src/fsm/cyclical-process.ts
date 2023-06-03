import { IRestartableProcess } from './types';
import { 
	RestartableOnEventProcess 
} from './restartable-on-event/restartable-on-event-process';

export class CyclicalProcess<Ctx, State>
	extends RestartableOnEventProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	constructor(
		process: IRestartableProcess<Ctx, State>,
		{ cycles, countFaults }: { cycles: number; countFaults?: boolean }
	) {
		super(process, {
			event: countFaults ? 'stop' : 'complete',
			times: cycles
		});
	}
}
