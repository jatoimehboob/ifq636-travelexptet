// ============================================================================
// OBSERVER PATTERN  ->  Notification system (SRS FR-17 / FR-18)
// ============================================================================
// The NotificationCenter is the "Subject". Observers register themselves with
// it, and whenever something interesting happens in the app (an expense is
// added, a budget limit is reached, a profile is updated) the Subject calls
// notify(), which pushes the event out to every registered observer.
//
// This decouples the thing that RAISES an event (e.g. the expense service)
// from the things that REACT to it (logging, storing an in-app notification,
// etc). New reactions can be added by writing a new observer and subscribing
// it -- no existing code has to change.
//
// NotificationCenter is also implemented as a SINGLETON: the whole app shares
// one notification hub via getInstance(), so every part of the system
// publishes to and reads from the same place.
// ============================================================================

class NotificationCenter {
    constructor() {
        // Guard so the Singleton can't be bypassed with `new`.
        if (NotificationCenter._instance) {
            return NotificationCenter._instance;
        }
        this.observers = [];
        NotificationCenter._instance = this;
    }

    // Singleton accessor -- always returns the one shared instance.
    static getInstance() {
        if (!NotificationCenter._instance) {
            NotificationCenter._instance = new NotificationCenter();
        }
        return NotificationCenter._instance;
    }

    // Register an observer. An observer is any object with an update(event) method.
    subscribe(observer) {
        if (typeof observer.update !== 'function') {
            throw new Error('Observer must implement an update(event) method');
        }
        this.observers.push(observer);
        return this; // allow chaining
    }

    // Remove an observer.
    unsubscribe(observer) {
        this.observers = this.observers.filter((o) => o !== observer);
        return this;
    }

    // Publish an event to every observer.
    // event = { type, message, data }
    publish(event) {
        this.observers.forEach((observer) => observer.update(event));
        return event;
    }

    // Helper used by tests to reset between cases.
    clear() {
        this.observers = [];
        return this;
    }
}

// Event type constants so producers and observers agree on names.
NotificationCenter.EVENTS = {
    EXPENSE_ADDED: 'EXPENSE_ADDED',
    BUDGET_LIMIT_REACHED: 'BUDGET_LIMIT_REACHED',
    PROFILE_UPDATED: 'PROFILE_UPDATED',
};

module.exports = NotificationCenter;
