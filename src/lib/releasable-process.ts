import { ReleasedProcess } from './released-process';
import { IReleasableProcess, IConstructableProcess } from './types';

export class ReleasableProcess<State, Options> 
	implements IReleasableProcess<State> 
{
	constructor(
		private readonly process: IConstructableProcess<State, Options>,
		private readonly options: Options
	) { }

	released() {
		return new ReleasedProcess(new this.process(this.options));
	}
}
