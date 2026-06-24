// ============================================================================
// FACADE PATTERN  ->  Expense management service
// ============================================================================
// Adding an expense is really three steps: validate the input, persist it to
// the database, then announce it so notifications fire. The controller
// shouldn't have to know about all three -- it should just say "add this
// expense". ExpenseService is the Facade that hides that multi-step subsystem
// behind one simple method.
//
// It also wires the OBSERVER pattern in: after a successful save it publishes
// an EXPENSE_ADDED event (and a BUDGET_LIMIT_REACHED event if a budget is
// exceeded) to the shared NotificationCenter.
//
// The Expense model is injected via the constructor (defaulting to the real
// Mongoose model) so the service can be unit-tested with a fake model and no
// live database.
// ============================================================================

const NotificationCenter = require('../observer/NotificationCenter');

class ExpenseService {
    // The Expense model is lazily resolved: only loaded if no model is injected.
    // This keeps the service unit-testable with a fake model and no mongoose.
    constructor(expenseModel = null, notifier = NotificationCenter.getInstance()) {
        this.expenseModel = expenseModel || require('../../models/Expense');
        this.notifier = notifier;
    }

    // Pure, easily unit-testable validation step.
    validate(data) {
        const required = ['title', 'amount', 'category', 'paymentMethod', 'date'];
        const missing = required.filter(
            (field) => data[field] === undefined || data[field] === null || data[field] === ''
        );
        if (missing.length > 0) {
            throw new Error(`Missing required field(s): ${missing.join(', ')}`);
        }
        if (Number(data.amount) <= 0) {
            throw new Error('Amount must be greater than zero');
        }
        return true;
    }

    // Single entry point the controller calls. options.budget is optional and,
    // if supplied, drives the budget-limit notification.
    async addExpense(data, userId, options = {}) {
        // Step 1: validate
        this.validate(data);

        // Step 2: persist
        const expense = await this.expenseModel.create({ ...data, user: userId });

        // Step 3: notify (Observer)
        this.notifier.publish({
            type: NotificationCenter.EVENTS.EXPENSE_ADDED,
            message: `Expense "${expense.title}" of $${expense.amount} added`,
            data: { expenseId: expense._id, amount: expense.amount },
        });

        if (options.budget && options.spentThisMonth !== undefined) {
            const projected = Number(options.spentThisMonth) + Number(expense.amount);
            if (projected >= Number(options.budget)) {
                this.notifier.publish({
                    type: NotificationCenter.EVENTS.BUDGET_LIMIT_REACHED,
                    message: `Monthly budget of $${options.budget} reached`,
                    data: { budget: options.budget, projected },
                });
            }
        }

        return expense;
    }
}

module.exports = ExpenseService;
