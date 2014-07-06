module jMess {
	//generally used for development
	export class EventBarker {
		private _eventRegistry: IEventRegistry;
		private _logR: ILogR;

		constructor(eventRegistry: IEventRegistry, logR: ILogR) {
			this._eventRegistry = eventRegistry;
			this._logR = logR;
		}

		private _beforeHook(data): void {
			if (!this._isInternalEvent(data[0])) {
				this._logR.trace('Hooked: ', data);
			}
		}

		private _beforeRaise(data): void {
			if (!this._isInternalEvent(data[0])) {
				this._logR.info('Raise: ', data);
			}
		}

		private _beforeRegister(data): void {
			this._logR.trace('Register: ', data);
		}

		public startBarking(): void {
			this._eventRegistry.hook(LifeCycleEvents.BeforeHook, this._beforeHook);
			this._eventRegistry.hook(LifeCycleEvents.BeforeRegister, this._beforeRegister);
			this._eventRegistry.hook(LifeCycleEvents.BeforeRaise, this._beforeRaise);
			this._logR.trace('woof.. woof.. event barker be a bark\'n');
		}

		private _isInternalEvent(args): boolean {
			//perf: we could arrange these with some heuristics based around number of actual events barked out to the logger.
			return args == LifeCycleEvents.BeforeHook
				|| args == LifeCycleEvents.BeforeRaise
				|| args == LifeCycleEvents.BeforeRegister
				|| args == LifeCycleEvents.AfterHook
				|| args == LifeCycleEvents.AfterRaise
				|| args == LifeCycleEvents.AfterRegister;
		}

	}
}