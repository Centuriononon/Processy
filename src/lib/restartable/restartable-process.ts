import { ReleasedRestartableProcess } from './released-restartable-process';
import { IReleasableProcess } from '../types';

export class RestartableProcess<State>
	implements IReleasableProcess<State>
{
	constructor(
		private readonly startable: IReleasableProcess<State>
	) {}

	released() {
		return new ReleasedRestartableProcess(this.startable);
	}
}
