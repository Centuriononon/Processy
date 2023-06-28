import { IReleasableProcess } from "lib/types";
import { ReleasedProtectedProcess } from "./released-protected-process";

export class ProtectedProcess<Ctx, State> implements IReleasableProcess<Ctx, State> {
    constructor(
        private readonly process: IReleasableProcess<Ctx, State>
    ) { }

    released(ctx: Ctx) {
        return new ReleasedProtectedProcess(this.process.released(ctx));
    };
}