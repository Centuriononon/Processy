import { AbstractObservableProcess } from './abstract-observable-process';
import { AbstractProcess } from './abstract-process';

export interface IProcess<State> extends AbstractObservableProcess<State> {
	start(state: State): this;
	// message(body: Msg): 'OK';
	working(): boolean;
	stop(status: 'OK' | 'BAD'): 'OK';
}

export interface IConstructableProcess<State, Options> {
	new(options: Options): IProcess<State>;
}

export interface IInitializableProcess<State> {
	initiated(): IInitiatedProcess<State>;
}

export interface IRestartableProcess<State>
	extends IInitializableProcess<State> {
	initiated(): IInitiatedRestartableProcess<State>;
}

export interface IInitiatedRestartableProcess<State>
	extends AbstractObservableProcess<State>, 
	IInitiatedProcess<State> {
	restart(status: 'OK' | 'BAD', state?: State): 'OK';
}

export interface IInitiatedProcess<State>
	extends AbstractObservableProcess<State> {
	start(state: State): this;
	stop: IProcess<State>['stop'];
	working(): boolean;
}

export interface IServicingStartedProcess<State> extends IInitiatedProcess<State> {
	
}

export type CompleteHandler<State> = (s: State) => void;
export type FaultHandler<Reason> = (r: Reason) => void;
export type StopHandler<Status> = (s: Status) => void;