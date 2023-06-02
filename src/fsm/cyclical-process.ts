import { CyclicalStartedProcess } from './cyclical-started-process';
import { IRestartableProcess } from './types';

export class CyclicalProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
    private readonly cycles: number;

	constructor(
		private readonly process: IRestartableProcess<Ctx, State>,
		{ cycles }: { cycles: number }
	) {
        this.cycles = cycles;
    }

	started(ctx: Ctx) {
		return new CyclicalStartedProcess(
			this.process.started(ctx),
			this.cycles
		);
	}
}
