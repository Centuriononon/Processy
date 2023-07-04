import { IReleasableProcess } from "lib/types";
import { ReleasedProtectedProcess } from "./released-protected-process";

export class ProtectedProcess<State> implements IReleasableProcess<State> {
    constructor(
        private readonly process: IReleasableProcess<State>
    ) { }

    released() {
        return new ReleasedProtectedProcess(this.process.released());
    };
}