describe('EventRegistry', function () {
    it('exists', function () {
        expect(jMess.EventRegistry).toBeDefined();
    });
    var eventRegistry;
    var someKnownEvent = 'someEvent';
    beforeEach(function (done) {
        eventRegistry = new jMess.EventRegistry(logR, function (eventBeingRaised, data) {
            console.log(eventBeingRaised, data);
        });
        done();
    });
    describe('getAvailableEvents', function () {
        it('returns the list of available events', function (done) {
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.length).toBe(0);
            done();
        });
        it('contains the life cycle events', function (done) {
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(availableEvents.length).toEqual(availableEvents.length);
            done();
        });
    });
    describe('register', function () {
        it('adds a string to the available events', function (done) {
            eventRegistry.register(someKnownEvent);
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(_.find(availableEvents, function (event) {
                return event === someKnownEvent;
            })).toBeDefined();
            done();
        });
        it('adds an objects values to the available events', function (done) {
            var eventsObj = { onlyEvent: someKnownEvent };
            eventRegistry.register(eventsObj);
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(_.find(availableEvents, function (event) {
                return event === eventsObj.onlyEvent;
            })).toBeDefined();
            done();
        });
        it('adds an array of event name strings to the available events', function (done) {
            var eventsArray = ['someEvent'];
            eventRegistry.register(eventsArray);
            var availableEvents = eventRegistry.getAvailableEvents();
            expect(_.find(availableEvents, function (event) {
                return event === eventsArray[0];
            })).toBeDefined();
            done();
        });
    });
    describe('hook and raise', function () {
        var someEventCalled;
        var someOtherKnownEvent = 'someOtherEvent';
        var someOtherEventCalled;
        var canceledEventCalled;
        beforeEach(function (done) {
            eventRegistry.register(someKnownEvent);
            eventRegistry.register(someOtherKnownEvent);
            someEventCalled = 0;
            someOtherEventCalled = false;
            canceledEventCalled = false;
            eventRegistry.hook(someKnownEvent, function () {
                someEventCalled++;
                done();
            });
            eventRegistry.hook(someOtherKnownEvent, function () {
                someOtherEventCalled = true;
                done();
            });
            var cancelation = eventRegistry.hook(someKnownEvent, function () {
                canceledEventCalled = true;
                done();
            });
            cancelation();
            eventRegistry.raise(someKnownEvent, {});
        });
        it('hook will register a method that can be invoked later', function (done) {
            expect(someEventCalled).toBe(1);
            done();
        });
        it('hook will return a cancelation fuction that will remove the hook created.', function (done) {
            expect(canceledEventCalled).toBe(false);
            done();
        });
        it('raise will only call delegates attached to a specific event', function (done) {
            expect(someOtherEventCalled).toBe(false);
            done();
        });
    });
});
//# sourceMappingURL=EventRegistryTests.js.map