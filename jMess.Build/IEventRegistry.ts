// ReSharper disable once InconsistentNaming
module jMess {
	export interface IEventRegistry {
		getAvailableEvents(): string[];
		hook(eventName: string, onRaise: Function): () => void;
		raise(eventToRaise: string, data: Object): void;
		register(eventsToRegister): void;
	}
}