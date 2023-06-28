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
		{ cycles }: { cycles: number; }
	) {
		super(process, {
			event: 'complete',
			times: cycles
		});
	}
}