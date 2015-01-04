// ReSharper disable once InconsistentNaming
module jMess {
	//generally used for development
	export class EventBarker {
		private _eventRegistry: IEventRegistry;
		private _logR: ILogR;

		constructor(eventRegistry: IEventRegistry, logR: ILogR) {
			this._eventRegistry = eventRegistry;
			this._logR = logR;
		}

		public startBarking(): void {
			var logger = this._logR;
			this._eventRegistry.hook(LifeCycleEvents.BeforeRegister, (data) => {
				logger.trace('Register: ', data);
			});
			this._eventRegistry.hook(LifeCycleEvents.BeforeHook, (data) => {
				if (!this._isInternalEvent(data[0])) {
					logger.trace('Hooked: ', data);
				}
			});
			this._eventRegistry.hook(LifeCycleEvents.BeforeRaise, (data) => {
				if (!this._isInternalEvent(data[0])) {
					logger.info('Raise: ', data);
				}
			});
			logger.trace('woof.. woof.. event barker be a bark\'n');
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