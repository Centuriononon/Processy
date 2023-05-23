import { ObservableProcess } from "./observable-process";

export abstract class Process<Ctx, State> extends ObservableProcess<State, string, 'OK' | 'ERR'> {
    protected _state?: State;
    protected _working: boolean = false;
    protected _inited: boolean = false;

    constructor(protected readonly _ctx: Ctx) {
        super();
    }

    protected abstract run(initialState: State): 'OK';

    init(initialState: State) {
        if (this._inited) throw new Error('Second init() call of process');

        this._state = initialState;
        this._working = true;
        this._inited = true;
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