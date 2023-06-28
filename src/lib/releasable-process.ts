import { ReleasedProcess } from './released-process';
import { IReleasableProcess, IConstructableProcess } from './types';

export class ReleasableProcess<Ctx, State, Options> 
	implements IReleasableProcess<Ctx, State> 
{
	constructor(
		private readonly process: IConstructableProcess<Ctx, State, Options>,
		private readonly options: Options
	) { }

	released(ctx: Ctx) {
		return new ReleasedProcess(new this.process(ctx, this.options));
	}
}
