import { Process } from "./process";
import { IStartableProcess, ProcessConstructor } from "./types";

export class StartableProcess<Ctx, State, Option> 
implements IStartableProcess<Ctx, State, Process<Ctx, State, Option>> {
    constructor(
        private readonly process: ProcessConstructor<Ctx, State, Option>,
        private readonly option: Option
    ) { }

    initiated(ctx: Ctx, state: State) {
        return new this.process(ctx, state);
    }

    started(process: Process<Ctx, State, Option>) {
        return process.start(this.option);
    }

    start(ctx: Ctx, state: State) {
        this.started(this.initiated(ctx, state));

        return 'OK' as const;
    }
}
