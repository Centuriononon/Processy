import { ObservableProcess } from "./observable-process";

export abstract class Process<Ctx, State, Options = void> extends ObservableProcess<State> {
    protected _working: boolean = false;
    protected _inited: boolean = false;

    constructor(protected readonly _ctx: Ctx, protected _state: State) {
        super();
    }

    protected abstract run(option: Options): 'OK';

    start(option: Options) {
        if (this._inited) throw new Error('Second init() call of process');

        this._working = true;
        this._inited = true;
        this.run(option);

        return this;
    }

    stop(status: 'OK' | 'ERR') {
        this.pub('stop', status);
        this._working = false;
    }

    protected complete = (state: State) => {
        this.pub('complete', state);
        this.stop('OK');
    }

    protected crash = (reason: string) => {
        this.pub('crash', reason);
        this.stop('OK');
    }
}