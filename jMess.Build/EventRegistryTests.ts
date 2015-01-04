/// <reference path="eventregistry.ts" />
/// <reference path="scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="scripts/typings/underscore/underscore.d.ts" />

describe('EventRegistry', () => {
	it('exists', () => {
		expect(jMess.EventRegistry).toBeDefined();
	});

	var eventRegistry: jMess.EventRegistry;
	var mockLog: ILogR;
	var someKnownEvent = 'someEvent';
	beforeEach((done: () => void) => {
		var emptyCall = () => { return; };
		mockLog = { info: emptyCall, custom: emptyCall, error: emptyCall, trace: emptyCall, warn: emptyCall };
		eventRegistry = new jMess.EventRegistry(mockLog);
		done();
	});

	describe('getAvailableEvents', () => {
		it('returns the list of available events', (done) => {
			var availableEvents = eventRegistry.getAvailableEvents();
			expect(availableEvents.length).toBeGreaterThan(0);
			done();
		});
		it('contains the life cycle events', (done) => {
			var availableEvents = eventRegistry.getAvailableEvents();
			expect(_.union(availableEvents, _.values(jMess.LifeCycleEvents)).length).toEqual(availableEvents.length);
			done();
		});
	});

	describe('register', () => {
		it('adds a string to the available events', (done) => {
			eventRegistry.register(someKnownEvent);

			var availableEvents = eventRegistry.getAvailableEvents();
			expect(_.find(availableEvents, (event) => { return event === someKnownEvent; })).toBeDefined();
			done();
		});

		it('adds an objects values to the available events', (done) => {
			var eventsObj = { onlyEvent: someKnownEvent };

			eventRegistry.register(eventsObj);

			var availableEvents = eventRegistry.getAvailableEvents();
			expect(_.find(availableEvents, (event) => { return event === eventsObj.onlyEvent; })).toBeDefined();
			done();
		});

		it('adds an array of event name strings to the available events', (done) => {
			var eventsArray = ['someEvent'];

			eventRegistry.register(eventsArray);

			var availableEvents = eventRegistry.getAvailableEvents();
			expect(_.find(availableEvents, (event) => { return event === eventsArray[0]; })).toBeDefined();
			done();
		});
	});

	describe('hook and raise', () => {
		var someEventCalled: number;
		var someOtherKnownEvent = 'someOtherEvent';
		var someOtherEventCalled: boolean;
		beforeEach((done: () => void) => {
			eventRegistry.register(someKnownEvent);
			eventRegistry.register(someOtherKnownEvent);

			someEventCalled = 0;
			someOtherEventCalled = false;

			eventRegistry.hook(someKnownEvent, () => { someEventCalled++; done(); });
			eventRegistry.hook(someOtherKnownEvent, () => { someOtherEventCalled = true; done(); });

			eventRegistry.raise(someKnownEvent, {});

		});

		it('hook will register a method that can be invoked later', (done) => {
			expect(someEventCalled).toBe(1);
			done();
		});

		it('raise will only call delegates attached to a specific event', (done) => {
			expect(someOtherEventCalled).toBe(false);
			done();
		});
	});
});