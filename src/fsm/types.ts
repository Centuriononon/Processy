import { Process } from "./process";

export interface ProcessConstructor<Ctx, State> {
    new(ctx: Ctx): Process<Ctx, State>
}

export type CompleteHandler<State> = (s: State) => void;
export type CrashHandler<Reason> = (r: Reason) => void; 
