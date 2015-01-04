/// <reference path="lifecycleevents.ts" />
/// <reference path="scripts/logr.d.ts" />
/// <reference path="ieventregistry.ts" />
// ReSharper disable once InconsistentNaming
var jMess;
(function (jMess) {
    var EventRegistry = (function () {
        function EventRegistry(logR, timeout) {
            this._events = _.clone(jMess.LifeCycleEvents);
            this._registry = {};
            this._logR = logR;
            this._timeout = timeout ? timeout : setTimeout;
        }
        EventRegistry.prototype.getAvailableEvents = function () {
            var eventCopy = _.clone(this._events);
            return _.values(eventCopy);
        };

        EventRegistry.prototype.hook = function (eventToHook, delegate) {
            if (eventToHook == null)
                throw 'You must provide an event to hook, have you define the event object yet? "...oh you have to write the code! -Scott Hanselman"';
            if (delegate == null)
                throw 'You must provide an delegate to run when the event is raised';
            if (!this._eventExists(eventToHook))
                throw 'The event "' + eventToHook + '" your trying to hook to does not exist, make sure you have registered the events with the EventRegistry, the available events are ' + _.map(_.values(this._events), function (x) {
                    return '\n' + x;
                });
            this.raise(jMess.LifeCycleEvents.BeforeHook, arguments);

            if (this._registry[eventToHook] == null) {
                this._registry[eventToHook] = [delegate];
            } else {
                this._registry[eventToHook].push(delegate);
            }
            this.raise(jMess.LifeCycleEvents.AfterHook, arguments);
        };

        EventRegistry.prototype.raise = function (eventToRaise, data) {
            var _this = this;
            if (eventToRaise == null)
                throw 'The event you provided to raise is null, are you sure you have defined the event?';
            if (data == null)
                throw 'data was null, consumers of events should feel confident they will never get null data.';
            if (!this._eventExists(eventToRaise))
                throw 'The event "' + eventToRaise + '" your trying to raise does not exist, make sure you have registered the event with the EventRegistry, the available events are ' + _.map(_.values(this._events), function (x) {
                    return '\n' + x;
                });

            if (eventToRaise !== jMess.LifeCycleEvents.BeforeRaise && eventToRaise !== jMess.LifeCycleEvents.AfterRaise) {
                //CAUTION: infinite loop possible here
                this.raise(jMess.LifeCycleEvents.BeforeRaise, arguments);
            }

            var eventDelegates = this._registry[eventToRaise];
            var asyncInvokation = function (delegate) {
                var logr = _this._logR;
                _this._timeout.call(window, function () {
                    try  {
                        delegate(data);
                    } catch (ex) {
                        logr.error('An exception was thrown when', eventToRaise, 'was Raised with', data, ex);
                        //We have to expect the consumer to handle their own errors
                    }
                }, 100);
            };

            _.each(eventDelegates, asyncInvokation);

            if (eventToRaise !== jMess.LifeCycleEvents.BeforeRaise && eventToRaise !== jMess.LifeCycleEvents.AfterRaise) {
                //CAUTION: infinite loop possible here
                this.raise(jMess.LifeCycleEvents.AfterRaise, arguments);
            }
        };

        EventRegistry.prototype.register = function (eventsToRegister) {
            if (eventsToRegister == null)
                throw 'Your events where null, we must have something';
            this.raise(jMess.LifeCycleEvents.BeforeRegister, arguments);
            if (eventsToRegister instanceof Array) {
                this._registerArrayOfEvents(eventsToRegister);
            } else if (eventsToRegister instanceof Object) {
                this._registerEventsObject(eventsToRegister);
            } else {
                this._registerSingleEvent(eventsToRegister);
            }
            this.raise(jMess.LifeCycleEvents.AfterRegister, arguments);
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
            if (eventToRegister === '')
                throw 'the event was just an empty string :(';
            if (this._eventExists(eventToRegister))
                throw 'the event you are trying to register "' + eventToRegister + '" is already registered, either you are duplicating logic or need to be more specific in your event naming';
            this._events[eventToRegister] = eventToRegister;
        };

        EventRegistry.prototype._eventExists = function (eventName) {
            return _.contains(_.values(this._events), eventName);
        };
        return EventRegistry;
    })();
    jMess.EventRegistry = EventRegistry;
})(jMess || (jMess = {}));
//# sourceMappingURL=EventRegistry.js.map
