import { AbstractObservableProcess } from './abstract-observable-process';
import { OK } from './constants';
import { IProcess } from './types';

export abstract class AbstractProcess<Ctx, State, Options = void, Msg = void>
	extends AbstractObservableProcess<State>
	implements IProcess<State, Msg>
{
	protected __working: boolean = false;
	protected __initiated: boolean = false;

	constructor(
		protected readonly _ctx: Ctx,
		protected readonly _options: Options
	) {
		super();
	}

	readonly working = () => this.__working;

	
	protected msg(body: Msg): 'OK' {
		throw new Error(
			'Message processing is not implemented in this process.' +
			'\nMessage body:\n' +
			JSON.stringify(body)
		);
		
		return OK;
	}
	
	readonly message = (body: Msg) => {
		if (this.__working) this.msg(body);
		
		return OK;
	};
	
	protected abstract run(state: State): 'OK';
	
	readonly start = (state: State) => {
		if (this.__initiated) 
            throw new Error('Process has already been started.');

		this.__working = true;
		this.__initiated = true;
		this.run(state);

		return this;
	};

	readonly stop = (status: 'OK' | 'BAD') => {
		this.pub('stop', status);
		this.__working = false;
		return OK;
	};

	protected complete = (state: State) => {
		this.stop('OK');
		this.pub('complete', state);
	};

	protected fault = (reason: string) => {
		this.stop('BAD');
		this.pub('fault', reason);
	};
}
