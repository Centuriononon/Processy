import * as FSM from './index';

class TestingProcess extends FSM.Process<'CONTEXT', string, string> {
    constructor(ctx: 'CONTEXT', state: string) {
        super(ctx, state);
    }

    protected run(processName: string) {
        console.log('Testing for', processName);

        setTimeout(() => {
            console.log(`${processName} is completed`);
            this.complete(this._state);
        }, 2000)

        return 'OK' as const;
    }
}

new FSM.StartableProcess(
    FSM.PipeableProcess<'CONTEXT', string>, 
    new Array(5).fill(0).map((_, i) => 
        new FSM.StartableProcess(TestingProcess, `Process #${i+1}`)
    )
).start('CONTEXT', 'Initial State');