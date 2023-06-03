import { AbstractObservableProcess } from "./abstract-observable-process";
import { OK } from "./constants";
import { IProcess } from "./types";

export abstract class AbstractProcess<Ctx, State, Options = void> 
    extends AbstractObservableProcess<State> 
    implements IProcess<State> {
    protected _working: boolean = false;
    protected _initiated: boolean = false;

    constructor(
        protected readonly _ctx: Ctx, 
        protected readonly _options: Options
    ) {
        super();
    }

    protected abstract run(state: State): 'OK';

    start(state: State) {
        if (this._initiated) 
            throw new Error(
				'It is not possible to run this process more than once.'
			);

        this._working = true;
        this._initiated = true;
        this.run(state);

        return this;
    }

    stop(status: 'OK' | 'BAD') {
        this.pub('stop', status);
        this._working = false;
        return OK;
    }

    protected complete = (state: State) => {
        this.pub('complete', state);
        this.stop('OK');
    }

    protected fault = (reason: string) => {
        this.pub('fault', reason);
        this.stop('OK');
    }
}