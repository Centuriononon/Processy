import { AbstractObservableProcess } from "lib/abstract-observable-process";
import { OK } from "lib/constants";
import { IReleasedProcess } from "lib/types";

export class ReleasedProtectedProcess<State>
    extends AbstractObservableProcess<State>
    implements IReleasedProcess<State>
{
    protected __working: boolean = false;
    protected __initiated: boolean = false;

    constructor(private readonly process: IReleasedProcess<State>) {
        super();
    }

    working = () => this.__working;

    start = (state: State) => {
        if (this.__initiated) throw new Error('Process has already been Released.');

        this.__working = true;
        this.__initiated = true;
        this.process.start(state);

        return this;
    };

    stop = (status: 'OK' | 'BAD') => {
        this.pub('stop', status);
        this.__working = false;
        this.process.stop(status);

        return OK;
    };
}