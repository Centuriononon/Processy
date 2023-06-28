import { IConstructableProcess, IInitializableProcess } from './types';

export class InitializableProcess<Ctx, State, Options>
	implements IInitializableProcess<Ctx, State>
{
	constructor(
		private readonly process: IConstructableProcess<Ctx, State, Options>,
		private readonly options: Options
	) { }

	initiated(ctx: Ctx) {
		return new this.process(ctx, this.options);
	}
}
