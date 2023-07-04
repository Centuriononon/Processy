import * as P from './index';

class CompletingProcess extends P.AbstractProcess<
	string,
	string
> {
	constructor(options: string) {
		super(options);
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
	string,
	string
> {
	constructor(options: string) {
		super(options);
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
	new P.InitializableProcess(
		P.PipeableProcess,
		[
			new P.InitializableProcess(CompletingProcess, '#1'),
			new P.InitializableProcess(CompletingProcess, '#2'),
			new P.FaultToleranceProcess(
				new P.RestartableProcess(
					new P.InitializableProcess(FaultingProcess, '#3')
				),
				{ faults: 4 }
			)
		]
	)
)

experiment.initiated().start('INITIAL_STATE'); 
experiment.initiated().start('INITIAL_STATE'); 
experiment.initiated().start('INITIAL_STATE'); 
experiment.initiated().start('INITIAL_STATE'); 