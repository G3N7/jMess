declare module jMess {
    class EventRegistry implements IEventRegistry {
        private _events;
        private _registry;
        private _logR;
        private _timeout;
        constructor(logR: ILogR, timeout?: (delegate: () => void, delay: number) => void);
        getAvailableEvents(): string[];
        hook(eventToHook: string, delegate: Function): () => void;
        raise(eventToRaise: string, data: Object): void;
        register(eventsToRegister: string | string[] | Object): void;
        private _registerEventsObject(eventsObj);
        private _registerArrayOfEvents(eventsArray);
        private _registerSingleEvent(eventToRegister);
        private _eventExists(eventName);
    }
}
declare module jMess {
    interface IEventRegistry {
        getAvailableEvents(): string[];
        hook(eventName: string, onRaise: Function): () => void;
        raise(eventToRaise: string, data: Object): void;
        register(eventsToRegister: any): void;
    }
}
