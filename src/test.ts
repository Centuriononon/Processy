import * as FSM from './index';

class CompletingProcess extends FSM.AbstractProcess<
	'CONTEXT',
	string,
	string,
	string
> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run(state: string) {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} is going to be completed`);
			this.complete(state);
		}, 4000);

		return 'OK' as const;
	}

	protected msg(body: string) {
		console.log('[CompletingProcess] Received new msg:', body);

		return 'OK' as const;
	}
}

class FaultingProcess extends FSM.AbstractProcess<
	'CONTEXT',
	string,
	string,
	string
> {
	constructor(ctx: 'CONTEXT', options: string) {
		super(ctx, options);
	}

	protected run() {
		console.log('Started', this._options);

		setTimeout(() => {
			console.log(`${this._options} is going to be faulted`);
			this.fault('This is my choise!');
		}, 4000);

		return 'OK' as const;
	}

	protected msg(body: string) {
		console.log('[FaultingProcess] Received new msg:', body);

		return 'OK' as const;
	}
}

const testMsg = () => {
	const process = new FSM.ConfigurableProcess(
		new FSM.StartableProcess(
			new FSM.InitializableProcess(CompletingProcess, 'TestMsgProcess')
		),
		{ cyclical: { cycles: Infinity } }
	)
		.started('CONTEXT')
		.init('INITIAL_STATE');

	const sendMsg = (qty: number, msgID: number = 0) => {
		if (process.working()) process.message('Msg #' + msgID);
		else setTimeout(() => sendMsg(qty, msgID), 50);

		if (qty !== 0) setTimeout(() => sendMsg(qty - 1, msgID + 1), 100);
		else process.stop('OK');
	};

	sendMsg(200);
};

const testPipeline = () =>
	new FSM.StartableProcess(
		new FSM.InitializableProcess(FSM.PipeableProcess, [
			new FSM.ConfigurableProcess(
				new FSM.StartableProcess(
					new FSM.InitializableProcess(CompletingProcess, '#1')
				),
				{ cyclical: { cycles: 2 } }
			),
			new FSM.StartableProcess(
				new FSM.InitializableProcess(CompletingProcess, '#2')
			),
			new FSM.ConfigurableProcess(
				new FSM.StartableProcess(
					new FSM.InitializableProcess(FaultingProcess, '#3')
				),
				{ faultTolerance: { faults: 2 } }
			)
		])
	)
		.started('CONTEXT')
		.init('INITIAL_STATE');


testMsg();