describe('EventRegistry',() => {
    it('exists',() => {
        expect(jMess.EventRegistry).toBeDefined();
    });

    var eventRegistry: jMess.EventRegistry;
    var someKnownEvent = 'someEvent';
    beforeEach((done: () => void) => {
        eventRegistry = new jMess.EventRegistry(logR,(eventBeingRaised, data) => { console.log(eventBeingRaised, data) });
        done();
    });

    describe('getAvailableEvents',() => {
        it('returns the list of available events',(done) => {
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.length).toBe(0);
            done();
        });
        it('contains the life cycle events',(done) => {
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.length).toEqual(availableEvents.length);
            done();
        });
    });

    describe('register',() => {
        it('adds a string to the available events',(done) => {
            eventRegistry.register(someKnownEvent);

            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.filter((event) => { return event === someKnownEvent; })).toBeDefined();
            done();
        });

        it('adds an objects values to the available events',(done) => {
            var eventsObj = { onlyEvent: someKnownEvent };

            eventRegistry.register(eventsObj);

            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.filter((event) => { return event === eventsObj.onlyEvent; })).toBeDefined();
            done();
        });

        it('adds an array of event name strings to the available events',(done) => {
            var eventsArray = ['someEvent'];

            eventRegistry.register(eventsArray);

            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.filter((event) => { return event === eventsArray[0]; })).toBeDefined();
            done();
        });
    });

    describe('hook and raise',() => {
        var someEventCalled: number;
        var someOtherKnownEvent = 'someOtherEvent';
        var someOtherEventCalled: boolean;
        var canceledEventCalled: boolean;
        beforeEach((done: () => void) => {
            eventRegistry.register(someKnownEvent);
            eventRegistry.register(someOtherKnownEvent);

            someEventCalled = 0;
            someOtherEventCalled = false;
            canceledEventCalled = false;

            eventRegistry.hook(someKnownEvent,() => { someEventCalled++; done(); });
            eventRegistry.hook(someOtherKnownEvent,() => { someOtherEventCalled = true; done(); });

            var cancelation = eventRegistry.hook(someKnownEvent,() => { canceledEventCalled = true; done(); });
            cancelation();

            eventRegistry.raise(someKnownEvent, {});
        });

        it('hook will register a method that can be invoked later',(done) => {
            expect(someEventCalled).toBe(1);
            done();
        });

        it('hook will return a cancelation function that will remove the hook created.',(done) => {
            expect(canceledEventCalled).toBe(false);
            done();
        });

        it('raise will only call delegates attached to a specific event',(done) => {
            expect(someOtherEventCalled).toBe(false);
            done();
        });
    });

    describe('hookOnce and raise', () => {
        var someEventCalled: number;
        var someOtherKnownEvent = 'someOtherEvent';
        var someOtherEventCalled: boolean;
        var canceledEventCalled: boolean;
        beforeEach((done: () => void) => {
            eventRegistry.register(someKnownEvent);
            eventRegistry.register(someOtherKnownEvent);

            someEventCalled = 0;
            someOtherEventCalled = false;
            canceledEventCalled = false;

            eventRegistry.hookOnce(someKnownEvent, () => { someEventCalled++; done(); });
            eventRegistry.hookOnce(someOtherKnownEvent, () => { someOtherEventCalled = true; done(); });

            eventRegistry.raise(someKnownEvent, {});
        });

        it('hookOnce will register a method that can be invoked later', (done) => {
            expect(someEventCalled).toBe(1);
            done();
        });

        it('raise will only call delegates attached to a specific event', (done) => {
            expect(someOtherEventCalled).toBe(false);
            done();
        });

        it('hooks will automatically be removed for raised events', (done) => {
            expect(eventRegistry.getHooksForEvent(someKnownEvent).length).toBe(0);
            done();
        });

        it('hooks will remain for events that are not raised', (done) => {
            expect(eventRegistry.getHooksForEvent(someOtherKnownEvent).length).toBe(1);
            done();
        });
    });
});