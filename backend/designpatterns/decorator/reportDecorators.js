// ============================================================================
// DECORATOR PATTERN  ->  Enhanced reports & dashboard features (SRS FR-18)
// ============================================================================
// A plain report just lists expenses. The dashboard needs an *enhanced* report
// with extra computed features layered on: a grand total, a per-category
// breakdown, remaining budget, and so on. Instead of building one giant report
// class with every feature baked in, each feature is a Decorator that wraps a
// report and adds its own contribution to the output.
//
// Decorators share the same build() interface as the base component, so they
// can be stacked in any combination -- e.g. wrap the base in Totals, then wrap
// that in CategoryBreakdown, then in BudgetRemaining. Each only adds; none has
// to know about the others.
// ============================================================================

// --- Base component ----------------------------------------------------------

class BaseReport {
    constructor(expenses) {
        this.expenses = expenses || [];
    }

    build() {
        return {
            expenses: this.expenses,
            count: this.expenses.length,
        };
    }
}

// --- Abstract decorator ------------------------------------------------------

class ReportDecorator {
    constructor(report) {
        this.report = report; // the component being wrapped
    }

    build() {
        // Default: pass through. Concrete decorators call super.build()
        // (via this.report.build()) and add to the result.
        return this.report.build();
    }

    // Expose the underlying expense list to subclasses.
    get expenses() {
        return this.report.expenses;
    }
}

// --- Concrete decorators -----------------------------------------------------

class TotalsDecorator extends ReportDecorator {
    build() {
        const result = this.report.build();
        result.total = this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        return result;
    }
}

class CategoryBreakdownDecorator extends ReportDecorator {
    build() {
        const result = this.report.build();
        const breakdown = {};
        this.expenses.forEach((e) => {
            breakdown[e.category] = (breakdown[e.category] || 0) + Number(e.amount);
        });
        result.categoryBreakdown = breakdown;
        return result;
    }
}

class BudgetRemainingDecorator extends ReportDecorator {
    constructor(report, budget) {
        super(report);
        this.budget = Number(budget) || 0;
    }

    build() {
        const result = this.report.build();
        const spent = this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        result.budget = this.budget;
        result.remainingBudget = this.budget - spent;
        return result;
    }
}

module.exports = {
    BaseReport,
    ReportDecorator,
    TotalsDecorator,
    CategoryBreakdownDecorator,
    BudgetRemainingDecorator,
};
