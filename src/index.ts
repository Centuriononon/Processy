export const trampolineAsync =
    async <T extends () => Promise<any>>(lazyPromise: () => Promise<T>) => {
        const isFn = lazyPromise && typeof lazyPromise === 'function';
        while (isFn) lazyPromise = await lazyPromise();
    }

class PubSub<T> {
    private handlers: { [eventName in keyof T]?: ((value: T[eventName]) => void)[] }

    constructor() {
        this.handlers = {}
    }

    pub<K extends keyof T>(event: K, value: T[K]): void {
        this.handlers[event]?.forEach(h => h(value));
    }

    sub<K extends keyof T>(event: K, handler: (value: T[K]) => void): this {
        this.handlers[event] = [...(this.handlers[event] || []), handler]

        return this;
    }
}

abstract class ObservableProcess<
    State, CrashReason = string, StopStatus = string
> extends PubSub<{ complete: State, crash: CrashReason, stop: StopStatus}> {
    constructor() {
        super();
    }
}

abstract class Process<Ctx, State> extends ObservableProcess<State, string, 'OK' | 'ERR'> {
    protected _state?: State;

    protected _working: boolean = false;

    constructor(protected readonly _ctx: Ctx) {
        super();
    }

    protected abstract run(initialState: State): 'OK';

    init(initialState: State) {
        this._state = initialState;
        this._working = true;
        this.run(initialState);

        return this;
    }

    stop(status: 'OK' | 'ERR') {
        this.pub('stop', status);
        this._working = false;
    }

    protected complete(state: State) {
        this.pub('complete', state);
        this.stop('OK');
    }

    protected crash(reason: string) {
        this.pub('crash', reason);
        this.stop('OK');
    }
}

interface ProcessConstructor<Ctx, State> {
    new (ctx: Ctx): Process<Ctx, State>
}

class StartableProcess<Ctx, State> {
    constructor(private readonly _process: ProcessConstructor<Ctx, State>) { }

    instance(ctx: Ctx) {
        return new this._process(ctx);
    }
}

type CompleteHandler<State> = (s: State) => void;
type CrashHandler<Reason> = (r: Reason) => void; 

class PipeableProcess<Ctx, State> extends Process<Ctx, State> {
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