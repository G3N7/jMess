// ReSharper disable once InconsistentNaming
module jMess {
    export class EventRegistry implements IEventRegistry {
        private _events: Object;
        private _registry: Object;
        private _logR: ILogR;
        private _timeout: (delegate: () => void, delay: number) => void;
        private _onRaise: (event: string, data: Object) => void;

        constructor(logR: ILogR, onRaise: (event: string, data: Object) => void, timeout?: (delegate: () => void, delay: number) => void) {
            this._events = {};
            this._registry = {};
            this._logR = logR;
            this._onRaise = onRaise;
            this._timeout = timeout ? timeout : setTimeout;
        }

        public getAvailableEvents(): string[] {
            var eventCopy = _.clone(this._events);
            return _.values(eventCopy);
        }

        public hook(eventToHook: string, delegate: Function): () => void {
            if (eventToHook == null) throw 'You must provide an event to hook, have you define the event object yet? "...oh you have to write the code! -Scott Hanselman"';
            if (delegate == null) throw 'You must provide an delegate to run when the event is raised';
            if (!this._eventExists(eventToHook)) throw 'The event "' + eventToHook + '" your trying to hook to does not exist, make sure you have registered the events with the EventRegistry, the available events are ' + _.map(_.values(this._events), x => '\n' + x);

            this._logR.trace('Hooking: ', eventToHook);

            if (this._registry[eventToHook] == null) {
                this._registry[eventToHook] = [delegate];
            } else {
                this._registry[eventToHook].push(delegate);
            }
            var cancelation = ((r, e, d) => {
                return () => {
                    var indexOfDelegate = r[e].indexOf(d);
                    r[e].splice(indexOfDelegate, 1);
                };
            })(this._registry, eventToHook, delegate);
            return cancelation;
        }

        public raise(eventToRaise: string, data: Object): void {
            if (eventToRaise == null) throw 'The event you provided to raise is null, are you sure you have defined the event?';
            if (data == null) throw 'data was null, consumers of events should feel confident they will never get null data.';
            if (!this._eventExists(eventToRaise)) throw 'The event "' + eventToRaise + '" your trying to raise does not exist, make sure you have registered the event with the EventRegistry, the available events are ' + _.map(_.values(this._events), x => '\n' + x);

            this._logR.info('Raise: ', eventToRaise, data);

            var asyncInvokation = (delegate) => {
                var logr = this._logR;
                this._timeout.call(window,() => {
                    try {
                        delegate(data);
                    } catch (ex) {
                        logr.error('An exception was thrown when', eventToRaise, 'was Raised with', data, ex);
                        //We have to expect the consumer to handle their own errors
                    }
                }, 100);
            };

            var eventDelegates = this._registry[eventToRaise];
            _.each(eventDelegates, asyncInvokation);
			this._timeout.call(window,() => {
				this._onRaise(eventToRaise, data);
			});
        }

        public register(eventsToRegister: string|string[]|Object): void {
            if (eventsToRegister == null) throw 'Your events where null, we must have something';

            this._logR.trace('Register: ', eventsToRegister);

            if (<any>eventsToRegister instanceof Array) {
                this._registerArrayOfEvents(<string[]>eventsToRegister);
            } else if (<any>eventsToRegister instanceof Object) {
                this._registerEventsObject(eventsToRegister);
            } else {
                this._registerSingleEvent(<string>eventsToRegister);
            }
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
            if (eventsArray.length === 0) throw 'The array of events was empty :(';
            for (var i = 0; i < eventsArray.length; i++) {
                var eventToRegister = eventsArray[i];
                if (eventToRegister === '') throw 'the event at ' + i + ' index was just an empty string :(';
                this._registerSingleEvent(eventsArray[i]);
            }
        }

        private _registerSingleEvent(eventToRegister: string) {
            if (typeof eventToRegister !== 'string') {
                this._logR.warn('The event being registered is not a string, its value is ', eventToRegister);
                return;
            }
            if (eventToRegister === '') throw 'the event was just an empty string :(';
            if (this._eventExists(eventToRegister)) throw 'the event you are trying to register "' + eventToRegister + '" is already registered, either you are duplicating logic or need to be more specific in your event naming';
            this._events[eventToRegister] = eventToRegister;
        }

        private _eventExists(eventName: string): boolean {
            return _.contains(_.values(this._events), eventName);
        }
    }
}