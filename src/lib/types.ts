import { AbstractObservableProcess } from './abstract-observable-process';
import { AbstractProcess } from './abstract-process';

export interface IProcess<State> extends AbstractObservableProcess<State> {
	start(state: State): this;
	// message(body: Msg): 'OK';
	working(): boolean;
	stop(status: 'OK' | 'BAD'): 'OK';
}

export interface IConstructableProcess<Ctx, State, Options> {
	new(ctx: Ctx, options: Options): IProcess<State>;
}

export interface IReleasableProcess<Ctx, State> {
	released(ctx: Ctx): IReleasedProcess<State>;
}

export interface IRestartableProcess<Ctx, State>
	extends IReleasableProcess<Ctx, State> {
	released(ctx: Ctx): IReleasedRestartableProcess<State>;
}

export interface IReleasedRestartableProcess<State>
	extends AbstractObservableProcess<State>, 
	IReleasedProcess<State> {
	restart(status: 'OK' | 'BAD', state?: State): 'OK';
}

export interface IReleasedProcess<State>
	extends AbstractObservableProcess<State> {
	start(state: State): this;
	stop: IProcess<State>['stop'];
	working(): boolean;
}

export interface IServicingStartedProcess<State> extends IReleasedProcess<State> {
	
}

export type CompleteHandler<State> = (s: State) => void;
export type FaultHandler<Reason> = (r: Reason) => void;
export type StopHandler<Status> = (s: Status) => void;