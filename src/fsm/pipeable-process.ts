import { Process } from "./process";
import { trampolineAsync } from "../utils/trampoline-async";
import { CompleteHandler, CrashHandler, IStartableProcess } from "./types";

interface InitialOptions<Ctx, State> {
    processes: IStartableProcess<Ctx, State, any>[],
    crashing?: 'RESTART' | 'CRASH',
    processing?: 'LOOP' | 'ONCE' 
}

interface Options<Ctx, State> extends InitialOptions<Ctx, State> {
    crashing: 'RESTART' | 'CRASH',
    processing: 'LOOP' | 'ONCE'
}

export class PipeableProcess<Ctx, State>
    extends Process<Ctx, State, InitialOptions<Ctx, State>> {
    protected _current?: Process<Ctx, State, any>;

    constructor(ctx: Ctx, state: State) {
        super(ctx, state);
    }

    run({ processes, crashing, processing }: InitialOptions<Ctx, State>) {
        const options = {
            processes,
            crashing: crashing || 'CRASH',
            processing: processing || 'ONCE'
        }

        trampolineAsync(() => this.startProcess(options, 0, this._state));

        return 'OK' as const;
    }

    private startProcess(options: Options<Ctx, State>, id: number, state: State): Promise<any> {
        return new Promise(resolve => {
            const { processes, crashing, processing } = options;

            const process = processes[id];

            const isLast = id === processes.length - 1;
            const nextID = isLast ? 0 : id + 1;

            const startNext: CompleteHandler<State> =
                state => resolve(() => this.startProcess(options, nextID, state));

            const restartPipeline: CrashHandler<string> = 
                () => resolve(() => this.startProcess(options, 0, state));
                
            const completeHandler = isLast && processing === 'ONCE' 
                ? this.complete : startNext;

            const crashHandler = crashing === 'CRASH' 
                ? this.crash : restartPipeline;

            this._current = process.started(
                process.initiated(this._ctx, this._state)
                    .sub('complete', completeHandler)
                    .sub('crash', crashHandler)
            );
        });
    }
}