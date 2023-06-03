import { IRestartableProcess } from './../types';
import { StartedFaultToleranceProcess } from './started-fault-tolerance-process';

export class FaultToleranceProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	private readonly faults: number;

	constructor(
		private readonly process: IRestartableProcess<Ctx, State>,
		{ faults }: { faults: number }
	) {
		this.faults = faults;
	}

	started(ctx: Ctx) {
		return new StartedFaultToleranceProcess(
			this.process.started(ctx),
			this.faults
		);
	}
}
