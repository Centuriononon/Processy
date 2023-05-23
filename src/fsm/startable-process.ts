import { Process } from "./process";
import { IStartableProcess, IConstructableProcess } from "./types";

export class StartableProcess<Ctx, State, Option>
    implements IStartableProcess<Ctx, State, Option> {
    constructor(
        private readonly process: IConstructableProcess<Ctx, State, Option>,
        private readonly option: Option
    ) { }

    initiated(ctx: Ctx, state: State) {
        return new this.process(ctx, state);
    }

    started(initiated: Process<Ctx, State, Option>) {
        return initiated.start(this.option);
    }

    start(ctx: Ctx, state: State) {
        this.started(this.initiated(ctx, state));

        return 'OK' as const;
    }
}
