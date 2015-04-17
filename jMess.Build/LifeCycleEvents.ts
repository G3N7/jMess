// ReSharper disable once InconsistentNaming
module jMess {
    var lifeCycleEvents = {
        // ReSharper disable InconsistentNaming
        AfterRegister: '__er_AfterRegisterEvent__',
        BeforeRegister: '__er_BeforeRegisterEvent__',
        AfterHook: '__er_AfterHookEvent__',
        BeforeHook: '__er_BeforeHookEvent__',
        AfterRaise: '__er_AfterRaiseEvent__',
        BeforeRaise: '__er_BeforeRaiseEvent__',
    };
    (<any>jMess).LifeCycleEvents = lifeCycleEvents;
}