import * as P from './index';

class CompletingProcess extends P.AbstractProcess<
	'CONTEXT',
	string,
	string
> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run(state: string) {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} completes`);
			this.complete(state);
		}, 4000);

		return 'OK' as const;
	}
}

class FaultingProcess extends P.AbstractProcess<
	'CONTEXT',
	string,
	string
> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run(state: 'INITIAL_STATE') {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} faults`);
			this.pub('fault', 'no');
		}, 4000);

		return 'OK' as const;
	}
}

const experiment = (
	new P.ReleasableProcess(
		P.PipeableProcess,
		[
			new P.ReleasableProcess(CompletingProcess, '#1'),
			new P.ReleasableProcess(CompletingProcess, '#2'),
			new P.FaultToleranceProcess(
				new P.RestartableProcess(
					new P.ReleasableProcess(FaultingProcess, '#3')
				),
				{ faults: 4 }
			)
		]
	)
		// Released abstraction is used to subscribe to the process before it starts
		.released('CONTEXT')
		.sub('fault', () => console.log('PIPELINE FAULT!!!'))
)

experiment.start('INITIAL_STATE');