var jMess;
(function (jMess) {
    //generally used for development
    var EventBarker = (function () {
        function EventBarker(eventRegistry, logR) {
            this._eventRegistry = eventRegistry;
        }
        EventBarker.prototype._beforeHook = function (data) {
            if (!this._isInternalEvent(data[0])) {
                this._logR.trace('Hooked: ', data);
            }
        };

        EventBarker.prototype._beforeRaise = function (data) {
            if (!this._isInternalEvent(data[0])) {
                this._logR.info('Raise: ', data);
            }
        };

        EventBarker.prototype._beforeRegister = function (data) {
            this._logR.trace('Register: ', data);
        };

        EventBarker.prototype.startBarking = function () {
            this._eventRegistry.Hook(jMess.LifeCycleEvents.BeforeHook, this._beforeHook);
            this._eventRegistry.Hook(jMess.LifeCycleEvents.BeforeRegister, this._beforeRegister);
            this._eventRegistry.Hook(jMess.LifeCycleEvents.BeforeRaise, this._beforeRaise);
            this._logR.trace('woof.. woof.. event barker be a bark\'n');
        };

        EventBarker.prototype._isInternalEvent = function (args) {
            //perf: we could arrange these with some heuristics based around number of actual events barked out to the logger.
            return args == jMess.LifeCycleEvents.BeforeHook || args == jMess.LifeCycleEvents.BeforeRaise || args == jMess.LifeCycleEvents.BeforeRegister || args == jMess.LifeCycleEvents.AfterHook || args == jMess.LifeCycleEvents.AfterRaise || args == jMess.LifeCycleEvents.AfterRegister;
        };
        return EventBarker;
    })();
    jMess.EventBarker = EventBarker;
})(jMess || (jMess = {}));
//# sourceMappingURL=EventBarker.js.map
