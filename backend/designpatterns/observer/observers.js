// ============================================================================
// OBSERVER PATTERN  ->  Concrete observers
// ============================================================================
// Each observer implements update(event). They react to events independently;
// the NotificationCenter (Subject) neither knows nor cares what they do.
// ============================================================================

// Writes every event to the server log. Useful for the demo / debugging.
class ConsoleLogObserver {
    update(event) {
        console.log(`[Notification] ${event.type}: ${event.message}`);
    }
}

// Stores notifications in memory so they can be shown in the UI
// (the "in-app notifications" requirement, FR-17). In a future iteration this
// could persist to a Notification collection in MongoDB instead -- only this
// class would change, nothing that publishes events.
class InAppNotificationObserver {
    constructor() {
        this.notifications = [];
    }

    update(event) {
        this.notifications.push({
            type: event.type,
            message: event.message,
            data: event.data || null,
            read: false,
            createdAt: new Date(),
        });
    }

    // Read API used by a notifications endpoint / dashboard.
    getAll() {
        return this.notifications;
    }

    getUnread() {
        return this.notifications.filter((n) => !n.read);
    }
}

module.exports = { ConsoleLogObserver, InAppNotificationObserver };
