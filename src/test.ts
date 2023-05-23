import * as FSM from './index';

class ProcessA extends FSM.Process<'CONTEXT', 'STATE'> {
    constructor(private readonly ctx: 'CONTEXT') {
        super(ctx);
    }

    protected run(initialState: 'STATE') {
        setTimeout(() => {
            console.log('ProcessA is completed');
            this.complete(initialState);
        }, 2000)

        return 'OK' as const;
    }
}


new ProcessA('CONTEXT').init('STATE').init('STATE');