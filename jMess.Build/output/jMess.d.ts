/// <reference path="../Scripts/LogR.d.ts" />
declare module jMess {
    class EventBarker {
        private _eventRegistry;
        private _logR;
        constructor(eventRegistry: IEventRegistry, logR: ILogR);
        public startBarking(): void;
        private _isInternalEvent(args);
    }
}
declare module jMess {
    class LifeCycleEvents {
        static AfterRegister: string;
        static BeforeRegister: string;
        static AfterHook: string;
        static BeforeHook: string;
        static AfterRaise: string;
        static BeforeRaise: string;
    }
}
declare module jMess {
    interface IEventRegistry {
        getAvailableEvents(): string[];
        hook(eventName: string, onRaise: Function): void;
        raise(eventToRaise: string, data: Object): void;
        register(eventsToRegister: any): void;
    }
}
declare module jMess {
    class EventRegistry implements IEventRegistry {
        private _events;
        private _registry;
        private _logR;
        private _timeout;
        constructor(logR: ILogR, timeout?: (delegate: () => void, delay: number) => void);
        public getAvailableEvents(): string[];
        public hook(eventToHook: string, delegate: Function): void;
        public raise(eventToRaise: string, data: Object): void;
        public register(eventsToRegister: any): void;
        private _registerEventsObject(eventsObj);
        private _registerArrayOfEvents(eventsArray);
        private _registerSingleEvent(eventToRegister);
        private _eventExists(eventName);
    }
}
