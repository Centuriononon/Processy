import { IInitializableProcess } from '../types';
import { InitiatedRestartableProcess } from './initiated-restartable-process';

export class RestartableProcess<State>
	implements IInitializableProcess<State>
{
	constructor(
		private readonly startable: IInitializableProcess<State>
	) {}

	initiated() {
		return new InitiatedRestartableProcess(this.startable);
	}
}
