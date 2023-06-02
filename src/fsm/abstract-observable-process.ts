import { PubSub } from '../utils/pub-sub';

export abstract class AbstractObservableProcess<State, Reason = string, Status = string> 
    extends PubSub<{ complete: State, crash: Reason, stop: Status }> {
    constructor() {
        super();
    }
}