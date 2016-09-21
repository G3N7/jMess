# jMess
A simple event driven messaging framework for javascript.

## EventRegistry
This is the heart of the system, it allows you to raise and hook to events while passing messages through your system.

---
```typescript
hook(eventName: string, onRaise: Function): () => void
```
will register a delegate to be invoked upon raising the event and then return a cancelation function that can be called to remove the hook that was just registered.

---
```typescript
raise(eventToRaise: string, data: Object): void
```
will raise an event passing the expected data along to each of the delegates registered to the event.

---
```typescript
register(eventsToRegister: string/Object/string[]): void
```
allows you to register events, although this step may seem unnecessary i have found it very useful in diagnosing typos in event names.

---
```typescript
getAvailableEvents(): string[]
```
allows you to see all currently registered events, this is mostly used for diagnostics.

## EventBarker
A little logging tool to allow for a console log stream of the events passing through the system.  Simply tell it to 
```typescript
startBarking()
```

## LifeCycleEvents
These events give you access points to have logic run across all commands at different points in the life cycle.

## Release Notes
### 3.0
This we have removed the dependency on underscore, this has a few effects:

- We are now using `Array.prototype.map()`, `Array.prototype.indexOf`, and `Object.keys`.  Consult [Can I Use, ES5](http://caniuse.com/#feat=es5) for compatibility
- You can now choose how you reference underscore, should you choose too.
- Removes a heafty dependency in simple scenarios.

## About the project

- Our project is written in typescript but compiled to target ECMAScript v5.
- Currently depends on Underscore.js for some utilities with a terse syntax, as needed the project can be migrated off of it.
- Uses the ILogR interface for logging.  Check out my ILogR project for an implementation with some jazz :D

