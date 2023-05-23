import { ProcessConstructor } from "./types";

export class StartableProcess<Ctx, State> {
    constructor(private readonly _process: ProcessConstructor<Ctx, State>) { }

    instance(ctx: Ctx) {
        return new this._process(ctx);
    }
}
