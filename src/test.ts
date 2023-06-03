import * as FSM from './index';

class CompletingProcess extends FSM.AbstractProcess<'CONTEXT', string, string> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run(state: string) {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} is completed`);
			this.complete(state);
		}, 2000);

		return 'OK' as const;
	}
}

class FaultingProcess extends FSM.AbstractProcess<'CONTEXT', string, string> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run() {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} is faulted`);
			this.fault('That is my choise!');
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
						'#1'
					)
				)
			),
			{ cycles: 3 }
		),
		new FSM.StartableProcess(
			new FSM.InitializableProcess(CompletingProcess, '#2')
		),
		new FSM.FaultToleranceProcess(
			new FSM.RestartableProcess(
				new FSM.StartableProcess(
					new FSM.InitializableProcess(
						FaultingProcess, 
						'#3'
					)
				)
			),
			{ faults: 2 }
		)
	])
)
	.started('CONTEXT')
	.init('INITIAL STATE');
