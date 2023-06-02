import * as FSM from './index';

class CompletingProcess extends FSM.AbstractProcess<'CONTEXT', string, string> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run(state: string) {
		console.log('State', this._options);

		setTimeout(() => {
			console.log(`${this._options} is completed`);
			this.complete(state);
		}, 2000);

		return 'OK' as const;
	}
}

class CrashingProcess extends FSM.AbstractProcess<'CONTEXT', string, string> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run() {
		console.log('Testing for', this._options);

		setTimeout(() => {
			console.log(`${this._options} is crashed`);
			this.crash('I just wanted that!');
		}, 2000);

		return 'OK' as const;
	}
}
new FSM.StartableProcess(
	new FSM.InitializableProcess(FSM.PipeableProcess<string, string>, [
		new FSM.CyclicalProcess(
			new FSM.RestartableProcess(
				new FSM.StartableProcess(
					new FSM.InitializableProcess(
						CompletingProcess,
						'Test Complete #1!'
					)
				)
			),
			{ cycles: 3 }
		),
		new FSM.StartableProcess(
			new FSM.InitializableProcess(CompletingProcess, 'Test Complete #2!')
		),
		new FSM.StartableProcess(
			new FSM.InitializableProcess(CrashingProcess, 'Test Crash #1!')
		)
	])
)
	.started('CONTEXT')
	.init('INITIAL STATE');
