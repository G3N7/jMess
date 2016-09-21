// ReSharper disable once InconsistentNaming
var jMess;
(function (jMess) {
    var EventRegistry = (function () {
        function EventRegistry(logR, onRaise, timeout) {
            this._events = {};
            this._registry = {};
            this._logR = logR;
            this._onRaise = onRaise;
            this._timeout = timeout ? timeout : setTimeout;
        }
        EventRegistry.prototype.getAvailableEvents = function () {
            var eventCopy = JSON.parse(JSON.stringify(this._events));
            var values = Object.keys(eventCopy).map(function (key) { return eventCopy[key]; });
            return values;
        };
        EventRegistry.prototype.getHooksForEvent = function (eventName) {
            return this._registry[eventName];
        };
        EventRegistry.prototype.hook = function (eventToHook, delegate) {
            if (eventToHook == null)
                throw 'You must provide an event to hook, have you define the event object yet? "...oh you have to write the code! -Scott Hanselman"';
            if (delegate == null)
                throw 'You must provide an delegate to run when the event is raised';
            if (!this._eventExists(eventToHook)) {
                var availableEvents = this.getAvailableEvents();
                var message = 'The event "' +
                    eventToHook +
                    '" your trying to hook to does not exist, make sure you have registered the events with the EventRegistry, the available events are ' +
                    availableEvents.map(function (x) { return '\n' + x; });
                throw message;
            }
            this._logR.trace('Registering hook: ', eventToHook);
            if (this._registry[eventToHook] == null) {
                this._registry[eventToHook] = [delegate];
            }
            else {
                this._registry[eventToHook].push(delegate);
            }
            var cancelation = (function (r, e, d) {
                return function () {
                    logR.trace("Removing hook: ", e);
                    var indexOfDelegate = r[e].indexOf(d);
                    r[e].splice(indexOfDelegate, 1);
                };
            })(this._registry, eventToHook, delegate);
            return cancelation;
        };
        EventRegistry.prototype.hookOnce = function (eventToHook, delegate) {
            if (eventToHook == null)
                throw 'You must provide an event to hook, have you define the event object yet? "...oh you have to write the code! -Scott Hanselman"';
            if (delegate == null)
                throw 'You must provide an delegate to run when the event is raised';
            if (!this._eventExists(eventToHook)) {
                var availableEvents = this.getAvailableEvents();
                var message = 'The event "' + eventToHook + '" your trying to hook to does not exist, make sure you have registered the events with the EventRegistry, the available events are ' + availableEvents.map(function (x) { return '\n' + x; });
                throw message;
            }
            if (this._registry[eventToHook] == null) {
                this._registry[eventToHook] = new Array();
            }
            var indexOfDelegate = this._registry[eventToHook].length;
            this._logR.trace('Registering hook ' + eventToHook + "[" + indexOfDelegate + "]");
            var cancelation = (function (r, e, i) {
                return function () {
                    logR.trace("Removing hook " + e + "[" + indexOfDelegate + "]");
                    r[e].splice(i, 1);
                };
            })(this._registry, eventToHook, indexOfDelegate);
            this._registry[eventToHook].push(function () {
                cancelation();
                delegate(arguments);
            });
        };
        EventRegistry.prototype.raise = function (eventToRaise, data) {
            var _this = this;
            if (eventToRaise == null)
                throw 'The event you provided to raise is null, are you sure you have defined the event?';
            if (data == null)
                throw 'data was null, consumers of events should feel confident they will never get null data.';
            if (!this._eventExists(eventToRaise)) {
                var availableEvents = this.getAvailableEvents();
                var message = 'The event "' + eventToRaise + '" your trying to raise does not exist, make sure you have registered the event with the EventRegistry, the available events are ' + availableEvents.map(function (x) { return '\n' + x; });
                throw message;
            }
            this._logR.info('Raise: ', eventToRaise, data);
            var asyncInvokation = function (delegate) {
                var logr = _this._logR;
                _this._timeout.call(window, function () {
                    try {
                        delegate(data);
                    }
                    catch (ex) {
                        logr.error('An exception was thrown when', eventToRaise, 'was Raised with', data, ex);
                    }
                }, 100);
            };
            var eventDelegates = this._registry[eventToRaise];
            _.each(eventDelegates, asyncInvokation);
            this._timeout.call(window, function () {
                _this._onRaise(eventToRaise, data);
            });
        };
        EventRegistry.prototype.register = function (eventsToRegister) {
            if (eventsToRegister == null)
                throw 'Your events where null, we must have something';
            this._logR.trace('Register: ', eventsToRegister);
            if (eventsToRegister instanceof Array) {
                this._registerArrayOfEvents(eventsToRegister);
            }
            else if (eventsToRegister instanceof Object) {
                this._registerEventsObject(eventsToRegister);
            }
            else {
                this._registerSingleEvent(eventsToRegister);
            }
        };
        EventRegistry.prototype._registerEventsObject = function (eventsObj) {
            for (var key in eventsObj) {
                if (eventsObj.hasOwnProperty(key)) {
                    var value = eventsObj[key];
                    if (typeof value == "string") {
                        this._registerSingleEvent(value);
                    }
                }
            }
        };
        EventRegistry.prototype._registerArrayOfEvents = function (eventsArray) {
            if (eventsArray.length === 0)
                throw 'The array of events was empty :(';
            for (var i = 0; i < eventsArray.length; i++) {
                var eventToRegister = eventsArray[i];
                if (eventToRegister === '')
                    throw 'the event at ' + i + ' index was just an empty string :(';
                this._registerSingleEvent(eventsArray[i]);
            }
        };
        EventRegistry.prototype._registerSingleEvent = function (eventToRegister) {
            if (typeof eventToRegister !== 'string') {
                this._logR.warn('The event being registered is not a string, its value is ', eventToRegister);
                return;
            }
            if (eventToRegister === '')
                throw 'the event was just an empty string :(';
            if (this._eventExists(eventToRegister))
                throw 'the event you are trying to register "' + eventToRegister + '" is already registered, either you are duplicating logic or need to be more specific in your event naming';
            this._events[eventToRegister] = eventToRegister;
        };
        EventRegistry.prototype._eventExists = function (eventName) {
            var availableEvents = this.getAvailableEvents();
            var containsEvent = availableEvents.indexOf(eventName) > -1;
            return containsEvent;
        };
        return EventRegistry;
    }());
    jMess.EventRegistry = EventRegistry;
})(jMess || (jMess = {}));
//# sourceMappingURL=EventRegistry.js.map