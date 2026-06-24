// ============================================================================
// STRATEGY PATTERN  ->  Report generation and filtering (SRS FR-15)
// ============================================================================
// Reports can be produced in several different ways: filter by date range,
// filter by category, or summarise totals per category. Rather than a big
// if/else block, each algorithm is its own interchangeable "strategy" object
// with the same generate(expenses, params) interface. The ReportContext is
// given a strategy at runtime and delegates to it.
//
// Adding a new report type later (e.g. "by payment method") means writing one
// new strategy class -- the context and the controller stay unchanged.
// ============================================================================

// --- Concrete strategies -----------------------------------------------------

class DateRangeReportStrategy {
    generate(expenses, params = {}) {
        const { startDate, endDate } = params;
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date('9999-12-31');

        const filtered = expenses.filter((e) => {
            const d = new Date(e.date);
            return d >= start && d <= end;
        });

        return {
            reportType: 'date-range',
            range: { startDate, endDate },
            count: filtered.length,
            total: filtered.reduce((sum, e) => sum + Number(e.amount), 0),
            expenses: filtered,
        };
    }
}

class CategoryReportStrategy {
    generate(expenses, params = {}) {
        const { category } = params;
        const filtered = category
            ? expenses.filter((e) => e.category === category)
            : expenses;

        return {
            reportType: 'category',
            category: category || 'all',
            count: filtered.length,
            total: filtered.reduce((sum, e) => sum + Number(e.amount), 0),
            expenses: filtered,
        };
    }
}

class CategorySummaryStrategy {
    // Summary analytics per category (the "summary analytics per category"
    // wording in FR-15).
    generate(expenses) {
        const summary = {};
        expenses.forEach((e) => {
            if (!summary[e.category]) {
                summary[e.category] = { category: e.category, count: 0, total: 0 };
            }
            summary[e.category].count += 1;
            summary[e.category].total += Number(e.amount);
        });

        return {
            reportType: 'category-summary',
            categories: Object.values(summary),
            total: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
        };
    }
}

// --- Context -----------------------------------------------------------------

class ReportContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
        return this;
    }

    generate(expenses, params) {
        if (!this.strategy) {
            throw new Error('No report strategy set');
        }
        return this.strategy.generate(expenses, params);
    }
}

// Factory helper so a controller can pick a strategy from a query param.
function getStrategy(type) {
    switch (type) {
        case 'date-range':
            return new DateRangeReportStrategy();
        case 'category':
            return new CategoryReportStrategy();
        case 'category-summary':
            return new CategorySummaryStrategy();
        default:
            return new DateRangeReportStrategy();
    }
}

module.exports = {
    ReportContext,
    DateRangeReportStrategy,
    CategoryReportStrategy,
    CategorySummaryStrategy,
    getStrategy,
};
