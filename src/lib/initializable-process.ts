import { IConstructableProcess, IInitializableProcess } from './types';

export class InitializableProcess<Ctx, State, Options, Msg>
	implements IInitializableProcess<Ctx, State, Msg>
{
	constructor(
		private readonly process: IConstructableProcess<
			Ctx,
			State,
			Options,
			Msg
		>,
		private readonly options: Options
	) {}

	initiated(ctx: Ctx) {
		return new this.process(ctx, this.options);
	}
}
