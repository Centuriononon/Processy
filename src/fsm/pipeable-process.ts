import { Process } from "./process";
import { trampolineAsync } from "../utils/trampoline-async";
import { CompleteHandler, CrashHandler, IStartableProcess } from "./types";

export class PipeableProcess<Ctx, State> extends Process<Ctx, State, any> {
    protected _current?: Process<Ctx, State, any>;

    constructor(ctx: Ctx, state: State) {
        super(ctx, state);
    }

    run(processes: IStartableProcess<Ctx, State, any>[]) {
        trampolineAsync(() => this.startProcess(processes, 0, this._state));

        return 'OK' as const;
    }

    private startProcess(
        processes: IStartableProcess<Ctx, State, any>[], 
        id: number, 
        state: State
    ): Promise<any> {
        return new Promise(resolve => {
            const process = processes[id];

            const isLast = id === processes.length - 1;
            const nextID = isLast ? 0 : id + 1;

            const nextProcess: CompleteHandler<State> =
                state => resolve(() => this.startProcess(processes, nextID, state));

            const restartPipeline: CrashHandler<string> =
                _reason => resolve(() => this.startProcess(processes, 0, state));

            this._current = process.started(
                process.initiated(this._ctx, this._state)
                    .sub('complete', nextProcess)
                    .sub('crash', restartPipeline)
            );
        });
    }
}