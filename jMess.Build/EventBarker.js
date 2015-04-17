// ReSharper disable once InconsistentNaming
var jMess;
(function (jMess) {
    //generally used for development
    var EventBarker = (function () {
        function EventBarker(eventRegistry, logR) {
            this._eventRegistry = eventRegistry;
            this._logR = logR;
        }
        EventBarker.prototype.startBarking = function () {
            var _this = this;
            var logger = this._logR;
            this._eventRegistry.hook(jMess.LifeCycleEvents.BeforeRegister, function (data) {
                logger.trace('Register: ', data);
            });
            this._eventRegistry.hook(jMess.LifeCycleEvents.BeforeHook, function (data) {
                if (!_this._isInternalEvent(data[0])) {
                    logger.trace('Hooked: ', data);
                }
            });
            this._eventRegistry.hook(jMess.LifeCycleEvents.BeforeRaise, function (data) {
                if (!_this._isInternalEvent(data[0])) {
                    logger.info('Raise: ', data);
                }
            });
            logger.trace('woof.. woof.. event barker be a bark\'n');
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