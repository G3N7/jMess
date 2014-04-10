var jMess;
(function (jMess) {
    var LifeCycleEvents = (function () {
        function LifeCycleEvents() {
        }
        LifeCycleEvents.AfterRegister = '__er_AfterRegisterEvent__';
        LifeCycleEvents.BeforeRegister = '__er_BeforeRegisterEvent__';
        LifeCycleEvents.AfterHook = '__er_AfterHookEvent__';
        LifeCycleEvents.BeforeHook = '__er_BeforeHookEvent__';
        LifeCycleEvents.AfterRaise = '__er_AfterRaiseEvent__';
        LifeCycleEvents.BeforeRaise = '__er_BeforeRaiseEvent__';
        return LifeCycleEvents;
    })();
    jMess.LifeCycleEvents = LifeCycleEvents;
})(jMess || (jMess = {}));
//# sourceMappingURL=LifeCycleEvents.js.map
