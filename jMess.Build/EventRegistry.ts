module jMess {
	export class EventRegistry implements IEventRegistry {
		private _events: Object;
		private _registry: Object;
		private _logR: ILogR;

		constructor(logR: ILogR) {
			this._events = _.clone(LifeCycleEvents);
			this._registry = {};
			this._logR = logR;
		}

		public getAvailableEvents(): string[] {
			var eventCopy = _.clone(this._events);
			return _.values(eventCopy);
		}

		public hook(eventToHook: string, delegate: Function): void {
			if (eventToHook == null) throw 'You must provide an event to hook, have you define the event object yet? "...oh you have to write the code! -Scott Hanselman"';
			if (delegate == null) throw 'You must provide an delegate to run when the event is raised';
			if (!this._eventExists(eventToHook)) throw 'The event "' + eventToHook + '" your trying to hook to does not exist, make sure you have registered the events with the EventRegistry, the available events are ' + _.map(_.values(this._events), x => '\n' + x);
			this.raise(LifeCycleEvents.BeforeHook, arguments);

			if (this._registry[eventToHook] == null) {
				this._registry[eventToHook] = [delegate];
			} else {
				this._registry[eventToHook].push(delegate);
			}
			this.raise(LifeCycleEvents.AfterHook, arguments);
		}
		
		public raise(eventToRaise: string, data: Object): void {
			if (eventToRaise == null) throw 'The event you provided to raise is null, are you sure you have defined the event?';
			if (data == null) throw 'data was null, consumers of events should feel confident they will never get null data.';
			if (!this._eventExists(eventToRaise)) throw 'The event "' + eventToRaise + '" your trying to raise does not exist, make sure you have registered the event with the EventRegistry, the available events are ' + _.map(_.values(this._events), x => '\n' + x);

			if (eventToRaise != LifeCycleEvents.BeforeRaise && eventToRaise !== LifeCycleEvents.AfterRaise) {
				//CAUTION: infinite loop possible here
				this.raise(LifeCycleEvents.BeforeRaise, arguments);
			}

			var eventDelegates = this._registry[eventToRaise];
			var asyncInvokation = (delegate) => {
				var logr = this._logR;
				setTimeout(() => {
					try {
						delegate(data);
					} catch (ex) {
						logr.error('An exception was thrown when', eventToRaise, 'was Raised with', data, ex);
						//We have to expect the consumer to handle their own errors
					}
				}, 100);
			};

			_.each(eventDelegates, asyncInvokation);

			if (eventToRaise != LifeCycleEvents.BeforeRaise && eventToRaise !== LifeCycleEvents.AfterRaise) {
				//CAUTION: infinite loop possible here
				this.raise(LifeCycleEvents.AfterRaise, arguments);
			}
		}

		public register(eventsToRegister: any): void {
			if (eventsToRegister == null) throw 'Your events where null, we must have something';
			this.raise(LifeCycleEvents.BeforeRegister, arguments);
			if (eventsToRegister instanceof Array) {
				this._registerArrayOfEvents(eventsToRegister);
			} else if (eventsToRegister instanceof Object) {
				this._registerEventsObject(eventsToRegister);
			} else {
				this._registerSingleEvent(eventsToRegister);
			}
			this.raise(LifeCycleEvents.AfterRegister, arguments);
		}

		private _registerEventsObject(eventsObj: Object) {
			for (var key in eventsObj) {
				if (eventsObj.hasOwnProperty(key)) {
					var value = eventsObj[key];
					if (typeof value == "string") {
						this._registerSingleEvent(value);
					}
				}
			}
		}

		private _registerArrayOfEvents(eventsArray: string[]) {
			if (eventsArray.length == 0) throw 'The array of events was empty :(';
			for (var i = 0; i < eventsArray.length; i++) {
				var eventToRegister = eventsArray[i];
				if (eventToRegister == '') throw 'the event at ' + i + ' index was just an empty string :(';
				this._registerSingleEvent(eventsArray[i]);
			}
		}

		private _registerSingleEvent(eventToRegister: string) {
			if (eventToRegister == '') throw 'the event was just an empty string :(';
			if (this._eventExists(eventToRegister)) throw 'the event you are trying to register "' + eventToRegister + '" is already registered, either you are duplicating logic or need to be more specific in your event naming';
			this._events[eventToRegister] = eventToRegister;
		}

		private _eventExists(eventName: string): boolean {
			return _.contains(_.values(this._events), eventName);
		}
	}
}