import { AbstractObservableProcess } from './abstract-observable-process';
import { AbstractProcess } from './abstract-process';

export interface IProcess<State, Msg> extends AbstractObservableProcess<State> {
	start(state: State): this;
	message(body: Msg): 'OK';
	working(): boolean;
	stop(status: 'OK' | 'BAD'): 'OK';
}

export interface IConstructableProcess<Ctx, State, Options, Msg> {
	new (ctx: Ctx, options: Options): IProcess<State, Msg>;
}

export interface IInitializableProcess<Ctx, State, Msg> {
	initiated(ctx: Ctx): IProcess<State, Msg>;
}

export interface IReinitializableProcess<Ctx, State, Options, Msg>
	extends IInitializableProcess<Ctx, State, Msg>,
		AbstractObservableProcess<State>,
		AbstractProcess<Ctx, State, Options> {
	reinitiated(state: State): 'OK';
}

export interface IStartableProcess<Ctx, State, Msg> {
	started(ctx: Ctx): IStartedProcess<State, Msg>;
}

export interface IRestartableProcess<Ctx, State, Msg>
	extends IStartableProcess<Ctx, State, Msg> {
	started(ctx: Ctx): IStartedRestartableProcess<State, Msg>;
}

export interface IStartedRestartableProcess<State, Msg>
	extends AbstractObservableProcess<State>,
		IStartedProcess<State, Msg> {
	restart(status: 'OK' | 'BAD', state?: State): 'OK';
}

export interface IStartedProcess<State, Msg>
	extends AbstractObservableProcess<State> {
	init(state: State): this;
	stop: IProcess<State, Msg>['stop'];
	working(): boolean;
	message(body: Msg): 'OK';
}

export type CompleteHandler<State> = (s: State) => void;
export type FaultHandler<Reason> = (r: Reason) => void;
export type StopHandler<Status> = (s: Status) => void;
