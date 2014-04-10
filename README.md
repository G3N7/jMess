jMess
=====
A simple event driven messaging framework for javascript.

---
##Components##
###EventRegistry###
This is the heart of the system, it allows you to raise and hook to events while passing messages through your system.

* `hook(eventName: string, onRaise: Function): void` - will register a delegate to be invoked upon raising the event.
* `raise(eventToRaise: string, data: Object): void` - will raise an event passing the expected data along to each of the delegates registered to the event.
* `register(eventsToRegister: string/Object/string[]): void` - allows you to register events, although this step may seem unnecessary i have found it very useful in diagnosing typos in event names.
* `getAvailableEvents(): string[]` - allows you to see all currently registered events, this is mostly used for diagnostics.

###EventBarker###
A little logging tool to allow for a console log stream of the events passing through the system.  Simply tell it to `startBarking()`

###LifeCycleEvents###
These events give you access points to have logic run across all commands at different points in the life cycle.

---
##About the project##

* Our project is written in typescript but compiled to target ECMAScript v5.
* Currently depends on Underscore.js for some utilities with a terse syntax, as needed the project can be migrated off of it.
* Uses the ILogR interface for logging.  Check out my ILogR project for an implementation with some jazz :D