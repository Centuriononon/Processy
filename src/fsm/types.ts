import { Process } from "./process";

export interface ProcessConstructor<Ctx, State, Option> {
    new(ctx: Ctx, state: State): Process<Ctx, State, Option>
}

export type CompleteHandler<State> = (s: State) => void;
export type CrashHandler<Reason> = (r: Reason) => void; 

export interface IStartableProcess<Ctx, State, Process> {
    initiated: (ctx: Ctx, state: State) => Process
    started: (initiatedProcess: Process) => Process
}