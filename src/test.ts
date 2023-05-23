import * as FSM from './index';

class CompletingProcess extends FSM.Process<'CONTEXT', string, string> {
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

class CrashingProcess extends FSM.Process<'CONTEXT', string, string> {
    constructor(ctx: 'CONTEXT', state: string) {
        super(ctx, state);
    }

    protected run(processName: string) {
        console.log('Testing for', processName);

        setTimeout(() => {
            console.log(`${processName} is crashed`);
            this.crash('I just wanted that!');
        }, 2000)

        return 'OK' as const;
    }
}

new FSM.StartableProcess(
    FSM.PipeableProcess<'CONTEXT', string>, 
    {
        processes: [
            new FSM.StartableProcess(CompletingProcess, 'Test Complete #1!'),
            new FSM.StartableProcess(CompletingProcess, 'Test Complete #2!'),
            new FSM.StartableProcess(CrashingProcess, 'Test Crash!')
        ],
        processing: 'LOOP',
        crashing: 'RESTART'
    }
).start('CONTEXT', 'Initial State');
