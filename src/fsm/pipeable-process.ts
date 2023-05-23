import { StartableProcess } from "./startable-process";
import { Process } from "./process";
import { trampolineAsync } from "../utils/trampoline-async";
import { CompleteHandler, CrashHandler } from "./types";

export class PipeableProcess<Ctx, State> extends Process<Ctx, State> {
    protected _current?: Process<Ctx, State>;

    constructor(
        private readonly ctx: Ctx,
        private readonly processes: StartableProcess<Ctx, State>[]
    ) {
        super(ctx);
    }

    run(initialState: State) {
        trampolineAsync(() => this.startProcess(0, initialState));

        return 'OK' as const;
    }

    private startProcess(id: number, state: State): Promise<any> {
        return new Promise(resolve => {
            const process = this.processes[id];

            const isLast = id === this.processes.length - 1;
            const nextID = isLast ? 0 : id + 1;

            const nextProcess: CompleteHandler<State> =
                state => resolve(() => this.startProcess(nextID, state));

            const restartPipeline: CrashHandler<string> =
                _reason => resolve(() => this.startProcess(0, state));

            this._current = process.instance(this.ctx)
                .sub('complete', nextProcess)
                .sub('crash', restartPipeline)
                .init(state);
        });
    }
}