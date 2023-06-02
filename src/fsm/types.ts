import { AbstractObservableProcess } from './abstract-observable-process';
import { AbstractProcess } from './abstract-process';

export interface IProcess<State> extends AbstractObservableProcess<State> {
	start(state: State): this;
	stop(status: 'OK' | 'BAD'): 'OK';
}

export interface IConstructableProcess<Ctx, State, Options> {
	new (ctx: Ctx, options: Options): IProcess<State>;
}

export interface IInitializableProcess<Ctx, State> {
	initiated(ctx: Ctx): IProcess<State>;
}

export interface IReinitializableProcess<Ctx, State, Options>
	extends IInitializableProcess<Ctx, State>,
		AbstractObservableProcess<State>,
		AbstractProcess<Ctx, State, Options> {
	reinitiated(state: State): 'OK';
}

export interface IStartableProcess<Ctx, State> {
	started(ctx: Ctx): IStartedProcess<State>;
}

export interface IRestartableProcess<Ctx, State> 
	extends IStartableProcess<Ctx, State> {
	started(ctx: Ctx): IRestartableStartedProcess<State>;
}

export interface IRestartableStartedProcess<State>
	extends AbstractObservableProcess<State>,
		IStartedProcess<State> {
	restart(status: 'OK' | 'BAD', state?: State): 'OK';
}

export interface IStartedProcess<State>
	extends AbstractObservableProcess<State> {
	init(state: State): this;
	stop: IProcess<State>['stop'];
}

export type CompleteHandler<State> = (s: State) => void;
export type CrashHandler<Reason> = (r: Reason) => void;
export type StopHandler<Status> = (s: Status) => void;
