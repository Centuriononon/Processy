import { Process } from "./process";
import { IStartableProcess, IConstructableProcess } from "./types";

export class StartableProcess<Ctx, State, Options>
    implements IStartableProcess<Ctx, State, Options> {
    constructor(
        private readonly process: IConstructableProcess<Ctx, State, Options>,
        private readonly option: Options
    ) { }

    initiated(ctx: Ctx, state: State) {
        return new this.process(ctx, state);
    }

    started(initiated: Process<Ctx, State, Options>) {
        return initiated.start(this.option);
    }

    start(ctx: Ctx, state: State) {
        this.started(this.initiated(ctx, state));

        return 'OK' as const;
    }
}
