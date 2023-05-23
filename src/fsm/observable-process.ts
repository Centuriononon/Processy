import { PubSub } from '../utils/pub-sub';

export abstract class ObservableProcess<
    State, CrashReason = string, StopStatus = string
> extends PubSub<{ complete: State, crash: CrashReason, stop: StopStatus }> {
    constructor() {
        super();
    }
}