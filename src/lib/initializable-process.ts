import { InitiatedProcess } from './initiated-process';
import { IInitializableProcess, IConstructableProcess } from './types';

export class InitializableProcess<State, Options> 
	implements IInitializableProcess<State> 
{
	constructor(
		private readonly process: IConstructableProcess<State, Options>,
		private readonly options: Options
	) { }

	initiated() {
		return new InitiatedProcess(new this.process(this.options));
	}
}
