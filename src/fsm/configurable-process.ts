import { CyclicalProcess } from './cyclical-process';
import { FaultToleranceProcess } from './fault-tolerance-process';
import { RestartableProcess } from './restartable/restartable-process';
import { IRestartableProcess, IStartableProcess } from './types';

export class ConfigurableProcess<Ctx, State>
	implements IRestartableProcess<Ctx, State>
{
	private readonly process: IRestartableProcess<Ctx, State>;
	private configuredProcess?: IRestartableProcess<Ctx, State>;

	constructor(
		process: IStartableProcess<Ctx, State>,
		private readonly config: {
			faultTolerance?: {
				faults: number;
			};
			cyclical?: {
				cycles: number;
				countFaults?: boolean;
			};
		}
	) {
		this.process = new RestartableProcess(process);
	}

	started(ctx: Ctx) {
        if (!this.configuredProcess) {
            var process = this.process;
    
            const { faultTolerance, cyclical } = this.config;
    
            if (faultTolerance)
                process = new FaultToleranceProcess(process, faultTolerance);
    
            if (cyclical) process = new CyclicalProcess(process, cyclical);
    
            this.configuredProcess = process;
        } 

		return this.configuredProcess.started(ctx);
	}
}
