import { StartedProcess } from "./started-process";
import { IStartableProcess, IInitializableProcess } from "./types";

export class StartableProcess<Ctx, State>
    implements IStartableProcess<Ctx, State>
{
    constructor(private readonly process: IInitializableProcess<Ctx, State>) {}

    started(ctx: Ctx) {
        return new StartedProcess(this.process.initiated(ctx));
    }
}
