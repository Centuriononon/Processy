import { Process } from "./process";

export interface IConstructableProcess<Ctx, State, Options> {
    new(ctx: Ctx, state: State): Process<Ctx, State, Options>
}

export type CompleteHandler<State> = (s: State) => void;
export type CrashHandler<Reason> = (r: Reason) => void;
export type StopHandler<Status> = (s: Status) => void;

export interface IStartableProcess<Ctx, State, Options> {
    initiated: (ctx: Ctx, state: State) => Process<Ctx, State, Options>
    started: (initiated: Process<Ctx, State, Options>) => Process<Ctx, State, Options>
    start: (ctx: Ctx, state: State) => 'OK';
}


