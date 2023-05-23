import { Process } from "./process";

export interface IConstructableProcess<Ctx, State, Option> {
    new(ctx: Ctx, state: State): Process<Ctx, State, Option>
}

export type CompleteHandler<State> = (s: State) => void;
export type CrashHandler<Reason> = (r: Reason) => void;

export interface IStartableProcess<Ctx, State, Option> {
    initiated: (ctx: Ctx, state: State) => Process<Ctx, State, Option>
    started: (initiated: Process<Ctx, State, Option>) => Process<Ctx, State, Option>
}


